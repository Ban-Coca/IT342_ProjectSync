package edu.cit.projectsync.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.cit.projectsync.Entity.TaskEntity;
import edu.cit.projectsync.Entity.UserEntity;
import edu.cit.projectsync.Repository.TaskRepository;
import edu.cit.projectsync.Repository.UserRepository;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    public TaskEntity createTask(TaskEntity task) {
        return taskRepository.save(task);
    }

    public TaskEntity updateTask(UUID taskId, TaskEntity updatedTask) {
        Optional<TaskEntity> taskOptional = taskRepository.findById(taskId);
        if (taskOptional.isPresent()) {
            TaskEntity task = taskOptional.get();
            task.setTitle(updatedTask.getTitle());
            task.setDescription(updatedTask.getDescription());
            task.setDueDate(updatedTask.getDueDate());
            task.setAssignedTo(updatedTask.getAssignedTo());
            task.setStatus(updatedTask.getStatus());
            return taskRepository.save(task);
        }
        return null;
    }

    public TaskEntity getTaskById(UUID taskId) {
        return taskRepository.findById(taskId).orElse(null);
    }

    public UserEntity getUserById(UUID userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
    }

    public List<TaskEntity> getTasksByProjectId(UUID projectId) {
        return taskRepository.findByProject_ProjectId(projectId);
    }
    
    public List<TaskEntity> getAllTasks() {
        return taskRepository.findAll();
    }

    public void deleteTask(UUID taskId) {
        taskRepository.deleteById(taskId);
    }

    public boolean taskExistsByTitle(String title) {
        return taskRepository.existsByTitle(title);
    }

    public List<UserEntity> getUsersByIds(List<UUID> userIds) {
        return userService.getUsersById(userIds);
    }

    public boolean taskExistsByTitleExcludingId(String title, UUID taskId) {
        return taskRepository.existsByTitleAndTaskIdNot(title, taskId);
    }
}