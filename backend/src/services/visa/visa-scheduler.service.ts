import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { VisaService } from './visa.service';

@Injectable()
export class VisaSchedulerService {
  private readonly logger = new Logger(VisaSchedulerService.name);

  constructor(private readonly visaService: VisaService) {}

  /**
   * UC004: Auto-reminder system for expiring visas
   * Runs daily at 9:00 AM to check for visas expiring within 30 days
   */
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async checkExpiringVisasDaily() {
    this.logger.log('Starting daily visa expiration check...');
    
    try {
      const expiringVisas = await this.visaService.checkExpiringVisas(30);
      
      if (expiringVisas.length > 0) {
        this.logger.log(`Found ${expiringVisas.length} visas expiring within 30 days. Reminders sent.`);
        
        // Log visa numbers for tracking
        const visaNumbers = expiringVisas.map(visa => visa.visaNumber).join(', ');
        this.logger.debug(`Expiring visas: ${visaNumbers}`);
      } else {
        this.logger.log('No visas expiring within 30 days.');
      }
    } catch (error) {
      this.logger.error('Error checking expiring visas:', error);
    }
  }

  /**
   * Weekly check for visas expiring within 7 days (more urgent)
   * Runs every Monday at 8:00 AM
   */
  @Cron('0 8 * * MON')
  async checkUrgentExpiringVisas() {
    this.logger.log('Starting weekly urgent visa expiration check...');
    
    try {
      const urgentExpiringVisas = await this.visaService.checkExpiringVisas(7);
      
      if (urgentExpiringVisas.length > 0) {
        this.logger.warn(`URGENT: Found ${urgentExpiringVisas.length} visas expiring within 7 days!`);
        
        // Log urgent visa numbers
        const urgentVisaNumbers = urgentExpiringVisas.map(visa => visa.visaNumber).join(', ');
        this.logger.warn(`Urgent expiring visas: ${urgentVisaNumbers}`);
      } else {
        this.logger.log('No visas expiring within 7 days.');
      }
    } catch (error) {
      this.logger.error('Error checking urgent expiring visas:', error);
    }
  }

  /**
   * Monthly statistics report
   * Runs on the 1st day of every month at 10:00 AM
   */
  @Cron('0 10 1 * *')
  async generateMonthlyReport() {
    this.logger.log('Generating monthly visa statistics report...');
    
    try {
      const statistics = await this.visaService.getStatistics();
      
      this.logger.log('=== MONTHLY VISA REPORT ===');
      this.logger.log(`Total visas: ${statistics.total}`);
      this.logger.log(`Active visas: ${statistics.byStatus.ACTIVE || 0}`);
      this.logger.log(`Extended visas: ${statistics.byStatus.EXTENDED || 0}`);
      this.logger.log(`Expired visas: ${statistics.byStatus.EXPIRED || 0}`);
      this.logger.log(`Cancelled visas: ${statistics.byStatus.CANCELLED || 0}`);
      this.logger.log(`Visas expiring soon: ${statistics.expiringSoon}`);
      this.logger.log(`Recent extensions (last 7 days): ${statistics.recentExtensions}`);
      this.logger.log('=== END REPORT ===');
    } catch (error) {
      this.logger.error('Error generating monthly report:', error);
    }
  }

  /**
   * Manual trigger for visa expiration check (for testing or emergency use)
   */
  async manualExpirationCheck(daysBeforeExpiration: number = 30): Promise<number> {
    this.logger.log(`Manual visa expiration check triggered for ${daysBeforeExpiration} days`);
    
    try {
      const expiringVisas = await this.visaService.checkExpiringVisas(daysBeforeExpiration);
      this.logger.log(`Manual check completed: ${expiringVisas.length} expiring visas found`);
      
      return expiringVisas.length;
    } catch (error) {
      this.logger.error('Error in manual expiration check:', error);
      throw error;
    }
  }
}