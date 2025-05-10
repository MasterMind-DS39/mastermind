// components/PlanList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function PlanList({ title, endpoint }) {
  const [plans, setPlans] = useState([]);
  const [userUpvotedPlans, setUserUpvotedPlans] = useState([]);
  const userId = 1; // Replace with actual logged-in user ID if available

  useEffect(() => {
    axios
      .get(endpoint)
      .then((response) => {
        console.log("Fetched plans:", response.data);
        setPlans(response.data);
      })
      .catch((error) => console.error("Error fetching plans:", error));

    axios
      .get(`http://localhost:8080/api/plans/user/${userId}/upvoted-plans`)
      .then((response) => {
        console.log("Fetched upvoted plans:", response.data);
        setUserUpvotedPlans(response.data.map((plan) => plan.id));
      }) // <- extract just IDs})
      .catch((error) => console.error("Error fetching upvoted plans:", error));
  }, [endpoint]);

  const handleUpvote = async (planId) => {
    try {
      const hasUpvoted = userUpvotedPlans.includes(planId);
      if (hasUpvoted) {
        await handleDownvote(planId);
        return;
      }

      const url = `http://localhost:8080/api/plans/upvote/${planId}?userID=${userId}`;
      await axios.put(url);

      // Update UI: increment count and mark as upvoted
      setPlans((prevPlans) =>
        prevPlans.map((p) =>
          p.id === planId ? { ...p, upvotes: p.upvotes + 1 } : p
        )
      );
      setUserUpvotedPlans((prev) => [...prev, planId]);
    } catch (error) {
      console.error("Upvote failed:", error);
    }
  };

  const handleDownvote = async (planId) => {
    try {
      const hasUpvoted = userUpvotedPlans.includes(planId);
      if (!hasUpvoted) return; // prevent duplicate downvote

      const url = `http://localhost:8080/api/plans/downvote/${planId}?userID=${userId}`;
      await axios.put(url);

      // Update UI: decrement count and mark as not upvoted
      setPlans((prevPlans) =>
        prevPlans.map((p) =>
          p.id === planId ? { ...p, upvotes: p.upvotes - 1 } : p
        )
      );
      setUserUpvotedPlans((prev) => prev.filter((id) => id !== planId));
    } catch (error) {
      console.error("Downvote failed:", error);
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: "#f9fafc",
        minHeight: "100vh",
      }}
    >
      <h2
        style={{
          color: "#4a90e2",
          borderBottom: "4px solid #4a90e2",
          paddingBottom: "10px",
          marginBottom: "30px",
          textAlign: "center",
          fontSize: "32px",
          fontWeight: "600",
        }}
      >
        {title}
      </h2>
      {Array.isArray(plans) && plans.length > 0 ? (
        <ul
          style={{
            listStyleType: "none",
            padding: 0,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "25px",
          }}
        >
          {plans.map((plan) => (
            <li
              key={plan.id}
              style={{
                backgroundColor: "#ffffff",
                padding: "20px",
                borderRadius: "16px",
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s, box-shadow 0.3s",
                cursor: "pointer",
                overflow: "hidden",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow =
                  "0 12px 24px rgba(0, 0, 0, 0.2)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 8px 20px rgba(0, 0, 0, 0.1)";
              }}
            >
              <Link
                to={`/plans/${plan.id}`}
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  textDecoration: "none",
                  color: "#4a90e2",
                  display: "block",
                  marginBottom: "12px",
                  transition: "color 0.3s",
                }}
                onMouseOver={(e) => (e.target.style.color = "#357ab8")}
                onMouseOut={(e) => (e.target.style.color = "#4a90e2")}
              >
                {plan.title}
              </Link>
              <p
                style={{
                  margin: "10px 0",
                  color: "#6b7280",
                  fontSize: "16px",
                  lineHeight: "1.6",
                }}
              >
                {plan.description}
              </p>
              <p
                style={{
                  margin: "6px 0",
                  fontSize: "14px",
                  color: "#9ca3af",
                  fontStyle: "italic",
                }}
              >
                Created by: {plan.createdBy}
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: "15px",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    color: "#6b7280",
                  }}
                >
                  Upvotes: {plan.upvotes}
                </p>
                <button
                  onClick={() => handleUpvote(plan.id)}
                  style={{
                    backgroundColor: userUpvotedPlans.includes(plan.id)
                      ? "#4a90e2"
                      : "#e5e7eb",
                    border: "none",
                    borderRadius: "50%",
                    cursor: "pointer",
                    fontSize: "18px",
                    color: userUpvotedPlans.includes(plan.id)
                      ? "#ffffff"
                      : "#6b7280",
                    width: "45px",
                    height: "45px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background-color 0.3s, color 0.3s",
                  }}
                  title={
                    userUpvotedPlans.includes(plan.id)
                      ? "Remove upvote"
                      : "Upvote"
                  }
                  onMouseOver={(e) => {
                    if (!userUpvotedPlans.includes(plan.id)) {
                      e.currentTarget.style.backgroundColor = "#d1d5db";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!userUpvotedPlans.includes(plan.id)) {
                      e.currentTarget.style.backgroundColor = "#e5e7eb";
                    }
                  }}
                >
                  ⬆
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p
          style={{
            fontSize: "20px",
            color: "#9ca3af",
            textAlign: "center",
            marginTop: "50px",
          }}
        >
          No learning plans available.
        </p>
      )}
    </div>
  );
}

export default PlanList;
