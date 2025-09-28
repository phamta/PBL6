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
import { TranslationCertificateService } from './translation-certificate.service';
import { CreateTranslationCertificateDto } from './dto/create-translation-certificate.dto';
import { UpdateTranslationCertificateDto } from './dto/update-translation-certificate.dto';

@Controller('translation-certificates')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TranslationCertificateController {
  constructor(private readonly translationCertificateService: TranslationCertificateService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.SPECIALIST)
  create(@Body() createDto: CreateTranslationCertificateDto, @Request() req) {
    return this.translationCertificateService.create(createDto, req.user.userId);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.SPECIALIST, UserRole.VIEWER)
  findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.translationCertificateService.findAll(+page, +limit);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.SPECIALIST, UserRole.VIEWER)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.translationCertificateService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.SPECIALIST)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateTranslationCertificateDto) {
    return this.translationCertificateService.update(id, updateDto);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('trangThai') trangThai: string,
  ) {
    return this.translationCertificateService.updateStatus(id, trangThai);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.translationCertificateService.remove(id);
  }
}