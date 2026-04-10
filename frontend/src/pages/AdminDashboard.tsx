import axios from "../utils/axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode<JwtPayload>(token) : null;
  console.log(decoded);
  const [event, setEvent] = useState<Event[]>([]);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  async function handleCreate() {
    // Implement event creation logic here
    try {
      await axios.post(
        "/event",
        {
          title: title,
          location: location,
          date: date,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      fetchData(); // Refresh the event list after creation
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  }
  async function handleDelete(id: number) {
    try {
      await axios.delete(`/event/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchData(); // Refresh the event list after deletion
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  }
  /**
   * Fetch all events for admin dashboard
   * This function is called on component mount and after creating/deleting an event
   * It sends a GET request to the backend to retrieve all events and updates the state
   * @param none
   * @returns void
   */
  async function fetchData() {
    try {
      const response = await axios.get("/event", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEvent(response.data.data);
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    }
  }
  useEffect(() => {
    if (decoded?.role === "ADMIN") {
      fetchData();
    }
    if (decoded?.role !== "ADMIN") {
      navigate("/user");
    } else {
      console.warn("User is not an admin");
    }
  }, []);
  /**
   * Logout function to clear token and redirect to login page
   * This function removes the token from localStorage and redirects the user to the login page
   * @param none
   * @returns void
   */
  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }
  return (
    <div className="flex flex-col gap-6 p-8 max-w-4xl mx-auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreate();
        }}
        className="flex flex-col gap-4"
      >
        <input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="text"
          placeholder="Event Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Add Event
        </button>
        <button
          type="button"
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Logout
        </button>
      </form>
      {event.map((e: Event) => (
        <div key={e.id} className="flex flex-col gap-2">
          <h3>{e.title}</h3>
          <p>{e.location}</p>
          <p>{new Date(e.date).toLocaleDateString()}</p>
          <button
            onClick={() => handleDelete(e.id)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
