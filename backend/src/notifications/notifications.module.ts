import { NotificationsGateway } from '../notifications/notifications.gateway';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [NotificationsGateway, JwtService],
  exports: [NotificationsGateway, JwtService],
})
export class NotificationsModule {}