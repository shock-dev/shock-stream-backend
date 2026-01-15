import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import type { Request } from 'express'

export const UserAgent = createParamDecorator(
    (_: unknown, context: ExecutionContext) => {
        if (context.getType() === 'http') {
            const req: Request = context.switchToHttp().getRequest()
            return req.headers['user-agent']
        } else {
            const req: Request =
                GqlExecutionContext.create(context).getContext().req
            return req.headers['user-agent']
        }
    }
)
