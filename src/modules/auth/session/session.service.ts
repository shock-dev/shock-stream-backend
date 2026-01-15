import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { Request, Response } from 'express'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { PasswordService } from '@/src/modules/auth/account/services/password.service'
import { LoginInput } from '@/src/modules/auth/session/inputs/login.input'
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util'

@Injectable()
export class SessionService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly passwordService: PasswordService,
        private readonly config: ConfigService
    ) {}

    async login(req: Request, input: LoginInput, userAgent: string) {
        const { login, password } = input
        const { session } = req

        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { username: { equals: login } },
                    { email: { equals: login } }
                ]
            }
        })

        if (!user) {
            throw new UnauthorizedException('Неверный логин или пароль')
        }

        const isValidPassword = await this.passwordService.verify(
            user.password,
            password
        )

        if (!isValidPassword) {
            throw new UnauthorizedException('Неверный логин или пароль')
        }

        const metadata = getSessionMetadata(req, userAgent)

        session.user = {
            id: user.id,
            createdAt: new Date(),
            metadata
        }

        await new Promise<void>((resolve, reject) => {
            session.save(err => (err ? reject(err) : resolve()))
        })

        return {
            id: user.id,
            username: user.username,
            email: user.email
        }
    }

    async logout(req: Request, res: Response): Promise<boolean> {
        await new Promise<void>((resolve, reject) => {
            req.session.destroy(err => (err ? reject(err) : resolve()))
        })

        res.clearCookie(this.config.getOrThrow<string>('SESSION_NAME'))

        return true
    }
}
