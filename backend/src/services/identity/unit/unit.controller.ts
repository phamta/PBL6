import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { UnitService } from './unit.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { QueryUnitsDto } from './dto/query-units.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

/**
 * Unit Controller - Xử lý CRUD operations cho units
 */
@ApiTags('Unit Management')
@Controller('units')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  /**
   * Tạo unit mới
   */
  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.DEPARTMENT_OFFICER)
  @ApiOperation({
    summary: 'Tạo đơn vị mới',
    description: 'Tạo đơn vị mới trong hệ thống (chỉ admin/department officer)',
  })
  @ApiResponse({
    status: 201,
    description: 'Tạo đơn vị thành công',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        code: { type: 'string' },
        parentId: { type: 'string' },
        level: { type: 'number' },
        isActive: { type: 'boolean' },
        parent: { type: 'object' },
        children: { type: 'array' },
        _count: { type: 'object' },
      },
    },
  })
  @ApiResponse({ status: 409, description: 'Tên hoặc mã đơn vị đã tồn tại' })
  @ApiResponse({ status: 403, description: 'Không có quyền tạo đơn vị' })
  async createUnit(@Body() createUnitDto: CreateUnitDto, @Req() req: any) {
    return this.unitService.createUnit(createUnitDto, req.user);
  }

  /**
   * Lấy danh sách units với pagination và filter
   */
  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách đơn vị',
    description: 'Lấy danh sách đơn vị với pagination và filter',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'parentId', required: false, type: String })
  @ApiQuery({ name: 'level', required: false, type: Number })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'includeChildren', required: false, type: Boolean })
  @ApiQuery({ name: 'includeUsers', required: false, type: Boolean })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách thành công',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              code: { type: 'string' },
              parentId: { type: 'string' },
              level: { type: 'number' },
              isActive: { type: 'boolean' },
              parent: { type: 'object' },
              children: { type: 'array' },
              users: { type: 'array' },
              _count: { type: 'object' },
            },
          },
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            total: { type: 'number' },
            pages: { type: 'number' },
          },
        },
      },
    },
  })
  async findUnits(@Query() queryDto: QueryUnitsDto, @Req() req: any) {
    return this.unitService.findUnits(queryDto, req.user);
  }

  /**
   * Lấy cây phân cấp đơn vị
   */
  @Get('hierarchy')
  @ApiOperation({
    summary: 'Lấy cây phân cấp đơn vị',
    description: 'Lấy toàn bộ cây phân cấp đơn vị theo cấu trúc parent-children',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy cây phân cấp thành công',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          code: { type: 'string' },
          level: { type: 'number' },
          children: {
            type: 'array',
            items: { $ref: '#/components/schemas/Unit' },
          },
          _count: { type: 'object' },
        },
      },
    },
  })
  async getUnitHierarchy(@Req() req: any) {
    return this.unitService.getUnitHierarchy(req.user);
  }

  /**
   * Lấy unit theo ID
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Lấy đơn vị theo ID',
    description: 'Lấy thông tin chi tiết của đơn vị theo ID',
  })
  @ApiParam({ name: 'id', description: 'ID của đơn vị', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin thành công',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        code: { type: 'string' },
        parentId: { type: 'string' },
        level: { type: 'number' },
        isActive: { type: 'boolean' },
        parent: { type: 'object' },
        children: { type: 'array' },
        users: { type: 'array' },
        _count: { type: 'object' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Đơn vị không tồn tại' })
  async findUnitById(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: any,
  ) {
    return this.unitService.findUnitById(id, req.user);
  }

  /**
   * Cập nhật unit
   */
  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.DEPARTMENT_OFFICER)
  @ApiOperation({
    summary: 'Cập nhật đơn vị',
    description: 'Cập nhật thông tin đơn vị',
  })
  @ApiParam({ name: 'id', description: 'ID của đơn vị', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật thành công',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        code: { type: 'string' },
        parentId: { type: 'string' },
        level: { type: 'number' },
        isActive: { type: 'boolean' },
        parent: { type: 'object' },
        children: { type: 'array' },
        _count: { type: 'object' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Đơn vị không tồn tại' })
  @ApiResponse({ status: 403, description: 'Không có quyền cập nhật đơn vị' })
  @ApiResponse({ status: 409, description: 'Tên hoặc mã đơn vị đã tồn tại' })
  async updateUnit(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUnitDto: UpdateUnitDto,
    @Req() req: any,
  ) {
    return this.unitService.updateUnit(id, updateUnitDto, req.user);
  }

  /**
   * Thay đổi trạng thái unit (kích hoạt/vô hiệu hóa)
   */
  @Patch(':id/toggle-status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.DEPARTMENT_OFFICER)
  @ApiOperation({
    summary: 'Thay đổi trạng thái đơn vị',
    description: 'Kích hoạt hoặc vô hiệu hóa đơn vị',
  })
  @ApiParam({ name: 'id', description: 'ID của đơn vị', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Thay đổi trạng thái thành công',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        isActive: { type: 'boolean' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Đơn vị không tồn tại' })
  @ApiResponse({ status: 403, description: 'Không có quyền thay đổi trạng thái' })
  async toggleUnitStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: any,
  ) {
    return this.unitService.toggleUnitStatus(id, req.user);
  }

  /**
   * Xóa unit
   */
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SYSTEM_ADMIN)
  @ApiOperation({
    summary: 'Xóa đơn vị',
    description: 'Xóa đơn vị khỏi hệ thống (chỉ system admin)',
  })
  @ApiParam({ name: 'id', description: 'ID của đơn vị', type: 'string' })
  @ApiResponse({ status: 200, description: 'Xóa đơn vị thành công' })
  @ApiResponse({ status: 404, description: 'Đơn vị không tồn tại' })
  @ApiResponse({ status: 403, description: 'Không có quyền xóa đơn vị' })
  @ApiResponse({ status: 400, description: 'Không thể xóa đơn vị có đơn vị con hoặc users' })
  async deleteUnit(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: any,
  ) {
    return this.unitService.deleteUnit(id, req.user);
  }
}