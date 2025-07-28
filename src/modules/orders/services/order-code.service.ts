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
    const expiresAt = null
    const orderCode = await this.orderCodeRepo.create({
        ...orderCodeData,
        code,
        expiresAt,
        isVerified: false
      } as any);
      const emailSubject = 'Patriot Platform: Your Secure Verification Code';
      
    const currentYear = new Date().getFullYear();

    let emailHtml = `
    <!DOCTYPE html>
    <html lang="en">
      <!-- ... (your well-structured HTML from the previous step) ... -->
      <body>
        <div class="container">
            <!-- Main Content -->
            <div class="content">
                <h1 style="color: #0d3b66; font-weight: 600; font-size: 24px;">Your Secure Verification Code</h1>
                <p style="font-size: 16px; line-height: 1.6;">Please use the following code to complete your verification</p>
                
                <div class="code-box">
                    <div class="code">{{code}}</div>
                </div>
            </div>
            
            <!-- Footer -->
            <div class="footer">
                <p>If you did not request this code, you can safely ignore this email.</p>
                <p>© {{current_year}} Patriot Platform. All rights reserved.</p>
            </div>
        </div>
      </body>
    </html>
  `;

  emailHtml = emailHtml
  .replace('{{code}}', code)
  .replace('{{current_year}}', currentYear.toString());

      const user = await this.userService.getByEmail(orderCodeData.user.email)
      try {
        await this.mailerService.sendEmail({
          to: user.email,
          subject: emailSubject,
          html: emailHtml,
        })
      console.log(user)

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