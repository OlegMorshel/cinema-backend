import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PrismaModule } from 'src/prisma/prisma.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AtStrategy, RtStrategy } from './strategies'


@Module({
  controllers: [AuthController],
  imports: [
    PrismaModule,
    ConfigModule,
    JwtModule.register({})
  ],
  providers: [
      AuthService,
    AtStrategy,
    RtStrategy,
    ConfigService],
  exports: [AuthService, JwtModule]
})
export class AuthModule { }
