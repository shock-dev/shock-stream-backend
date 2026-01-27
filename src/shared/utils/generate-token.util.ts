import { TokenType } from '@prisma/generated/client'
import { v4 as uuidv4 } from 'uuid'

import { PrismaService } from '@/src/core/prisma/prisma.service'

export async function generateToken(
    prismaService: PrismaService,
    userId: string,
    type: TokenType,
    isUUID: boolean = false
) {
    let token: string

    if (isUUID) {
        token = uuidv4()
    } else {
        token = Math.floor(
            Math.random() * (1_000_000 - 100_000) + 100_000
        ).toString()
    }

    const expiresIn = new Date(new Date().getTime() + 300_000)

    const existingToken = await prismaService.token.findFirst({
        where: { type, userId }
    })

    if (existingToken) {
        await prismaService.token.delete({ where: { id: existingToken.id } })
    }

    return prismaService.token.create({
        data: { token, expiresIn, type, user: { connect: { id: userId } } },
        include: { user: true }
    })
}
