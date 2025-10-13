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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PartnerService, QueryPartnersDto } from './partner.service';
import { CreatePartnerDto, UpdatePartnerDto } from './dto';
import { ActionGuard } from '../../guards/action.guard';
import { RequireAction } from '../../decorators/require-action.decorator';

@ApiTags('Partners')
@ApiBearerAuth()
@Controller('partners')
@UseGuards(ActionGuard)
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Get()
  @RequireAction('PARTNER_READ')
  @ApiOperation({ summary: 'Lấy danh sách đối tác' })
  @ApiResponse({ status: 200, description: 'Danh sách đối tác' })
  async getPartners(@Query() query: QueryPartnersDto) {
    return await this.partnerService.getPartners(query);
  }

  @Get('all')
  @RequireAction('PARTNER_READ')
  @ApiOperation({ summary: 'Lấy tất cả đối tác (không pagination)' })
  @ApiResponse({ status: 200, description: 'Danh sách tất cả đối tác' })
  async getAllPartners() {
    return await this.partnerService.getAllPartners();
  }

  @Get(':id')
  @RequireAction('PARTNER_READ')
  @ApiOperation({ summary: 'Lấy chi tiết đối tác' })
  @ApiResponse({ status: 200, description: 'Chi tiết đối tác' })
  @ApiResponse({ status: 404, description: 'Đối tác không tồn tại' })
  async getPartnerById(@Param('id') id: string) {
    return await this.partnerService.getPartnerById(id);
  }

  @Post()
  @RequireAction('PARTNER_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tạo đối tác mới' })
  @ApiResponse({ status: 201, description: 'Đối tác đã được tạo' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  async createPartner(@Body() createPartnerDto: CreatePartnerDto) {
    // Implementation will be added later
    return { message: 'Partner creation not implemented yet' };
  }

  @Put(':id')
  @RequireAction('PARTNER_UPDATE')
  @ApiOperation({ summary: 'Cập nhật đối tác' })
  @ApiResponse({ status: 200, description: 'Đối tác đã được cập nhật' })
  @ApiResponse({ status: 404, description: 'Đối tác không tồn tại' })
  async updatePartner(
    @Param('id') id: string,
    @Body() updatePartnerDto: UpdatePartnerDto,
  ) {
    // Implementation will be added later
    return { message: 'Partner update not implemented yet' };
  }

  @Delete(':id')
  @RequireAction('PARTNER_DELETE')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa đối tác' })
  @ApiResponse({ status: 204, description: 'Đối tác đã được xóa' })
  @ApiResponse({ status: 404, description: 'Đối tác không tồn tại' })
  async deletePartner(@Param('id') id: string) {
    // Implementation will be added later
    return { message: 'Partner deletion not implemented yet' };
  }
}