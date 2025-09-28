import { Injectable, NotFoundException, ConflictException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { QueryUnitsDto } from './dto/query-units.dto';
import { Unit } from '@prisma/client';

/**
 * Unit Service - Xử lý logic business cho units
 */
@Injectable()
export class UnitService {
  constructor(private prisma: PrismaService) {}

  /**
   * Tạo unit mới
   */
  async createUnit(createUnitDto: CreateUnitDto, currentUser: any) {
    const { name, code, parentId, level = 0, isActive = true } = createUnitDto;

    // Chỉ SYSTEM_ADMIN và DEPARTMENT_OFFICER có thể tạo unit
    if (!['SYSTEM_ADMIN', 'DEPARTMENT_OFFICER'].includes(currentUser.role)) {
      throw new ForbiddenException('Không có quyền tạo đơn vị');
    }

    // Kiểm tra tên đơn vị đã tồn tại
    const existingUnit = await this.prisma.unit.findUnique({
      where: { name },
    });

    if (existingUnit) {
      throw new ConflictException('Tên đơn vị đã tồn tại');
    }

    // Kiểm tra mã đơn vị đã tồn tại (nếu có)
    if (code) {
      const existingCode = await this.prisma.unit.findUnique({
        where: { code },
      });

      if (existingCode) {
        throw new ConflictException('Mã đơn vị đã tồn tại');
      }
    }

    // Kiểm tra parent unit có tồn tại (nếu có)
    if (parentId) {
      const parentUnit = await this.prisma.unit.findUnique({
        where: { id: parentId },
      });

      if (!parentUnit) {
        throw new BadRequestException('Đơn vị cha không tồn tại');
      }

      if (!parentUnit.isActive) {
        throw new BadRequestException('Đơn vị cha đã bị vô hiệu hóa');
      }
    }

    // Tạo unit mới
    const unit = await this.prisma.unit.create({
      data: {
        name,
        code,
        parentId,
        level,
        isActive,
      },
      include: {
        parent: true,
        children: true,
        _count: {
          select: { users: true },
        },
      },
    });

    return unit;
  }

  /**
   * Lấy danh sách units với pagination và filter
   */
  async findUnits(queryDto: QueryUnitsDto, currentUser: any) {
    const {
      page = 1,
      limit = 10,
      search,
      parentId,
      level,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'asc',
      includeChildren = false,
      includeUsers = false,
    } = queryDto;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (parentId !== undefined) {
      where.parentId = parentId === 'null' ? null : parentId;
    }

    if (level !== undefined) {
      where.level = level;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    // Build include clause
    const include: any = {
      parent: true,
      _count: {
        select: { users: true, children: true },
      },
    };

    if (includeChildren) {
      include.children = {
        include: {
          _count: {
            select: { users: true },
          },
        },
      };
    }

    if (includeUsers) {
      include.users = {
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          isActive: true,
        },
      };
    }

    // Execute queries
    const [units, total] = await Promise.all([
      this.prisma.unit.findMany({
        where,
        include,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.unit.count({ where }),
    ]);

    return {
      data: units,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Lấy unit theo ID
   */
  async findUnitById(id: string, currentUser: any) {
    const unit = await this.prisma.unit.findUnique({
      where: { id },
      include: {
        parent: true,
        children: {
          include: {
            _count: {
              select: { users: true },
            },
          },
        },
        users: {
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
            isActive: true,
          },
        },
        _count: {
          select: { users: true, children: true },
        },
      },
    });

    if (!unit) {
      throw new NotFoundException('Đơn vị không tồn tại');
    }

    return unit;
  }

  /**
   * Lấy cây phân cấp units
   */
  async getUnitHierarchy(currentUser: any) {
    const rootUnits = await this.prisma.unit.findMany({
      where: { parentId: null, isActive: true },
      include: {
        children: {
          where: { isActive: true },
          include: {
            children: {
              where: { isActive: true },
              include: {
                children: {
                  where: { isActive: true },
                  include: {
                    _count: {
                      select: { users: true },
                    },
                  },
                },
                _count: {
                  select: { users: true },
                },
              },
            },
            _count: {
              select: { users: true },
            },
          },
        },
        _count: {
          select: { users: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return rootUnits;
  }

  /**
   * Cập nhật unit
   */
  async updateUnit(id: string, updateUnitDto: UpdateUnitDto, currentUser: any) {
    // Chỉ SYSTEM_ADMIN và DEPARTMENT_OFFICER có thể cập nhật unit
    if (!['SYSTEM_ADMIN', 'DEPARTMENT_OFFICER'].includes(currentUser.role)) {
      throw new ForbiddenException('Không có quyền cập nhật đơn vị');
    }

    const existingUnit = await this.prisma.unit.findUnique({
      where: { id },
    });

    if (!existingUnit) {
      throw new NotFoundException('Đơn vị không tồn tại');
    }

    const { name, code, parentId, level, isActive } = updateUnitDto;

    // Kiểm tra tên đơn vị đã tồn tại (nếu thay đổi)
    if (name && name !== existingUnit.name) {
      const duplicateName = await this.prisma.unit.findUnique({
        where: { name },
      });

      if (duplicateName) {
        throw new ConflictException('Tên đơn vị đã tồn tại');
      }
    }

    // Kiểm tra mã đơn vị đã tồn tại (nếu thay đổi)
    if (code && code !== existingUnit.code) {
      const duplicateCode = await this.prisma.unit.findUnique({
        where: { code },
      });

      if (duplicateCode) {
        throw new ConflictException('Mã đơn vị đã tồn tại');
      }
    }

    // Kiểm tra parent unit (nếu thay đổi)
    if (parentId !== undefined && parentId !== existingUnit.parentId) {
      if (parentId) {
        // Không cho phép đặt chính nó làm parent
        if (parentId === id) {
          throw new BadRequestException('Không thể đặt chính nó làm đơn vị cha');
        }

        const parentUnit = await this.prisma.unit.findUnique({
          where: { id: parentId },
        });

        if (!parentUnit) {
          throw new BadRequestException('Đơn vị cha không tồn tại');
        }

        if (!parentUnit.isActive) {
          throw new BadRequestException('Đơn vị cha đã bị vô hiệu hóa');
        }

        // Kiểm tra không tạo vòng lặp (circular reference)
        await this.checkCircularReference(id, parentId);
      }
    }

    // Cập nhật unit
    const updatedUnit = await this.prisma.unit.update({
      where: { id },
      data: updateUnitDto,
      include: {
        parent: true,
        children: true,
        _count: {
          select: { users: true },
        },
      },
    });

    return updatedUnit;
  }

  /**
   * Xóa unit (soft delete)
   */
  async deleteUnit(id: string, currentUser: any) {
    // Chỉ SYSTEM_ADMIN có thể xóa unit
    if (currentUser.role !== 'SYSTEM_ADMIN') {
      throw new ForbiddenException('Không có quyền xóa đơn vị');
    }

    const unit = await this.prisma.unit.findUnique({
      where: { id },
      include: {
        children: true,
        users: true,
      },
    });

    if (!unit) {
      throw new NotFoundException('Đơn vị không tồn tại');
    }

    // Kiểm tra có đơn vị con không
    if (unit.children.length > 0) {
      throw new BadRequestException('Không thể xóa đơn vị có đơn vị con');
    }

    // Kiểm tra có user không
    if (unit.users.length > 0) {
      throw new BadRequestException('Không thể xóa đơn vị có user');
    }

    // Xóa unit
    await this.prisma.unit.delete({
      where: { id },
    });

    return { message: 'Xóa đơn vị thành công' };
  }

  /**
   * Vô hiệu hóa/kích hoạt unit
   */
  async toggleUnitStatus(id: string, currentUser: any) {
    // Chỉ SYSTEM_ADMIN và DEPARTMENT_OFFICER có thể thay đổi trạng thái
    if (!['SYSTEM_ADMIN', 'DEPARTMENT_OFFICER'].includes(currentUser.role)) {
      throw new ForbiddenException('Không có quyền thay đổi trạng thái đơn vị');
    }

    const unit = await this.prisma.unit.findUnique({
      where: { id },
      include: {
        children: true,
        users: true,
      },
    });

    if (!unit) {
      throw new NotFoundException('Đơn vị không tồn tại');
    }

    const newStatus = !unit.isActive;

    // Nếu vô hiệu hóa, cần vô hiệu hóa tất cả đơn vị con và users
    if (!newStatus) {
      await this.prisma.$transaction([
        // Vô hiệu hóa đơn vị con
        this.prisma.unit.updateMany({
          where: { parentId: id },
          data: { isActive: false },
        }),
        // Vô hiệu hóa users
        this.prisma.user.updateMany({
          where: { unitId: id },
          data: { isActive: false },
        }),
        // Vô hiệu hóa đơn vị chính
        this.prisma.unit.update({
          where: { id },
          data: { isActive: newStatus },
        }),
      ]);
    } else {
      // Nếu kích hoạt, chỉ kích hoạt đơn vị này
      await this.prisma.unit.update({
        where: { id },
        data: { isActive: newStatus },
      });
    }

    return {
      message: `${newStatus ? 'Kích hoạt' : 'Vô hiệu hóa'} đơn vị thành công`,
      isActive: newStatus,
    };
  }

  /**
   * Kiểm tra circular reference khi thay đổi parent
   */
  private async checkCircularReference(unitId: string, newParentId: string) {
    let currentParent = newParentId;

    while (currentParent) {
      if (currentParent === unitId) {
        throw new BadRequestException('Không thể tạo vòng lặp trong cây phân cấp');
      }

      const parent = await this.prisma.unit.findUnique({
        where: { id: currentParent },
        select: { parentId: true },
      });

      currentParent = parent?.parentId || null;
    }
  }
}