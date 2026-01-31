import { BadRequestException, Injectable } from '@nestjs/common'
import type { User } from '@prisma/generated/client'
import { Secret } from 'otpauth'
import QRCode from 'qrcode'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { EnableTotpInput } from '@/src/modules/auth/totp/inputs/enable-totp.input'
import { TotpFactory } from '@/src/modules/auth/totp/totp.factory'

@Injectable()
export class TotpService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly totpFactory: TotpFactory
    ) {}

    public async generateSecret(user: User) {
        const secret = new Secret({ size: 20 }).base32

        const totp = this.totpFactory.create(user, secret)

        const otpauthUrl = totp.toString()
        const qrcodeUrl = await QRCode.toDataURL(otpauthUrl)

        return {
            qrcodeUrl,
            secret
        }
    }

    public async enable(user: User, input: EnableTotpInput) {
        const { secret, pin } = input

        const totp = this.totpFactory.create(user, secret)

        const delta = totp.validate({ token: pin, window: 1 })

        if (delta === null) {
            throw new BadRequestException('Неверный код')
        }

        await this.prismaService.user.update({
            where: { id: user.id },
            data: { isTotpEnabled: true, totpSecret: secret }
        })

        return true
    }

    public async disable(user: User) {
        await this.prismaService.user.update({
            where: { id: user.id },
            data: { isTotpEnabled: false, totpSecret: null }
        })

        return true
    }
}
