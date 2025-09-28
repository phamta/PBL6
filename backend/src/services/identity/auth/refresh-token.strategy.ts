import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../database/prisma.service';

/**
 * Refresh Token Strategy - Xác thực refresh token
 */
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.refreshSecret'),
      passReqToCallback: true,
    });
  }

  /**
   * Validate refresh token payload
   */
  async validate(req: any, payload: any) {
    const refreshToken = req.get('authorization')?.replace('Bearer', '').trim();

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { refreshTokens: true },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User không tồn tại hoặc đã bị vô hiệu hóa');
    }

    // Kiểm tra refresh token có tồn tại trong DB và chưa hết hạn
    const storedToken = user.refreshTokens.find(
      (token) => token.token === refreshToken && token.expiresAt > new Date()
    );

    if (!storedToken) {
      throw new UnauthorizedException('Refresh token không hợp lệ hoặc đã hết hạn');
    }

    const { password, refreshTokens, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      refreshToken,
    };
  }
}