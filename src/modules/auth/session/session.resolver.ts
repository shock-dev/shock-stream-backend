import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'

import { UserModel } from '@/src/modules/auth/account/models/user.model'
import { LoginInput } from '@/src/modules/auth/session/inputs/login.input'
import { SessionModel } from '@/src/modules/auth/session/models/session.model'
import type { GqlContext } from '@/src/shared/@types/gql-context.type'
import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { UserAgent } from '@/src/shared/decorators/user-agent.decorator'

import { SessionService } from './session.service'

@Resolver('Session')
export class SessionResolver {
    constructor(private readonly sessionService: SessionService) {}

    @Authorization()
    @Query(() => [SessionModel], { name: 'findSessionsByUser' })
    public async findByUser(@Context() ctx: GqlContext) {
        return this.sessionService.findByUser(ctx.req)
    }

    @Authorization()
    @Query(() => SessionModel, { name: 'findCurrentSession' })
    public async findCurrent(@Context() ctx: GqlContext) {
        return this.sessionService.findCurrent(ctx.req)
    }

    @Mutation(() => UserModel, { name: 'loginUser' })
    public async login(
        @Context() ctx: GqlContext,
        @Args('data') input: LoginInput,
        @UserAgent() userAgent: string
    ) {
        return this.sessionService.login(ctx.req, input, userAgent)
    }

    @Authorization()
    @Mutation(() => Boolean, { name: 'logoutUser' })
    public async logout(@Context() ctx: GqlContext) {
        return this.sessionService.logout(ctx.req, ctx.res)
    }

    @Mutation(() => Boolean, { name: 'clearSessionCookie' })
    public async clearSession(@Context() ctx: GqlContext) {
        return this.sessionService.clearSession(ctx.res)
    }

    @Authorization()
    @Mutation(() => Boolean, { name: 'removeSession' })
    public async remove(@Context() ctx: GqlContext, @Args('id') id: string) {
        return this.sessionService.remove(ctx.req, id)
    }
}
