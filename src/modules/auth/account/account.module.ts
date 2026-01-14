import { Module } from '@nestjs/common'

import { PasswordService } from '@/src/modules/auth/account/services/password.service'

import { AccountResolver } from './account.resolver'
import { AccountService } from './account.service'

@Module({
    providers: [AccountResolver, AccountService, PasswordService],
    exports: [AccountService, PasswordService]
})
export class AccountModule {}
