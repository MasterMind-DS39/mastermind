// src/components/Sidebar.js
import React from "react";
import { Link } from "react-router-dom";

function PlanSidebar() {
  const sidebarStyle = {
    height: "100vh",
    width: "250px",
    zIndex: 1,
    background: "linear-gradient(to bottom, #1877F2, #145DA0)",
    paddingTop: "30px",
    color: "white",
    position: "fixed",
    top: 0,
    left: 0,
    boxShadow: "2px 0 5px rgba(0, 0, 0, 0.2)",
    fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
  };

  const linkStyle = {
    display: "block",
    padding: "14px 24px",
    textDecoration: "none",
    color: "#ffffff",
    fontWeight: "600",
    fontSize: "16px",
    transition: "all 0.3s ease",
    borderRadius: "8px",
    margin: "8px 12px",
  };

  const linkHoverStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    cursor: "pointer",
  };

  const [hoveredLink, setHoveredLink] = React.useState(null);

  const links = [
    { to: "/all_learning_plans", label: "All Learning Plans" },
    { to: "/user/2", label: "Your Plans" },
    { to: "/completed_plans", label: "Completed Plans" },
    { to: "/ongoing-plans", label: "Ongoing Plans" },
    { to: "/create_learning_plan", label: "Create Plan" },
    { to: "/ai_plan", label: "Generate Plan" },
  ];

  return (
    <div style={sidebarStyle}>
      {links.map((link, index) => (
        <Link
          key={index}
          to={link.to}
          style={{
            ...linkStyle,
            ...(hoveredLink === index ? linkHoverStyle : {}),
          }}
          onMouseEnter={() => setHoveredLink(index)}
          onMouseLeave={() => setHoveredLink(null)}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}

export default PlanSidebar;
