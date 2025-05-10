import React, { useState } from "react";
import axios from "axios";

function SearchPlans({ onResults }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8080/api/plans/search?query=${encodeURIComponent(
          query
        )}`
      );
      const sortedPlans = res.data.sort((a, b) => b.upvotes - a.upvotes);
      onResults(sortedPlans);
    } catch (error) {
      console.error("Search failed:", error);
      onResults([]);
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "'Roboto', sans-serif",
        color: "#333",
      }}
    >
      <h2
        style={{ color: "#1877f2", textAlign: "center", marginBottom: "20px" }}
      >
        Search Learning Plans
      </h2>
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search plans by title or keyword"
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            fontSize: "16px",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "12px 20px",
            backgroundColor: "#1877f2",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#145dbf")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#1877f2")}
        >
          Search
        </button>
      </div>
      {loading && (
        <p style={{ textAlign: "center", fontSize: "18px", color: "#555" }}>
          Loading...
        </p>
      )}
    </div>
  );
}

export default SearchPlans;
