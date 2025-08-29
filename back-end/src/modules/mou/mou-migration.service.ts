import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class MouMigrationService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async fixMouEnumIssue(): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      
      console.log('Starting MOU enum fix...');
      
      // Step 1: Update existing "active" status to "signed"
      await queryRunner.query(`UPDATE mous SET status = 'signed' WHERE status = 'active'`);
      console.log('Updated active status to signed');
      
      // Step 2: Add missing enum values if they don't exist
      try {
        await queryRunner.query(`ALTER TYPE mous_status_enum ADD VALUE IF NOT EXISTS 'proposing'`);
        await queryRunner.query(`ALTER TYPE mous_status_enum ADD VALUE IF NOT EXISTS 'reviewing'`);
        await queryRunner.query(`ALTER TYPE mous_status_enum ADD VALUE IF NOT EXISTS 'pending_supplement'`);
        await queryRunner.query(`ALTER TYPE mous_status_enum ADD VALUE IF NOT EXISTS 'approved'`);
        await queryRunner.query(`ALTER TYPE mous_status_enum ADD VALUE IF NOT EXISTS 'rejected'`);
        await queryRunner.query(`ALTER TYPE mous_status_enum ADD VALUE IF NOT EXISTS 'expired'`);
        await queryRunner.query(`ALTER TYPE mous_status_enum ADD VALUE IF NOT EXISTS 'terminated'`);
        console.log('Added missing enum values');
      } catch (error) {
        console.log('Enum values might already exist or enum needs to be recreated');
      }
      
      // Step 3: Update any other invalid status values
      await queryRunner.query(`
        UPDATE mous SET status = 'signed' 
        WHERE status NOT IN ('proposing', 'reviewing', 'pending_supplement', 'approved', 'signed', 'rejected', 'expired', 'terminated')
      `);
      console.log('Updated any other invalid status values');
      
      await queryRunner.commitTransaction();
      console.log('MOU enum fix completed successfully');
      
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error fixing MOU enum:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async dropAndRecreateMouTable(): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      
      console.log('Dropping MOU table and related objects...');
      
      // Drop table and related objects
      await queryRunner.query('DROP TABLE IF EXISTS mous CASCADE');
      await queryRunner.query('DROP TYPE IF EXISTS mous_status_enum CASCADE');
      await queryRunner.query('DROP TYPE IF EXISTS mous_status_enum_old CASCADE');
      await queryRunner.query('DROP TYPE IF EXISTS mous_type_enum CASCADE');
      await queryRunner.query('DROP TYPE IF EXISTS mous_priority_enum CASCADE');
      
      await queryRunner.commitTransaction();
      console.log('MOU table and types dropped successfully');
      
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error dropping MOU table:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
