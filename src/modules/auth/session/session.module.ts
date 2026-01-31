import { Module } from '@nestjs/common'

import { AccountModule } from '@/src/modules/auth/account/account.module'
import { TotpFactory } from '@/src/modules/auth/totp/totp.factory'
import { VerificationService } from '@/src/modules/auth/verification/verification.service'

import { SessionResolver } from './session.resolver'
import { SessionService } from './session.service'

@Module({
    imports: [AccountModule],
    providers: [
        SessionResolver,
        SessionService,
        VerificationService,
        TotpFactory
    ]
})
export class SessionModule {}
