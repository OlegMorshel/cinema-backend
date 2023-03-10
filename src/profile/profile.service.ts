import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Profile, RoleEnumType } from "@prisma/client"
import { UserId } from "../auth/types"
import { PrismaService } from "../prisma/prisma.service"
import { UserService } from "../user/user.service"
import { CreateProfileDto } from "./dto"
import {
	ProfileId,
	SubscribeProfileArgs,
	UnsubscribeProfileArgs,
	UpdateAnotherProfileArgs,
	UpdateProfileArgs
} from "./types"

@Injectable()
export class ProfileService {

	public async create(createProfileDto: CreateProfileDto): Promise<Profile> {
		return this.prisma.profile.create({
			data: createProfileDto
		});
	}

	public async update({ userID, dto }: UpdateProfileArgs): Promise<Profile> {
		const { userId } = await this.prisma.profile.findFirst({ where: { userId: userID } })
		if (!userId) throw new HttpException(`User with id:${userId} not found`, HttpStatus.CONFLICT,)

		return this.prisma.profile.update({
			where: { userId: userId },
			data: dto
		})
	}

	public async updateAnotherProfile({ updatedProfileId, userID, dto }: UpdateAnotherProfileArgs): Promise<Profile> {
		await this.isHaveAccess("admin", userID)
		const { id } = await this.prisma.profile.findFirst({ where: { id: updatedProfileId } })
		if (id === undefined) throw new HttpException(`User with id:${id} not found`, HttpStatus.CONFLICT,)

		return this.prisma.profile.update({
			where: { id },
			data: dto
		})
	}

	public async delete(userId: UserId): Promise<Profile> {
		const deletedProfile = await this.prisma.profile.delete({ where: { userId } })
		await this.userService.delete(userId)
		return deletedProfile
	}

	public async subscribe({ profileId, userId }: SubscribeProfileArgs): Promise<void> {
		await this.canUpdateByProfileId("creator", profileId)
		await this.canAccessSubscribeProfile({ profileId, userId })
		await this.prisma.profile.update({
			where: { id: profileId },
			data: { subscribersCount: { increment: 1 } }
		})
		await this.prisma.profile.update({
			where: { userId },
			data: {
				subscribedProfileIds: { push: profileId }
			}
		})
	}

	public async unsubscribe({ userId, profileId }: UnsubscribeProfileArgs): Promise<void> {
		await this.canUpdateByProfileId("creator", profileId)
		await this.prisma.profile.update({
			where: {
				id: profileId
			},
			data: { subscribersCount: { decrement: 1 } }
		})

		const { subscribedProfileIds } = await this.prisma.profile.findUnique({
			where: { userId },
			select: { subscribedProfileIds: true }
		})
		await this.prisma.profile.update({
			where: { userId },
			data: {
				subscribedProfileIds: { set: subscribedProfileIds.filter(id => id !== profileId) }
			}
		})
	}

	// =======  Utils  =======
	private async isHaveAccess(role: RoleEnumType, userId: UserId): Promise<boolean> {
		const profile = await this.prisma.profile.findUnique({ where: { userId: +userId } })
		if (!profile) throw new HttpException(`User with id:${userId} not found.`, HttpStatus.NOT_FOUND)
		if (profile.role !== role) throw new HttpException(`You need have the Role:${role} to change another profile`, HttpStatus.METHOD_NOT_ALLOWED)
		return true
	}

	private async canUpdateByProfileId(role: RoleEnumType, profileId: ProfileId): Promise<boolean> {
		const profile = await this.prisma.profile.findUnique({ where: { id: +profileId } })
		if (!profile) throw new HttpException(`Profile with id:${profileId} not found.`, HttpStatus.NOT_FOUND)
		if (profile.role !== role) throw new HttpException(`For this action target should be ${role}`, HttpStatus.BAD_REQUEST)
		return true
	}

	private async canAccessSubscribeProfile({ profileId, userId }: SubscribeProfileArgs): Promise<boolean> {
		const { subscribedProfileIds } = await this.prisma.profile.findUnique({
			where: { userId },
			select: { subscribedProfileIds: true }
		})
		if (subscribedProfileIds.includes(profileId)) {
			throw new HttpException(`This profile already subscribe to Profile with id:${profileId}`, HttpStatus.BAD_REQUEST)
		}
		return true
	}

	constructor(
		private prisma: PrismaService,
		private userService: UserService
	) {
	}
}
