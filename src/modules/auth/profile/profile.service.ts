import { ConflictException, Injectable } from '@nestjs/common'
import { User } from '@prisma/generated/client'
import Upload from 'graphql-upload/Upload.js'
import sharp from 'sharp'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { ChangeProfileInfoInput } from '@/src/modules/auth/profile/inputs/change-profile-info'
import { StorageService } from '@/src/modules/lib/storage/storage.service'

@Injectable()
export class ProfileService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly storageService: StorageService
    ) {}

    public async changeAvatar(user: User, file: Upload) {
        if (user.avatar) {
            await this.storageService.delete(user.avatar)
        }

        const chunks: Buffer[] = []

        for await (const chunk of file.createReadStream()) {
            chunks.push(chunk)
        }

        const buffer = Buffer.concat(chunks)
        const fileName = `channels/${user.username}.webp`

        const isGif = file.filename?.toLowerCase().endsWith('.gif')

        const processedBuffer = await sharp(buffer, { animated: isGif })
            .resize(512, 512)
            .webp()
            .toBuffer()

        await this.storageService.upload(
            fileName,
            processedBuffer,
            'image/webp'
        )

        await this.prismaService.user.update({
            where: { id: user.id },
            data: { avatar: fileName }
        })
    }

    public async deleteAvatar(user: User) {
        if (!user.avatar) {
            return
        }

        await this.storageService.delete(user.avatar)

        await this.prismaService.user.update({
            where: { id: user.id },
            data: { avatar: null }
        })
    }

    public async changeInfo(user: User, input: ChangeProfileInfoInput) {
        const { username, displayName, bio } = input

        if (username !== user.username) {
            const exists = await this.prismaService.user.findUnique({
                where: { username }
            })

            if (exists) {
                throw new ConflictException('Имя пользователя уже занято')
            }
        }

        try {
            await this.prismaService.user.update({
                where: { id: user.id },
                data: {
                    username,
                    displayName,
                    ...(bio !== undefined ? { bio } : {})
                }
            })
        } catch (e) {
            if (e.code === 'P2002') {
                throw new ConflictException('Имя пользователя уже занято')
            }
            throw e
        }

        return true
    }
}
