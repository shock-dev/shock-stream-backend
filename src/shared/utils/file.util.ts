import { ReadStream } from 'fs'

export function validateFileFormat(
    filename: string,
    allowedFileFormats: string[]
) {
    if (!filename || allowedFileFormats.length === 0) return false

    const ext = filename.split('.').pop()?.toLowerCase()
    if (!ext) return false

    return allowedFileFormats.map(f => f.toLowerCase()).includes(ext)
}

export async function validateFileSize(
    fileStream: ReadStream,
    allowedFileSizeInBytes: number
): Promise<boolean> {
    return new Promise((resolve, reject) => {
        let fileSizeInBytes = 0

        fileStream
            .on('data', (chunk: Buffer) => {
                fileSizeInBytes += chunk.byteLength

                if (fileSizeInBytes > allowedFileSizeInBytes) {
                    fileStream.destroy()
                    resolve(false)
                }
            })
            .on('end', () => {
                resolve(fileSizeInBytes <= allowedFileSizeInBytes)
            })
            .on('error', err => {
                reject(err)
            })
    })
}
