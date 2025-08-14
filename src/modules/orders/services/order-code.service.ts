import { Injectable, NotFoundException } from '@nestjs/common'
import { OrderCodeRepository } from '../repository/order-code.repository'
import { Order, OrderCode, OrderStatus, User } from 'src/database'
import { UserRepository } from '/users/repository/user.repository'
import { CreateOrderCodeDto } from '../api/dto/create-order-code.dto'
import { MailerService } from '/mailer/services/mailer.service'
import { OrdersRepository } from '../repository/orders.repository'
import { UserService } from '/users/services/user.service'

@Injectable()
export class OrderCodeService {
  constructor(
      private readonly orderCodeRepo: OrderCodeRepository,
      private readonly orderRepo: OrdersRepository,
      private readonly userService: UserService,
      private readonly mailerService: MailerService,
    ) {}

  async createOrderCode(orderCodeData: CreateOrderCodeDto) {
    const code = Math.floor(100000 + Math.random() * 900000).toString()
   const orderCode = await this.orderCodeRepo.findOneBy({
      user: { id: orderCodeData.user.id }
    })
    if(orderCode) {
      await this.orderCodeRepo.delete(orderCode.id)
    }
    const expiresAt = null
   await this.orderCodeRepo.create({
        ...orderCodeData,
        code,
        expiresAt,
        isVerified: false
      } as any);
      const emailSubject = 'Patriot Platform: Your Secure Verification Code';
      
      console.log(orderCodeData.user)
    const currentYear = new Date().getFullYear();

    let emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        /* Add your CSS styles here for better presentation */
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; }
        .content { text-align: center; }
        .code-box { background-color: #f0f4f8; border: 1px solid #dbe3eb; padding: 20px; margin: 20px 0; }
        .code { font-size: 36px; font-weight: bold; letter-spacing: 5px; color: #0d3b66; }
        .footer { text-align: center; font-size: 12px; color: #777; margin-top: 30px; }
    </style>
</head>
<body>
    <div class="container">
        <!-- Main Content -->
        <div class="content">
            <h1 style="color: #0d3b66; font-weight: 600; font-size: 24px;">Your Delivery Confirmation Code</h1>
            <p style="font-size: 16px; line-height: 1.6;">
                Your Patriot Platform order has arrived. To ensure a secure handover, please provide the following code to the driver.
            </p>
            
            <div class="code-box">
                <div class="code">{{code}}</div>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p>If you did not request this delivery, please disregard this email.</p>
            <p>© {{current_year}} Patriot Platform. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
  `;
  orderCodeData.user.email = 'osama.altamr.sy@gmail.com'
  emailHtml = emailHtml
  .replace('{{code}}', code)
  .replace('{{current_year}}', currentYear.toString());
      try {
        await this.mailerService.sendEmail({
          to: orderCodeData.user.email,
          subject: emailSubject,
          html: emailHtml,
        })
      console.log(orderCodeData.user)

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
          await this.orderCodeRepo.update(
            orderCode.id,
            { isVerified: true, verifiedAt: now, code: null, expiresAt: null }
          );
          await this.orderRepo.update(verificationData.orderId, {
            status: OrderStatus.delivered,
            deliveredAt: new Date(),
          })
          return {
            isValid: true,
            message: 'Verification successful'
          };
        }
      
}