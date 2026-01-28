import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator'

import { Match } from '@/src/shared/decorators/match.decorator'

@InputType()
export class NewPasswordInput {
    @Field(() => String)
    @IsString()
    @MinLength(8)
    @IsNotEmpty()
    public password: string

    @Field(() => String)
    @IsString()
    @MinLength(8)
    @IsNotEmpty()
    @Match('password', {
        message: 'Пароли не совпадают'
    })
    public passwordRepeat: string

    @Field(() => String)
    @IsUUID('4')
    @IsNotEmpty()
    public token: string
}
