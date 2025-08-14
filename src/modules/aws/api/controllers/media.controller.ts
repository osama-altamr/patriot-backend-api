import { Body, Controller, Logger, Post } from "@nestjs/common";
import { FileUploadService } from "/aws/services/s3.service";
import { CreateMediaFileDto } from "../dto/request/create-media-file.dto";
import { CreateMediaFileValidation } from "../validation/create-media-file.pipe";

@Controller("media")
export class MediaController {
    constructor(private readonly fileUploadService: FileUploadService){}
    
    @Post('/pre-signed')
    async getPreSignedURL(@Body(CreateMediaFileValidation) mediaData: CreateMediaFileDto){
         
            mediaData.contentType = mediaData.contentType ? mediaData.contentType : `image/${mediaData.fileName.split('.')[1]}` 
            Logger.debug({
                mediaData
                      })
            const url =  await this.fileUploadService.getPreSignedURL(mediaData)

            Logger.debug({
                url
                      })
        return { url }
    }
}