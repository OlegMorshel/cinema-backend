import { Injectable } from '@nestjs/common';
import { PrismaService } from "../prisma/prisma.service";
import { Profile } from "@prisma/client";
import { CreateProfileArgs } from "./types";

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

  constructor(
    private prisma: PrismaService,
  ) {
  }
}
