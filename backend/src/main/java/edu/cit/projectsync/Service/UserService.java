package edu.cit.projectsync.Service;

import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

import javax.naming.NameNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import edu.cit.projectsync.Entity.UserEntity;
import edu.cit.projectsync.Repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    //Create of CRUD
	public UserEntity postUserRecord(UserEntity user) {
		return userRepository.save(user);
	}

    //Read of CRUD
	public List<UserEntity> getAllUsers(){
		return userRepository.findAll();
	}

    //find by ID
	public UserEntity findById(int userId) {
		return userRepository.findById(userId).get();
	}

    //Update of CRUD
	@SuppressWarnings("finally")
	public UserEntity putUserDetails (int userId, UserEntity newUserDetails) {
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
		}finally {
			return userRepository.save(user);
		}
	}

    //Delete of CRUD
	public String deleteUser(int userId) {
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

    public Optional<UserEntity> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

}
