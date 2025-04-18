package edu.cit.projectsync.Service;

import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import javax.naming.NameNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import edu.cit.projectsync.Entity.UserEntity;
import edu.cit.projectsync.Repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    //Create of CRUD
	public UserEntity postUserRecord(UserEntity user) {
		return userRepository.save(user);
	}

    //Read of CRUD
	public List<UserEntity> getAllUsers(){
		return userRepository.findAll();
	}

    //find by ID
	public UserEntity findById(UUID userId) {
		return userRepository.findById(userId).get();
	}

    //Update of CRUD
	@SuppressWarnings("finally")
	public UserEntity putUserDetails (UUID userId, UserEntity newUserDetails) throws NameNotFoundException {
		UserEntity user = new UserEntity();
		
		try {
			user = userRepository.findById(userId).get();
			
			user.setFirstName(newUserDetails.getFirstName());
			user.setLastName(newUserDetails.getLastName());
			user.setEmail(newUserDetails.getEmail());
			user.setPassword(newUserDetails.getPassword());
            user.setUpdatedAt(newUserDetails.getUpdatedAt());
		}catch(NoSuchElementException nex){
			throw new NameNotFoundException("User "+ userId +"not found");
		}

		return userRepository.save(user);

	}

    //Delete of CRUD
	public String deleteUser(UUID userId) {
		String msg = "";
		
		if(userRepository.findById(userId).isPresent()) {
			userRepository.deleteById(userId);
			msg = "User record successfully deleted!";
		}else {
			msg = "User ID "+ userId +" NOT FOUND!";
		}
		return msg;
	}

    @Scheduled(cron = "0 0 0 * * ?") // Runs daily at midnight
    public void deactivateInactiveUsers() {
        List<UserEntity> users = userRepository.findAll();
        Date now = new Date();

        for (UserEntity user : users) {
            if (user.getLastLogin() != null) {
                long diffInMillis = now.getTime() - user.getLastLogin().getTime();
                long diffInDays = TimeUnit.MILLISECONDS.toDays(diffInMillis);

                if (diffInDays > 30 && user.IsActive()) {
                    user.setIsActive(false);
                    userRepository.save(user);
                }
            }
        }
    }

	public UserEntity findByEmail(String email) {
        List<UserEntity> users = userRepository.findByEmail(email);
        if (users.size() > 1) {
            throw new IllegalStateException("Multiple users found with the same email: " + email);
        }
        return users.isEmpty() ? null : users.get(0);
    }

	public List<UserEntity> getUsersById(List<UUID> userIds) {
		return userRepository.findByUserIdIn(userIds);
	}

	public boolean userExistsById(UUID userId) {
		return userRepository.existsById(userId);
	}
}
