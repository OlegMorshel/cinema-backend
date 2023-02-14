import { UserId } from "../../auth/types";
import { CreateProfileDto } from "./create-profile.dto";
import { UpdateProfileDto } from "./update-profile.dto";
import { ProfileId } from "./profile.types";

export type CreateProfileArgs = {
  userId: UserId,
  profileInfo: Omit<CreateProfileDto, 'password' | 'email'>
}

export interface UpdateAnotherProfileArgs extends UpdateProfileArgs {
  updatedProfileId: ProfileId
}

export interface UpdateProfileArgs {
  userID: UserId,
  dto: UpdateProfileDto,
}
