import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from '../../database/prisma.service';  // Thêm import PrismaService

/**
 * JWT Guard - Xác thực người dùng qua JWT token
 * Kiểm tra token trong Authorization header
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,  // Inject PrismaService để query DB
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token không được cung cấp');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      
      // Fetch user từ DB dựa trên sub để lấy unitId (bỏ actions vì không có trong schema)
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, unitId: true },  // Chỉ select id và unitId
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Gán user vào request: id/unitId từ DB, actions từ payload
      request['user'] = {
        id: user.id,
        unitId: user.unitId,
        actions: payload.actions || [],  // Lấy actions từ payload JWT
      };
    } catch {
      throw new UnauthorizedException('Token không hợp lệ');
    }
    
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}