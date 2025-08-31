import { IsString, IsUUID, IsEnum, IsOptional, IsArray } from 'class-validator';

export enum InstructionType {
  PRIORITY = 'priority',
  GENERAL = 'general',
  URGENT = 'urgent'
}

export class SendInstructionDto {
  @IsArray()
  @IsUUID(4, { each: true })
  recipientIds: string[]; // IDs chuyên viên nhận chỉ đạo

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsEnum(InstructionType)
  type: InstructionType;

  @IsString()
  @IsOptional()
  relatedEntityId?: string; // ID của visa, mou, etc. nếu có liên quan

  @IsString()
  @IsOptional()
  relatedEntityType?: string; // 'visa', 'mou', 'visitor', 'translation'
}
