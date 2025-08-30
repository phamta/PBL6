import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [
          __dirname + '/../modules/user/entities/*.entity{.ts,.js}',
          __dirname + '/../modules/visa/entities/*.entity{.ts,.js}',
          __dirname + '/../modules/mou/entities/*.entity{.ts,.js}',
          __dirname + '/../modules/visitor/entities/*.entity{.ts,.js}',
          __dirname + '/../modules/translation/entities/*.entity{.ts,.js}',
          __dirname + '/../modules/visa-extension/entities/*.entity{.ts,.js}',
        ],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        synchronize: false, // Disabled due to foreign key constraint conflicts
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
