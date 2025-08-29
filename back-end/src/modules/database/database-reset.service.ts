import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseResetService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async resetMouTable(): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    
    try {
      await queryRunner.connect();
      
      // Drop MOUs table and related types
      await queryRunner.query('DROP TABLE IF EXISTS mous CASCADE;');
      await queryRunner.query('DROP TYPE IF EXISTS mous_status_enum_old CASCADE;');
      await queryRunner.query('DROP TYPE IF EXISTS mous_status_enum CASCADE;');
      await queryRunner.query('DROP TYPE IF EXISTS mous_type_enum CASCADE;');
      await queryRunner.query('DROP TYPE IF EXISTS mous_priority_enum CASCADE;');
      
      console.log('MOU table and types dropped successfully');
    } catch (error) {
      console.error('Error resetting MOU table:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
