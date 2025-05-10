// src/main/java/com/ds39/mastermind/repository/NotificationRepo.java
package com.ds39.mastermind.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import com.ds39.mastermind.entity.Notification;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface NotificationRepo extends CrudRepository<Notification, Integer> {
    List<Notification> findByRecipientUserIdOrderByTimestampDesc(String userId);
    int countByRecipientUserIdAndReadFalse(String userId);

    // Add this method for deletion by id and user
    @Transactional
    void deleteByIdAndRecipientUserId(int id, String recipientUserId);
}
