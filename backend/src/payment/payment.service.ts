import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from 'src/event/event.entity';
import { Repository } from 'typeorm';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';
import { TicketService } from 'src/ticket/ticket.service';
import { Payment } from './payment.entity';

@Injectable()
export class PaymentService {
    private razorpay: Razorpay;

    constructor(
        @InjectRepository(Event)
        private eventRepository: Repository<Event>,
        @InjectRepository(Payment)
        private paymentRepository: Repository<Payment>,

        private ticketService: TicketService,
    ) {
        this.razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });
    }

    /**
     * Creates a payment order for the specified event.
     * @param eventId 
     * @returns 
     */

    async createOrder(eventId: number, seatNumber: string, userId: number) {
        const event = await this.eventRepository.findOne({
            where: { id: eventId },
        });

        if (!event) throw new NotFoundException('Event not found');

        const amount = Number(event.price) * 100;

        const order = await this.razorpay.orders.create({
            amount,
            currency: 'INR',
            receipt: `event_${eventId}_${Date.now()}`,
        });

        await this.paymentRepository.save({
            orderId: order.id,
            eventId,
            seatNumber,
            userId,
            status: 'CREATED',
        });

        return {
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.RAZORPAY_KEY_ID,
        };
    }

    /**
     * Verifies the payment and books a ticket if the payment is successful.
     * @param data 
     * @returns 
     */

    async verifyPayment(data: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
    }) {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = data;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(body)
            .digest('hex');

        const payment = await this.paymentRepository.findOne({
            where: { orderId: razorpay_order_id },
        });

        if (!payment) throw new NotFoundException('Order not found');

        if (payment.status === 'SUCCESS') {
            return { message: 'Already processed' };
        }

        console.log('Expected:', expectedSignature);
        console.log('Received:', razorpay_signature);
        console.log('Order ID:', razorpay_order_id);
        console.log('Payment ID:', razorpay_payment_id);
        if (expectedSignature !== razorpay_signature) {
            payment.status = 'FAILED';
            await this.paymentRepository.save(payment);

            throw new BadRequestException('Invalid payment signature');
        }

        payment.paymentId = razorpay_payment_id;
        payment.status = 'SUCCESS';
        await this.paymentRepository.save(payment);
        return this.ticketService.bookTicket(
            payment.userId,
            payment.eventId,
            payment.seatNumber,
        );
    }
}
