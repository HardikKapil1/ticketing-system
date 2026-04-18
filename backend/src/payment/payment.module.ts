import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from 'src/event/event.entity';
import { Payment } from './payment.entity';
import { TicketModule } from 'src/ticket/ticket.module';


@Module({
  imports: [TypeOrmModule.forFeature([Event, Payment]), TicketModule],
  providers: [PaymentService],
  controllers: [PaymentController]
})
export class PaymentModule { }
