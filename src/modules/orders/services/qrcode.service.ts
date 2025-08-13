   // qrcode.service.ts
   import { Injectable } from '@nestjs/common';
   import * as QRCode from 'qrcode';

   @Injectable()
   export class QrcodeService {
     async generateQRCode(text: string): Promise<string> {
       try {
         const qrCodeDataURL = await QRCode.toDataURL(text);
         console.log(qrCodeDataURL)
         return qrCodeDataURL;
       } catch (err) {
         console.error(err);
         throw new Error('Failed to generate QR code');
       }
     }
   }