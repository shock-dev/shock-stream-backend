import { Module } from '@nestjs/common'

import { MailService } from '@/src/modules/lib/mail/mail.service'

import { DeactivateResolver } from './deactivate.resolver'
import { DeactivateService } from './deactivate.service'

@Module({
    providers: [DeactivateResolver, DeactivateService, MailService]
})
export class DeactivateModule {}
