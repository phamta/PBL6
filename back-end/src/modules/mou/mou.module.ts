import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MouService } from './mou.service';
import { MouController } from './mou.controller';
import { MouMigrationService } from './mou-migration.service';
import { MouMigrationController } from './mou-migration.controller';
import { MouApplication } from './entities/mou-application.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MouApplication, User])],
  controllers: [MouController, MouMigrationController],
  providers: [MouService, MouMigrationService],
  exports: [MouService],
})
export class MouModule {}
