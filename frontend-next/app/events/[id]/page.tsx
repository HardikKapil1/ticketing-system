'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

interface Event {
  title: string
  description: string
  location: string
  date: string
  price: number
  availableSeats: number
  category: string
}

export default function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [event, setEvent] = useState<Event | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')

    axios.get(`http://localhost:3000/event/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setEvent(res.data))
    .catch((err) => {
      console.error(err)
      router.push('/user')
    })
  }, [id, router])

  if (!event) return <div>Loading...</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{event.title}</h1>
      <p>{event.description}</p>
      <p>📍 {event.location}</p>
      <p>📅 {new Date(event.date).toLocaleDateString()}</p>
      <p>💰 ₹{event.price}</p>
      <p>🪑 {event.availableSeats} seats left</p>
      <p>🏷️ {event.category}</p>

      <button className="bg-blue-500 text-white px-4 py-2 mt-4 rounded" onClick={() => router.push(`/events/${id}/book`)}>
        Book Ticket
      </button>
    </div>
  )
}