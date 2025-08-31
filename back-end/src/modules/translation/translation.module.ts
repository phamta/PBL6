import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TranslationService } from './translation.service';
import { TranslationController } from './translation.controller';
import { TranslationRequestNew } from './entities/translation-application.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TranslationRequestNew])],
  controllers: [TranslationController],
  providers: [TranslationService],
  exports: [TranslationService],
})
export class TranslationModule {}
