import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import { UserModel } from '@/src/modules/auth/account/models/user.model'
import { LoginInput } from '@/src/modules/auth/session/inputs/login.input'
import type { GqlContext } from '@/src/shared/@types/gql-context.type'

import { SessionService } from './session.service'

@Resolver('Session')
export class SessionResolver {
    constructor(private readonly sessionService: SessionService) {}

    @Mutation(() => UserModel, { name: 'loginUser' })
    async login(@Context() ctx: GqlContext, @Args('data') input: LoginInput) {
        return this.sessionService.login(ctx.req, input)
    }

    @Mutation(() => Boolean, { name: 'logoutUser' })
    async logout(@Context() ctx: GqlContext) {
        return this.sessionService.logout(ctx.req, ctx.res)
    }
}
