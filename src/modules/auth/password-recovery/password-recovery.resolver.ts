import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import { NewPasswordInput } from '@/src/modules/auth/password-recovery/inputs/new-password.input'
import { ResetPasswordInput } from '@/src/modules/auth/password-recovery/inputs/reset-password.input'
import type { GqlContext } from '@/src/shared/@types/gql-context.type'
import { UserAgent } from '@/src/shared/decorators/user-agent.decorator'

import { PasswordRecoveryService } from './password-recovery.service'

@Resolver('PasswordRecovery')
export class PasswordRecoveryResolver {
    public constructor(
        private readonly passwordRecoveryService: PasswordRecoveryService
    ) {}

    @Mutation(() => Boolean, { name: 'resetPassword' })
    public async resetPassword(
        @Context() ctx: GqlContext,
        @Args('data') input: ResetPasswordInput,
        @UserAgent() userAgent: string
    ) {
        return this.passwordRecoveryService.resetPassword(
            ctx.req,
            input,
            userAgent
        )
    }

    @Mutation(() => Boolean, { name: 'setNewPassword' })
    public async setNewPassword(@Args('data') input: NewPasswordInput) {
        console.log('test')
        return this.passwordRecoveryService.setNewPassword(input)
    }
}
