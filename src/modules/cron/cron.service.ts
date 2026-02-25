import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { MailService } from '@/src/modules/lib/mail/mail.service'
import { StorageService } from '@/src/modules/lib/storage/storage.service'

@Injectable()
export class CronService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly mailService: MailService,
        private readonly storageService: StorageService
    ) {}

    @Cron('0 0 * * *')
    public async deleteDeactivatedAccounts() {
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        const deactivatedAccounts = await this.prismaService.user.findMany({
            where: {
                isDeactivated: true,
                deactivatedAt: { lte: sevenDaysAgo }
            },
            select: {
                id: true,
                email: true,
                avatar: true
            }
        })

        for (const user of deactivatedAccounts) {
            await this.mailService.sendAccountDeletion(user.email)

            if (user.avatar) await this.storageService.delete(user.avatar)
        }

        await this.prismaService.user.deleteMany({
            where: {
                id: {
                    in: deactivatedAccounts.map(u => u.id)
                }
            }
        })
    }
}
