package edu.cit.projectsync.Mapper;

import java.util.List;
import java.util.stream.Collectors;

import edu.cit.projectsync.DTO.UserDTO;
import edu.cit.projectsync.Entity.UserEntity;

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

        // Map projects to ProjectDTO
        dto.setProjects(
            userEntity.getProjects() != null
                ? userEntity.getProjects().stream()
                    .map(ProjectMapper::toDTO) // Use ProjectMapper to map ProjectEntity to ProjectDTO
                    .collect(Collectors.toList())
                : List.of()
        );

        dto.setTeamProjectIds(
            userEntity.getTeamProjects() != null
                ? userEntity.getTeamProjects().stream()
                    .map(project -> project.getProjectId())
                    .collect(Collectors.toList())
                : List.of()
        );

        return dto;
    }
}