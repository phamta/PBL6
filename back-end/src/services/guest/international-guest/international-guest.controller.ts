import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user.enum';
import { InternationalGuestService } from './international-guest.service';
import { CreateInternationalGuestDto } from './dto/create-international-guest.dto';
import { UpdateInternationalGuestDto } from './dto/update-international-guest.dto';

@Controller('international-guests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InternationalGuestController {
  constructor(private readonly internationalGuestService: InternationalGuestService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.SPECIALIST)
  create(@Body() createDto: CreateInternationalGuestDto, @Request() req) {
    return this.internationalGuestService.create(createDto, req.user.userId);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.SPECIALIST, UserRole.VIEWER)
  findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.internationalGuestService.findAll(+page, +limit);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.SPECIALIST, UserRole.VIEWER)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.internationalGuestService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.SPECIALIST)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateInternationalGuestDto) {
    return this.internationalGuestService.update(id, updateDto);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('trangThai') trangThai: string,
  ) {
    return this.internationalGuestService.updateStatus(id, trangThai);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.internationalGuestService.remove(id);
  }
}