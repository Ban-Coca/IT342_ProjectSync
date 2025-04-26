package edu.cit.projectsync.Repository;

import java.util.List;
import java.util.UUID;

import org.apache.catalina.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import edu.cit.projectsync.Entity.UserEntity;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, UUID> {
    List<UserEntity> findByEmail(String email);
    List<UserEntity> findByUserIdIn(List<UUID> userIds);
    UserEntity findByDeviceToken(String deviceToken);
    @Query("SELECT u FROM UserEntity u WHERE " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<UserEntity> searchUsers(@Param("keyword") String keyword);
}
