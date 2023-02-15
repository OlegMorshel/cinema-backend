import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"
import { RoleType } from '../types/profile.types'

export class CreateProfileDto {

	@IsNotEmpty()
	@IsNumber()
	userId: number

	@IsNotEmpty()
	@IsString()
	name: string

	@IsNotEmpty()
	@IsString()
	last_name: string


	@IsNotEmpty()
	@IsNumber()
	phone: number

	@IsBoolean()
	@IsOptional()
	isBlocked: boolean


	@IsNumber()
	@IsOptional()
	subscribersCount: number

	@IsString()
	@IsOptional()
	role: RoleType

	@IsString()
	@IsOptional()
	description: string

	@IsString()
	@IsOptional()
	location: string

	@IsString()
	@IsOptional()
	bannerId: string

	@IsString()
	@IsOptional()
	avatarId: string
}