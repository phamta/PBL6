import { PartialType } from '@nestjs/swagger';
import { CreateGuestDto } from './create-guest.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { GuestStatus } from '@prisma/client';

export class UpdateGuestDto extends PartialType(CreateGuestDto) {
  @ApiPropertyOptional({ 
    description: 'Trạng thái khách (chỉ admin/manager mới được thay đổi)',
    enum: GuestStatus,
    example: GuestStatus.APPROVED 
  })
  @IsEnum(GuestStatus)
  @IsOptional()
  status?: GuestStatus;
}