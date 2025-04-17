package edu.cit.projectsync.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.cit.projectsync.Entity.ProjectEntity;
import edu.cit.projectsync.Repository.ProjectRepository;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    public ProjectEntity createProject(ProjectEntity project) {
        return projectRepository.save(project);
    }
    
    public ProjectEntity updateProject(UUID projectId, ProjectEntity updatedProject) {
        Optional<ProjectEntity> projectOptional = projectRepository.findById(projectId);
        if (projectOptional.isPresent()) {
            ProjectEntity project = projectOptional.get();
            project.setName(updatedProject.getName());
            project.setDescription(updatedProject.getDescription());
            project.setStartDate(updatedProject.getStartDate());
            project.setEndDate(updatedProject.getEndDate());
            project.setGoals(updatedProject.getGoals());
            project.setTeamMembers(updatedProject.getTeamMembers());
            return projectRepository.save(project);
        }
        return null;
    }

    public ProjectEntity getProjectById(UUID projectId) {
        return projectRepository.findById(projectId).orElse(null);
    }

    public List<ProjectEntity> getProjectsByUserId(UUID userId) {
        return projectRepository.findByOwnerUserIdOrTeamMembersUserId (userId, userId);
    }

    public List<ProjectEntity> getAllProjects() {
        return projectRepository.findAll();
    }

    public void deleteProject(UUID projectId) {
        projectRepository.deleteById(projectId);
    }
}