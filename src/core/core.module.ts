import { ApolloDriver } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'

import { getGraphqlConfig } from '@/src/core/config/graphql.config'
import { AccountModule } from '@/src/modules/auth/account/account.module'
import { IS_DEV_ENV } from '@/src/shared/utils/is-dev.util'

import { PrismaModule } from './prisma/prisma.module'
import { RedisModule } from './redis/redis.module'

@Module({
    imports: [
        ConfigModule.forRoot({ ignoreEnvFile: !IS_DEV_ENV, isGlobal: true }),
        GraphQLModule.forRootAsync({
            driver: ApolloDriver,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: getGraphqlConfig
        }),
        PrismaModule,
        RedisModule,
        AccountModule
    ],
    controllers: [],
    providers: []
})
export class CoreModule {}
