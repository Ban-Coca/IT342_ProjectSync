package edu.cit.projectsync.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.cit.projectsync.Entity.TaskEntity;
import edu.cit.projectsync.Repository.TaskRepository;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

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

    public List<TaskEntity> getTasksByProjectId(UUID projectId) {
        return taskRepository.findByProject_ProjectId(projectId);
    }
    
    public List<TaskEntity> getAllTasks() {
        return taskRepository.findAll();
    }

    public void deleteTask(UUID taskId) {
        taskRepository.deleteById(taskId);
    }
}