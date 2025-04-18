package edu.cit.projectsync.Repository;

import edu.cit.projectsync.Entity.UserEntity;
import edu.cit.projectsync.Entity.VerificationCodeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserVerificationRepository extends JpaRepository<VerificationCodeEntity, UUID> {
    VerificationCodeEntity findByUser(UserEntity user);
}
