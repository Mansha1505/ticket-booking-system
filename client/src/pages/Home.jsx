import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
const fetchEvents = async () => {
  try {
    setLoading(true);

    let query = "/events";

    if (search || category) query += "?";
    if (search) query += `keyword=${search}&`;
    if (category) query += `category=${category}`;

    const res = await api.get(query);
    console.log("EVENTS API RESPONSE:", res.data);
    setEvents(res.data);
  } catch (err) {
    console.error("Error loading events:", err);
    setEvents([]);
  } finally {
    setLoading(false);
  }
};

    fetchEvents();
  }, [search, category]);

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Find Your Next Experience
      </h1>

      {/* SEARCH + CATEGORY */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          marginBottom: "30px",
        }}
      >
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px",
            width: "260px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        >
          <option value="">All Categories</option>
          <option value="Concert">Concert</option>
          <option value="Movie">Movie</option>
          <option value="Seminars">Seminars</option>
        </select>
      </div>

      {/* EVENTS */}
      {loading ? (
        <p style={{ textAlign: "center" }}>Loading events...</p>
      ) : events.length === 0 ? (
        <p style={{ textAlign: "center", color: "#6b7280" }}>
          No events found.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
          }}
        >
          {events.map((event) => (
            <div
              key={event._id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "16px",
                background: "#fff",
              }}
            >
              <img
                src={event.image}
                alt={event.title}
                style={{
                  width: "100%",
                  height: "160px",
                  objectFit: "cover",
                  borderRadius: "6px",
                }}
              />

              <h3 style={{ marginTop: "10px" }}>{event.title}</h3>

              <p style={{ color: "#6b7280", fontSize: "14px" }}>
                {new Date(event.date).toLocaleDateString()} • {event.location}
              </p>

              <p style={{ fontWeight: "bold", marginTop: "6px" }}>
                ₹{event.price}
              </p>

              <Link
                to={`/event/${event._id}`}
                style={{
                  display: "block",
                  marginTop: "12px",
                  padding: "10px",
                  background: "#2563eb",
                  color: "#fff",
                  textAlign: "center",
                  borderRadius: "6px",
                  textDecoration: "none",
                }}
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
