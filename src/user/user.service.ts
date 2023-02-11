import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserId } from "../auth/types";
import { User } from "@prisma/client";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {
  }

  async delete(userId: UserId): Promise<User> {
    const user = this.prisma.user.delete({ where: { id: userId } })
    if (user === undefined) throw new HttpException(`User with id:${userId} Not Found`, HttpStatus.NOT_FOUND)
    return user
  }
}
