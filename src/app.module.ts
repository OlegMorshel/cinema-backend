import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from "@nestjs/config"
import { APP_GUARD } from "@nestjs/core"
import { AuthModule } from './auth/auth.module'
import { CommentModule } from './comment/comment.module'
import { AtGuard } from "./common"
import { FileModule } from "./file/file.module"
import { MinioClientModule } from "./minio-client/minio-client.module"
import { ProfileModule } from './profile/profile.module'
import { UserModule } from './user/user.module'
import { VideoModule } from './video/video.module'

@Module({
	imports: [
		UserModule,
		VideoModule,
		CommentModule,
		AuthModule,
		ConfigModule,
		ProfileModule,
		MinioClientModule,
		FileModule
	],
	controllers: [],
	providers: [
		{ provide: APP_GUARD, useClass: AtGuard }
	]
})
export class AppModule {
	static port: string

	constructor(private configService: ConfigService) {
		AppModule.port = configService.get('PORT')
	}
}
