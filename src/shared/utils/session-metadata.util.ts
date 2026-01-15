import DeviceDetector from 'device-detector-js'
import type { Request } from 'express'
import { lookup } from 'geoip-lite'
import * as countries from 'i18n-iso-countries'

import { SessionMetadata } from '@/src/shared/@types/session-metadata.type'
import { IS_DEV_ENV } from '@/src/shared/utils/is-dev.util'

const UNKNOWN = 'Неизвестно'

countries.registerLocale(require('i18n-iso-countries/langs/en.json'))

const deviceDetector = new DeviceDetector()

function normalizeIp(ip?: string): string | null {
    if (!ip) return null
    return ip.replace('::ffff:', '')
}

function getClientIp(req: Request): string | null {
    if (IS_DEV_ENV) {
        return process.env.DEV_IP || '173.166.164.121'
    }

    return normalizeIp(req.ip)
}

export function getSessionMetadata(
    req: Request,
    userAgent: string
): SessionMetadata {
    const ip = getClientIp(req)

    const location = ip ? lookup(ip) : null
    const device = deviceDetector.parse(userAgent)

    return {
        ip: ip ?? UNKNOWN,
        location: {
            country:
                countries.getName(location?.country as string, 'en') ?? UNKNOWN,
            city: location?.city ?? UNKNOWN,
            latitude: location?.ll?.[0] ?? 0,
            longitude: location?.ll?.[1] ?? 0
        },
        device: {
            browser: device.client?.name ?? UNKNOWN,
            os: device.os?.name ?? UNKNOWN,
            type: device.device?.type ?? UNKNOWN
        }
    }
}
