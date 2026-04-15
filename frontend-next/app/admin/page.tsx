"use client";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface JwtPayload {
  userId: number;
  role: string;
  iat: number;
  exp: number;
}

interface Event {
  id: number;
  title: string;
  location: string;
  date: Date;
}

interface Ticket {
  id: number;
  userId: number;
  eventId: number;
  seatNumber: string;
  bookingDate: Date;
}

const AdminDashboard = () => {
  const router = useRouter();
  const [event, setEvent] = useState<Event[]>([]);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  /**
   * Handles the creation of a new event by sending a POST request to the backend API with the event details. After successful creation, it clears the form fields and refreshes the event list.
   */
  async function handleCreate() {
    try {
      const storedToken = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/event",
        {
          title: title,
          location: location,
          date: date,
        },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        },
      );
      setTitle("");
      setLocation("");
      setDate("");
      fetchData(storedToken || "");
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  }

  async function handleDelete(id: number) {
    try {
      const storedToken = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/event/${id}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      if (storedToken) fetchData(storedToken);
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  }

  async function fetchData(token: string) {
    try {
      const response = await axios.get("http://localhost:3000/event", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEvent(response.data.data);
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    }
  }

  async function fetchTickets(token: string) {
    try {
      const response = await axios.get("http://localhost:3000/ticket/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTickets(response.data);
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    router.push("/login");
  }

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
      return;
    }

    const decoded = jwtDecode<JwtPayload>(storedToken);
    if (decoded.role !== "ADMIN") {
      router.push("/user");
      return;
    }

    console.log("token:", storedToken);

    const loadData = async () => {
      await Promise.all([fetchData(storedToken), fetchTickets(storedToken)]);
    };

    loadData();
  }, [router]);

  return (
    <main className="app-shell">
      <div className="dashboard-container space-y-6">
        <header className="glass-panel flex flex-col justify-between gap-4 p-6 md:flex-row md:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-sky-300">
              Admin Console
            </p>
            <h1 className="page-title mt-3">Events Dashboard</h1>
            <p className="page-subtitle mt-3 max-w-2xl">
              Create, review, and manage all published events.
            </p>
          </div>
          <button type="button" onClick={logout} className="btn-danger">
            Logout
          </button>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article className="stat-card">
            <p className="stat-label">Total Events</p>
            <p className="stat-value">{event.length}</p>
          </article>
          <article className="stat-card">
            <p className="stat-label">Role</p>
            <p className="stat-value text-lg">Administrator</p>
          </article>
          <article className="stat-card">
            <p className="stat-label">System Status</p>
            <p className="stat-value text-lg text-emerald-300">Operational</p>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreate();
            }}
            className="surface p-5"
          >
            <h2 className="section-heading">Create New Event</h2>
            <p className="page-subtitle mt-1">
              Add details for upcoming events.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="field-label">Event Title</label>
                <input
                  type="text"
                  placeholder="Product Launch Summit"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-dark"
                  required
                />
              </div>

              <div>
                <label className="field-label">Location</label>
                <input
                  type="text"
                  placeholder="Bengaluru Convention Center"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="input-dark"
                  required
                />
              </div>

              <div>
                <label className="field-label">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="input-dark"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary mt-6 w-full">
              Add Event
            </button>
          </form>

          <section className="surface p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="section-heading">Event List</h2>
              <span className="status-pill">{event.length} records</span>
            </div>

            <div className="space-y-3">
              {event.length === 0 && (
                <p className="empty-state">
                  No events available yet. Create your first event from the
                  form.
                </p>
              )}

              {event.map((e: Event) => (
                <article key={e.id} className="data-card">
                  <h3 className="text-lg font-semibold">{e.title}</h3>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    {e.location}
                  </p>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    {new Date(e.date).toLocaleDateString()}
                  </p>

                  <button
                    onClick={() => handleDelete(e.id)}
                    className="btn-danger mt-4 text-sm"
                  >
                    Delete
                  </button>
                </article>
              ))}
            </div>
          </section>
        </section>
        <section className="surface p-5">
          <h2 className="section-heading">All Booked Tickets</h2>
          <div className="mt-4 space-y-3">
            {tickets.length === 0 && (
              <p className="empty-state">No tickets booked yet.</p>
            )}

            {tickets.map((ticket: Ticket) => (
              <article key={ticket.id} className="data-card">
                <h3 className="text-lg font-semibold">
                  Ticket ID: {ticket.id} - Event ID: {ticket.eventId}
                </h3>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  User ID: {ticket.userId} | Seat: {ticket.seatNumber}
                </p>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  Booked on: {new Date(ticket.bookingDate).toLocaleString()}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default AdminDashboard;
