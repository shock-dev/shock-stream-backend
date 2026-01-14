import {
    CanActivate,
    type ExecutionContext,
    Injectable,
    UnauthorizedException
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import type { Request } from 'express'

import { PrismaService } from '@/src/core/prisma/prisma.service'

@Injectable()
export class GqlAuthGuard implements CanActivate {
    constructor(private readonly prisma: PrismaService) {}

    public async canActivate(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context)
        const req: Request = ctx.getContext().req

        if (!req.session.user) {
            throw new UnauthorizedException('Пользователь не авторизован')
        }

        req.user = await this.prisma.user.findUnique({
            where: { id: req.session.user.id }
        })

        return true
    }
}
