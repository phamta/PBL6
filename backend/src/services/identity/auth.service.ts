import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UpdateUserDto, ChangePasswordDto } from './dto/update-user.dto';

/**
 * Auth Service - Xử lý authentication và authorization
 * Bao gồm đăng nhập, đăng ký, refresh token, quản lý người dùng
 */
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Đăng nhập
   */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Tìm user
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { unit: true },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Tạo tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    // Cập nhật thời gian đăng nhập
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        unit: user.unit,
      },
      ...tokens,
    };
  }

  /**
   * Đăng ký
   */
  async register(registerDto: RegisterDto) {
    const { email, password, fullName, phoneNumber, role, unitId } = registerDto;

    // Kiểm tra email đã tồn tại
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email đã được sử dụng');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Tạo user mới
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        phoneNumber,
        role,
        unitId,
      },
      include: { unit: true },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        unit: user.unit,
      },
      ...tokens,
    };
  }

  /**
   * Refresh token
   */
  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;

    try {
      // Verify refresh token
      const payload = await this.jwtService.verifyAsync(refreshToken);
      
      // Tìm token trong database
      const storedToken = await this.prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
      });

      if (!storedToken || storedToken.expiresAt < new Date()) {
        throw new UnauthorizedException('Refresh token không hợp lệ');
      }

      // Xóa token cũ
      await this.prisma.refreshToken.delete({
        where: { id: storedToken.id },
      });

      // Tạo tokens mới
      const tokens = await this.generateTokens(
        storedToken.user.id,
        storedToken.user.email,
        storedToken.user.role,
      );

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }
  }

  /**
   * Đăng xuất
   */
  async logout(userId: string) {
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });

    return { message: 'Đăng xuất thành công' };
  }

  /**
   * Lấy thông tin user hiện tại
   */
  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        unit: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Người dùng không tồn tại');
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Cập nhật thông tin user
   */
  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    const { email, ...updateData } = updateUserDto;

    // Kiểm tra email đã tồn tại (nếu có thay đổi)
    if (email) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          email,
          id: { not: userId },
        },
      });

      if (existingUser) {
        throw new ConflictException('Email đã được sử dụng');
      }
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { email, ...updateData },
      include: {
        unit: true,
      },
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Đổi mật khẩu
   */
  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Người dùng không tồn tại');
    }

    // Kiểm tra mật khẩu hiện tại
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Mật khẩu hiện tại không đúng');
    }

    // Hash mật khẩu mới
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return { message: 'Đổi mật khẩu thành công' };
  }

  /**
   * Tạo access và refresh token
   */
  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get('jwt.accessTokenExpiresIn'),
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get('jwt.refreshTokenExpiresIn'),
      }),
    ]);

    // Lưu refresh token vào database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}