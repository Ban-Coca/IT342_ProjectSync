package edu.cit.projectsync.Controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.cit.projectsync.DTO.TaskDTO;
import edu.cit.projectsync.Entity.TaskEntity;
import edu.cit.projectsync.Mapper.TaskMapper;
import edu.cit.projectsync.Service.ProjectService;
import edu.cit.projectsync.Service.TaskService;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private ProjectService projectService;

    @PostMapping("/createtask")
    public ResponseEntity<Object> createTask(@RequestBody TaskDTO taskDTO) {
        try {
            // Validate required fields
            if (taskDTO.getTitle() == null || taskDTO.getTitle().isEmpty()) {
                return ResponseEntity.badRequest().body("Task title is required."); // Return 400 if title is missing
            }
            if (taskDTO.getProject() == null) {
                return ResponseEntity.badRequest().body("Project ID is required."); // Return 400 if project ID is missing
            }

             // Check if a task with the same name already exists
            boolean taskExists = taskService.taskExistsByTitle(taskDTO.getTitle());
            if (taskExists) {
                return ResponseEntity.status(409).body("A task with the title '" + taskDTO.getTitle() + "' already exists."); // Return 409 Conflict
            }

            // Map TaskDTO to TaskEntity using TaskMapper
            TaskEntity task = TaskMapper.toEntity(taskDTO, projectService, taskService);

            // Save the task
            TaskEntity createdTask = taskService.createTask(task);

            // Map TaskEntity back to TaskDTO
            TaskDTO createdTaskDTO = TaskMapper.toDTO(createdTask);

            return ResponseEntity.status(201).body(createdTaskDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("An error occurred while creating the task: " + e.getMessage()); // Return 400 with a detailed error message
        }
    }

    @PutMapping("/updatetask/{taskId}")
    public ResponseEntity<Object> updateTask(@PathVariable UUID taskId, @RequestBody TaskDTO taskDTO) {
        try {
            // Check if the task exists
            TaskEntity existingTask = taskService.getTaskById(taskId);
            if (existingTask == null) {
                return ResponseEntity.status(404).body("Task with ID " + taskId + " does not exist."); // Return 404 if task doesn't exist
            }

            // Check if a task with the same title already exists (excluding the current task)
            boolean taskExists = taskService.taskExistsByTitleExcludingId(taskDTO.getTitle(), taskId);
            if (taskExists) {
                return ResponseEntity.status(409).body("A task with the title '" + taskDTO.getTitle() + "' already exists."); // Return 409 Conflict
            }

            // Map TaskDTO to TaskEntity
            TaskEntity task = TaskMapper.toEntity(taskDTO, projectService, taskService);

            // Update the task
            TaskEntity updatedTask = taskService.updateTask(taskId, task);

            // Map updated TaskEntity back to TaskDTO
            TaskDTO updatedTaskDTO = TaskMapper.toDTO(updatedTask);

            return ResponseEntity.ok(updatedTaskDTO);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An error occurred while updating the task: " + e.getMessage()); // Return 500 for unexpected errors
        }
    }

    @GetMapping("/gettaskid/{taskId}")
    public ResponseEntity<TaskDTO> getTaskById(@PathVariable UUID taskId) {
        TaskEntity task = taskService.getTaskById(taskId);
        if (task != null) {
            TaskDTO taskDTO = TaskMapper.toDTO(task);
            return ResponseEntity.ok(taskDTO);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<Object> getTasksByProjectId(@PathVariable UUID projectId) {
        // Check if the project exists
        boolean projectExists = projectService.projectExistsById(projectId);
        if (!projectExists) {
            return ResponseEntity.status(404).body("Project with ID " + projectId + " does not exist."); // Return 404 if project doesn't exist
        }

        // Retrieve tasks for the project
        List<TaskEntity> tasks = taskService.getTasksByProjectId(projectId);
        if (tasks != null && !tasks.isEmpty()) {
            List<TaskDTO> taskDTOs = tasks.stream()
                .map(TaskMapper::toDTO)
                .toList();
            return ResponseEntity.ok(taskDTOs);
        }
        return ResponseEntity.noContent().build(); // Return 204 if no tasks are found
    }

    @GetMapping("/getalltask")
    public ResponseEntity<List<TaskDTO>> getAllTasks() {
        List<TaskEntity> tasks = taskService.getAllTasks();
        List<TaskDTO> taskDTOs = tasks.stream()
            .map(TaskMapper::toDTO)
            .toList();
        return ResponseEntity.ok(taskDTOs);
    }

    @DeleteMapping("/deletetask/{taskId}")
    public ResponseEntity<String> deleteTask(@PathVariable UUID taskId) {
        try {
            TaskEntity task = taskService.getTaskById(taskId);
            if (task == null) {
                return ResponseEntity.status(404).body("Task with ID " + taskId + " not found.");
            }

            taskService.deleteTask(taskId);
            return ResponseEntity.ok("Task with ID " + taskId + " has been successfully deleted.");
        } catch (Exception e) {
            System.err.println("Error deleting task with ID " + taskId + ": " + e.getMessage());
            return ResponseEntity.status(500).body("An error occurred while deleting the task.");
        }
    }
}