import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { Request, Response } from 'express'
import { SessionData } from 'express-session'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { RedisService } from '@/src/core/redis/redis.service'
import { PasswordService } from '@/src/modules/auth/account/services/password.service'
import { LoginInput } from '@/src/modules/auth/session/inputs/login.input'
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util'

@Injectable()
export class SessionService {
    public constructor(
        private readonly prisma: PrismaService,
        private readonly passwordService: PasswordService,
        private readonly config: ConfigService,
        private readonly redis: RedisService
    ) {}

    public async findByUser(req: Request) {
        const userId = req.session.userId

        if (!userId) {
            throw new NotFoundException('Пользователь не обнаружен в сессии')
        }

        const keys = await this.redis.client.keys('*')

        if (!keys) {
            throw new NotFoundException('Нет ключей в хранилище')
        }

        const userSessions: (SessionData & { id: string })[] = []

        for (const key of keys) {
            const sessionData = await this.redis.client.get(key)

            if (sessionData) {
                const session = JSON.parse(sessionData) as SessionData

                if (session.userId === userId) {
                    userSessions.push({
                        ...session,
                        id: key.split(':')[1]
                    })
                }
            }
        }

        userSessions.sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        )

        return userSessions.filter(s => s.id !== req.session.id)
    }

    public async findCurrent(req: Request) {
        const sessionId = req.session.id

        const sessionData = await this.redis.client.get(
            this.config.getOrThrow('SESSION_FOLDER') + sessionId
        )

        if (!sessionData) {
            throw new NotFoundException('Сессия не найдена')
        }

        const session = JSON.parse(sessionData) as SessionData

        return {
            ...session,
            id: sessionId
        }
    }

    public async login(req: Request, input: LoginInput, userAgent: string) {
        const { login, password } = input

        const user = await this.prisma.user.findFirst({
            where: {
                OR: [{ username: login }, { email: login }]
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

        return new Promise((resolve, reject) => {
            req.session.userId = user.id
            req.session.createdAt = new Date()
            req.session.metadata = metadata

            req.session.save(err => {
                if (err) {
                    reject(
                        new InternalServerErrorException(
                            'Не удалось сохранить сессию'
                        )
                    )
                }

                resolve(user)
            })
        })
    }

    public logout(req: Request, res: Response) {
        return new Promise((resolve, reject) => {
            req.session.destroy(err => {
                if (err) {
                    reject(
                        new InternalServerErrorException(
                            'Не удалось удалить сессию'
                        )
                    )
                }

                res.clearCookie(this.config.getOrThrow<string>('SESSION_NAME'))

                resolve(true)
            })
        })
    }

    public async clearSession(res: Response) {
        res.clearCookie(this.config.getOrThrow<string>('SESSION_NAME'))
        return true
    }

    public async remove(req: Request, id: string) {
        if (req.session.id === id) {
            throw new ConflictException('Текущую сессию удалить нельзя')
        }

        await this.redis.client.del(
            this.config.getOrThrow('SESSION_FOLDER') + id
        )

        return true
    }
}
