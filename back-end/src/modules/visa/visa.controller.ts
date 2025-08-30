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
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { Permission } from '../../common/enums/permission.enum';

@Controller('visa')
@UseGuards(JwtAuthGuard)
export class VisaController {
  constructor(private readonly visaService: VisaService) {}

  @Post()
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.VISA_CREATE)
  create(@Body() createVisaApplicationDto: CreateVisaApplicationDto, @Request() req) {
    return this.visaService.create(createVisaApplicationDto, req.user.id);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.VISA_READ)
  findAll() {
    return this.visaService.findAll();
  }

  @Get('my-applications')
  findMyApplications(@Request() req) {
    return this.visaService.findByUser(req.user.id);
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.VISA_READ)
  findOne(@Param('id') id: string) {
    return this.visaService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.VISA_UPDATE)
  update(@Param('id') id: string, @Body() updateVisaApplicationDto: UpdateVisaApplicationDto) {
    return this.visaService.update(id, updateVisaApplicationDto);
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.VISA_DELETE)
  remove(@Param('id') id: string) {
    return this.visaService.remove(id);
  }
}
