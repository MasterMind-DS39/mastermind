import React from "react";
import { Link } from "react-router-dom";

function PlanSidebar() {
  const sidebarStyle = {
    height: "100vh",
    width: "240px", // Reduced width
    zIndex: 1,
    background: "linear-gradient(135deg, #4A90E2, #145DA0)",
    paddingTop: "30px",
    color: "white",
    position: "fixed",
    top: 0,
    left: 0,
    boxShadow: "4px 0 10px rgba(0, 0, 0, 0.3)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const logoStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#ffffff",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
  };

  const linkStyle = {
    display: "block",
    width: "90%",
    padding: "14px 20px",
    textDecoration: "none",
    color: "#ffffff",
    fontWeight: "600",
    fontSize: "16px",
    transition: "all 0.3s ease",
    borderRadius: "12px",
    margin: "8px 0",
    textAlign: "center",
    background: "rgba(255, 255, 255, 0.1)",
  };

  const linkHoverStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    transform: "scale(1.05)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
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

  const footerStyle = {
    marginTop: "auto",
    padding: "10px",
    fontSize: "14px",
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
  };

  return (
    <div style={sidebarStyle}>
      <div style={logoStyle}>PlanMaster</div>
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
      <div style={footerStyle}>© 2023 PlanMaster</div>
    </div>
  );
}

export default PlanSidebar;
