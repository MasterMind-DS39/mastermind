// src/main/java/com/ds39/mastermind/controller/NotificationController.java
package com.ds39.mastermind.controller;

import com.ds39.mastermind.entity.Notification;
import com.ds39.mastermind.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    NotificationService notificationService;

    @GetMapping("/{userId}")
    public List<Notification> getNotifications(@PathVariable String userId) {
        return notificationService.getNotificationsForUser(userId);
    }

    @PostMapping("/markAllRead/{userId}")
    public void markAllAsRead(@PathVariable String userId) {
        notificationService.markAllAsRead(userId);
    }
}
