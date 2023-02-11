import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserId } from "../../../auth/types";

export const GetCurrentUserId = createParamDecorator(
    (data: undefined, context: ExecutionContext): UserId => {
        const request = context.switchToHttp().getRequest()
        return request.user["sub"]
    },
)