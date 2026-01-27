import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import { UserModel } from '@/src/modules/auth/account/models/user.model'
import { VerificationInput } from '@/src/modules/auth/verification/inputs/verification.input'
import type { GqlContext } from '@/src/shared/@types/gql-context.type'
import { UserAgent } from '@/src/shared/decorators/user-agent.decorator'

import { VerificationService } from './verification.service'

@Resolver('Verification')
export class VerificationResolver {
    public constructor(
        private readonly verificationService: VerificationService
    ) {}

    @Mutation(() => UserModel, { name: 'verifyAccount' })
    public async verify(
        @Context() ctx: GqlContext,
        @Args('data') input: VerificationInput,
        @UserAgent() userAgent: string
    ) {
        return this.verificationService.verify(ctx.req, input, userAgent)
    }
}
