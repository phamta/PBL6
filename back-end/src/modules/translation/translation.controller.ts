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
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user.enum';

@Controller('translation')
@UseGuards(JwtAuthGuard)
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.KHOA, UserRole.PHONG)
  create(@Body() createTranslationDto: CreateTranslationDto) {
    return this.translationService.create(createTranslationDto);
  }

  @Get()
  findAll() {
    return this.translationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.translationService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.KHOA)
  update(@Param('id') id: string, @Body() updateTranslationDto: UpdateTranslationDto) {
    return this.translationService.update(id, updateTranslationDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.translationService.remove(id);
  }
}
