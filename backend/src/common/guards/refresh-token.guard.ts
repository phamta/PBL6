import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Refresh Token Guard - Bảo vệ endpoint cần refresh token
 */
@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {}