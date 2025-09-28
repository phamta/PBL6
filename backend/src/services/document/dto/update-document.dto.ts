import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { DocumentType, DocumentStatus } from '@prisma/client';
import { CreateDocumentDto } from './create-document.dto';

/**
 * DTO cập nhật document
 */
export class UpdateDocumentDto extends CreateDocumentDto {
  @ApiProperty({
    description: 'Trạng thái văn bản',
    enum: DocumentStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(DocumentStatus, { message: 'Trạng thái văn bản không hợp lệ' })
  status?: DocumentStatus;
}