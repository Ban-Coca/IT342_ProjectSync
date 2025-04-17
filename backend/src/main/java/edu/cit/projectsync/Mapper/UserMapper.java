package edu.cit.projectsync.Mapper;

import java.util.List;
import java.util.stream.Collectors;


import edu.cit.projectsync.DTO.UserDTO;
import edu.cit.projectsync.Entity.UserEntity;
import edu.cit.projectsync.Entity.DocumentEntity;
import edu.cit.projectsync.Entity.ProjectEntity;
import edu.cit.projectsync.Entity.TaskEntity;

public class UserMapper {

    public static UserDTO toDTO(UserEntity userEntity) {
        UserDTO dto = new UserDTO();
        dto.setUserId(userEntity.getUserId());
        dto.setEmail(userEntity.getEmail());
        dto.setFirstName(userEntity.getFirstName());
        dto.setLastName(userEntity.getLastName());
        dto.setActive(userEntity.IsActive());
        dto.setCreatedAt(userEntity.getCreatedAt());
        dto.setLastLogin(userEntity.getLastLogin());

        // Map projects (List<ProjectEntity> to List<Integer>)
        dto.setProjects(
            userEntity.getProjects() != null
                ? userEntity.getProjects().stream()
                    .map(ProjectEntity::getProjectId) // Extract project IDs
                    .collect(Collectors.toList())
                : List.of() // Return an empty list if projects are null
        );

        // Map team projects (List<ProjectEntity> to List<Integer>)
        dto.setTeamProjectIds(
            userEntity.getTeamProjects() != null
                ? userEntity.getTeamProjects().stream()
                    .map(ProjectEntity::getProjectId) // Extract project IDs
                    .collect(Collectors.toList())
                : List.of() // Return an empty list if team projects are null
        );

        // Map tasks (List<TaskEntity> to List<Integer>)
        dto.setTasks(
            userEntity.getTasks() != null
                ? userEntity.getTasks().stream()
                    .map(TaskEntity::getTaskId) // Extract task IDs
                    .collect(Collectors.toList())
                : List.of() // Return an empty list if tasks are null
        );

        // Map documents (List<DocumentEntity> to List<Integer>)
        dto.setDocuments(
            userEntity.getDocuments() != null
                ? userEntity.getDocuments().stream()
                    .map(DocumentEntity::getDocumentId) // Extract document IDs
                    .collect(Collectors.toList())
                : List.of() // Return an empty list if documents are null
        );

        return dto;
    }
}