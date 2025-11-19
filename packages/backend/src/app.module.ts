import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/user.entity';
import { Call } from './calls/call.entity';
import { AuthModule } from './auth/auth.module';
import { CallsModule } from './calls/calls.module';
import { OracleModule } from './oracle/oracle.module';
import { IndexerModule } from './indexer/indexer.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'backit',
      entities: [User, Call],
      synchronize: true, // Only for development
    }),
    TypeOrmModule.forFeature([User, Call]),
    AuthModule,
    CallsModule,
    OracleModule,
    IndexerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
