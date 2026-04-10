import axios from "../utils/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface Event {
  id: number;
  title: string;
  location: string;
  date: string;
}

interface Ticket {
  id: number;
  eventId: number;
  seatNumber: string;
  bookingDate: string;
}

const UserDashboard = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [seatNumber, setSeatNumber] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode<{ role: string }>(token);
      if (decoded?.role === "ADMIN") {
        navigate("/admin");
      }
    }
  }, [navigate, token]);
  /**
   * Fetches the events and updates the state with the retrieved events.
   * This function is called when the component mounts to ensure that the available events are displayed on the dashboard.
   * It sends a GET request to the backend API endpoint for fetching events, including the authorization token in the request headers.
   * If the request is successful, it updates the `events` state with the retrieved data. If there is an error, it logs the error to the console.
   * @param none
   * @returns void
   */
  useEffect(() => {
    async function fetchEvents() {
      const response = await axios.get("/event", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("response:", response.data);
      setEvents(response.data.data);
    }
    fetchEvents();
  }, []);

  /**
   * Fetches the tickets for the logged-in user and updates the state with the retrieved tickets.
   * This function is called when the component mounts to ensure that the user's tickets are displayed on the dashboard.
   * It sends a GET request to the backend API endpoint for fetching tickets, including the authorization token in the request headers.
   * If the request is successful, it updates the `tickets` state with the retrieved data. If there is an error, it logs the error to the console.
   * @param none
   * @returns void
   */
  useEffect(() => {
    async function fetchTickets() {
      const response = await axios.get("/ticket", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("response:", response.data);
      setTickets(response.data);
    }
    fetchTickets();
  }, []);

  /**
   * @param eventId
   * @param seatNumber
   */
  async function postTicket(eventId: number, seatNumber: string) {
    try {
      const response = await axios.post(
        `/ticket`,
        { eventId, seatNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("Ticket booked:", response.data);
    } catch (error) {
      console.error("Error booking ticket:", error);
    }
  }

  return (
    <div className="flex flex-col gap-6 p-8 max-w-4xl mx-auto">
      <h1>User Dashboard</h1>
      <h2>Available Events</h2>
      <ul>
        {events.map((event) => (
          <li key={event.id} className="flex flex-col gap-2">
            <h3>{event.title}</h3>
            <p>{event.location}</p>
            <p>{event.date}</p>
            <input
              type="text"
              value={seatNumber[event.id] || ""}
              onChange={(e) =>
                setSeatNumber({ ...seatNumber, [event.id]: e.target.value })
              }
              placeholder="Seat Number"
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => postTicket(event.id, seatNumber[event.id])}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Book Ticket
            </button>
          </li>
        ))}
      </ul>
        <h2>My Tickets</h2>
        <ul>
          {tickets.map((ticket) => (
            <li key={ticket.id}>
              <p>Event: {ticket.eventId}</p>
              <p>Seat: {ticket.seatNumber}</p>
              <p>Booked: {new Date(ticket.bookingDate).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
    </div>
  );
};

export default UserDashboard;
