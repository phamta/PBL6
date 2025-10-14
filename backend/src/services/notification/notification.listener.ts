import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationService } from './notification.service';
import { PrismaService } from '../../database/prisma.service';
import { NotificationType } from '@prisma/client';

interface SystemUser {
  id: string;
  actions: string[];
  fullName: string;
  email: string;
}

interface DocumentEvent {
  document: {
    id: string;
    title: string;
    expiryDate?: Date;
    createdBy: {
      id: string;
      fullName: string;
      email: string;
    };
  };
  user: SystemUser;
}

interface VisaEvent {
  visa: {
    id: string;
    passportNumber: string;
    holderName: string;
    expiryDate: Date;
    holderEmail?: string;
    createdBy: {
      id: string;
      fullName: string;
      email: string;
    };
  };
  user: SystemUser;
}

interface TranslationEvent {
  translation: {
    id: string;
    applicantName: string;
    applicantEmail: string;
    documentTitle: string;
    status: string;
  };
  user: SystemUser;
}

interface GuestEvent {
  guest: {
    id: string;
    fullName: string;
    email?: string;
    organization?: string;
    visitDate: Date;
    createdBy: {
      id: string;
      fullName: string;
      email: string;
    };
  };
  user?: SystemUser; // Làm user optional để tránh lỗi undefined
}

/**
 * NotificationListener - Lắng nghe events và gửi notification tự động
 * 
 * Events được xử lý:
 * - document.created → thông báo cho Department Officer
 * - document.expiring → email reminder cho creator
 * - visa.created → thông báo cho Department Officer
 * - visa.expiring → email reminder cho visa holder và creator
 * - translation.completed → email cho applicant
 * - guest.created → thông báo cho Department Officer
 * - guest.visit_reminder → email reminder trước ngày visit
 */
@Injectable()
export class NotificationListener {
  private readonly logger = new Logger(NotificationListener.name);

  // System user for sending automated notifications
  private readonly systemUser: SystemUser = {
    id: 'system',
    actions: ['notification:send'],
    fullName: 'Hệ thống',
    email: 'system@pbl6.edu.vn',
  };

  constructor(
    private readonly notificationService: NotificationService,
    private readonly prisma: PrismaService,
  ) {}

  // ==================== DOCUMENT EVENTS ====================

  /**
   * Xử lý khi document được tạo mới
   */
  @OnEvent('document.created')
  async handleDocumentCreated(event: DocumentEvent) {
    this.logger.log(`📄 Document created: ${event.document.title} by ${event.user?.fullName || 'Unknown User'}`);

    try {
      // Tìm Department Officers (users có role 'department_officer')
      const departmentOfficers = await this.prisma.user.findMany({
        where: {
          roles: {
            some: {
              role: {
                code: 'department_officer'
              }
            }
          },
          isActive: true
        },
        select: {
          id: true,
          fullName: true,
          email: true
        }
      });

      if (departmentOfficers.length === 0) {
        this.logger.warn('No department officers found to notify');
        return;
      }

      // Gửi system notification cho từng Department Officer
      const notificationPromises = departmentOfficers.map(officer =>
        this.notificationService.sendNotification({
          type: NotificationType.SYSTEM,
          recipient: officer.id,
          subject: 'Tài liệu mới cần duyệt',
          content: `Tài liệu "${event.document.title}" vừa được tạo bởi ${event.user?.fullName || 'Unknown User'} và đang chờ duyệt.`,
        }, this.systemUser)
      );

      await Promise.all(notificationPromises);

      this.logger.log(`✅ Notifications sent to ${departmentOfficers.length} department officers for document: ${event.document.id}`);
    } catch (error) {
      this.logger.error(`❌ Failed to send document created notification: ${error.message}`, error.stack);
    }
  }

  /**
   * Xử lý khi document sắp hết hạn
   */
  @OnEvent('document.expiring')
  async handleDocumentExpiring(event: DocumentEvent) {
    this.logger.log(`⏰ Document expiring: ${event.document.title}, expires: ${event.document.expiryDate}`);

    if (!event.document.expiryDate) {
      this.logger.warn(`Document ${event.document.id} has no expiry date, skipping notification`);
      return;
    }

    try {
      // Gửi email reminder cho creator
      await this.notificationService.sendNotification({
        type: NotificationType.EMAIL,
        recipient: event.document.createdBy.email,
        subject: `Nhắc nhở: Tài liệu "${event.document.title}" sắp hết hạn`,
        content: `Xin chào ${event.document.createdBy.fullName},

Tài liệu "${event.document.title}" của bạn sẽ hết hạn vào ngày ${event.document.expiryDate.toLocaleDateString('vi-VN')}.

Vui lòng kiểm tra và gia hạn tài liệu nếu cần thiết.

Trân trọng,
Hệ thống quản lý HTQT`,
        variables: {
          fullName: event.document.createdBy.fullName,
          documentTitle: event.document.title,
          expiryDate: event.document.expiryDate.toLocaleDateString('vi-VN'),
        }
      }, this.systemUser);

      this.logger.log(`✅ Document expiring notification sent to: ${event.document.createdBy.email}`);
    } catch (error) {
      this.logger.error(`❌ Failed to send document expiring notification: ${error.message}`, error.stack);
    }
  }

  // ==================== VISA EVENTS ====================

  /**
   * Xử lý khi visa được tạo mới
   */
  @OnEvent('visa.created')
  async handleVisaCreated(event: VisaEvent) {
    this.logger.log(`🛂 Visa created: ${event.visa.passportNumber} for ${event.visa.holderName}`);

    try {
      // Gửi system notification cho Department Officers
      await this.notificationService.sendNotification({
        type: NotificationType.SYSTEM,
        recipient: 'department-officers', // TODO: Thay bằng logic tìm department officers
        subject: 'Visa application mới',
        content: `Visa application cho ${event.visa.holderName} (Passport: ${event.visa.passportNumber}) vừa được tạo bởi ${event.user?.fullName || 'Unknown User'}.`,
      }, this.systemUser);

      this.logger.log(`✅ Notification sent for visa creation: ${event.visa.id}`);
    } catch (error) {
      this.logger.error(`❌ Failed to send visa created notification: ${error.message}`, error.stack);
    }
  }

  /**
   * Xử lý khi visa sắp hết hạn
   */
  @OnEvent('visa.expiring')
  async handleVisaExpiring(event: VisaEvent) {
    this.logger.log(`⏰ Visa expiring: ${event.visa.passportNumber}, expires: ${event.visa.expiryDate}`);

    try {
      // Gửi email cho visa holder (nếu có email)
      if (event.visa.holderEmail) {
        await this.notificationService.sendNotification({
          type: NotificationType.EMAIL,
          recipient: event.visa.holderEmail,
          subject: `Visa Expiry Reminder - Nhắc nhở hết hạn visa`,
          content: `Dear ${event.visa.holderName} / Kính gửi ${event.visa.holderName},

Your visa (Passport: ${event.visa.passportNumber}) will expire on ${event.visa.expiryDate.toLocaleDateString('en-US')}.
Visa của bạn (Hộ chiếu: ${event.visa.passportNumber}) sẽ hết hạn vào ngày ${event.visa.expiryDate.toLocaleDateString('vi-VN')}.

Please contact the International Relations Office for visa extension if needed.
Vui lòng liên hệ Phòng Quan hệ Quốc tế để gia hạn visa nếu cần thiết.

Best regards / Trân trọng,
International Relations Office / Phòng Quan hệ Quốc tế`,
        }, this.systemUser);
      }

      // Gửi email cho creator
      await this.notificationService.sendNotification({
        type: NotificationType.EMAIL,
        recipient: event.visa.createdBy.email,
        subject: `Nhắc nhở: Visa ${event.visa.passportNumber} sắp hết hạn`,
        content: `Xin chào ${event.visa.createdBy.fullName},

Visa cho ${event.visa.holderName} (Passport: ${event.visa.passportNumber}) sẽ hết hạn vào ngày ${event.visa.expiryDate.toLocaleDateString('vi-VN')}.

Vui lòng liên hệ với visa holder để thực hiện các thủ tục gia hạn nếu cần thiết.

Trân trọng,
Hệ thống quản lý HTQT`,
      }, this.systemUser);

      this.logger.log(`✅ Visa expiring notifications sent for: ${event.visa.passportNumber}`);
    } catch (error) {
      this.logger.error(`❌ Failed to send visa expiring notification: ${error.message}`, error.stack);
    }
  }

  // ==================== TRANSLATION EVENTS ====================

  /**
   * Xử lý khi translation được hoàn thành
   */
  @OnEvent('translation.completed')
  async handleTranslationCompleted(event: TranslationEvent) {
    this.logger.log(`📝 Translation completed: ${event.translation.documentTitle} for ${event.translation.applicantName}`);

    try {
      // Gửi email thông báo hoàn thành cho applicant
      await this.notificationService.sendNotification({
        type: NotificationType.EMAIL,
        recipient: event.translation.applicantEmail,
        subject: `Hoàn thành dịch thuật - ${event.translation.documentTitle}`,
        content: `Xin chào ${event.translation.applicantName},

Yêu cầu dịch thuật tài liệu "${event.translation.documentTitle}" của bạn đã được hoàn thành thành công.

Mã yêu cầu: ${event.translation.id}
Tài liệu: ${event.translation.documentTitle}
Trạng thái: Đã hoàn thành

Vui lòng liên hệ Phòng Quan hệ Quốc tế để nhận tài liệu đã dịch và công chứng.

Thông tin liên hệ:
- Email: htqt@university.edu.vn
- Điện thoại: (028) 1234 5678

Trân trọng,
Phòng Quan hệ Quốc tế`,
        variables: {
          applicantName: event.translation.applicantName,
          documentTitle: event.translation.documentTitle,
          requestId: event.translation.id,
        }
      }, this.systemUser);

      // Gửi system notification cho staff
      await this.notificationService.sendNotification({
        type: NotificationType.SYSTEM,
        recipient: event.user.id,
        subject: 'Translation đã hoàn thành',
        content: `Đã gửi thông báo hoàn thành translation "${event.translation.documentTitle}" cho ${event.translation.applicantName}.`,
      }, this.systemUser);

      this.logger.log(`✅ Translation completion notifications sent for: ${event.translation.id}`);
    } catch (error) {
      this.logger.error(`❌ Failed to send translation completed notification: ${error.message}`, error.stack);
    }
  }

  /**
   * Xử lý khi translation được approve
   */
  @OnEvent('translation.approved')
  async handleTranslationApproved(event: TranslationEvent) {
    this.logger.log(`✅ Translation approved: ${event.translation.documentTitle}`);

    try {
      // Gửi email thông báo approve cho applicant
      await this.notificationService.sendNotification({
        type: NotificationType.EMAIL,
        recipient: event.translation.applicantEmail,
        subject: `Đã duyệt yêu cầu dịch thuật - ${event.translation.documentTitle}`,
        content: `Xin chào ${event.translation.applicantName},

Yêu cầu dịch thuật tài liệu "${event.translation.documentTitle}" của bạn đã được duyệt và đang trong quá trình xử lý.

Mã yêu cầu: ${event.translation.id}
Trạng thái: Đã duyệt

Chúng tôi sẽ thông báo khi quá trình dịch thuật hoàn tất.

Trân trọng,
Phòng Quan hệ Quốc tế`,
      }, this.systemUser);

      this.logger.log(`✅ Translation approval notification sent to: ${event.translation.applicantEmail}`);
    } catch (error) {
      this.logger.error(`❌ Failed to send translation approved notification: ${error.message}`, error.stack);
    }
  }

  // ==================== GUEST EVENTS ====================

  /**
   * Xử lý khi guest được đăng ký
   */
  @OnEvent('guest.created')
  async handleGuestCreated(event: GuestEvent) {
    this.logger.log(`🎓 Guest registered: ${event.guest.fullName} from ${event.guest.organization}`);

    try {
      // Gửi system notification cho Department Officers
      await this.notificationService.sendNotification({
        type: NotificationType.SYSTEM,
        recipient: 'department-officers', // TODO: Thay bằng logic tìm department officers
        subject: 'Khách quốc tế mới đăng ký',
        content: `Khách quốc tế ${event.guest.fullName} từ ${event.guest.organization || 'N/A'} đã đăng ký ghé thăm vào ngày ${event.guest.visitDate.toLocaleDateString('vi-VN')}.`,
      }, this.systemUser);

      // Gửi email confirmation cho guest (nếu có email)
      if (event.guest.email) {
        await this.notificationService.sendNotification({
          type: NotificationType.EMAIL,
          recipient: event.guest.email,
          subject: 'Xác nhận đăng ký thăm quan / Visit Registration Confirmation',
          content: `Dear ${event.guest.fullName} / Kính gửi ${event.guest.fullName},

Thank you for registering your visit to our university.
Cảm ơn bạn đã đăng ký thăm quan trường đại học của chúng tôi.

Visit Details / Thông tin chuyến thăm:
- Date / Ngày: ${event.guest.visitDate.toLocaleDateString('en-US')} / ${event.guest.visitDate.toLocaleDateString('vi-VN')}
- Organization / Tổ chức: ${event.guest.organization || 'N/A'}

We will contact you soon with more details.
Chúng tôi sẽ liên hệ với bạn sớm để cung cấp thêm thông tin chi tiết.

Best regards / Trân trọng,
International Relations Office / Phòng Quan hệ Quốc tế`,
        }, this.systemUser);
      }

      this.logger.log(`✅ Guest registration notifications sent for: ${event.guest.id}`);
    } catch (error) {
      this.logger.error(`❌ Failed to send guest created notification: ${error.message}`, error.stack);
    }
  }

  /**
   * Xử lý reminder trước ngày guest visit
   */
  @OnEvent('guest.visit_reminder')
  async handleGuestVisitReminder(event: GuestEvent) {
    this.logger.log(`⏰ Guest visit reminder: ${event.guest.fullName} visiting tomorrow`);

    try {
      // Gửi reminder cho staff phụ trách
      await this.notificationService.sendNotification({
        type: NotificationType.SYSTEM,
        recipient: event.guest.createdBy.id,
        subject: 'Nhắc nhở: Khách quốc tế ghé thăm ngày mai',
        content: `Khách quốc tế ${event.guest.fullName} từ ${event.guest.organization || 'N/A'} sẽ ghé thăm vào ngày mai (${event.guest.visitDate.toLocaleDateString('vi-VN')}). Vui lòng chuẩn bị đón tiếp.`,
      }, this.systemUser);

      // Gửi reminder email cho guest
      if (event.guest.email) {
        await this.notificationService.sendNotification({
          type: NotificationType.EMAIL,
          recipient: event.guest.email,
          subject: 'Visit Reminder / Nhắc nhở chuyến thăm',
          content: `Dear ${event.guest.fullName} / Kính gửi ${event.guest.fullName},

This is a reminder that your visit to our university is scheduled for tomorrow.
Đây là lời nhắc rằng chuyến thăm của bạn đến trường đại học được lên lịch vào ngày mai.

Visit Date / Ngày thăm: ${event.guest.visitDate.toLocaleDateString('en-US')} / ${event.guest.visitDate.toLocaleDateString('vi-VN')}

Please contact us if you have any questions.
Vui lòng liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi nào.

Contact / Liên hệ:
- Email: htqt@university.edu.vn
- Phone / SĐT: (028) 1234 5678

Best regards / Trân trọng,
International Relations Office / Phòng Quan hệ Quốc tế`,
        }, this.systemUser);
      }

      this.logger.log(`✅ Guest visit reminder sent for: ${event.guest.id}`);
    } catch (error) {
      this.logger.error(`❌ Failed to send guest visit reminder: ${error.message}`, error.stack);
    }
  }

  // ==================== SYSTEM EVENTS ====================

  /**
   * Xử lý khi system config thay đổi
   */
  @OnEvent('system.config.updated')
  async handleSystemConfigUpdated(event: { key: string; value: string; user: SystemUser }) {
    this.logger.log(`⚙️ System config updated: ${event.key} = ${event.value}`);

    try {
      // Gửi notification cho system administrators
      await this.notificationService.sendNotification({
        type: NotificationType.SYSTEM,
        recipient: 'system-admins', // TODO: Thay bằng logic tìm system admins
        subject: 'Cấu hình hệ thống đã thay đổi',
        content: `Cấu hình "${event.key}" đã được thay đổi thành "${event.value}" bởi ${event.user?.fullName || 'Unknown User'}.`,
      }, this.systemUser);

      this.logger.log(`✅ System config update notification sent`);
    } catch (error) {
      this.logger.error(`❌ Failed to send system config notification: ${error.message}`, error.stack);
    }
  }

  /**
   * Xử lý error events để gửi cảnh báo
   */
  @OnEvent('system.error')
  async handleSystemError(event: { error: string; context: string; user?: SystemUser }) {
    this.logger.error(`🚨 System error occurred: ${event.error} in ${event.context}`);

    try {
      // Gửi error alert cho system administrators
      await this.notificationService.sendNotification({
        type: NotificationType.SYSTEM,
        recipient: 'system-admins', // TODO: Thay bằng logic tìm system admins
        subject: '⚠️ Lỗi hệ thống',
        content: `Đã xảy ra lỗi trong hệ thống:
        
Context: ${event.context}
Error: ${event.error}
Time: ${new Date().toLocaleString('vi-VN')}
User: ${event.user?.fullName || 'Unknown'}`,
      }, this.systemUser);

      this.logger.log(`✅ System error notification sent`);
    } catch (error) {
      this.logger.error(`❌ Failed to send system error notification: ${error.message}`, error.stack);
    }
  }
}