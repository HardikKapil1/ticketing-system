// src/app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventModule } from './event/event.module';

@Module({
  imports: [
    EventModule, // ✅ only this needed now
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
