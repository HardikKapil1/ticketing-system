"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/app/lib/api";

interface Event {
  title: string;
  description: string;
  location: string;
  date: string;
  price: number;
  availableSeats: number;
  category: string;
}

export default function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [event, setEvent] = useState<Event | null>(null);
  const router = useRouter();
  const [seatNumber, setSeatNumber] = useState('')

  /**
   * 
   * Handles the ticket booking process:
   * 1. Creates a payment order for the selected event and seat number.
   * 2. Opens the Razorpay payment popup with the order details.
   * 3. On successful payment, verifies the payment and books the ticket.
   */

async function handleBooking() {
  const token = localStorage.getItem('token')
  
  // Step 1: Create order
  const { data } = await api.post('/payment/order',
    { eventId: Number(id), seatNumber },
    { headers: { Authorization: `Bearer ${token}` }}
  )

  // Step 2: Open Razorpay popup
  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: data.amount,
    currency: 'INR',
    order_id: data.orderId,
    name: 'TicketOps',
    description: `Booking for ${event?.title}`,
    handler: async function(response: any) {
      console.log('Payment successful:', response);
      // Step 3: Verify payment
      await api.post('/payment/verify',
        {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        },
        { headers: { Authorization: `Bearer ${token}` }}
      )
      alert('Ticket booked successfully!')
    }
  }

  const razorpay = new (window as any).Razorpay(options)
  razorpay.open()
}
  useEffect(() => {
    const token = localStorage.getItem("token");

    api.get(`/event/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setEvent(res.data))
      .catch((err) => {
        console.error(err);
        router.push("/user");
      });
  }, [id, router]);

  if (!event) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{event.title}</h1>
      <p>{event.description}</p>
      <p>📍 {event.location}</p>
      <p>📅 {new Date(event.date).toLocaleDateString()}</p>
      <p>💰 ₹{event.price}</p>
      <p>🪑 {event.availableSeats} seats left</p>
      <p>🏷️ {event.category}</p>
      <input 
        type="text"
        placeholder="Enter seat number"
        value={seatNumber}
        onChange={(e) => setSeatNumber(e.target.value)}
        className="input-dark"
      />
<button onClick={handleBooking} className="btn-primary mt-4">
  Book Ticket
</button>
    </div>
  );
}
