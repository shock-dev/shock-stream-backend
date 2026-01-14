import { Module } from '@nestjs/common'

import { AccountModule } from '@/src/modules/auth/account/account.module'

import { SessionResolver } from './session.resolver'
import { SessionService } from './session.service'

@Module({
    imports: [AccountModule],
    providers: [SessionResolver, SessionService]
})
export class SessionModule {}
