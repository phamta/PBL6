import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, QueryRunner } from 'typeorm';
import { MOU_STATUS_VALUES } from './constants/mou.constants';
import { MigrationResult, MigrationOptionsDto, EnumCheckResult } from './dto/migration.dto';

@Injectable()
export class MouMigrationService {
  private readonly logger = new Logger(MouMigrationService.name);

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async fixMouEnumIssue(options: MigrationOptionsDto = {}): Promise<MigrationResult> {
    const queryRunner = this.dataSource.createQueryRunner();
    let totalAffectedRows = 0;
    const errors: string[] = [];
    const warnings: string[] = [];
    const details: any = {};
    
    try {
      await queryRunner.connect();
      
      if (!options.dryRun) {
        await queryRunner.startTransaction();
      }
      
      this.logger.log('Starting MOU enum fix...', { dryRun: options.dryRun });
      
      // Step 1: Update existing "active" status to "signed"
      const activeToSignedResult = await this.updateActiveToSigned(queryRunner, options.dryRun);
      totalAffectedRows += activeToSignedResult;
      details.activeToSigned = activeToSignedResult;
      
      // Step 2: Add missing enum values
      if (!options.dryRun) {
        const addedEnumValues = await this.addMissingEnumValues(queryRunner);
        details.enumValuesAdded = addedEnumValues;
      } else {
        this.logger.log('[DRY RUN] Would add missing enum values');
        details.enumValuesAdded = MOU_STATUS_VALUES;
      }
      
      // Step 3: Update invalid status values
      const invalidStatusResult = await this.updateInvalidStatuses(queryRunner, options.dryRun);
      totalAffectedRows += invalidStatusResult;
      details.invalidStatuses = invalidStatusResult;
      
      if (!options.dryRun) {
        await queryRunner.commitTransaction();
      }
      
      this.logger.log('MOU enum fix completed successfully', { 
        totalAffectedRows,
        dryRun: options.dryRun 
      });
      
      return {
        success: true,
        affectedRows: totalAffectedRows,
        message: options.dryRun ? 'Migration preview completed' : 'MOU enum fix completed successfully',
        errors: errors.length > 0 ? errors : undefined,
        warnings: warnings.length > 0 ? warnings : undefined,
        details,
      };
      
    } catch (error) {
      if (!options.dryRun) {
        await queryRunner.rollbackTransaction();
      }
      this.logger.error('Error fixing MOU enum:', error);
      
      return {
        success: false,
        affectedRows: 0,
        message: `Failed to fix MOU enum: ${error.message}`,
        errors: [error.message],
      };
    } finally {
      await queryRunner.release();
    }
  }

  async dropAndRecreateMouTable(): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      
      this.logger.log('Dropping MOU table and related objects...');
      
      // Drop table and related objects
      await queryRunner.query('DROP TABLE IF EXISTS mous CASCADE');
      await queryRunner.query('DROP TYPE IF EXISTS mous_status_enum CASCADE');
      await queryRunner.query('DROP TYPE IF EXISTS mous_status_enum_old CASCADE');
      await queryRunner.query('DROP TYPE IF EXISTS mous_type_enum CASCADE');
      await queryRunner.query('DROP TYPE IF EXISTS mous_priority_enum CASCADE');
      
      await queryRunner.commitTransaction();
      this.logger.log('MOU table and types dropped successfully');
      
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Error dropping MOU table:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async updateActiveToSigned(queryRunner: QueryRunner, dryRun: boolean): Promise<number> {
    const query = `UPDATE mous SET status = 'signed' WHERE status = 'active'`;
    
    if (dryRun) {
      const countResult = await queryRunner.query(`SELECT COUNT(*) as count FROM mous WHERE status = 'active'`);
      const count = parseInt(countResult[0]?.count || '0');
      this.logger.log(`[DRY RUN] Would update ${count} active status to signed`);
      return count;
    }
    
    const result = await queryRunner.query(query);
    const affectedRows = result.affectedRows || 0;
    this.logger.log(`Updated ${affectedRows} active status to signed`);
    return affectedRows;
  }

  private async addMissingEnumValues(queryRunner: QueryRunner): Promise<string[]> {
    const addedValues: string[] = [];
    
    for (const value of MOU_STATUS_VALUES) {
      try {
        await queryRunner.query(`ALTER TYPE mous_status_enum ADD VALUE IF NOT EXISTS '${value}'`);
        addedValues.push(value);
        this.logger.log(`Added enum value: ${value}`);
      } catch (error) {
        this.logger.warn(`Enum value '${value}' might already exist: ${error.message}`);
      }
    }
    
    return addedValues;
  }

  private async updateInvalidStatuses(queryRunner: QueryRunner, dryRun: boolean): Promise<number> {
    const validStatuses = MOU_STATUS_VALUES.map(status => `'${status}'`).join(', ');
    const query = `UPDATE mous SET status = 'signed' WHERE status NOT IN (${validStatuses})`;
    
    if (dryRun) {
      const countResult = await queryRunner.query(
        `SELECT COUNT(*) as count FROM mous WHERE status NOT IN (${validStatuses})`
      );
      const count = parseInt(countResult[0]?.count || '0');
      this.logger.log(`[DRY RUN] Would update ${count} invalid status values`);
      return count;
    }
    
    const result = await queryRunner.query(query);
    const affectedRows = result.affectedRows || 0;
    this.logger.log(`Updated ${affectedRows} invalid status values`);
    return affectedRows;
  }

  private async checkEnumExists(queryRunner: QueryRunner, enumName: string): Promise<EnumCheckResult> {
    try {
      const result = await queryRunner.query(`
        SELECT enumlabel as value 
        FROM pg_enum 
        JOIN pg_type ON pg_enum.enumtypid = pg_type.oid 
        WHERE pg_type.typname = $1
      `, [enumName]);
      
      const currentValues = result.map((row: any) => row.value);
      const missingValues = MOU_STATUS_VALUES.filter(value => !currentValues.includes(value));
      
      return {
        exists: result.length > 0,
        values: currentValues,
        missingValues,
      };
    } catch (error) {
      return {
        exists: false,
        values: [],
        missingValues: MOU_STATUS_VALUES,
      };
    }
  }
}
