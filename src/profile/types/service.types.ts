import { UserId } from "../../auth/types";
import { CreateProfileDto } from "./create-profile.dto";

export type CreateProfileArgs = {
  userId: UserId,
  profileInfo: Omit<CreateProfileDto, 'password' | 'email'>
}