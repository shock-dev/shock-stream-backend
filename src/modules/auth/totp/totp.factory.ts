import { Injectable } from '@nestjs/common'
import { User } from '@prisma/generated/client'
import { TOTP } from 'otpauth'

@Injectable()
export class TotpFactory {
    create(user: Pick<User, 'email'>, secret: string) {
        return new TOTP({
            issuer: 'ShockStream',
            label: user.email,
            algorithm: 'SHA1',
            digits: 6,
            secret
        })
    }
}
