import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function NotificationList({ userId }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    api.get(`/notifications/${userId}`)
      .then(res => setNotifications(res.data));
  }, [userId]);

  const markAsRead = id => {
    api.patch(`/notifications/${id}/read`).then(() =>
      setNotifications(n => n.map(notif =>
        notif.id === id ? { ...notif, readStatus: true } : notif
      ))
    );
  };

  return (
    <div>
      <h3>Notifications</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {notifications.map(n => (
          <li key={n.id} style={{ background: n.readStatus ? "#f0f0f0" : "#d7ffd7", margin: 5, borderRadius: 8, padding: 10 }}>
            {n.message} <a href={n.link}>View</a>
            {!n.readStatus && <button onClick={() => markAsRead(n.id)} style={{ marginLeft: 10 }}>Mark as Read</button>}
            <span style={{ color: "#888", marginLeft: 20, fontSize: 11 }}>{new Date(n.createdAt).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
