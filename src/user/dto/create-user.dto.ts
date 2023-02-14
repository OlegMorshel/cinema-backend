import {
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    MinLength
} from 'class-validator'

export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    surname: string

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(36)
    login: string

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(120)
    password: string

}