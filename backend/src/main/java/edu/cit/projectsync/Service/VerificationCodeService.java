package edu.cit.projectsync.Service;

import edu.cit.projectsync.Entity.UserEntity;
import edu.cit.projectsync.Entity.VerificationCodeEntity;
import edu.cit.projectsync.Repository.UserVerificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class VerificationCodeService {

    @Autowired
    private UserVerificationRepository verificationRepo;

    private static final int EXPIRATION_MINUTES = 30;

    public VerificationCodeEntity createVerificationCode(UserEntity user, String code) {
        // Delete any existing codes for this user first
        deleteByUser(user);

        // Create new verification code
        VerificationCodeEntity verificationCode = new VerificationCodeEntity();
        verificationCode.setUser(user);
        verificationCode.setCode(code);
        verificationCode.setCreatedAt(LocalDateTime.now());
        return verificationRepo.save(verificationCode);
    }

    public Optional<VerificationCodeEntity> findByUser(UserEntity user) {
        return Optional.ofNullable(verificationRepo.findByUser(user));
    }

    public boolean isCodeValid(VerificationCodeEntity verificationCode) {
        LocalDateTime expirationTime = verificationCode.getCreatedAt().plusMinutes(EXPIRATION_MINUTES);
        return LocalDateTime.now().isBefore(expirationTime);
    }

    public void deleteByUser(UserEntity user) {
        VerificationCodeEntity existingCode = verificationRepo.findByUser(user);
        if (existingCode != null) {
            verificationRepo.delete(existingCode);
        }
    }

    public VerificationCodeEntity save(VerificationCodeEntity verificationCode) {
        return verificationRepo.save(verificationCode);
    }
}
