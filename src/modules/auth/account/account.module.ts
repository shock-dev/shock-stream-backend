import { Module } from '@nestjs/common'

import { PasswordService } from '@/src/modules/auth/account/services/password.service'
import { VerificationService } from '@/src/modules/auth/verification/verification.service'

import { AccountResolver } from './account.resolver'
import { AccountService } from './account.service'

@Module({
    providers: [
        AccountResolver,
        AccountService,
        PasswordService,
        VerificationService
    ],
    exports: [AccountService, PasswordService]
})
export class AccountModule {}
