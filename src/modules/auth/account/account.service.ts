import { ConflictException, Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/generated/client'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { CreateUserInput } from '@/src/modules/auth/account/inputs/create-user.input'
import { PasswordService } from '@/src/modules/auth/account/services/password.service'
import { VerificationService } from '@/src/modules/auth/verification/verification.service'

@Injectable()
export class AccountService {
    public constructor(
        private readonly prisma: PrismaService,
        private readonly passwordService: PasswordService,
        private readonly verificationService: VerificationService
    ) {}

    public async me(id: string) {
        return this.prisma.user.findUnique({
            where: { id }
        })
    }

    public async create(input: CreateUserInput) {
        const { username, email, password } = input

        const hashedPassword = await this.passwordService.hash(password)

        try {
            const user = await this.prisma.user.create({
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
}
