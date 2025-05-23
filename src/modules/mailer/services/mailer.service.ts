import { Injectable } from '@nestjs/common';
import { EnvironmentService } from '@Package/config';
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';

@Injectable()
export class MailerService {
  private mailerSend: MailerSend;

  constructor(
    private readonly environmentService: EnvironmentService,
  ) {
    this.mailerSend = new MailerSend({
      apiKey: environmentService.get('mailerSend.apiKey'),
    });
  }

  async sendEmail(options: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
    from?: string;
  }): Promise<any> {
    try {
      const sentFrom = new Sender(
        options.from || this.environmentService.get('mailerSend.senderEmail'),
        this.environmentService.get('mailerSend.name')
      );
      console.log("Start Sending Email"),
      
      console.log("mailerSend config",this.environmentService.get('mailerSend.senderEmail'),
      this.environmentService.get('mailerSend.name'),
      this.environmentService.get('mailerSend.apiKey')
    )
      const recipients = [new Recipient(options.to, 'Recipient')];

      const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setSubject(options.subject);

      if (options.text) {
        emailParams.setText(options.text);
      }

      if (options.html) {
        emailParams.setHtml(options.html);
      }

      return await this.mailerSend.email.send(emailParams)
    } catch (error) {
      console.log({error})
      console.error('Error sending email:', error);
      throw error;
    }
  }
}