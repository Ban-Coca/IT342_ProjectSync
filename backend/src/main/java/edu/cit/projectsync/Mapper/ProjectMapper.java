package edu.cit.projectsync.Mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.boot.autoconfigure.security.SecurityProperties;

import edu.cit.projectsync.DTO.ProjectDTO;
import edu.cit.projectsync.DTO.UserDTO;
import edu.cit.projectsync.Entity.DocumentEntity;
import edu.cit.projectsync.Entity.ProjectEntity;
import edu.cit.projectsync.Entity.TaskEntity;
import edu.cit.projectsync.Entity.UserEntity;
import edu.cit.projectsync.Service.UserService;

public class ProjectMapper {

    public static ProjectDTO toDTO(ProjectEntity project) {
        if (project == null) {
            return null; // Return null if the input ProjectEntity is null
        }

        ProjectDTO dto = new ProjectDTO();
        dto.setProjectId(project.getProjectId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        dto.setStartDate(project.getStartDate());
        dto.setEndDate(project.getEndDate());

        // Map owner (UserEntity to UserDTO)
        if (project.getOwner() != null) {
            UserDTO ownerDTO = new UserDTO();
            ownerDTO.setUserId(project.getOwner().getUserId());
            ownerDTO.setFirstName(project.getOwner().getFirstName());
            ownerDTO.setLastName(project.getOwner().getLastName());
            ownerDTO.setEmail(project.getOwner().getEmail());
            dto.setOwnerId(ownerDTO);
        }

        // Map goals
        dto.setGoals(project.getGoals() != null ? project.getGoals() : List.of()); // Handle null goals

        // Map team members (List<UserEntity> to List<UserDTO>)
        dto.setTeamMemberIds(
            project.getTeamMembers() != null
                ? project.getTeamMembers().stream()
                    .map(member -> {
                        UserDTO userDTO = new UserDTO();
                        userDTO.setUserId(member.getUserId());
                        userDTO.setFirstName(member.getFirstName());
                        userDTO.setLastName(member.getLastName());
                        userDTO.setEmail(member.getEmail());
                        return userDTO;
                    })
                    .collect(Collectors.toList())
                : List.of() // Return an empty list if teamMembers is null
        );

        // Map tasks (List<TaskEntity> to List<Integer>)
        dto.setTasks(
            project.getTasks() != null
                ? project.getTasks().stream()
                    .map(TaskEntity::getTaskId) // Extract task IDs
                    .collect(Collectors.toList())
                : List.of() // Return an empty list if tasks are null
        );

        // Map documents (List<DocumentEntity> to List<Integer>)
        dto.setDocuments(
            project.getDocuments() != null
                ? project.getDocuments().stream()
                    .map(DocumentEntity::getDocumentId) // Extract document IDs
                    .collect(Collectors.toList())
                : List.of() // Return an empty list if documents are null
        );

        return dto;
    }

    public static ProjectEntity toEntity(ProjectDTO dto, UserService userService) {
        if (dto == null) {
            return null; // Return null if the input ProjectDTO is null
        }
    
        ProjectEntity project = new ProjectEntity();
        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
        project.setStartDate(dto.getStartDate());
        project.setEndDate(dto.getEndDate());
    
        if (dto.getOwnerId() != null) {
            // Fetch the UserEntity from the database using the userId
            UserEntity owner = userService.findById(dto.getOwnerId().getUserId());
            if (owner == null) {
                throw new IllegalArgumentException("Owner with ID " + dto.getOwnerId().getUserId() + " does not exist.");
            }
            project.setOwner(owner);
        } else {
            project.setOwner(null); // Set owner to null if ownerId is null
        }
    
        // Set goals
        project.setGoals(dto.getGoals() != null ? dto.getGoals() : List.of()); // Handle null goals
    
        // Set team members
        if (dto.getTeamMemberIds() != null) {
            List<UserEntity> teamMembers = dto.getTeamMemberIds().stream()
                .map(userDTO -> {
                    UserEntity user = new UserEntity();
                    user.setUserId(userDTO.getUserId());
                    return user;
                })
                .collect(Collectors.toList());
            project.setTeamMembers(teamMembers);
        } else {
            project.setTeamMembers(null); // Set teamMembers to null if dto.getTeamMemberIds() is null
        }
    
        // Set tasks
        if (dto.getTasks() != null) {
            List<TaskEntity> tasks = dto.getTasks().stream()
                .map(taskId -> {
                    TaskEntity task = new TaskEntity();
                    task.setTaskId(taskId);
                    return task;
                })
                .collect(Collectors.toList());
            project.setTasks(tasks);
        } else {
            project.setTasks(null); // Set tasks to null if dto.getTasks() is null
        }
    
        // Set documents
        if (dto.getDocuments() != null) {
            List<DocumentEntity> documents = dto.getDocuments().stream()
                .map(documentId -> {
                    DocumentEntity document = new DocumentEntity();
                    document.setDocumentId(documentId);
                    return document;
                })
                .collect(Collectors.toList());
            project.setDocuments(documents);
        } else {
            project.setDocuments(null); // Set documents to null if dto.getDocuments() is null
        }
    
        return project;
    }
}