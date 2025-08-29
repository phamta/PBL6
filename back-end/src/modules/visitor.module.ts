import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { VisitorController } from '../controllers/visitor.controller';
import { VisitorService } from '../services/visitor.service';
import { Visitor } from '../entities/visitor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Visitor]),
    MulterModule.register({
      dest: './uploads/visitors',
    }),
  ],
  controllers: [VisitorController],
  providers: [VisitorService],
  exports: [VisitorService],
})
export class VisitorModule {}
