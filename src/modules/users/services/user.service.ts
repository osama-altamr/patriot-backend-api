import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { IUser, User } from '../../../database';
import { UserRepository } from '/users/repository/user.repository';
import { HashService, } from '@Package/auth';
import { AuthService } from '/auth/services/auth.service';
import { RefreshTokenRepository } from '/refresh-tokens/repository/refresh-token.repository';
import { addMinutes, addSeconds, isPast } from 'date-fns'
import { EnvironmentService } from '@Package/config';
import { MailerService } from '/mailer/services/mailer.service';
import { ResetPasswordDto } from '../api/dto/request/reset-password.dto';
import { UpdatePasswordDto } from '../api/dto/request/update-password.dto';
import { PermissionRepository } from '/permissions/repository/permission.repository';
import { PermissionAccessType } from '/permissions/api/enums/permission.enum';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly refreshTokenRepo: RefreshTokenRepository,
    private readonly authService: AuthService,
    private readonly environmentService: EnvironmentService,
    private readonly mailerService: MailerService,
  ) {}
  calculateExpiration (issuedAt: Date): Date {
    return addSeconds(issuedAt, +this.environmentService.get('jwt.jwtExpiredRefresh'))
  }
  
  getAllUsers(): Promise<IUser[]> {
    return this.userRepo.findAll({});
  }

  getByEmail(email: string): Promise<IUser> {
    return this.userRepo.findOneBy({
      email,
    })
  }

  getMe(id: string): Promise<IUser> {
    return this.userRepo.findOneById(id)
  }

  updateUser(id: string, updateData: Partial<User>): Promise<IUser> {
    return this.userRepo.update(id, updateData)
  }
  
  async createUser(data: IUser): Promise<{
    user: IUser,
    accessToken: string,
    refreshToken: string
  }> {
    data.password = await HashService.hashPassword(data.password)
    const user =  await this.userRepo.create(data) as User
    const accessToken =  await this.authService.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    })
    const refreshToken = await this.authService.generateRefreshToken({
      id: user.id,
      email: user.email,
      role: user.role,
    })
    const issuedAt = new Date()

    await this.refreshTokenRepo.create({
      token: refreshToken,
      issuedAt,
      expiresAt: this.calculateExpiration(issuedAt),
      revokedAt: null,
      user
    })
    
    return {
      user,
      accessToken,
      refreshToken,
 }
}

  async forgotPassword(email: string){
    const user = await this.getByEmail(email)
    const resetPasswordCode =  Math.floor(100000 + Math.random() * 900000).toString()
    const resetPasswordCodeExpiresAt = addMinutes(new Date(), 5)
    const dashboardUrl = 'http://localhost:3000'

    const to = email
    const resetPasswordLink = `${dashboardUrl}/reset-password/?email=${user.email}&resetCode=${resetPasswordCode}`
    const emailTemplate = {
      subject: `🔐 Patriot Platform - Password Reset Request`,
      
      text: `
    Patriot Platform Password Reset
    
    We received a request to reset your password. 
    Please click the link below to proceed:
    
    ${resetPasswordLink}
    
    This link will expire in 10 minutes.
    If you didn't request this, please ignore this email.
    
    © ${new Date().getFullYear()} Patriot Platform. All rights reserved.
      `,
      to, 
      html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #0d3b66; padding: 20px; text-align: center; }
        .logo { color: white; font-size: 24px; font-weight: bold; }
        .content { padding: 30px; background: #f9f9f9; }
        .button { 
          display: inline-block; padding: 12px 24px; 
          background-color: #0d3b66; color: white !important; 
          text-decoration: none; border-radius: 4px; font-weight: bold;
        }
        .footer { margin-top: 20px; font-size: 12px; color: #777; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Patriot Platform</div>
        </div>
        
        <div class="content">
          <h2>Password Reset Request</h2>
          <p>We received a request to reset your password. Please click the button below to proceed:</p>
          
          <p style="text-align: center; margin: 30px 0;">
            <a href="${resetPasswordLink}" class="button">Reset Password</a>
          </p>
          
          <p>This link will expire in <strong>10 minutes</strong>. If you didn't request this, please ignore this email.</p>
          
          <div style="background-color: #fff3cd; padding: 12px; border-left: 4px solid #ffc107; margin: 20px 0;">
            <p style="margin: 0;">For your security, never share this link with anyone.</p>
          </div>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} Patriot Platform. All rights reserved.</p>
          <p>This is an automated message. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
      `
    };
    console.log(resetPasswordCode)
    await this.userRepo.update(user.id, {
      resetPasswordCode,
      resetPasswordCodeExpiresAt
    })
    await this.mailerService.sendEmail(emailTemplate)
  }

  async resetPassword(reqData: ResetPasswordDto){
    const user = await this.userRepo.findOneBy({
      email:  reqData.email,
      resetPasswordCode: reqData.code,
    })

    if(!user || isPast(user.resetPasswordCodeExpiresAt)) {
      throw new BadRequestException('Invalid credentials')
    }
    await this.userRepo.update(user.id, {
      password: await HashService.hashPassword(reqData.password),
      resetPasswordCode: null,
      resetPasswordCodeExpiresAt: null,
    })
  }

  async updatePassword(userId:string, reqData: UpdatePasswordDto){
    const user = await this.userRepo.findOneById(userId)

    if(!await HashService.comparePassword(reqData.currentPassword, user.password)){
      throw new UnauthorizedException('Current password is incorrect');
    }

    await this.userRepo.update(user.id, {
      password: await HashService.hashPassword(reqData.newPassword),
    })
  }
}
