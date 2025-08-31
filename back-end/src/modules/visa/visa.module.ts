import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisaService } from './visa.service';
import { VisaApplication, VisaDocument, VisaHistory } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([VisaApplication, VisaDocument, VisaHistory])],
  providers: [VisaService],
  exports: [VisaService],
})
export class VisaModule {}
