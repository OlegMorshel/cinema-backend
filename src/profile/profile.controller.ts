import { Controller } from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService,
  ) {
  }

  // @Post()
  // @Public()
  // @HttpCode(HttpStatus.CREATED)
  // create(@Body() dto: CreateProfileDto): Promise<Profile> {
  //   return this.profileService.create(dto)
  // }
}
