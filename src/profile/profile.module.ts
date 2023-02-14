import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PrismaModule } from "../prisma/prisma.module";
import { UserModule } from "../user/user.module";
import { UserService } from "../user/user.service";

@Module({
  imports: [ PrismaModule, UserModule ],
  controllers: [ ProfileController ],
  providers: [ ProfileService, UserService ]
})
export class ProfileModule {
}
