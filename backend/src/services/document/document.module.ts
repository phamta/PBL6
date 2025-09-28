import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { IdentityModule } from '../identity/identity.module';

/**
 * Document Module - Module quản lý MOU và văn bản hợp tác
 * UC002: Khởi tạo đề xuất MOU
 * UC003: Duyệt MOU
 */
@Module({
  imports: [IdentityModule],
  controllers: [DocumentController],
  providers: [DocumentService],
  exports: [DocumentService],
})
export class DocumentModule {}