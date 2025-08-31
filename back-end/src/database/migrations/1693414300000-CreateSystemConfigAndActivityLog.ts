import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateSystemConfigAndActivityLog1693414300000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create system_config table
    await queryRunner.createTable(
      new Table({
        name: 'system_config',
        columns: [
          {
            name: 'config_id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'smtp_host',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'smtp_port',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'smtp_user',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'smtp_password',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'smtp_secure',
            type: 'boolean',
            default: false,
          },
          {
            name: 'reminder_enabled',
            type: 'boolean',
            default: true,
          },
          {
            name: 'reminder_t30',
            type: 'int',
            default: 30,
          },
          {
            name: 'reminder_t7',
            type: 'int',
            default: 7,
          },
          {
            name: 'reminder_t1',
            type: 'int',
            default: 1,
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

    // Create activity_log table
    await queryRunner.createTable(
      new Table({
        name: 'activity_log',
        columns: [
          {
            name: 'log_id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'action',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'ip_address',
            type: 'varchar',
            length: '45',
            isNullable: true,
          },
          {
            name: 'user_agent',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'request_data',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['user_id'],
            referencedTableName: 'user',
            referencedColumnNames: ['user_id'],
            onDelete: 'SET NULL',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('activity_log', true);
    await queryRunner.dropTable('system_config', true);
  }
}
