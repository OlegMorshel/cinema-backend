import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { RoleType } from "./role.type";

export class CreateProfileDto {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string

  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  last_name: string

  @IsBoolean()
  isBlocked?: boolean

  @IsNumber()
  @IsNotEmpty()
  phone: number

  @IsNumber()
  subscribersCount?: number

  @IsString()
  role?: RoleType

  @IsString()
  description?: string

  @IsString()
  location?: string

  @IsString()
  bannerId?: string

  @IsString()
  avatarId?: string
}