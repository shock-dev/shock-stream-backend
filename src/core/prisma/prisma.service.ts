import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/generated/client'
import process from 'node:process'

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy
{
    constructor() {
        const adapter = new PrismaPg({
            url: process.env['POSTGRES_URI']
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
