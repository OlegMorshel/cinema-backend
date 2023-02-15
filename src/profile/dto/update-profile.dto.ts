import { IsNumber, IsOptional, IsString } from "class-validator"

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  name: string

  @IsString()
  @IsOptional()
  last_name: string

  @IsNumber()
  @IsOptional()
  phone: number

  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsOptional()
  location?: string

  @IsString()
  @IsOptional()
  bannerId?: string

  @IsString()
  @IsOptional()
  avatarId?: string
}
