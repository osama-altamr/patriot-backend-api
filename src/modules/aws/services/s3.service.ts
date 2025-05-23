import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { CreateMediaFileDto } from '../api/dto/request/create-media-file.dto';
import { v4 as uuid } from 'uuid'
import { EnvironmentService } from '@Package/config';

@Injectable()
export class FileUploadService {
    constructor(
      private readonly environmentService: EnvironmentService,
    ) { }
    protected parseFileExtension(fileName: string): string {
        return fileName.substr(fileName.lastIndexOf('.') + 1)
      }

    async getPreSignedURL(
        mediaData: CreateMediaFileDto
    ) {
        const region =  this.environmentService.get('aws.region')
        const accessKey = this.environmentService.get('aws.accessKey')
        const secretKey = this.environmentService.get('aws.secretKey')
        const bucketName = this.environmentService.get('aws.bucketName')

        try {
            const s3 = new S3({
                region: region,
                accessKeyId: accessKey,
                secretAccessKey: secretKey
            });
            const fileId = uuid()
            const extension = this.parseFileExtension(mediaData.fileName)
            let params = {
                Bucket: bucketName,
                Key: `media/${mediaData.userId}/${fileId}.${extension}`,
                Expires: 1800,
                ContentType: mediaData.contentType, 
            };

            return await s3.getSignedUrlPromise('putObject', params);
        } catch (error) {
            throw error;
        }
    }
}