import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST') || 'localhost',
  port: parseInt(configService.get('DB_PORT')) || 5432,
  username: configService.get('DB_USERNAME') || 'postgres',
  password: configService.get('DB_PASSWORD') || 'postgres',
  database: configService.get('DB_DATABASE') || 'pbl6_htqt',
  entities: [
    __dirname + '/../modules/user/entities/*.entity{.ts,.js}',
    __dirname + '/../modules/visa/entities/*.entity{.ts,.js}',
    __dirname + '/../modules/mou/entities/*.entity{.ts,.js}',
    __dirname + '/../modules/visitor/entities/*.entity{.ts,.js}',
    __dirname + '/../modules/translation/entities/*.entity{.ts,.js}',
    __dirname + '/../modules/visa-extension/entities/*.entity{.ts,.js}',
    __dirname + '/../common/entities/*.entity{.ts,.js}',
  ],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false, // Use migrations instead
  logging: process.env.NODE_ENV === 'development',
});
