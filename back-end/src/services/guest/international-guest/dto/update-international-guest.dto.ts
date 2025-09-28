import { PartialType } from '@nestjs/mapped-types';
import { CreateInternationalGuestDto } from './create-international-guest.dto';
import { IsOptional, IsIn } from 'class-validator';

export class UpdateInternationalGuestDto extends PartialType(CreateInternationalGuestDto) {
  @IsOptional()
  @IsIn(['pending', 'approved', 'rejected'])
  trangThai?: string;
}