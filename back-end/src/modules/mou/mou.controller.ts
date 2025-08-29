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
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user.enum';

@Controller('mou')
@UseGuards(JwtAuthGuard)
export class MouController {
  constructor(private readonly mouService: MouService) {}

  @Post()
  create(@Body() createMouDto: CreateMouDto, @Request() req) {
    return this.mouService.create(createMouDto, req.user.id);
  }

  @Get()
  findAll(@Query() filterDto: FilterMouDto) {
    return this.mouService.findAll(filterDto);
  }

  @Get('statistics')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.KHOA, UserRole.PHONG)
  getStatistics() {
    return this.mouService.getStatistics();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mouService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMouDto: UpdateMouDto, @Request() req) {
    return this.mouService.update(id, updateMouDto, req.user.id);
  }

  @Put(':id/review')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.KHOA, UserRole.PHONG)
  review(@Param('id') id: string, @Body() reviewDto: ReviewMouDto, @Request() req) {
    return this.mouService.review(id, reviewDto, req.user.id);
  }

  @Put(':id/approve')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.KHOA)
  approve(@Param('id') id: string, @Body() approveDto: ApproveMouDto, @Request() req) {
    return this.mouService.approve(id, approveDto, req.user.id);
  }

  @Put(':id/sign')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.KHOA)
  sign(@Param('id') id: string, @Body() signDto: SignMouDto, @Request() req) {
    return this.mouService.sign(id, signDto, req.user.id);
  }

  @Put(':id/assign/:assigneeId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.KHOA, UserRole.PHONG)
  assign(@Param('id') id: string, @Param('assigneeId') assigneeId: string, @Request() req) {
    return this.mouService.assignToUser(id, assigneeId, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.mouService.remove(id, req.user.id);
  }
}
