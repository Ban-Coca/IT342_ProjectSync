package edu.cit.projectsync.Mapper;

import java.util.stream.Collectors;

import edu.cit.projectsync.DTO.ProjectDTO;
import edu.cit.projectsync.Entity.ProjectEntity;
import edu.cit.projectsync.Entity.UserEntity;

public class ProjectMapper {

    public static ProjectDTO toDTO(ProjectEntity project) {
        ProjectDTO dto = new ProjectDTO();
        dto.setProjectId(project.getProjectId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        dto.setStartDate(project.getStartDate());
        dto.setEndDate(project.getEndDate());
        dto.setOwnerId(project.getOwner().getUserId()); // Map the owner's ID
        dto.setGoals(project.getGoals()); // Map project goals
        dto.setTeamMemberIds(
            project.getTeamMembers().stream()
                .map(UserEntity::getUserId) // Extract user IDs from team members
                .collect(Collectors.toList())
        );
        return dto;
    }
}