package com.ds39.mastermind.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ds39.mastermind.model.Notification;
import com.ds39.mastermind.model.User;
import com.ds39.mastermind.repository.NotificationRepository;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public Notification createNotification(User recipient, String message, String link) {
        Notification notification = new Notification();
        notification.setUser(recipient);
        notification.setMessage(message);
        notification.setLink(link);
        notificationRepository.save(notification);
        return notification;
    }

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId).orElseThrow();
        notification.setReadStatus(true);
        notificationRepository.save(notification);
    }
}
