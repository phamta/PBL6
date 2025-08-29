import { Injectable } from '@nestjs/common';
import { VisaExtensionService } from './visa-extension.service';
import { EmailService } from '../email/email.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { VisaExtension, VisaExtensionStatus } from './entities/visa-extension.entity';

@Injectable()
export class VisaExpiryReminderService {
  constructor(
    @InjectRepository(VisaExtension)
    private visaExtensionRepository: Repository<VisaExtension>,
    private emailService: EmailService,
  ) {}

  // Manual method to check visa expiries (can be called via API or scheduled externally)
  async checkVisaExpiries() {
    console.log('Running visa expiry check...');

    // Check for visas expiring in 30 days
    await this.sendReminders(30);
    
    // Check for visas expiring in 7 days
    await this.sendReminders(7);
    
    // Check for visas expiring in 1 day
    await this.sendReminders(1);
  }

  private async sendReminders(daysUntilExpiry: number): Promise<void> {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysUntilExpiry);
    
    // Get start and end of target date
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const expiringSoon = await this.visaExtensionRepository.find({
      where: {
        visaExpiryDate: Between(startOfDay, endOfDay),
        status: VisaExtensionStatus.EXTENDED, // Only for extended visas
      },
      relations: ['applicant'],
    });

    console.log(`Found ${expiringSoon.length} visas expiring in ${daysUntilExpiry} days`);

    for (const visaExtension of expiringSoon) {
      try {
        await this.emailService.sendVisaExpiryReminder(
          visaExtension.applicant.email,
          visaExtension.fullName,
          visaExtension.applicationNumber,
          visaExtension.visaExpiryDate,
          daysUntilExpiry,
        );
        
        console.log(`Reminder sent to ${visaExtension.applicant.email} for application ${visaExtension.applicationNumber}`);
      } catch (error) {
        console.error(`Failed to send reminder for application ${visaExtension.applicationNumber}:`, error);
      }
    }
  }

  // Manual trigger for testing
  async triggerManualCheck(days: number = 30): Promise<{ message: string; count: number }> {
    await this.sendReminders(days);
    
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);
    
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const count = await this.visaExtensionRepository.count({
      where: {
        visaExpiryDate: Between(startOfDay, endOfDay),
        status: VisaExtensionStatus.EXTENDED,
      },
    });

    return {
      message: `Reminders sent for visas expiring in ${days} days`,
      count,
    };
  }
}
