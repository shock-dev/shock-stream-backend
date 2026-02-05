import {
    BadRequestException,
    ConflictException,
    Injectable,
    UnauthorizedException
} from '@nestjs/common'
import { Prisma, type User } from '@prisma/generated/client'
import { hash, verify } from 'argon2'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { ChangeEmailInput } from '@/src/modules/auth/account/inputs/change-email.input'
import { ChangePasswordInput } from '@/src/modules/auth/account/inputs/change-password.input'
import { CreateUserInput } from '@/src/modules/auth/account/inputs/create-user.input'
import { PasswordService } from '@/src/modules/auth/account/services/password.service'
import { VerificationService } from '@/src/modules/auth/verification/verification.service'

@Injectable()
export class AccountService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly passwordService: PasswordService,
        private readonly verificationService: VerificationService
    ) {}

    public async me(id: string) {
        return this.prismaService.user.findUnique({
            where: { id }
        })
    }

    public async create(input: CreateUserInput) {
        const { username, email, password } = input

        const hashedPassword = await this.passwordService.hash(password)

        try {
            const user = await this.prismaService.user.create({
                data: {
                    username,
                    email,
                    displayName: username,
                    password: hashedPassword
                }
            })

            await this.verificationService.sendVerificationToken(user)

            return user
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
                const target = (error.meta?.target as string[])?.[0]

                if (target === 'username') {
                    throw new ConflictException(
                        'Это имя пользователя уже занято'
                    )
                }

                if (target === 'email') {
                    throw new ConflictException('Эта почта уже занята')
                }

                throw new ConflictException('Пользователь уже существует')
            }

            throw error
        }
    }

    public async changeEmail(user: User, input: ChangeEmailInput) {
        const { email } = input

        if (email === user.email) {
            throw new BadRequestException('Новый email совпадает с текущим')
        }

        try {
            await this.prismaService.user.update({
                where: { id: user.id },
                data: { email, isEmailVerified: false }
            })

            return true
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
                throw new ConflictException('Этот email уже используется')
            }

            throw error
        }
    }

    public async changePassword(user: User, input: ChangePasswordInput) {
        const { currentPassword, newPassword } = input

        const isValidOldPassword = await verify(user.password, currentPassword)

        if (!isValidOldPassword) {
            throw new UnauthorizedException('Неверный текущий пароль')
        }

        const isSamePassword = await verify(user.password, newPassword)

        if (isSamePassword) {
            throw new BadRequestException(
                'Новый пароль должен отличаться от текущего'
            )
        }

        const hashedPassword = await hash(newPassword)

        await this.prismaService.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        })

        return true
    }
}
