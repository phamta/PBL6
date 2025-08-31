import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from '../modules/user/user.service';
import { CreateUserDto } from '../modules/user/dto/create-user.dto';
import { UserRole } from '../common/enums/user.enum';
import { UserUtils } from '../common/utils/user.utils';

@Controller('debug')
export class DebugController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get('users')
  async getAllUsers() {
    try {
      const users = await this.userService.findAll();
      return {
        success: true,
        count: users.length,
        users: users.map(user => ({
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: UserUtils.getPrimaryRole(user),
          status: 'active',
          createdAt: user.createdAt
        }))
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Post('create-admin')
  async createAdmin() {
    try {
      const createAdminDto: CreateUserDto = {
        email: 'admin@university.edu.vn',
        fullName: 'Administrator',
        password: 'admin123',
        role: UserRole.ADMIN,
        department: 'IT Department'
      };

      const user = await this.userService.create(createAdminDto);
      return {
        success: true,
        message: 'Admin user created successfully',
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: UserUtils.getPrimaryRole(user)
        },
        credentials: {
          email: 'admin@university.edu.vn',
          password: 'admin123'
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Get('check-admin')
  async checkAdmin() {
    try {
      const admin = await this.userService.findByEmail('admin@university.edu.vn');
      if (admin) {
        return {
          success: true,
          exists: true,
          admin: {
            id: admin.id,
            email: admin.email,
            fullName: admin.fullName,
            role: UserUtils.getPrimaryRole(admin),
            status: 'active'
          }
        };
      } else {
        return {
          success: true,
          exists: false,
          message: 'Admin user not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}
