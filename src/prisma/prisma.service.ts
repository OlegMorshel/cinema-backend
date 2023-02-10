import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor () {
        super({
            datasources: {
                db: {
                    url: "postgresql://postgres:HNQCu1PPZ1BvYcw8@db.pmqfewdsuejneouftdrs.supabase.co:5432/postgres"
                }
            }
        })
    }

    async onModuleInit () {
        await this.$connect()
    }
    async enableShutdownHooks (app: INestApplication) {
        this.$on('beforeExit', async () => {
            await app.close()
        })
    }
}