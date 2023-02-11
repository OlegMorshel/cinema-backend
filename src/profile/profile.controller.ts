import { Body, Controller, HttpCode, HttpStatus, Param, Put } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from "./types";
import { Profile } from "@prisma/client";
import { GetCurrentUserId } from "../common";
import { UserId } from "../auth/types";

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService,
  ) {
  }

  @Put(":id")
  @HttpCode(HttpStatus.OK)
  updateAnotherProfile(@GetCurrentUserId() userId: UserId, @Param() { id: updatedProfileId }: { id: string }, @Body() dto: UpdateProfileDto): Promise<Profile> {
    return this.profileService.updateAnotherProfile({ userID: userId, updatedProfileId: +updatedProfileId, dto })
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  updateCurrentProfile(@GetCurrentUserId() userId: UserId, @Body() dto: UpdateProfileDto) {
    return this.profileService.update({ dto, userID: userId })
  }
}
