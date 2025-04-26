package edu.cit.projectsync.Repository;

import edu.cit.projectsync.Entity.NotificationEntity;
import edu.cit.projectsync.Entity.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<NotificationEntity, UUID> {

    List<NotificationEntity> findByUserOrderByCreatedAtDesc(UserEntity user);

    Page<NotificationEntity> findByUserOrderByCreatedAtDesc(UserEntity user, Pageable pageable);

    List<NotificationEntity> findByUserAndReadFalseOrderByCreatedAtDesc(UserEntity user);

    long countByUserAndReadFalse(UserEntity user);

    @Modifying
    @Query("UPDATE NotificationEntity n SET n.read = true WHERE n.user = :user AND n.read = false")
    int markAllAsRead(UserEntity user);

    List<NotificationEntity> findByUserAndNotificationTypeOrderByCreatedAtDesc(UserEntity user, String notificationType);

}
