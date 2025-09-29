import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { VisaService, VisaUser } from './visa.service';
import { CreateVisaDto, UpdateVisaDto, ExtendVisaDto, ApproveVisaDto, FilterVisaDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ActionGuard } from '../../common/guards/action.guard';
import { RequireAction } from '../../decorators/require-action.decorator';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: VisaUser;
}

/**
 * Visa Controller with RBAC Action-Based Permissions
 * 
 * Actions:
 * - VISA_CREATE: Tạo visa application mới
 * - VISA_UPDATE: Cập nhật visa information
 * - VISA_DELETE: Xóa/hủy visa
 * - VISA_EXTEND: Tạo visa extension request
 * - VISA_APPROVE: Approve visa extension
 * - VISA_REJECT: Reject visa extension
 * - VISA_READ_ALL: Xem tất cả visas
 * - VISA_READ: Xem visas do mình tạo
 */
@ApiTags('Visa Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, ActionGuard)
@Controller('visas')
export class VisaController {
  constructor(private readonly visaService: VisaService) {}

  /**
   * UC001: Create new visa record
   */
  @Post()
  @RequireAction('VISA_CREATE')
  @ApiOperation({ 
    summary: 'Create new visa application',
    description: 'Create new visa applications. Requires VISA_CREATE action.',
  })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Visa application created successfully',
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Invalid input data or validation errors',
  })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT, 
    description: 'Visa number already exists',
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Insufficient permissions',
  })
  @ApiBody({ type: CreateVisaDto })
  async create(
    @Body() createVisaDto: CreateVisaDto,
    @Req() req: AuthenticatedRequest,
  ) {
    // Set the createdBy field from authenticated user
    createVisaDto.createdBy = req.user.id;
    
    const visa = await this.visaService.create(createVisaDto, req.user);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Visa application created successfully',
      data: visa,
    };
  }

  /**
   * UC002: Get all visas with filtering and pagination
   */
  @Get()
  @RequireAction('VISA_READ')
  @ApiOperation({ 
    summary: 'Get all visas with filtering and pagination',
    description: 'Retrieve visas with optional filtering, sorting, and pagination. Requires VISA_READ (minimum) action. Service will check for higher permissions.',
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Visas retrieved successfully',
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Invalid filter parameters',
  })
  @ApiQuery({ name: 'search', required: false, description: 'Search by holder name or visa number' })
  @ApiQuery({ name: 'status', required: false, enum: ['ACTIVE', 'EXPIRING', 'EXPIRED', 'EXTENDED', 'CANCELLED'] })
  @ApiQuery({ name: 'holderCountry', required: false, description: 'Filter by holder country' })
  @ApiQuery({ name: 'sponsorUnit', required: false, description: 'Filter by sponsor unit' })
  @ApiQuery({ name: 'expiringWithinDays', required: false, description: 'Filter visas expiring within specified days' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 10, max: 100)' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sort field' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Sort order' })
  async findAll(
    @Query() filterDto: FilterVisaDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const result = await this.visaService.findAll(filterDto, req.user);
    return {
      statusCode: HttpStatus.OK,
      message: 'Visas retrieved successfully',
      data: result,
    };
  }

  /**
   * UC003: Find visa by ID
   */
  @Get(':id')
  @RequireAction('VISA_READ')
  @ApiOperation({ 
    summary: 'Get visa by ID',
    description: 'Retrieve a specific visa by its ID with all related information. Requires VISA_READ (minimum) action.',
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Visa retrieved successfully',
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Visa not found',
  })
  @ApiParam({ name: 'id', description: 'Visa ID', type: 'string' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const visa = await this.visaService.findOne(id, req.user);
    return {
      statusCode: HttpStatus.OK,
      message: 'Visa retrieved successfully',
      data: visa,
    };
  }

  /**
   * UC004: Update visa information
   */
  @Patch(':id')
  @RequireAction('VISA_UPDATE')
  @ApiOperation({ 
    summary: 'Update visa information',
    description: 'Update visa details. Requires VISA_UPDATE action.',
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Visa updated successfully',
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Invalid update data',
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Insufficient permissions to update this visa',
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Visa not found',
  })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT, 
    description: 'Visa number already exists',
  })
  @ApiParam({ name: 'id', description: 'Visa ID', type: 'string' })
  @ApiBody({ type: UpdateVisaDto })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVisaDto: UpdateVisaDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const visa = await this.visaService.update(id, updateVisaDto, req.user);
    return {
      statusCode: HttpStatus.OK,
      message: 'Visa updated successfully',
      data: visa,
    };
  }

  /**
   * UC005: Delete/Cancel visa
   */
  @Delete(':id')
  @RequireAction('VISA_DELETE')
  @ApiOperation({ 
    summary: 'Cancel visa (soft delete)',
    description: 'Cancel a visa by setting its status to CANCELLED. Requires VISA_DELETE action.',
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Visa cancelled successfully',
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Visa cannot be cancelled',
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Insufficient permissions to cancel this visa',
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Visa not found',
  })
  @ApiParam({ name: 'id', description: 'Visa ID', type: 'string' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    await this.visaService.remove(id, req.user);
    return {
      statusCode: HttpStatus.OK,
      message: 'Visa cancelled successfully',
    };
  }

  /**
   * UC006: Create visa extension request
   */
  @Post(':id/extend')
  @RequireAction('VISA_EXTEND')
  @ApiOperation({ 
    summary: 'Create visa extension request',
    description: 'Create visa extension requests for existing visas. Requires VISA_EXTEND action.',
  })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Visa extension request created successfully',
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Invalid extension data or visa cannot be extended',
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Insufficient permissions',
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Visa not found',
  })
  @ApiParam({ name: 'id', description: 'Visa ID', type: 'string' })
  @ApiBody({ type: ExtendVisaDto })
  async createExtension(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() extendVisaDto: ExtendVisaDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const extension = await this.visaService.createExtension(id, extendVisaDto, req.user);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Visa extension request created successfully',
      data: extension,
    };
  }

  /**
   * UC007: Approve visa extension
   */
  @Post('extensions/:extensionId/approve')
  @RequireAction('VISA_APPROVE')
  @ApiOperation({ 
    summary: 'Approve or reject visa extension',
    description: 'Approve or reject visa extension requests. Requires VISA_APPROVE action.',
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Visa extension processed successfully',
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Extension already processed or invalid approval data',
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Insufficient permissions',
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Visa extension not found',
  })
  @ApiParam({ name: 'extensionId', description: 'Visa extension ID', type: 'string' })
  @ApiBody({ type: ApproveVisaDto })
  async approveExtension(
    @Param('extensionId', ParseUUIDPipe) extensionId: string,
    @Body() approveVisaDto: ApproveVisaDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const extension = await this.visaService.approveExtension(extensionId, approveVisaDto, req.user);
    return {
      statusCode: HttpStatus.OK,
      message: `Visa extension ${approveVisaDto.action.toLowerCase()}d successfully`,
      data: extension,
    };
  }

  /**
   * UC008: Get visa extensions
   */
  @Get(':id/extensions')
  @RequireAction('VISA_READ')
  @ApiOperation({ 
    summary: 'Get visa extensions',
    description: 'Retrieve all extensions for a specific visa. Requires VISA_READ action.',
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Visa extensions retrieved successfully',
  })
  @ApiParam({ name: 'id', description: 'Visa ID', type: 'string' })
  async getExtensions(
    @Param('id', ParseUUIDPipe) visaId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const extensions = await this.visaService.getExtensions(visaId, req.user);
    return {
      statusCode: HttpStatus.OK,
      message: 'Visa extensions retrieved successfully',
      data: {
        count: extensions.length,
        extensions,
      },
    };
  }

  /**
   * UC009: Get visa statistics
   */
  @Get('statistics')
  @RequireAction('VISA_READ_ALL')
  @ApiOperation({ 
    summary: 'Get visa statistics',
    description: 'Retrieve visa statistics including counts by status, expiring visas, and pending extensions. Requires visa.view_all action.',
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Statistics retrieved successfully',
  })
  async getStatistics(@Req() req: AuthenticatedRequest) {
    const statistics = await this.visaService.getStats(req.user);
    return {
      statusCode: HttpStatus.OK,
      message: 'Visa statistics retrieved successfully',
      data: statistics,
    };
  }

  /**
   * UC010: Send expiration reminders (manual trigger)
   */
  @Post('send-reminders')
  @RequireAction('VISA_APPROVE')
  @ApiOperation({ 
    summary: 'Send expiration reminders',
    description: 'Manually trigger sending reminders for visas expiring soon. Requires VISA_APPROVE action.',
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Reminders sent successfully',
  })
  async sendReminders() {
    await this.visaService.sendExpirationReminders();
    return {
      statusCode: HttpStatus.OK,
      message: 'Expiration reminders sent successfully',
    };
  }

  /**
   * Reset reminder status (for testing)
   */
  @Post('reset-reminders')
  @RequireAction('VISA_APPROVE')
  @ApiOperation({ 
    summary: 'Reset reminder status',
    description: 'Reset reminder status for all visas (for testing purposes). Requires VISA_APPROVE action.',
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Reminder status reset successfully',
  })
  async resetReminders() {
    const count = await this.visaService.resetReminders();
    return {
      statusCode: HttpStatus.OK,
      message: 'Reminder status reset successfully',
      data: { resetCount: count },
    };
  }
}