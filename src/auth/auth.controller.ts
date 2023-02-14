import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthDto } from './dto'
import { Tokens, UserId } from './types'
import { GetCurrentUser, GetCurrentUserId, Public, RtGuard } from "../common";
import { CreateProfileDto } from "../profile/types";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {
  }

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() dto: CreateProfileDto): Promise<Tokens> {
    return this.authService.signUp(dto)
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signIn(dto)
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: UserId) {
    return this.authService.logout(userId)
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@GetCurrentUserId() userId: UserId, @GetCurrentUser("refreshToken") rt: string) {
    return this.authService.refresh(userId, rt)
  }
}
