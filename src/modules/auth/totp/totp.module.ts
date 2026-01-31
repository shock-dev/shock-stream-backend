import { Module } from '@nestjs/common'

import { TotpFactory } from '@/src/modules/auth/totp/totp.factory'

import { TotpResolver } from './totp.resolver'
import { TotpService } from './totp.service'

@Module({
    providers: [TotpResolver, TotpService, TotpFactory],
    exports: [TotpFactory]
})
export class TotpModule {}
