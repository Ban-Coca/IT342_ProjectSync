package edu.cit.projectsync.Service;

import java.util.List;
import java.util.Optional;

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

    public TaskEntity updateTask(Long taskId, TaskEntity updatedTask) {
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

    public TaskEntity getTaskById(Long taskId) {
        return taskRepository.findById(taskId).orElse(null);
    }

    public List<TaskEntity> getTasksByProjectId(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }
    
    public List<TaskEntity> getAllTasks() {
        return taskRepository.findAll();
    }

    public void deleteTask(Long taskId) {
        taskRepository.deleteById(taskId);
    }
}