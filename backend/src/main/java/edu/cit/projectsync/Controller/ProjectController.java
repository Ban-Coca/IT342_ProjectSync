package edu.cit.projectsync.Controller;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.cit.projectsync.DTO.ProjectDTO;
import edu.cit.projectsync.Entity.ProjectEntity;
import edu.cit.projectsync.Mapper.ProjectMapper;
import edu.cit.projectsync.Service.ProjectService;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;
   
    @PostMapping("/createproject")
    public ResponseEntity<ProjectDTO> createProject(@RequestBody ProjectEntity project) {
        try {
            if (project.getOwner() == null || project.getOwner().getUserId() == null) {
                return ResponseEntity.badRequest().build();
            }

            ProjectEntity createdProject = projectService.createProject(project);
            ProjectDTO projectDTO = ProjectMapper.toDTO(createdProject);
            return ResponseEntity.status(201).body(projectDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/updateproject/{projectId}/")
    public ResponseEntity<ProjectDTO> updateProject(@PathVariable UUID projectId, @RequestBody ProjectEntity updatedProject) {
        ProjectEntity project = projectService.updateProject(projectId, updatedProject);
        if (project != null) {
            ProjectDTO projectDTO = ProjectMapper.toDTO(project);
            return ResponseEntity.ok(projectDTO);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/getprojectbyid/{projectId}/")
    public ResponseEntity<ProjectDTO> getProjectById(@PathVariable UUID projectId) {
        ProjectEntity project = projectService.getProjectById(projectId);
        if (project != null) {
            ProjectDTO projectDTO = ProjectMapper.toDTO(project);
            return ResponseEntity.ok(projectDTO);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/getallprojects")
    public ResponseEntity<List<ProjectDTO>> getAllProjects() {
        List<ProjectEntity> projects = projectService.getAllProjects();
        List<ProjectDTO> projectDTOs = projects.stream()
                                               .map(ProjectMapper::toDTO)
                                               .collect(Collectors.toList());
        return ResponseEntity.ok(projectDTOs);
    }

    @DeleteMapping("/deleteproject/{projectId}")
    public ResponseEntity<String> deleteProject(@PathVariable UUID projectId) {
        try {
            ProjectEntity project = projectService.getProjectById(projectId);
            if (project == null) {
                return ResponseEntity.status(404).body("Project with ID " + projectId + " not found.");
            }

            projectService.deleteProject(projectId);
            return ResponseEntity.ok("Project with ID " + projectId + " has been successfully deleted.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An error occurred while deleting the project: " + e.getMessage());
        }
    }

    @GetMapping("/getprojectbyuser/{userId}")
    public ResponseEntity<List<ProjectDTO>> getProjectsByUserId(@PathVariable UUID userId) {
        List<ProjectEntity> projects = projectService.getProjectsByUserId(userId);
        if (projects != null && !projects.isEmpty()) {
            List<ProjectDTO> projectDTOs = projects.stream()
                                                   .map(ProjectMapper::toDTO)
                                                   .collect(Collectors.toList());
            return ResponseEntity.ok(projectDTOs);
        }
        return ResponseEntity.noContent().build();
    }
}