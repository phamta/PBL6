import { Logger } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';

export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);

  static async withTransaction<T>(
    dataSource: DataSource,
    callback: (queryRunner: QueryRunner) => Promise<T>,
    options: { dryRun?: boolean } = {}
  ): Promise<T> {
    const queryRunner = dataSource.createQueryRunner();
    
    try {
      await queryRunner.connect();
      
      if (!options.dryRun) {
        await queryRunner.startTransaction();
      }
      
      const result = await callback(queryRunner);
      
      if (!options.dryRun) {
        await queryRunner.commitTransaction();
      }
      
      return result;
    } catch (error) {
      if (!options.dryRun) {
        await queryRunner.rollbackTransaction();
      }
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  static async safeQuery(
    queryRunner: QueryRunner,
    query: string,
    parameters?: any[]
  ): Promise<any> {
    try {
      return await queryRunner.query(query, parameters);
    } catch (error) {
      throw new Error(`Database query failed: ${error.message}`);
    }
  }
}
