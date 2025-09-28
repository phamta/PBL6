import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TranslationCertificate } from '../../common/entities/translation-certificate.entity';
import { TranslationCertificateService } from './translation-certificate.service';
import { TranslationCertificateController } from './translation-certificate.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TranslationCertificate])],
  controllers: [TranslationCertificateController],
  providers: [TranslationCertificateService],
  exports: [TranslationCertificateService],
})
export class TranslationCertificateModule {}