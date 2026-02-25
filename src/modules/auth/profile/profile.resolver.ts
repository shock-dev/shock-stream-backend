import { Args, Mutation, Resolver } from '@nestjs/graphql'
import type { User } from '@prisma/generated/client'
import GraphQlUpload from 'graphql-upload/GraphQLUpload.js'
import Upload from 'graphql-upload/Upload.js'

import { ChangeProfileInfoInput } from '@/src/modules/auth/profile/inputs/change-profile-info'
import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'
import { FileValidationPipe } from '@/src/shared/pipes/file-validation.pipe'

import { ProfileService } from './profile.service'

@Resolver('Profile')
export class ProfileResolver {
    public constructor(private readonly profileService: ProfileService) {}

    @Mutation(() => Boolean, { name: 'changeProfileAvatar' })
    @Authorization()
    public async changeAvatar(
        @Authorized() user: User,
        @Args('avatar', { type: () => GraphQlUpload }, FileValidationPipe)
        avatar: Upload
    ) {
        return this.profileService.changeAvatar(user, avatar)
    }

    @Mutation(() => Boolean, { name: 'deleteProfileAvatar' })
    @Authorization()
    public async deleteAvatar(@Authorized() user: User) {
        return this.profileService.deleteAvatar(user)
    }

    @Mutation(() => Boolean, { name: 'changeProfileInfo' })
    @Authorization()
    public async changeInfo(
        @Authorized() user: User,
        @Args('data') input: ChangeProfileInfoInput
    ) {
        return this.profileService.changeInfo(user, input)
    }
}
