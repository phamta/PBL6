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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../../common/enums/permission.enum';
import { UserRole } from '../../common/enums/user.enum';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.USER_CREATE)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.USER_READ)
  findAll() {
    return this.userService.findAll();
  }

  @Get('profile')
  getProfile(@Request() req) {
    return this.userService.findOne(req.user.id);
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.USER_READ)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.USER_UPDATE)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Patch('profile')
  updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user.id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.USER_DELETE)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Post(':id/assign-role')
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.USER_ASSIGN_ROLE)
  assignRole(@Param('id') id: string, @Body() body: { role: UserRole }) {
    return this.userService.update(id, { role: body.role });
  }
}
