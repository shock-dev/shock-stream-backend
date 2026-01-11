import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/generated/client'

import { DB_URL } from '@/prisma.config'

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy
{
    constructor() {
        const adapter = new PrismaPg({
            url: DB_URL
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
