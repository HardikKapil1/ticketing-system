import { Controller, Post, Body, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
    constructor(private paymentService: PaymentService) { }

    @Post('order')
    createOrder(
        @Body() body: { eventId: number; seatNumber: string },
        @Req() req: { user: { userId: number } }
    ) {
        return this.paymentService.createOrder(
            body.eventId,
            body.seatNumber,
            req.user.userId
        );
    }

    @Post('verify')
    verifyPayment(@Body() body: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
    }) {
        return this.paymentService.verifyPayment(body);
    }
}