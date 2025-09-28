import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TranslationService } from './translation.service';
import { CreateTranslationDto } from './dto/create-translation.dto';
import { UpdateTranslationDto } from './dto/update-translation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../../common/enums/permission.enum';

@Controller('translation')
@UseGuards(JwtAuthGuard)
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}

  @Post()
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.TRANSLATION_CREATE)
  create(@Body() createTranslationDto: CreateTranslationDto) {
    return this.translationService.create(createTranslationDto);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.TRANSLATION_READ)
  findAll() {
    return this.translationService.findAll();
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.TRANSLATION_READ)
  findOne(@Param('id') id: string) {
    return this.translationService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.TRANSLATION_UPDATE)
  update(@Param('id') id: string, @Body() updateTranslationDto: UpdateTranslationDto) {
    return this.translationService.update(id, updateTranslationDto);
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.TRANSLATION_DELETE)
  remove(@Param('id') id: string) {
    return this.translationService.remove(id);
  }
}
