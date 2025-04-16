package edu.cit.projectsync.Controller;

import java.util.List;

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

import edu.cit.projectsync.Entity.ProjectEntity;
import edu.cit.projectsync.Entity.TaskEntity;
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
    public ResponseEntity<TaskEntity> createTask(@RequestBody TaskEntity task, @RequestParam int projectId) {
        ProjectEntity project = projectService.getProjectById(projectId);
        if (project == null) {
            return ResponseEntity.badRequest().build(); // Return 400 if the project doesn't exist
        }
        task.setProject(project);

        // Create the task
        TaskEntity createdTask = taskService.createTask(task);
        return ResponseEntity.status(201).body(createdTask);
    }

    @PutMapping("/updatetask/{taskId}/")
    public ResponseEntity<TaskEntity> updateTask(@PathVariable int taskId, @RequestBody TaskEntity updatedTask) {
        TaskEntity task = taskService.updateTask(taskId, updatedTask);
        if (task != null) {
            return ResponseEntity.ok(task);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/gettaskid/{taskId}/")
    public ResponseEntity<TaskEntity> getTaskById(@PathVariable int taskId) {
        TaskEntity task = taskService.getTaskById(taskId);
        if (task != null) {
            return ResponseEntity.ok(task);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/project/{projectId}/")
    public ResponseEntity<List<TaskEntity>> getTasksByProjectId(@PathVariable int projectId) {
        List<TaskEntity> tasks = taskService.getTasksByProjectId(projectId);
        if (tasks != null && !tasks.isEmpty()) {
            return ResponseEntity.ok(tasks);
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/getalltask")
    public ResponseEntity<List<TaskEntity>> getAllTasks() {
        List<TaskEntity> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(tasks);
    }

    @DeleteMapping("/deletetask/{taskId}/")
    public ResponseEntity<Void> deleteTask(@PathVariable int taskId) {
        taskService.deleteTask(taskId);
        return ResponseEntity.noContent().build();
    }
}