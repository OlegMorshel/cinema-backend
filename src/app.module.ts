import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { CommentModule } from './comment/comment.module'
import { UserModule } from './user/user.module'
import { VideoModule } from './video/video.module'
import {APP_GUARD} from "@nestjs/core";
import {AtGuard} from "./common";

@Module({
  imports: [UserModule, VideoModule, CommentModule, AuthModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard
    }
  ]
})
export class AppModule { }
