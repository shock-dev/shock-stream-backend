import { Query, Resolver } from '@nestjs/graphql'

import { UserModel } from '@/src/modules/auth/account/models/user.model'

import { AccountService } from './account.service'

@Resolver()
export class AccountResolver {
    public constructor(private readonly accountService: AccountService) {}

    @Query(() => [UserModel], { name: 'findAllUsers' })
    public async findAll() {
        return this.accountService.findAll()
    }
}
