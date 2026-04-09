// src/app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventModule } from './event/event.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event/event.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'ticketing',
      entities: [Event],
      synchronize: true,
}),
    EventModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
