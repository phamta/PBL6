import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user.enum';
import { MouMigrationService } from './mou-migration.service';

@Controller('mou-migration')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MouMigrationController {
  constructor(private readonly mouMigrationService: MouMigrationService) {}

  @Post('fix-enum')
  @Roles(UserRole.ADMIN)
  async fixMouEnum() {
    await this.mouMigrationService.fixMouEnumIssue();
    return { message: 'MOU enum issue fixed successfully' };
  }

  @Post('drop-table')
  @Roles(UserRole.ADMIN)
  async dropMouTable() {
    await this.mouMigrationService.dropAndRecreateMouTable();
    return { message: 'MOU table dropped successfully. Restart server to recreate.' };
  }
}
