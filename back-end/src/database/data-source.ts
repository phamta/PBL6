import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { User } from '../modules/user/entities/user.entity';
import { VisaApplication } from '../modules/visa/entities/visa-application.entity';
import { Mou } from '../modules/mou/entities/mou.entity';
import { Visitor } from '../modules/visitor/entities/visitor.entity';
import { Translation } from '../modules/translation/entities/translation.entity';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  entities: [
    User,
    VisaApplication,
    Mou,
    Visitor,
    Translation,
  ],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  logging: true,
});
