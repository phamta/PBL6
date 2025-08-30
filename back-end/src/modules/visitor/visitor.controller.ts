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
import { VisitorService } from './visitor.service';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { Permission } from '../../common/enums/permission.enum';

@Controller('visitor')
@UseGuards(JwtAuthGuard)
export class VisitorController {
  constructor(private readonly visitorService: VisitorService) {}

  @Post()
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.VISITOR_CREATE)
  create(@Body() createVisitorDto: CreateVisitorDto) {
    return this.visitorService.create(createVisitorDto);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.VISITOR_READ)
  findAll() {
    return this.visitorService.findAll();
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.VISITOR_READ)
  findOne(@Param('id') id: string) {
    return this.visitorService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.VISITOR_UPDATE)
  update(@Param('id') id: string, @Body() updateVisitorDto: UpdateVisitorDto) {
    return this.visitorService.update(id, updateVisitorDto);
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.VISITOR_DELETE)
  remove(@Param('id') id: string) {
    return this.visitorService.remove(id);
  }
}
