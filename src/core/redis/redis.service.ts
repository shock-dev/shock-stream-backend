import { Injectable, OnModuleDestroy } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createClient, RedisClientType } from 'redis'

@Injectable()
export class RedisService implements OnModuleDestroy {
    public readonly client: RedisClientType

    constructor(configService: ConfigService) {
        this.client = createClient({
            url: configService.getOrThrow<string>('REDIS_URI')
        })

        this.client.connect().catch(console.error)
    }

    async onModuleDestroy() {
        await this.client.quit()
    }
}
