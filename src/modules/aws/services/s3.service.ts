import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import * as AWS from 'aws-sdk'
import { CreateMediaFileDto } from '../api/dto/request/create-media-file.dto';
import { v4 as uuid } from 'uuid'
import { EnvironmentService } from '@Package/config';
import * as mCrypto from 'crypto'

const generateRandomString = (length: number) => mCrypto.randomBytes(length).toString('hex')

@Injectable()
export class FileUploadService {
    constructor(
      private readonly environmentService: EnvironmentService,
    ) {}
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
    async uploadExcelBufferFileToS3 (buffer: Buffer, filename: string)  {
        try {
            const bucketName = this.environmentService.get('aws.bucketName')
            const region =  this.environmentService.get('aws.region')
            const accessKey = this.environmentService.get('aws.accessKey')
            const secretKey = this.environmentService.get('aws.secretKey')

            const s3Upload = new AWS.S3({
                region: region,
                accessKeyId: accessKey,
                secretAccessKey: secretKey
            })

          const now = new Date()
          const year = now.getFullYear()
          const month = String(now.getMonth() + 1).padStart(2, '0')
          const day = String(now.getDate()).padStart(2, '0')
          const timestamp = now.getTime()
          const uniqueFilename = `${timestamp}-${year}${month}${day}-${generateRandomString(5)}-${filename}`
      
          const params = {
            Bucket: bucketName,
            Key: uniqueFilename,
            Body: buffer,
            ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          }
      
          const s3Response = await s3Upload.upload(params).promise()
          return s3Response.Location
        } catch (error) {
          console.error('Failed to upload file to S3:', error)
          throw new Error('Failed to upload file to S3')
        }
      }
 
}