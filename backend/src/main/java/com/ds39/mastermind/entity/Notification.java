// src/main/java/com/ds39/mastermind/entity/Notification.java
package com.ds39.mastermind.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

import java.sql.Timestamp;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue
    private int id;

    @Column(nullable = false)
    private String recipientUserId;

    @Column(nullable = false)
    private String senderUserId;

    @Column(nullable = false)
    private String postId;

    @Column(nullable = false)
    private String message;

    @Column(name = "is_read", nullable = false)
    private boolean read = false;

    @Column(nullable = false)
    private Timestamp timestamp;

    public Notification() {}

    public Notification(String recipientUserId, String senderUserId, String postId, String message, Timestamp timestamp) {
        this.recipientUserId = recipientUserId;
        this.senderUserId = senderUserId;
        this.postId = postId;
        this.message = message;
        this.timestamp = timestamp;
        this.read = false;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getRecipientUserId() { return recipientUserId; }
    public void setRecipientUserId(String recipientUserId) { this.recipientUserId = recipientUserId; }

    public String getSenderUserId() { return senderUserId; }
    public void setSenderUserId(String senderUserId) { this.senderUserId = senderUserId; }

    public String getPostId() { return postId; }
    public void setPostId(String postId) { this.postId = postId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public boolean isRead() {
        return read;
    }
    public void setRead(boolean read) {
        this.read = read;
    }

    public Timestamp getTimestamp() { return timestamp; }
    public void setTimestamp(Timestamp timestamp) { this.timestamp = timestamp; }
}
