import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AddSystemSettingsAndUserStatus1702000000000 implements MigrationInterface {
  name = 'AddSystemSettingsAndUserStatus1702000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create system_settings table
    await queryRunner.createTable(
      new Table({
        name: 'system_settings',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'key',
            type: 'varchar',
            length: '255',
            isUnique: true,
          },
          {
            name: 'value',
            type: 'text',
          },
          {
            name: 'type',
            type: 'varchar',
            length: '50',
            default: "'string'",
          },
          {
            name: 'category',
            type: 'varchar',
            length: '100',
            default: "'general'",
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'is_editable',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Add status column to user table
    await queryRunner.query(`
      ALTER TABLE "user" 
      ADD COLUMN "status" varchar(20) DEFAULT 'active'
    `);

    // Insert default system settings
    await queryRunner.query(`
      INSERT INTO "system_settings" ("key", "value", "type", "category", "description", "is_editable") VALUES
      ('app_name', 'PBL6 QLHTQT', 'string', 'general', 'Tên ứng dụng', true),
      ('app_version', '1.0.0', 'string', 'general', 'Phiên bản ứng dụng', false),
      ('max_file_size', '10485760', 'number', 'files', 'Kích thước file tối đa (bytes)', true),
      ('allowed_file_types', 'pdf,doc,docx,jpg,jpeg,png', 'string', 'files', 'Các loại file được phép', true),
      ('email_notifications', 'true', 'boolean', 'notifications', 'Bật thông báo email', true),
      ('auto_backup', 'true', 'boolean', 'system', 'Tự động sao lưu', true),
      ('backup_frequency', '24', 'number', 'system', 'Tần suất sao lưu (giờ)', true),
      ('maintenance_mode', 'false', 'boolean', 'system', 'Chế độ bảo trì', true),
      ('default_language', 'vi', 'string', 'general', 'Ngôn ngữ mặc định', true),
      ('session_timeout', '3600', 'number', 'security', 'Thời gian timeout phiên (giây)', true)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove status column from user table
    await queryRunner.query(`
      ALTER TABLE "user" 
      DROP COLUMN "status"
    `);

    // Drop system_settings table
    await queryRunner.dropTable('system_settings');
  }
}