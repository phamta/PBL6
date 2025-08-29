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
} from '@nestjs/common';
import { VisaService } from './visa.service';
import { CreateVisaApplicationDto } from './dto/create-visa-application.dto';
import { UpdateVisaApplicationDto } from './dto/update-visa-application.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user.enum';

@Controller('visa')
@UseGuards(JwtAuthGuard)
export class VisaController {
  constructor(private readonly visaService: VisaService) {}

  @Post()
  create(@Body() createVisaApplicationDto: CreateVisaApplicationDto, @Request() req) {
    return this.visaService.create(createVisaApplicationDto, req.user.id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.KHOA, UserRole.PHONG)
  findAll() {
    return this.visaService.findAll();
  }

  @Get('my-applications')
  findMyApplications(@Request() req) {
    return this.visaService.findByUser(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.visaService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.KHOA)
  update(@Param('id') id: string, @Body() updateVisaApplicationDto: UpdateVisaApplicationDto) {
    return this.visaService.update(id, updateVisaApplicationDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.visaService.remove(id);
  }
}
