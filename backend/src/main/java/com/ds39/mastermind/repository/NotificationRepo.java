package com.ds39.mastermind.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import com.ds39.mastermind.entity.Notification;
import java.util.List;

@Repository
public interface NotificationRepo extends CrudRepository<Notification, Integer> {
    List<Notification> findByRecipientUserIdOrderByTimestampDesc(String recipientUserId);
}