import { IsEmail, IsNotEmpty, IsNumber, IsString, } from "class-validator"

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  password: string

  @IsNotEmpty()
  @IsString()
  name: string

  @IsString()
  last_name: string

  @IsNumber()
  phone: number
}
