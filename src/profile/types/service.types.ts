import { UserId } from "../../auth/types"
import { UpdateProfileDto } from "../dto"
import { ProfileId } from "./profile.types"


export interface UpdateAnotherProfileArgs extends UpdateProfileArgs {
	updatedProfileId: ProfileId
}

export interface UpdateProfileArgs {
	userID: UserId,
	dto: UpdateProfileDto,
}

export interface SubscribeProfileArgs {
	userId: UserId,
	profileId: ProfileId
}

export interface UnsubscribeProfileArgs extends SubscribeProfileArgs {
}