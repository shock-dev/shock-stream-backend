import type { MailerOptions } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'

export function getMailerConfig(configService: ConfigService): MailerOptions {
    return {
        transport: {
            host: configService.getOrThrow<string>('MAIL_HOST'),
            port: configService.getOrThrow<number>('MAIL_PORT'),
            secure: false
        },
        defaults: {
            from: `"ShockStream" ${configService.getOrThrow<string>('MAIL_FROM')}`
        }
    }
}
