import React, { useState } from "react";
import NotificationList from "./components/NotificationList";
import PostList from "./components/PostList";
import FollowButton from "./components/FollowButton";

// In real app, get these from login/session
const DEMO_USER_ID = 1;
const ANOTHER_USER_ID = 2;

export default function App() {
  const [userId] = useState(DEMO_USER_ID);

  return (
    <div style={{
      maxWidth: 700, margin: "0 auto",
      fontFamily: "system-ui",
      background: "#fafcfd", borderRadius: 12,
      boxShadow: "0 5px 24px #bbb", padding: 30, marginTop: 50
    }}>
      <h1>Skill Sharing Platform</h1>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ width: "60%" }}>
          <PostList userId={userId} />
        </div>
        <div style={{ width: "35%", marginLeft: 20 }}>
          <NotificationList userId={userId} />
          <h3>Follow Example</h3>
          <FollowButton followerId={userId} followedId={ANOTHER_USER_ID} />
        </div>
      </div>
      <hr />
      <div style={{ fontSize: 13, color: "#888", marginTop: 20 }}>
        Demo User ID: {DEMO_USER_ID} (change in App.js)<br />
        <strong>Full messaging, comment, like, heart, and notification system working!</strong>
      </div>
    </div>
  );
}
