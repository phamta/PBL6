import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemLog, LogLevel, LogAction } from '../entities/system-log.entity';

@Injectable()
export class LoggingService {
  constructor(
    @InjectRepository(SystemLog)
    private systemLogRepository: Repository<SystemLog>,
  ) {}

  async logAdminAction(
    action: LogAction,
    userId: string,
    description: string,
    level: LogLevel = LogLevel.INFO,
    metadata?: any,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const log = this.systemLogRepository.create({
      level,
      action,
      description,
      userId,
      metadata,
      ipAddress,
      userAgent,
    });

    return this.systemLogRepository.save(log);
  }

  async logUserCreated(adminId: string, createdUserId: string, userEmail: string) {
    return this.logAdminAction(
      LogAction.CREATE_USER,
      adminId,
      `Admin created new user: ${userEmail}`,
      LogLevel.INFO,
      { createdUserId, userEmail },
    );
  }

  async logUserUpdated(adminId: string, updatedUserId: string, userEmail: string) {
    return this.logAdminAction(
      LogAction.UPDATE_USER,
      adminId,
      `Admin updated user: ${userEmail}`,
      LogLevel.INFO,
      { updatedUserId, userEmail },
    );
  }

  async logUserDeleted(adminId: string, deletedUserId: string, userEmail: string) {
    return this.logAdminAction(
      LogAction.DELETE_USER,
      adminId,
      `Admin deleted user: ${userEmail}`,
      LogLevel.WARNING,
      { deletedUserId, userEmail },
    );
  }

  async logRoleAssigned(adminId: string, userId: string, roleId: string) {
    return this.logAdminAction(
      LogAction.ASSIGN_ROLE,
      adminId,
      `Admin assigned role to user`,
      LogLevel.INFO,
      { userId, roleId },
    );
  }

  async logRoleRevoked(adminId: string, userId: string, roleId: string) {
    return this.logAdminAction(
      LogAction.REVOKE_ROLE,
      adminId,
      `Admin revoked role from user`,
      LogLevel.INFO,
      { userId, roleId },
    );
  }

  async logSettingsUpdated(adminId: string, settingsUpdated: string[]) {
    return this.logAdminAction(
      LogAction.SYSTEM_CONFIG,
      adminId,
      `Admin updated system settings`,
      LogLevel.INFO,
      { settingsUpdated },
    );
  }

  async logBatchOperation(adminId: string, operation: string, count: number, details?: any) {
    return this.logAdminAction(
      LogAction.SYSTEM_CONFIG, // Using closest available action
      adminId,
      `Admin performed batch ${operation} on ${count} items`,
      LogLevel.INFO,
      { operation, count, ...details },
    );
  }
}