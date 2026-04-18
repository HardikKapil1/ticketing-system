import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './ticket.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { Event } from 'src/event/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, Event]), NotificationsModule],
  providers: [TicketService],
  controllers: [TicketController],
  exports: [TicketService],
})
export class TicketModule {}
