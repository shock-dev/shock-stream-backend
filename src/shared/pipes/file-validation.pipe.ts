import {
    type ArgumentMetadata,
    BadRequestException,
    Injectable,
    type PipeTransform
} from '@nestjs/common'
import { ReadStream } from 'fs'

import {
    validateFileFormat,
    validateFileSize
} from '@/src/shared/utils/file.util'

@Injectable()
export class FileValidationPipe implements PipeTransform {
    private readonly allowedFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp']
    private readonly maxSizeInBytes = 10 * 1024 * 1024 // 10MB

    public async transform(value: any, metadata: ArgumentMetadata) {
        if (!value.filename) {
            throw new BadRequestException('Файл не загружен')
        }

        const { filename, createReadStream } = value

        const fileStream = createReadStream() as ReadStream

        const isFileFormatValid = validateFileFormat(
            filename,
            this.allowedFormats
        )

        if (!isFileFormatValid) {
            throw new BadRequestException('Не поддерживаемый формат файла')
        }

        const isFileSizeValid = await validateFileSize(
            fileStream,
            this.maxSizeInBytes
        )

        if (!isFileSizeValid) {
            throw new BadRequestException(
                `Размер файла превышает ${this.maxSizeInBytes / (1024 * 1024)} МБ`
            )
        }

        return value
    }
}
