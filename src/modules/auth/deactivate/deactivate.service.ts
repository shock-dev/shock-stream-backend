import {
    BadRequestException,
    Injectable,
    NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { type User } from '@prisma/generated/client'
import { TokenType } from '@prisma/generated/enums'
import { verify } from 'argon2'
import type { Request, Response } from 'express'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { DeactivateAccountInput } from '@/src/modules/auth/deactivate/inputs/deactivate-account.input'
import { MailService } from '@/src/modules/lib/mail/mail.service'
import { generateToken } from '@/src/shared/utils/generate-token.util'
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util'
import { destroySession } from '@/src/shared/utils/session.util'

@Injectable()
export class DeactivateService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService,
        private readonly mailService: MailService
    ) {}

    public async deactivate(
        req: Request,
        res: Response,
        input: DeactivateAccountInput,
        user: User,
        userAgent: string
    ) {
        const { email, password, pin } = input

        if (email !== user.email) {
            throw new BadRequestException('Неверная почта')
        }

        const isValidPassword = await verify(user.password, password)

        if (!isValidPassword) {
            throw new BadRequestException('Неверный пароль')
        }

        if (!pin) {
            await this.sendDeactivationToken(req, user, userAgent)

            return { message: 'Требуется код подтверждения' }
        }

        await this.validateDeactivationToken(req, res, pin)

        return {
            user
        }
    }

    private async validateDeactivationToken(
        req: Request,
        res: Response,
        token: string
    ) {
        const existingToken = await this.prismaService.token.findUnique({
            where: {
                token,
                type: TokenType.DEACTIVATE_ACCOUNT
            }
        })

        if (!existingToken) {
            throw new NotFoundException('Токен не найден')
        }

        const hasExpired = new Date(existingToken.expiresIn) < new Date()

        if (hasExpired) {
            throw new BadRequestException('Токен истек')
        }

        await this.prismaService.user.update({
            where: { id: existingToken.userId },
            data: { isDeactivated: true, deactivatedAt: new Date() }
        })

        await this.prismaService.token.delete({
            where: {
                id: existingToken.id,
                type: TokenType.DEACTIVATE_ACCOUNT
            }
        })

        return destroySession(req, res, this.configService)
    }

    public async sendDeactivationToken(
        req: Request,
        user: User,
        userAgent: string
    ) {
        const deactivationToken = await generateToken(
            this.prismaService,
            user.id,
            TokenType.DEACTIVATE_ACCOUNT
        )

        const metadata = getSessionMetadata(req, userAgent)

        await this.mailService.sendDeactivationCode(
            user.email,
            user.username,
            deactivationToken.token,
            metadata
        )

        return true
    }
}
