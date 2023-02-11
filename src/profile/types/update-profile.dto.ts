import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateProfileDto {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string

  @IsString()
  name: string

  @IsString()
  last_name: string

  @IsBoolean()
  isBlocked?: boolean

  @IsNumber()
  phone: number

  @IsNumber()
  subscribersCount?: number

  @IsString()
  description?: string

  @IsString()
  location?: string

  @IsString()
  bannerId?: string

  @IsString()
  avatarId?: string
}
