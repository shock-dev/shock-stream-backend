import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { render } from '@react-email/components'

import VerificationTemplate from '@/src/modules/lib/mail/templates/verification.template'

@Injectable()
export class MailService {
    public constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService
    ) {}

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

    private async sendMail(to: string, subject: string, html: string) {
        return this.mailerService.sendMail({
            to,
            subject,
            html
        })
    }
}
