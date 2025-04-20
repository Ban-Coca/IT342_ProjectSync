package edu.cit.projectsync.Mapper;

import java.util.stream.Collectors;

import edu.cit.projectsync.DTO.ProjectDTO;
import edu.cit.projectsync.DTO.TaskDTO;
import edu.cit.projectsync.DTO.UserDTO;
import edu.cit.projectsync.Entity.ProjectEntity;
import edu.cit.projectsync.Entity.TaskEntity;
import edu.cit.projectsync.Entity.UserEntity;
import edu.cit.projectsync.Service.ProjectService;
import edu.cit.projectsync.Service.TaskService;

public class TaskMapper {
    public static TaskDTO toDTO(TaskEntity task) {
        TaskDTO dto = new TaskDTO();
        dto.setTaskId(task.getTaskId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setDueDate(task.getDueDate());
        dto.setStatus(task.getStatus());
        dto.setPriority(task.getPriority());

        // Map ProjectEntity to ProjectDTO
        ProjectDTO projectDTO = new ProjectDTO();
        projectDTO.setProjectId(task.getProject().getProjectId());
        projectDTO.setName(task.getProject().getName()); // Example field
        dto.setProject(projectDTO);

        // Map assigned users (List<UserEntity> to List<UserDTO>)
        dto.setAssignedTo(
            task.getAssignedTo().stream()
                .map(user -> {
                    UserDTO userDTO = new UserDTO();
                    userDTO.setUserId(user.getUserId());
                    userDTO.setFirstName(user.getFirstName());
                    userDTO.setLastName(user.getLastName());
                    userDTO.setEmail(user.getEmail());
                    return userDTO;
                })
                .collect(Collectors.toList())
        );

        return dto;
    }

    public static TaskEntity toEntity(TaskDTO dto, ProjectService projectService, TaskService taskService) {
        TaskEntity task = new TaskEntity();
        task.setTaskId(dto.getTaskId()); // Ensure the task ID is set for updates
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setDueDate(dto.getDueDate());
        task.setStatus(dto.getStatus());
        task.setPriority(dto.getPriority());

        // Fetch and set the project
        if (dto.getProject() != null) {
            ProjectEntity project = projectService.getProjectById(dto.getProject().getProjectId());
            task.setProject(project);
        }
    
        // Fetch and set assigned users
        if (dto.getAssignedTo() != null && !dto.getAssignedTo().isEmpty()) {
        task.setAssignedTo(
            dto.getAssignedTo().stream()
                .map(userDTO -> {
                    // Fetch UserEntity by ID and handle potential nulls
                    UserEntity user = taskService.getUserById(userDTO.getUserId());
                    if (user == null) {
                        throw new RuntimeException("User not found with ID: " + userDTO.getUserId());
                    }
                    return user;
                })
                .collect(Collectors.toList())
        );
    }
    
        return task;
    }
}
