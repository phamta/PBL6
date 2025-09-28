import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor() {}

  async sendStatusUpdate(to: string, subject: string, message: string): Promise<void> {
    try {
      // Simple implementation - just log for now
      // TODO: Implement actual email sending with nodemailer or other service
      console.log('Email would be sent:', {
        to,
        subject,
        message,
        timestamp: new Date(),
      });
      
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log(`Email sent to ${to}: ${subject}`);
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }

  async sendVisaExpiryReminder(
    to: string,
    fullName: string,
    applicationNumber: string,
    expiryDate: Date,
    daysUntilExpiry: number,
  ): Promise<void> {
    const subject = `Visa Expiry Reminder - ${daysUntilExpiry} days remaining`;
    const message = `Dear ${fullName},

Your visa is set to expire in ${daysUntilExpiry} days on ${expiryDate.toDateString()}.

Application Number: ${applicationNumber}

Please take necessary action to extend your visa before the expiry date.

Best regards,
International Relations Office`;

    await this.sendStatusUpdate(to, subject, message);
  }
}
