// src/components/NotificationPanel.js
import React, { Component } from 'react';
import './NotificationPanel.css';
import { Link } from 'react-router-dom';

class NotificationPanel extends Component {
    handleDelete = (id) => {
        const userId = JSON.parse(localStorage.getItem("users"))?.uid;
        if (!userId) return;
        fetch(`http://localhost:8080/notifications/${userId}/${id}`, {
            method: "DELETE"
        })
        .then(() => {
            if (typeof this.props.onDelete === "function") {
                this.props.onDelete(id);
            }
        })
        .catch(err => {
            console.error("Failed to delete notification", err);
        });
    }

    render() {
        const { notifications, onClose } = this.props;
        const notificationsArray = Array.isArray(notifications) ? notifications : [];
        return (
            <div className="notification-dropdown">
                <div className="notification-header">
                    <h3>Notifications</h3>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>
                
                <div className="notification-content">
                    {notificationsArray.length === 0 ? (
                        <div className="no-notifications">No notifications yet.</div>
                    ) : (
                        <ul className="notification-list">
                            {notificationsArray.map(n => (
                                <li key={n.id} className={n.read ? "read" : "unread"}>
                                    <div className="notification-item">
                                        <div className="notification-message">{n.message}</div>
                                        <div className="notification-time">
                                            {new Date(n.timestamp).toLocaleString()}
                                        </div>
                                        <button
                                            className="notification-delete-btn"
                                            onClick={() => this.handleDelete(n.id)}
                                            title="Delete notification"
                                        >🗑️</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                
                <div className="notification-footer">
                    <Link to="/all-notifications" onClick={onClose}>See all notifications</Link>
                </div>
            </div>
        );
    }
}

export default NotificationPanel;
