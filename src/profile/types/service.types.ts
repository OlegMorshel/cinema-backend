import { SignUpDto } from 'src/auth/dto'
import { UserId } from "../../auth/types"
import { UpdateProfileDto } from "../dto/update-profile.dto"
import { ProfileId } from "./profile.types"

export type CreateProfileArgs = {
  userId: UserId,
  profileInfo: Omit<SignUpDto, 'password' | 'email'>
}

export interface UpdateAnotherProfileArgs extends UpdateProfileArgs {
  updatedProfileId: ProfileId
}

export interface UpdateProfileArgs {
  userID: UserId,
  dto: UpdateProfileDto,
}
