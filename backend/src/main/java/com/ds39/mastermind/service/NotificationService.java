// src/main/java/com/ds39/mastermind/service/NotificationService.java
package com.ds39.mastermind.service;

import com.ds39.mastermind.entity.Notification;
import com.ds39.mastermind.repository.NotificationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    NotificationRepo notificationRepo;

    public void createLikeNotification(String recipientUserId, String senderUserId, String postId, String senderUserName) {
        if (recipientUserId.equals(senderUserId)) return; // Don't notify self-likes

        String message = senderUserName + " has liked one of your posts";
        Notification notification = new Notification(
            recipientUserId,
            senderUserId,
            postId,
            message,
            new Timestamp(System.currentTimeMillis())
        );
        notificationRepo.save(notification);
    }

    public List<Notification> getNotificationsForUser(String userId) {
        return notificationRepo.findByRecipientUserIdOrderByTimestampDesc(userId);
    }

    public void markAllAsRead(String userId) {
        List<Notification> notifications = notificationRepo.findByRecipientUserIdOrderByTimestampDesc(userId);
        for (Notification n : notifications) {
            n.setRead(true);
        }
        notificationRepo.saveAll(notifications);
    }
}


