import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserStatusColumn1702000000001 implements MigrationInterface {
  name = 'AddUserStatusColumn1702000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if user table exists
    const userTableExists = await queryRunner.hasTable('user');
    
    if (userTableExists) {
      // Check if status column already exists
      const statusColumnExists = await queryRunner.hasColumn('user', 'status');
      
      if (!statusColumnExists) {
        // Add status column to user table
        await queryRunner.query(`
          ALTER TABLE "user" 
          ADD COLUMN "status" varchar(20) DEFAULT 'active'
        `);
      }
    } else {
      console.log('User table does not exist, skipping status column addition');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Check if user table exists
    const userTableExists = await queryRunner.hasTable('user');
    
    if (userTableExists) {
      // Check if status column exists
      const statusColumnExists = await queryRunner.hasColumn('user', 'status');
      
      if (statusColumnExists) {
        // Remove status column from user table
        await queryRunner.query(`
          ALTER TABLE "user" 
          DROP COLUMN "status"
        `);
      }
    }
  }
}