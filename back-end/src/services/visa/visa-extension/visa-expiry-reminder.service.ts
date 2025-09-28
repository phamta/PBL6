import { Injectable } from '@nestjs/common';
import { VisaExtensionService } from './visa-extension.service';
import { EmailService } from '../../communication/email/email.service';
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
        ngayHetHanVisa: Between(startOfDay, endOfDay),
        trangThai: 'extended', // Only for extended visas
      },
      relations: ['user'],
    });

    console.log(`Found ${expiringSoon.length} visas expiring in ${daysUntilExpiry} days`);

    for (const visaExtension of expiringSoon) {
      try {
        await this.emailService.sendVisaExpiryReminder(
          visaExtension.user.email,
          visaExtension.hoTen,
          visaExtension.id,
          visaExtension.ngayHetHanVisa,
          daysUntilExpiry,
        );
        
        console.log(`Reminder sent to ${visaExtension.user.email} for application ${visaExtension.id}`);
      } catch (error) {
        console.error(`Failed to send reminder for application ${visaExtension.id}:`, error);
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
        ngayHetHanVisa: Between(startOfDay, endOfDay),
        trangThai: 'extended',
      },
    });

    return {
      message: `Reminders sent for visas expiring in ${days} days`,
      count,
    };
  }
}
