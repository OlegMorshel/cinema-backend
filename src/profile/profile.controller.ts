import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Put } from '@nestjs/common'
import { Profile } from "@prisma/client"
import { UserId } from "../auth/types"
import { GetCurrentUserId } from "../common"
import { UpdateProfileDto } from './dto'
import { ProfileService } from './profile.service'

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService,
  ) {
  }

  @Put("/me")
  @HttpCode(HttpStatus.OK)
  updateCurrentProfile(@GetCurrentUserId() userId: UserId, @Body() dto: UpdateProfileDto) {
    return this.profileService.update({ dto, userID: userId })
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  updateAnotherProfile(@GetCurrentUserId() userId: UserId, @Param() { id: updatedProfileId }: { id: string }, @Body() dto: UpdateProfileDto): Promise<Profile> {
    return this.profileService.updateAnotherProfile({ userID: userId, updatedProfileId: +updatedProfileId, dto })
  }


  @Put("/subscribe/:id")
  @HttpCode(HttpStatus.OK)
  subscribe(@Param(){ id: subscribedProfileId }: { id: string } ): Promise<void>{
    return this.profileService.subscribe(+subscribedProfileId)
  }

  @Put("/unsubscribe/:id")
  @HttpCode(HttpStatus.OK)
  unsubscribe(@Param(){ id: unsubscribedProfileId }: { id: string } ): Promise<void>{
    return this.profileService.unsubscribe(+unsubscribedProfileId)
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  deleteProfile(@GetCurrentUserId() userId: UserId): Promise<Profile>{
    return this.profileService.delete(userId)
  }
}
