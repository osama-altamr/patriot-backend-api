import { Injectable, NotFoundException } from '@nestjs/common'
import { OrderCodeRepository } from '../repository/order-code.repository'
import { Order, OrderCode, User } from 'src/database'
import { UserRepository } from '/users/repository/user.repository'
import { CreateOrderCodeDto } from '../api/dto/create-order-code.dto'
import { MailerService } from '/mailer/services/mailer.service'
import { OrdersRepository } from '../repository/orders.repository'

@Injectable()
export class OrderCodeService {
  constructor(
      private readonly orderCodeRepo: OrderCodeRepository,
      private readonly orderRepo: OrdersRepository,

      private readonly mailerService: MailerService,

    ) {}

  async createOrderCode(orderCodeData: CreateOrderCodeDto) {
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);
    const orderCode = await this.orderCodeRepo.create({
        ...orderCodeData,
        code,
        expiresAt,
        isVerified: false
      } as any);
      const emailSubject = 'Patriot Platform: Your Secure Verification Code';
      
      const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; color: #333333;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
              <!-- Header -->
              <div style="background-color: #0d3b66; padding: 25px; text-align: center;">
                  <img src="https://cdn.worldvectorlogo.com/logos/new-england-patriots.svg" alt="Patriot Platform" width="180" style="max-width: 100%; height: auto;">
              </div>
              
              <!-- Main Content -->
              <div style="padding: 40px 30px; text-align: center;">
                  <h1 style="color: #0d3b66; margin: 0 0 25px 0; font-size: 24px; font-weight: 600;">
                      <span style="display: inline-block; margin-right: 10px;">🔒</span> 
                      Your Verification Code
                  </h1>
                  
                  <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.5;">
                      Please use the following code to verify your identity:
                  </p>
                  
                  <!-- Code Display -->
                  <div style="background: linear-gradient(135deg, #f0f7ff 0%, #e1edfa 100%); 
                              padding: 25px; margin: 0 auto 30px auto; width: fit-content;
                              border-radius: 10px; border: 1px solid #c9dff5;
                              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);">
                      <div style="font-size: 42px; font-weight: 700; letter-spacing: 3px; 
                                  color: #0d3b66; text-align: center; line-height: 1;">
                          ${code}
                      </div>
                  </div>
                  
                  <!-- Expiration Info -->
                  <div style="margin-bottom: 30px; background-color: #f9f9f9; 
                              padding: 15px; border-radius: 8px; display: inline-block;">
                      <p style="margin: 5px 0; color: #555555; font-size: 15px;">
                          <span style="font-weight: 600;">Expires:</span> 
                          ${new Date(Date.now() + 3600000).toLocaleString()}
                      </p>
                      <p style="margin: 5px 0; color: #555555; font-size: 15px;">
                          <span style="font-weight: 600;">Valid for:</span> 1 hour
                      </p>
                  </div>
                  
          </div>
      </body>
      </html>
      `;
      try {
        await this.mailerService.sendEmail({
          to:  orderCodeData.user.email,
          subject: emailSubject,
          html: emailHtml,
        });
      } catch (error) {
        console.error('Failed to send verification email:', error);
      }
      }

      async verifyCode(verificationData: {
        code: string
        orderId: string
      }): Promise<{ isValid: boolean; message?: string }> {
        console.log(verificationData)
        const orderCode = await this.orderCodeRepo.findOneBy({
            code: verificationData.code,
            order: { id: verificationData.orderId } as any,
        });
      
        console.log(orderCode)
        if (!orderCode) {
          return {
            isValid: false,
            message: 'Invalid verification code'
          };
        }
      
        if (orderCode.isVerified) {
            return {
              isValid: false,
              message: 'This code was already used'
            };
          }
        
          const now = new Date();
          if (now > orderCode.expiresAt) {
            return {
              isValid: false,
              message: 'Verification code has expired'
            };
          }
        
          await this.orderCodeRepo.update(
            orderCode.id,
            { isVerified: true, verifiedAt: now, code: null, expiresAt: null }
          );
        
          return {
            isValid: true,
            message: 'Verification successful'
          };
        }
      
}