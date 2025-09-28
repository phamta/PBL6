import { Controller, Post, Body, UseGuards, Logger } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user.enum';
import { MouMigrationService } from './mou-migration.service';
import { MigrationOptionsDto, MigrationResult } from './dto/migration.dto';

@Controller('mou-migration')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MouMigrationController {
  private readonly logger = new Logger(MouMigrationController.name);

  constructor(private readonly mouMigrationService: MouMigrationService) {}

  @Post('fix-enum')
  @Roles(UserRole.ADMIN)
  async fixMouEnum(@Body() options: MigrationOptionsDto): Promise<MigrationResult> {
    this.logger.log('MOU enum fix requested', { options });
    return this.mouMigrationService.fixMouEnumIssue(options);
  }

  @Post('drop-table')
  @Roles(UserRole.ADMIN)
  async dropMouTable(@Body() options: MigrationOptionsDto): Promise<{ message: string }> {
    this.logger.warn('MOU table drop requested - DANGEROUS OPERATION', { options });
    
    if (!options.force) {
      throw new Error('This is a dangerous operation. Set force: true to proceed.');
    }
    
    await this.mouMigrationService.dropAndRecreateMouTable();
    return { message: 'MOU table dropped successfully. Restart server to recreate.' };
  }
}
