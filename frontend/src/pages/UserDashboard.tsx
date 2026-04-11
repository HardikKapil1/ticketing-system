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

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  }

  return (
    <main className="app-shell">
      <div className="dashboard-container space-y-6">
        <header className="glass-panel flex flex-col justify-between gap-4 p-6 md:flex-row md:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-blue-300">
              User Workspace
            </p>
            <h1 className="page-title">Ticket Dashboard</h1>
            <p className="page-subtitle">
              Browse active events and manage all your bookings.
            </p>
          </div>
          <button type="button" onClick={logout} className="btn-muted">
            Logout
          </button>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article className="stat-card">
            <p className="stat-label">Available Events</p>
            <p className="stat-value">{events.length}</p>
          </article>
          <article className="stat-card">
            <p className="stat-label">Booked Tickets</p>
            <p className="stat-value">{tickets.length}</p>
          </article>
          <article className="stat-card">
            <p className="stat-label">Account Type</p>
            <p className="stat-value text-lg">Standard User</p>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <section className="surface p-5">
            <h2 className="section-heading">Available Events</h2>
            <p className="page-subtitle mt-1">
              Choose an event and enter your seat number to book instantly.
            </p>

            <div className="mt-4 space-y-4">
              {events.length === 0 && (
                <p className="rounded-lg border border-dashed border-slate-500/40 bg-slate-900/40 px-4 py-5 text-sm text-[var(--text-secondary)]">
                  No events are currently available.
                </p>
              )}

              {events.map((event) => (
                <article
                  key={event.id}
                  className="rounded-lg border border-slate-600/40 bg-slate-900/45 p-4"
                >
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    {event.location}
                  </p>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    {new Date(event.date).toLocaleDateString()}
                  </p>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <input
                      type="text"
                      value={seatNumber[event.id] || ""}
                      onChange={(e) =>
                        setSeatNumber({ ...seatNumber, [event.id]: e.target.value })
                      }
                      placeholder="Seat Number"
                      className="input-dark sm:max-w-[180px]"
                    />
                    <button
                      onClick={() => postTicket(event.id, seatNumber[event.id])}
                      className="btn-primary"
                    >
                      Book Ticket
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="surface p-5">
            <h2 className="section-heading">My Tickets</h2>
            <p className="page-subtitle mt-1">
              Your latest bookings with event and seat details.
            </p>

            <div className="mt-4 space-y-3">
              {tickets.length === 0 && (
                <p className="rounded-lg border border-dashed border-slate-500/40 bg-slate-900/40 px-4 py-5 text-sm text-[var(--text-secondary)]">
                  You do not have any bookings yet.
                </p>
              )}

              {tickets.map((ticket) => (
                <article
                  key={ticket.id}
                  className="rounded-lg border border-slate-600/40 bg-slate-900/45 p-4"
                >
                  <p className="text-sm text-[var(--text-secondary)]">
                    Event ID:{" "}
                    <span className="font-semibold text-[var(--text-primary)]">
                      {ticket.eventId}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    Seat:{" "}
                    <span className="font-semibold text-[var(--text-primary)]">
                      {ticket.seatNumber}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    Booked on:{" "}
                    <span className="font-semibold text-[var(--text-primary)]">
                      {new Date(ticket.bookingDate).toLocaleDateString()}
                    </span>
                  </p>
                </article>
              ))}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
};

export default UserDashboard;
