package com.school.transport.module.notifications.repository;

import com.school.transport.module.notifications.entity.NotificationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface NotificationLogRepository extends JpaRepository<NotificationLog, UUID> {
    
    List<NotificationLog> findByTripId(UUID tripId);
    
    List<NotificationLog> findByRecipientUserId(UUID recipientUserId);
    
    List<NotificationLog> findByStatus(NotificationLog.NotificationStatus status);
    
    @Query("SELECT n FROM NotificationLog n WHERE n.tripId = :tripId AND n.type = :type")
    Optional<NotificationLog> findByTripIdAndType(UUID tripId, NotificationLog.NotificationType type);
    
    @Query("SELECT n FROM NotificationLog n WHERE n.status = 'QUEUED' ORDER BY n.createdAt ASC")
    List<NotificationLog> findQueuedNotifications();
}
