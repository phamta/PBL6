import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RefreshTokenGuard } from '../../../common/guards/refresh-token.guard';

/**
 * Auth Controller - Xử lý các endpoint authentication
 */
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Đăng ký user mới
   */
  @Post('register')
  @ApiOperation({
    summary: 'Đăng ký user mới',
    description: 'Tạo tài khoản mới trong hệ thống',
  })
  @ApiResponse({
    status: 201,
    description: 'Đăng ký thành công',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            fullName: { type: 'string' },
            role: { type: 'string' },
            isActive: { type: 'boolean' },
            unit: { type: 'object' },
          },
        },
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 409, description: 'Email đã được sử dụng' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * Đăng nhập
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Đăng nhập',
    description: 'Xác thực user và trả về access token + refresh token',
  })
  @ApiResponse({
    status: 200,
    description: 'Đăng nhập thành công',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            fullName: { type: 'string' },
            role: { type: 'string' },
            isActive: { type: 'boolean' },
            unit: { type: 'object' },
          },
        },
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Email hoặc mật khẩu không đúng' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * Refresh access token
   */
  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('refresh-token')
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Tạo access token mới bằng refresh token',
  })
  @ApiBody({
    description: 'Không cần body, refresh token được lấy từ Authorization header',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Refresh thành công',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Refresh token không hợp lệ' })
  async refreshToken(@Req() req: any) {
    const { id: userId, refreshToken } = req.user;
    return this.authService.refreshToken(userId, refreshToken);
  }

  /**
   * Đăng xuất
   */
  @Post('logout')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('refresh-token')
  @ApiOperation({
    summary: 'Đăng xuất',
    description: 'Đăng xuất khỏi thiết bị hiện tại (xóa refresh token)',
  })
  @ApiResponse({ status: 200, description: 'Đăng xuất thành công' })
  async logout(@Req() req: any) {
    const { id: userId, refreshToken } = req.user;
    return this.authService.logout(userId, refreshToken);
  }

  /**
   * Đăng xuất tất cả thiết bị
   */
  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Đăng xuất tất cả thiết bị',
    description: 'Đăng xuất khỏi tất cả thiết bị (xóa tất cả refresh token)',
  })
  @ApiResponse({ status: 200, description: 'Đăng xuất tất cả thiết bị thành công' })
  async logoutAll(@Req() req: any) {
    const { id: userId } = req.user;
    return this.authService.logoutAll(userId);
  }

  /**
   * Lấy thông tin user hiện tại
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy thông tin profile',
    description: 'Lấy thông tin user đang đăng nhập',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin thành công',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        email: { type: 'string' },
        fullName: { type: 'string' },
        role: { type: 'string' },
        isActive: { type: 'boolean' },
        unit: { type: 'object' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Chưa xác thực' })
  async getProfile(@Req() req: any) {
    return req.user;
  }
}