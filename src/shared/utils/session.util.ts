import { InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { User } from '@prisma/generated/client'
import type { Request, Response } from 'express'

import type { SessionMetadata } from '@/src/shared/@types/session-metadata.type'

export function saveSession(
    req: Request,
    user: User,
    metadata: SessionMetadata
) {
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

            resolve({ user })
        })
    })
}

export function destroySession(
    req: Request,
    res: Response,
    configService: ConfigService
) {
    return new Promise((resolve, reject) => {
        req.session.destroy(err => {
            if (err) {
                reject(
                    new InternalServerErrorException(
                        'Не удалось удалить сессию'
                    )
                )
            }

            res.clearCookie(configService.getOrThrow<string>('SESSION_NAME'))

            resolve(true)
        })
    })
}
