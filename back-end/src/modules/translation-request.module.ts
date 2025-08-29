import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TranslationRequest } from '../entities/translation-request.entity';
import { TranslationRequestService } from '../services/translation-request.service';
import { TranslationRequestController } from '../controllers/translation-request.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([TranslationRequest]),
  ],
  controllers: [TranslationRequestController],
  providers: [TranslationRequestService],
  exports: [TranslationRequestService],
})
export class TranslationRequestModule {}
