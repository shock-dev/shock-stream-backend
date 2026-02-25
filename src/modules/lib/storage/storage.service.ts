import {
    DeleteObjectCommand,
    GetObjectCommand,
    PutObjectCommand,
    S3Client
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class StorageService {
    private readonly client: S3Client
    private readonly bucket: string

    constructor(private config: ConfigService) {
        this.bucket = this.config.get<string>('S3_BUCKET')!
        this.client = new S3Client({
            region: this.config.get<string>('S3_REGION'),
            endpoint: this.config.get<string>('S3_ENDPOINT'),
            forcePathStyle: this.config.get<string>('S3_FORCE_PATH') === 'true',
            credentials: {
                accessKeyId: this.config.get<string>('S3_ACCESS_KEY')!,
                secretAccessKey: this.config.get<string>('S3_SECRET_KEY')!
            }
        })
    }

    async upload(
        key: string,
        buffer: Buffer,
        contentType: string
    ): Promise<string> {
        await this.client.send(
            new PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: buffer,
                ContentType: contentType
            })
        )
        return key
    }

    async delete(key: string): Promise<void> {
        await this.client.send(
            new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: key
            })
        )
    }

    async getSignedDownloadUrl(key: string, expiresIn = 60): Promise<string> {
        return getSignedUrl(
            this.client,
            new GetObjectCommand({
                Bucket: this.bucket,
                Key: key
            }),
            { expiresIn }
        )
    }
}
