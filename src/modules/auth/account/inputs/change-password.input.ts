import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString, MinLength } from 'class-validator'

import { Match } from '@/src/shared/decorators/match.decorator'

@InputType()
export class ChangePasswordInput {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    currentPassword: string

    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    newPassword: string

    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @Match('newPassword')
    confirmNewPassword: string
}
