export function parseBoolean(value: string): boolean {
    return ['true', '1', 'yes', 'on'].includes(value.toLowerCase())
}
