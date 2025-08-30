import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitorService } from './visitor.service';
import { VisitorController } from './visitor.controller';
import { VisitorGroup } from './entities/visitor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VisitorGroup])],
  controllers: [VisitorController],
  providers: [VisitorService],
  exports: [VisitorService],
})
export class VisitorModule {}
