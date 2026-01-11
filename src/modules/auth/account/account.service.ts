import { ConflictException, Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/generated/client'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { CreateUserInput } from '@/src/modules/auth/account/inputs/create-user.input'
import { PasswordService } from '@/src/modules/auth/account/services/password.service'

@Injectable()
export class AccountService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly passwordService: PasswordService
    ) {}

    public async findAll() {
        return this.prismaService.user.findMany()
    }

    public async create(input: CreateUserInput) {
        const { username, email, password } = input

        const hashedPassword = await this.passwordService.hash(password)

        try {
            return await this.prismaService.user.create({
                data: {
                    username,
                    email,
                    displayName: username,
                    password: hashedPassword
                },
                select: {
                    id: true,
                    username: true,
                    email: true
                }
            })
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
