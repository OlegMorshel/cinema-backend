import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { RoleType } from 'src/profile/types/profile.types'

export class SignUpDto {
	@IsNotEmpty()
	@IsEmail()
	readonly email: string


	@IsNotEmpty()
	@IsString()
	readonly password: string

	@IsNotEmpty()
	@IsString()
	readonly name: string

	@IsNotEmpty()
	@IsString()
	readonly last_name: string


	@IsNotEmpty()
	@IsNumber()
	readonly phone: number

	@IsBoolean()
	@IsOptional()
	readonly isBlocked: boolean

	@IsNumber()
	@IsOptional()
	readonly subscribersCount: number

	@IsString()
	@IsOptional()
	readonly role: RoleType

	@IsString()
	@IsOptional()
	readonly description: string

	@IsString()
	@IsOptional()
	readonly location: string

	@IsString()
	@IsOptional()
	readonly bannerId: string

	@IsString()
	@IsOptional()
	readonly avatarId: string
}
