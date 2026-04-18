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
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [price, setPrice] = useState(0)
/**
 * Handles the edit action for an event by populating the form fields with the selected event's details, allowing the admin to modify and update the event information. When the "Edit" button is clicked, it sets the editing state and pre-fills the form with the existing event data for easy editing.
 * @param e - The event object that is being edited, containing its current details such as title, location, and date.
 */

function handleEdit(e: Event) {
  setEditingEvent(e)
  setTitle(e.title)
  setLocation(e.location)
  setDate(new Date(e.date).toISOString().split('T')[0])
}

async function handleUpdate() {
  if (!editingEvent) return
  const token = localStorage.getItem("token")
  await axios.patch(
    `http://localhost:3000/event/${editingEvent.id}`,
    { title, location, date },
    { headers: { Authorization: `Bearer ${token}` }}
  )
  setEditingEvent(null)
  setTitle("")
  setLocation("")
  setDate("")
  fetchData(token || "")
}

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
          price: price,
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
      setPrice(0);
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

  /**
   * Fetches all events for admin view by sending a GET request to the backend API with the admin's JWT token for authentication. The retrieved events are stored in the component's state.
   * @param token - The JWT token used for authentication in the API request headers.
   */

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

  /**
   * Fetches all tickets for admin view 
   * @param token  
   */

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
            editingEvent ? handleUpdate() : handleCreate();
          }}
            className="surface p-5"
          >
           <h2 className="section-heading">
            {editingEvent ? "Edit Event" : "Create New Event"}
          </h2>
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
               <div>
                <label className="field-label">Price (₹)</label>
                <input
                  type="number"
                  placeholder="500"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="input-dark"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary mt-6 w-full">
                {editingEvent ? "Update Event" : "Add Event"}
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

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(e)}
                    className="btn-secondary text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(e.id)}
                    className="btn-danger text-sm"
                  >
                    Delete
                  </button>
                </div>
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
