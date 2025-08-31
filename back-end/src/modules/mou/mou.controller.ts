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
  Put,
} from '@nestjs/common';
import { MouService } from './mou.service';
import { CreateMouDto } from './dto/create-mou.dto';
import { UpdateMouDto } from './dto/update-mou.dto';
import { ReviewMouDto, ApproveMouDto, SignMouDto, FilterMouDto } from './dto/workflow-mou.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../../common/enums/permission.enum';

@Controller('mou')
@UseGuards(JwtAuthGuard)
export class MouController {
  constructor(private readonly mouService: MouService) {}

  @Post()
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.MOU_CREATE)
  create(@Body() createMouDto: CreateMouDto, @Request() req) {
    return this.mouService.create(createMouDto, req.user.id);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.MOU_READ)
  findAll(@Query() filterDto: FilterMouDto) {
    return this.mouService.findAll(filterDto);
  }

  @Get('statistics')
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.REPORT_STATS)
  getStatistics() {
    return this.mouService.getStatistics();
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.MOU_READ)
  findOne(@Param('id') id: string) {
    return this.mouService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.MOU_UPDATE)
  update(@Param('id') id: string, @Body() updateMouDto: UpdateMouDto, @Request() req) {
    return this.mouService.update(id, updateMouDto, req.user.id);
  }

  @Put(':id/review')
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.MOU_REVIEW)
  review(@Param('id') id: string, @Body() reviewDto: ReviewMouDto, @Request() req) {
    return this.mouService.review(id, reviewDto, req.user.id);
  }

  @Put(':id/approve')
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.MOU_APPROVE)
  approve(@Param('id') id: string, @Body() approveDto: ApproveMouDto, @Request() req) {
    return this.mouService.approve(id, approveDto, req.user.id);
  }

  @Put(':id/sign')
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.MOU_SIGN)
  sign(@Param('id') id: string, @Body() signDto: SignMouDto, @Request() req) {
    return this.mouService.sign(id, signDto, req.user.id);
  }

  @Put(':id/assign/:assigneeId')
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.MOU_ASSIGN)
  assign(@Param('id') id: string, @Param('assigneeId') assigneeId: string, @Request() req) {
    return this.mouService.assignToUser(id, assigneeId, req.user.id);
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.MOU_DELETE)
  remove(@Param('id') id: string, @Request() req) {
    return this.mouService.remove(id, req.user.id);
  }
}
