import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PrismaModule } from 'src/prisma/prisma.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AtStrategy, RtStrategy } from './strategies'
import { ProfileModule } from "../profile/profile.module";
import { ProfileService } from "../profile/profile.service";
import { UserModule } from "../user/user.module";
import { UserService } from "../user/user.service";


@Module({
  controllers: [ AuthController ],
  imports: [
    PrismaModule,
    JwtModule.register({}),
    ConfigModule,
    ProfileModule,
    UserModule,
  ],
  providers: [
    AuthService,
    AtStrategy,
    RtStrategy,
    ConfigService,
    ProfileService,
    UserService,
  ],
  exports: [ AuthService, JwtModule ]
})
export class AuthModule {
}
