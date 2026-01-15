import 'express-session'

import type { SessionMetadata } from '@/src/shared/@types/session-metadata.type'

declare module 'express-session' {
    interface SessionData {
        user?: {
            id: string
            createdAt: Date
            metadata: SessionMetadata
        }
    }
}
