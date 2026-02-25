import { Field, InputType } from '@nestjs/graphql'
import {
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    MinLength
} from 'class-validator'

@InputType()
export class ChangeProfileInfoInput {
    @Field(() => String)
    @MinLength(3)
    @MaxLength(32)
    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/)
    public username: string

    @Field(() => String)
    @IsString()
    @Matches(/\S/)
    @IsNotEmpty()
    public displayName: string

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    @MaxLength(300)
    public bio?: string
}
