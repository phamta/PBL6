import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User, RefreshToken } from '@prisma/client';

/**
 * Auth Service - Xử lý authentication và authorization
 */
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Đăng ký user mới
   */
  async register(registerDto: RegisterDto) {
    const { email, password, fullName, unitId, role = 'STUDENT' } = registerDto;

    // Kiểm tra email đã tồn tại
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email đã được sử dụng');
    }

    // Kiểm tra unit có tồn tại
    if (unitId) {
      const unit = await this.prisma.unit.findUnique({
        where: { id: unitId },
      });
      if (!unit) {
        throw new BadRequestException('Unit không tồn tại');
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Tạo user mới
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        role,
        unitId,
      },
      include: {
        unit: true,
      },
    });

    // Tạo tokens
    const tokens = await this.generateTokens(user.id);

    // Loại bỏ password khỏi response
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      ...tokens,
    };
  }

  /**
   * Đăng nhập user
   */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Tìm user theo email
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { unit: true },
    });

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Kiểm tra user có active không
    if (!user.isActive) {
      throw new UnauthorizedException('Tài khoản đã bị vô hiệu hóa');
    }

    // Kiểm tra password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Tạo tokens
    const tokens = await this.generateTokens(user.id);

    // Loại bỏ password khỏi response
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      ...tokens,
    };
  }

  /**
   * Refresh token
   */
  async refreshToken(userId: string, refreshToken: string) {
    // Kiểm tra refresh token trong DB
    const storedToken = await this.prisma.refreshToken.findFirst({
      where: {
        userId,
        token: refreshToken,
        expiresAt: { gt: new Date() },
      },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Refresh token không hợp lệ hoặc đã hết hạn');
    }

    // Xóa refresh token cũ
    await this.prisma.refreshToken.delete({
      where: { id: storedToken.id },
    });

    // Tạo tokens mới
    const tokens = await this.generateTokens(userId);

    return tokens;
  }

  /**
   * Đăng xuất (xóa refresh token)
   */
  async logout(userId: string, refreshToken: string) {
    await this.prisma.refreshToken.deleteMany({
      where: {
        userId,
        token: refreshToken,
      },
    });

    return { message: 'Đăng xuất thành công' };
  }

  /**
   * Đăng xuất tất cả thiết bị
   */
  async logoutAll(userId: string) {
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });

    return { message: 'Đăng xuất tất cả thiết bị thành công' };
  }

  /**
   * Validate user (dùng cho Passport strategies)
   */
  async validateUser(userId: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { unit: true },
    });

    if (!user || !user.isActive) {
      return null;
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Tạo access token và refresh token
   */
  private async generateTokens(userId: string) {
    const payload = { sub: userId };

    const [accessToken, refreshTokenValue] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.secret'),
        expiresIn: this.configService.get<string>('jwt.accessTokenExpiry'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
        expiresIn: this.configService.get<string>('jwt.refreshTokenExpiry'),
      }),
    ]);

    // Lưu refresh token vào DB
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 ngày

    await this.prisma.refreshToken.create({
      data: {
        token: refreshTokenValue,
        userId,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken: refreshTokenValue,
    };
  }

  /**
   * Xóa các refresh token hết hạn (có thể chạy bằng cron job)
   */
  async cleanExpiredTokens() {
    await this.prisma.refreshToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });
  }
}