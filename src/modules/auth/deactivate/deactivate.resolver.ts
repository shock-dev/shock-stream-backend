import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import type { User } from '@prisma/generated/client'

import { AuthModel } from '@/src/modules/auth/account/models/auth.model'
import { DeactivateAccountInput } from '@/src/modules/auth/deactivate/inputs/deactivate-account.input'
import type { GqlContext } from '@/src/shared/@types/gql-context.type'
import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'
import { UserAgent } from '@/src/shared/decorators/user-agent.decorator'

import { DeactivateService } from './deactivate.service'

@Resolver('Deactivate')
export class DeactivateResolver {
    public constructor(private readonly deactivateService: DeactivateService) {}

    @Authorization()
    @Mutation(() => AuthModel, { name: 'deactivateAccount' })
    public async deactivate(
        @Context() ctx: GqlContext,
        @Args('data') input: DeactivateAccountInput,
        @Authorized() user: User,
        @UserAgent() userAgent: string
    ) {
        return this.deactivateService.deactivate(
            ctx.req,
            ctx.res,
            input,
            user,
            userAgent
        )
    }
}
