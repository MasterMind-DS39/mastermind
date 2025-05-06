// src/components/Sidebar.js
import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  const sidebarStyle = {
    height: "100vh",
    width: "220px",
    backgroundColor: "#1877F2", // Facebook Blue
    paddingTop: "20px",
    color: "white",
    position: "fixed",
    top: 0,
    left: 0,
  };

  const linkStyle = {
    display: "block",
    padding: "12px 20px",
    textDecoration: "none",
    color: "white",
    fontWeight: "bold",
  };

  const linkHover = {
    backgroundColor: "#165ecc",
  };

  return (
    <div style={sidebarStyle}>
      <Link to="/all_learning_plans" style={linkStyle}>All Learning Plans</Link>
      <Link to="/user/:userId" style={linkStyle}>Your Plans</Link>
      <Link to="/completed_plans" style={linkStyle}>Completed Plans</Link>
      <Link to="/ongoing-plans" style={linkStyle}>Ongoing Plans</Link>
      <Link to="/create_learning_plan" style={linkStyle}>Create Plan</Link>
    </div>
  );
}

export default Sidebar;