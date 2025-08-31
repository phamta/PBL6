import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseConfig } from '../config/app.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get<DatabaseConfig>('database');
        return {
          type: 'postgres',
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.database,
          entities: [
            __dirname + '/../modules/user/entities/*.entity{.ts,.js}',
            __dirname + '/../modules/visa/entities/*.entity{.ts,.js}',
            __dirname + '/../modules/mou/entities/*.entity{.ts,.js}',
            __dirname + '/../modules/visitor/entities/*.entity{.ts,.js}',
            __dirname + '/../modules/translation/entities/*.entity{.ts,.js}',
            __dirname + '/../modules/visa-extension/entities/*.entity{.ts,.js}',
            __dirname + '/../entities/*.entity{.ts,.js}',
          ],
          migrations: [__dirname + '/migrations/*{.ts,.js}'],
          synchronize: dbConfig.synchronize,
          logging: dbConfig.logging,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
