import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user.enum';
import { DatabaseResetService } from './database-reset.service';

@Controller('database')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DatabaseResetController {
  constructor(private readonly databaseResetService: DatabaseResetService) {}

  @Post('reset-mou')
  @Roles(UserRole.ADMIN)
  async resetMouTable() {
    await this.databaseResetService.resetMouTable();
    return { message: 'MOU table reset successfully' };
  }
}
