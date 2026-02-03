import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { render } from '@react-email/components'

import AccountDeactivationTemplate from '@/src/modules/lib/mail/templates/deactivate.template'
import ResetPasswordTemplate from '@/src/modules/lib/mail/templates/reset-password.template'
import VerificationTemplate from '@/src/modules/lib/mail/templates/verification.template'
import type { SessionMetadata } from '@/src/shared/@types/session-metadata.type'

@Injectable()
export class MailService {
    public constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService
    ) {}

    public async sendPasswordResetToken(
        email: string,
        username: string,
        token: string,
        metadata: SessionMetadata
    ) {
        const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
        const resetUrl = `${domain}/account/recovery/${token}`
        const html = await render(
            ResetPasswordTemplate({
                resetUrl,
                username,
                ip: metadata.ip,
                device: metadata.device.browser,
                location: metadata.location.country
            })
        )

        return this.sendMail(email, 'Сброс пароля', html)
    }

    public async sendVerificationToken(
        email: string,
        username: string,
        token: string
    ) {
        const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
        const verifyUrl = `${domain}/account/verify?token=${token}`
        const html = await render(VerificationTemplate({ verifyUrl, username }))

        return this.sendMail(email, 'Верификация аккаунта', html)
    }

    public async sendDeactivationCode(
        email: string,
        username: string,
        token: string,
        metadata: SessionMetadata
    ) {
        const html = await render(
            AccountDeactivationTemplate({
                token,
                username,
                ip: metadata.ip,
                device: metadata.device.browser,
                location: metadata.location.country
            })
        )

        return this.sendMail(email, 'Деактивация аккаунта', html)
    }

    private async sendMail(to: string, subject: string, html: string) {
        return this.mailerService.sendMail({
            to,
            subject,
            html
        })
    }
}
