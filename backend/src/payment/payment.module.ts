import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from 'src/event/event.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  providers: [PaymentService],
  controllers: [PaymentController]
})
export class PaymentModule { }
