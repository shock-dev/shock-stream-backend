import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/generated/client'

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy
{
    constructor(private readonly config: ConfigService) {
        const url = config.getOrThrow<string>('POSTGRES_URI')

        const adapter = new PrismaPg({
            connectionString: url
        })
        super({ adapter })
    }

    public async onModuleInit() {
        await this.$connect()
    }

    public async onModuleDestroy() {
        await this.$disconnect()
    }
}
