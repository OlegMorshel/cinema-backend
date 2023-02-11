import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { CommentModule } from './comment/comment.module'
import { UserModule } from './user/user.module'
import { VideoModule } from './video/video.module'
import { APP_GUARD } from "@nestjs/core";
import { AtGuard } from "./common";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [UserModule, VideoModule, CommentModule, AuthModule, ConfigModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard
    }
  ]
})
export class AppModule {
  static port: string

  constructor(private configService: ConfigService) {
    AppModule.port = configService.get('PORT')
  }
}
