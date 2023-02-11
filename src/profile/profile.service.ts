import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from "../prisma/prisma.service";
import { Profile, RoleEnumType } from "@prisma/client";
import { CreateProfileArgs, UpdateAnotherProfileArgs, UpdateProfileArgs } from "./types";
import { UserId } from "../auth/types";

@Injectable()
export class ProfileService {

  async create({ userId, profileInfo }: CreateProfileArgs): Promise<Profile> {
    return this.prisma.profile.create({
      data: {
        ...profileInfo,
        userId
      }
    });
  }

  async update({ userID, dto }: UpdateProfileArgs): Promise<Profile> {
    const { userId } = await this.prisma.profile.findFirst({ where: { userId: userID } })
    if (!userId) throw new HttpException(`User with id:${userId} not found`, HttpStatus.CONFLICT,)

    return this.prisma.profile.update({
      where: { userId: userId },
      data: { ...dto }
    })
  }

  async updateAnotherProfile({ updatedProfileId, userID, dto }: UpdateAnotherProfileArgs): Promise<Profile> {
    await this.isHaveAccess("admin", userID)
    const { id } = await this.prisma.profile.findFirst({ where: { id: updatedProfileId } })
    if (id === undefined) throw new HttpException(`User with id:${id} not found`, HttpStatus.CONFLICT,)

    return this.prisma.profile.update({
      where: { id },
      data: { ...dto }
    })
  }


  private async isHaveAccess(role: RoleEnumType, userId: UserId): Promise<boolean> {
    const profile = await this.prisma.profile.findUnique({ where: { userId: +userId } })
    if (!profile) throw new HttpException(`Profile with id:${userId} not found.`, HttpStatus.NOT_FOUND)
    if (profile.role !== role) throw new HttpException(`You need have the Role:${role} to change another profile`, HttpStatus.METHOD_NOT_ALLOWED)
    return true
  }

  constructor(
    private prisma: PrismaService,
  ) {
  }
}
