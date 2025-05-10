// src/main/java/com/ds39/mastermind/service/NotificationService.java
package com.ds39.mastermind.service;

import com.ds39.mastermind.entity.Notification;
import com.ds39.mastermind.repository.NotificationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Date;

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

    public void createCommentNotification(String recipientUserId, String commenterUserId, String postId, String commenterUserName, String commentText) {
        String message = commenterUserName + " commented: \"" + commentText + "\" on your post";
        Notification notification = new Notification();
        notification.setRecipientUserId(recipientUserId);
        notification.setSenderUserId(commenterUserId);
        notification.setPostId(postId);
        notification.setMessage(message);
        notification.setTimestamp(new Timestamp(new Date().getTime()));
        notification.setRead(false);
        notificationRepo.save(notification);
    }

    // ADD THIS METHOD
    public void deleteNotification(int notificationId, String userId) {
        notificationRepo.deleteByIdAndRecipientUserId(notificationId, userId);
    }
}
