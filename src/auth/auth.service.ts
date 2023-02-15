import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { User } from "@prisma/client"
import * as bcrypt from 'bcryptjs'
import { PrismaService } from 'src/prisma/prisma.service'
import { ProfileService } from "../profile/profile.service"
import { AuthDto, SignUpDto } from './dto'
import { Tokens, UserId } from './types'

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService,
		private configService: ConfigService,
		private profileService: ProfileService
	) {
	}


	async signUp(dto: SignUpDto): Promise<Tokens> {
		const {email, password, ...profileData} = dto
		const { id: userId, email: userEmail } = await this.createUser(dto)
		await this.profileService.create({ userId, ...profileData })

		const tokens = await this.getTokens(userId, userEmail)
		await this.updateRtHash(userId, tokens.refresh_token)
		return tokens
	}

	async signIn(dto: AuthDto): Promise<Tokens> {
		const user = await this.prisma.user.findUnique({
			where: {
				email: dto.email
			}
		})
		if (!user) throw new ForbiddenException("Access denied")

		const passwordMatches = await bcrypt.compare(dto.password, user.hash)

		if (!passwordMatches) throw new ForbiddenException("Access denied")

		const tokens = await this.getTokens(user.id, user.email)
		await this.updateRtHash(user.id, tokens.refresh_token)
		return tokens
	}

	async logout(userId: UserId) {
	 return await this.prisma.user.updateMany({
			where: {
				id: userId,
				hashRt: {
					not: null,
				}
			},
			data: {
				hashRt: null
			}
		})
	}

	async refresh(userId: UserId, rt: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId
			}
		})

		if (!user || !user.hashRt) throw new ForbiddenException("Access Denied")

		const rtMatches = await bcrypt.compare(rt, user.hashRt)

		if (!rtMatches) throw new ForbiddenException("Access Denied")

		const tokens = await this.getTokens(user.id, user.email)
		await this.updateRtHash(user.id, tokens.refresh_token)
		return tokens
	}


	async createUser(dto: AuthDto): Promise<User> {
		const { password, email } = dto
		const withCurrentEmailUserExist = await this.checkUserExist(email)

		if (withCurrentEmailUserExist) {
			throw new HttpException({
				status: HttpStatus.CONFLICT,
				error: `User with Email:${email} already exist. Please choose another Email.`,
			}, HttpStatus.BAD_REQUEST)
		}

		const hash = await this.hashData(password)
		const newUser = await this.prisma.user.create({
			data: {
				email,
				hash,
			}
		})
		return { ...newUser, hash }
	}

	async checkUserExist(email: string): Promise<boolean> {
		const user = await this.prisma.user.findUnique({
			where: {
				email
			}
		})
		return !!user
	}

	hashData(data: string): Promise<string> {
		return bcrypt.hash(data, 10)
	}

	async getTokens(userId: UserId, email: string): Promise<Tokens> {
		const [ at, rt ] = await Promise.all([
			this.jwtService.signAsync({ sub: userId, email, }, {
				expiresIn: 60 * 15,
				secret: this.configService.get("AT_SECRET")
			}),
			this.jwtService.signAsync({ sub: userId, email, }, {
				expiresIn: 60 * 60 * 24 * 7,
				secret: this.configService.get("RT_SECRET")
			}),
		])
		return {
			access_token: at,
			refresh_token: rt
		}
	}

	async updateRtHash(userId: UserId, rt: string) {
		const hash = await this.hashData(rt)
		await this.prisma.user.update({
			where: {
				id: userId
			},
			data: {
				hashRt: hash,
			}
		})
	}
}
