import { Injectable, NotFoundException, BadRequestException, ForbiddenException, ConflictException, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../database/prisma.service';
import { CreateTemplateDto, UpdateTemplateDto, SendNotificationDto, FilterNotificationDto, FilterTemplateDto } from './dto';
import { NotificationTemplate, NotificationLog, UserNotification, NotificationType, NotificationStatus, Prisma } from '@prisma/client';

export interface NotificationUser {
  id: string;
  actions: string[];
  unitId?: string;
  email?: string;
  fullName?: string;
}

export interface NotificationTemplateWithRelations extends NotificationTemplate {}

export interface NotificationLogWithRelations extends NotificationLog {
  sentBy?: {
    id: string;
    fullName: string;
    email: string;
  } | null;
}

export interface UserNotificationWithRelations extends UserNotification {
  user: {
    id: string;
    fullName: string;
    email: string;
  };
}

export interface NotificationListResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * NotificationService - Quản lý thông báo và template
 * 
 * Action permissions:
 * - notification:create_template: Tạo template thông báo
 * - notification:update_template: Cập nhật template
 * - notification:view_template: Xem template
 * - notification:delete_template: Xóa template
 * - notification:send: Gửi thông báo
 * - notification:view_logs: Xem log thông báo
 * - notification:view_user: Xem thông báo của user
 */
@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // ==================== TEMPLATE MANAGEMENT ====================

  /**
   * Tạo notification template mới
   */
  async createTemplate(createTemplateDto: CreateTemplateDto, user: NotificationUser): Promise<NotificationTemplateWithRelations> {
    // Kiểm tra quyền
    if (!user.actions.includes('notification:create_template')) {
      throw new ForbiddenException('Không có quyền tạo notification template');
    }

    try {
      const template = await this.prisma.notificationTemplate.create({
        data: {
          name: createTemplateDto.name,
          type: createTemplateDto.type,
          subject: createTemplateDto.subject,
          content: createTemplateDto.content,
          variables: createTemplateDto.variables || [],
          isActive: createTemplateDto.isActive ?? true,
        },
      });

      this.logger.log(`Created notification template: ${template.name} by user: ${user.id}`);

      // Emit event
      this.eventEmitter.emit('notification.template.created', {
        template,
        user,
      });

      return template;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Tên template đã tồn tại');
        }
      }
      this.logger.error(`Failed to create template: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Cập nhật notification template
   */
  async updateTemplate(id: string, updateTemplateDto: UpdateTemplateDto, user: NotificationUser): Promise<NotificationTemplateWithRelations> {
    // Kiểm tra quyền
    if (!user.actions.includes('notification:update_template')) {
      throw new ForbiddenException('Không có quyền cập nhật notification template');
    }

    const existingTemplate = await this.prisma.notificationTemplate.findUnique({
      where: { id },
    });

    if (!existingTemplate) {
      throw new NotFoundException('Không tìm thấy notification template');
    }

    try {
      const template = await this.prisma.notificationTemplate.update({
        where: { id },
        data: {
          ...updateTemplateDto,
          variables: updateTemplateDto.variables || existingTemplate.variables,
          updatedAt: new Date(),
        },
      });

      this.logger.log(`Updated notification template: ${template.name} by user: ${user.id}`);

      // Emit event
      this.eventEmitter.emit('notification.template.updated', {
        template,
        user,
        changes: updateTemplateDto,
      });

      return template;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Tên template đã tồn tại');
        }
      }
      this.logger.error(`Failed to update template: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Lấy danh sách notification templates với filtering
   */
  async getTemplates(filterDto: FilterTemplateDto, user: NotificationUser): Promise<NotificationListResult<NotificationTemplateWithRelations>> {
    // Kiểm tra quyền
    if (!user.actions.includes('notification:view_template')) {
      throw new ForbiddenException('Không có quyền xem notification template');
    }

    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', ...filters } = filterDto;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.NotificationTemplateWhereInput = {};

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { subject: { contains: filters.search, mode: 'insensitive' } },
        { content: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    // Build orderBy
    const orderBy: Prisma.NotificationTemplateOrderByWithRelationInput = {};
    orderBy[sortBy] = sortOrder;

    try {
      const [templates, total] = await Promise.all([
        this.prisma.notificationTemplate.findMany({
          where,
          skip,
          take: limit,
          orderBy,
        }),
        this.prisma.notificationTemplate.count({ where }),
      ]);

      return {
        data: templates,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error(`Failed to get templates: ${error.message}`, error.stack);
      throw new BadRequestException('Lỗi khi lấy danh sách template');
    }
  }

  /**
   * Lấy chi tiết notification template
   */
  async getTemplateById(id: string, user: NotificationUser): Promise<NotificationTemplateWithRelations> {
    // Kiểm tra quyền
    if (!user.actions.includes('notification:view_template')) {
      throw new ForbiddenException('Không có quyền xem notification template');
    }

    const template = await this.prisma.notificationTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException('Không tìm thấy notification template');
    }

    return template;
  }

  /**
   * Xóa notification template
   */
  async deleteTemplate(id: string, user: NotificationUser): Promise<void> {
    // Kiểm tra quyền
    if (!user.actions.includes('notification:delete_template')) {
      throw new ForbiddenException('Không có quyền xóa notification template');
    }

    const existingTemplate = await this.prisma.notificationTemplate.findUnique({
      where: { id },
    });

    if (!existingTemplate) {
      throw new NotFoundException('Không tìm thấy notification template');
    }

    try {
      await this.prisma.notificationTemplate.delete({
        where: { id },
      });

      this.logger.log(`Deleted notification template: ${existingTemplate.name} by user: ${user.id}`);

      // Emit event
      this.eventEmitter.emit('notification.template.deleted', {
        template: existingTemplate,
        user,
      });
    } catch (error) {
      this.logger.error(`Failed to delete template: ${error.message}`, error.stack);
      throw new BadRequestException('Lỗi khi xóa template');
    }
  }

  // ==================== NOTIFICATION SENDING ====================

  /**
   * Gửi notification
   */
  async sendNotification(sendDto: SendNotificationDto, user: NotificationUser): Promise<NotificationLogWithRelations> {
    // Kiểm tra quyền
    if (!user.actions.includes('notification:send')) {
      throw new ForbiddenException('Không có quyền gửi notification');
    }

    let finalSubject: string | null = null;
    let finalContent: string;

    // Nếu có templateId, lấy template và thay thế variables
    if (sendDto.templateId) {
      const template = await this.prisma.notificationTemplate.findUnique({
        where: { id: sendDto.templateId, isActive: true },
      });

      if (!template) {
        throw new NotFoundException('Không tìm thấy template hoặc template không hoạt động');
      }

      if (template.type !== sendDto.type) {
        throw new BadRequestException('Loại template không khớp với loại notification');
      }

      finalSubject = template.subject;
      finalContent = template.content;

      // Thay thế variables nếu có
      if (sendDto.variables) {
        Object.entries(sendDto.variables).forEach(([key, value]) => {
          const placeholder = `{{${key}}}`;
          if (finalSubject) {
            finalSubject = finalSubject.replace(new RegExp(placeholder, 'g'), String(value));
          }
          finalContent = finalContent.replace(new RegExp(placeholder, 'g'), String(value));
        });
      }
    } else {
      // Sử dụng content trực tiếp
      if (!sendDto.content) {
        throw new BadRequestException('Content không được để trống khi không sử dụng template');
      }
      finalSubject = sendDto.subject;
      finalContent = sendDto.content;
    }

    // Validate subject cho EMAIL type
    if (sendDto.type === NotificationType.EMAIL && !finalSubject) {
      throw new BadRequestException('Subject không được để trống cho EMAIL notification');
    }

    try {
      // Tạo notification log
      const notificationLog = await this.prisma.notificationLog.create({
        data: {
          type: sendDto.type,
          recipient: sendDto.recipient,
          subject: finalSubject,
          content: finalContent,
          status: NotificationStatus.PENDING,
          sentById: user.id === 'system' ? null : user.id, // Don't set sentById for system notifications
        },
        include: {
          sentBy: {
            select: { id: true, fullName: true, email: true },
          },
        },
      });

      // Xử lý gửi theo loại notification
      let deliveryStatus: NotificationStatus;
      let errorMessage: string | null = null;

      try {
        switch (sendDto.type) {
          case NotificationType.EMAIL:
            await this.sendEmailNotification(sendDto.recipient, finalSubject!, finalContent);
            deliveryStatus = NotificationStatus.SENT;
            break;

          case NotificationType.SYSTEM:
            await this.sendSystemNotification(sendDto.recipient, finalSubject, finalContent);
            deliveryStatus = NotificationStatus.DELIVERED;
            break;

          case NotificationType.SMS:
            await this.sendSmsNotification(sendDto.recipient, finalContent);
            deliveryStatus = NotificationStatus.SENT;
            break;

          default:
            throw new BadRequestException('Loại notification không được hỗ trợ');
        }
      } catch (error) {
        deliveryStatus = NotificationStatus.FAILED;
        errorMessage = error.message;
        this.logger.error(`Failed to send notification: ${error.message}`, error.stack);
      }

      // Cập nhật status
      const updatedLog = await this.prisma.notificationLog.update({
        where: { id: notificationLog.id },
        data: {
          status: deliveryStatus,
          sentAt: new Date(),
          deliveredAt: deliveryStatus === NotificationStatus.DELIVERED ? new Date() : null,
          errorMessage,
        },
        include: {
          sentBy: {
            select: { id: true, fullName: true, email: true },
          },
        },
      });

      this.logger.log(`Sent ${sendDto.type} notification to ${sendDto.recipient} with status: ${deliveryStatus}`);

      // Emit event
      this.eventEmitter.emit('notification.sent', {
        notificationLog: updatedLog,
        user,
        status: deliveryStatus,
      });

      return updatedLog as NotificationLogWithRelations;
    } catch (error) {
      this.logger.error(`Failed to send notification: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Gửi EMAIL notification (simulate)
   */
  private async sendEmailNotification(recipient: string, subject: string, content: string): Promise<void> {
    // Simulate email sending (thay vì SMTP thật)
    this.logger.log(`📧 [EMAIL SIMULATION] To: ${recipient}`);
    this.logger.log(`📧 [EMAIL SIMULATION] Subject: ${subject}`);
    this.logger.log(`📧 [EMAIL SIMULATION] Content: ${content}`);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Simulate success (có thể thêm random fail để test)
    if (Math.random() > 0.95) { // 5% fail rate
      throw new Error('Email delivery failed - SMTP server unavailable');
    }
  }

  /**
   * Gửi SYSTEM notification
   */
  private async sendSystemNotification(userId: string, title: string | null, content: string): Promise<void> {
    try {
      await this.prisma.userNotification.create({
        data: {
          userId,
          title: title || 'Thông báo hệ thống',
          content,
          type: 'INFO',
          isRead: false,
        },
      });
      
      this.logger.log(`📱 [SYSTEM NOTIFICATION] Created for user: ${userId}`);
    } catch (error) {
      throw new Error(`Failed to create system notification: ${error.message}`);
    }
  }

  /**
   * Gửi SMS notification (future implementation)
   */
  private async sendSmsNotification(phoneNumber: string, content: string): Promise<void> {
    // Future implementation - chỉ log hiện tại
    this.logger.log(`📱 [SMS SIMULATION] To: ${phoneNumber}`);
    this.logger.log(`📱 [SMS SIMULATION] Content: ${content}`);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // For now, always succeed
  }

  // ==================== NOTIFICATION LOGS ====================

  /**
   * Lấy danh sách notification logs
   */
  async getLogs(filterDto: FilterNotificationDto, user: NotificationUser): Promise<NotificationListResult<NotificationLogWithRelations>> {
    // Kiểm tra quyền
    if (!user.actions.includes('notification:view_logs')) {
      throw new ForbiddenException('Không có quyền xem notification logs');
    }

    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', ...filters } = filterDto;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.NotificationLogWhereInput = {};

    if (filters.search) {
      where.OR = [
        { recipient: { contains: filters.search, mode: 'insensitive' } },
        { subject: { contains: filters.search, mode: 'insensitive' } },
        { content: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.sentById) {
      where.sentById = filters.sentById;
    }

    if (filters.createdFrom || filters.createdTo) {
      where.createdAt = {};
      if (filters.createdFrom) {
        where.createdAt.gte = new Date(filters.createdFrom);
      }
      if (filters.createdTo) {
        where.createdAt.lte = new Date(filters.createdTo);
      }
    }

    // Build orderBy
    const orderBy: Prisma.NotificationLogOrderByWithRelationInput = {};
    if (sortBy === 'sentAt') {
      orderBy.sentAt = sortOrder;
    } else {
      orderBy[sortBy] = sortOrder;
    }

    try {
      const [logs, total] = await Promise.all([
        this.prisma.notificationLog.findMany({
          where,
          skip,
          take: limit,
          orderBy,
          include: {
            sentBy: {
              select: { id: true, fullName: true, email: true },
            },
          },
        }),
        this.prisma.notificationLog.count({ where }),
      ]);

      return {
        data: logs as NotificationLogWithRelations[],
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error(`Failed to get notification logs: ${error.message}`, error.stack);
      throw new BadRequestException('Lỗi khi lấy danh sách notification logs');
    }
  }

  // ==================== USER NOTIFICATIONS ====================

  /**
   * Lấy danh sách user notifications
   */
  async getUserNotifications(user: NotificationUser, page = 1, limit = 20): Promise<NotificationListResult<UserNotification>> {
    // Kiểm tra quyền
    if (!user.actions.includes('notification:view_user')) {
      throw new ForbiddenException('Không có quyền xem user notifications');
    }

    const skip = (page - 1) * limit;

    try {
      const [notifications, total] = await Promise.all([
        this.prisma.userNotification.findMany({
          where: { userId: user.id },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.userNotification.count({ where: { userId: user.id } }),
      ]);

      return {
        data: notifications,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error(`Failed to get user notifications: ${error.message}`, error.stack);
      throw new BadRequestException('Lỗi khi lấy danh sách user notifications');
    }
  }

  /**
   * Mark user notification as read
   */
  async markAsRead(notificationId: string, user: NotificationUser): Promise<UserNotification> {
    // Kiểm tra quyền
    if (!user.actions.includes('notification:view_user')) {
      throw new ForbiddenException('Không có quyền cập nhật user notifications');
    }

    const existingNotification = await this.prisma.userNotification.findUnique({
      where: { id: notificationId },
    });

    if (!existingNotification) {
      throw new NotFoundException('Không tìm thấy notification');
    }

    if (existingNotification.userId !== user.id) {
      throw new ForbiddenException('Không có quyền cập nhật notification này');
    }

    try {
      const updatedNotification = await this.prisma.userNotification.update({
        where: { id: notificationId },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });

      this.logger.log(`User ${user.id} marked notification ${notificationId} as read`);

      // Emit event
      this.eventEmitter.emit('notification.read', {
        notification: updatedNotification,
        user,
      });

      return updatedNotification;
    } catch (error) {
      this.logger.error(`Failed to mark notification as read: ${error.message}`, error.stack);
      throw new BadRequestException('Lỗi khi cập nhật notification');
    }
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Lấy thống kê notification
   */
  async getStats(user: NotificationUser) {
    // Kiểm tra quyền
    if (!user.actions.includes('notification:view_logs')) {
      throw new ForbiddenException('Không có quyền xem thống kê notification');
    }

    try {
      const [
        totalLogs,
        pendingLogs,
        sentLogs,
        failedLogs,
        deliveredLogs,
        totalTemplates,
        activeTemplates,
        userNotifications,
        unreadUserNotifications,
      ] = await Promise.all([
        this.prisma.notificationLog.count(),
        this.prisma.notificationLog.count({ where: { status: NotificationStatus.PENDING } }),
        this.prisma.notificationLog.count({ where: { status: NotificationStatus.SENT } }),
        this.prisma.notificationLog.count({ where: { status: NotificationStatus.FAILED } }),
        this.prisma.notificationLog.count({ where: { status: NotificationStatus.DELIVERED } }),
        this.prisma.notificationTemplate.count(),
        this.prisma.notificationTemplate.count({ where: { isActive: true } }),
        this.prisma.userNotification.count({ where: { userId: user.id } }),
        this.prisma.userNotification.count({ where: { userId: user.id, isRead: false } }),
      ]);

      return {
        logs: {
          total: totalLogs,
          pending: pendingLogs,
          sent: sentLogs,
          failed: failedLogs,
          delivered: deliveredLogs,
        },
        templates: {
          total: totalTemplates,
          active: activeTemplates,
        },
        userNotifications: {
          total: userNotifications,
          unread: unreadUserNotifications,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to get notification stats: ${error.message}`, error.stack);
      throw new BadRequestException('Lỗi khi lấy thống kê notification');
    }
  }
}