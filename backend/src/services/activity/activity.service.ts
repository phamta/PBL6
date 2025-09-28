import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ActivityType } from '@prisma/client';

/**
 * Activity Service - Ghi log hoạt động người dùng
 * Truy vết toàn bộ thao tác trong hệ thống
 */
@Injectable()
export class ActivityService {
  constructor(private prisma: PrismaService) {}

  /**
   * Ghi log hoạt động
   */
  async logActivity(
    userId: string,
    action: ActivityType,
    resource: string,
    resourceId?: string,
    oldData?: any,
    newData?: any,
    description?: string,
  ) {
    return await this.prisma.activityLog.create({
      data: {
        userId,
        action,
        resource,
        resourceId,
        oldData: oldData ? JSON.stringify(oldData) : null,
        newData: newData ? JSON.stringify(newData) : null,
        description,
        // ipAddress và userAgent sẽ được thêm từ interceptor
      },
    });
  }

  /**
   * Lấy lịch sử hoạt động
   */
  async getActivityLogs(
    page: number = 1,
    limit: number = 50,
    userId?: string,
    action?: ActivityType,
    resource?: string,
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (userId) where.userId = userId;
    if (action) where.action = action;
    if (resource) where.resource = resource;

    const [logs, total] = await Promise.all([
      this.prisma.activityLog.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: { id: true, fullName: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.activityLog.count({ where }),
    ]);

    return {
      logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // More methods...
}