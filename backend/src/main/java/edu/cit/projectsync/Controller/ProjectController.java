package edu.cit.projectsync.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.cit.projectsync.Entity.ProjectEntity;
import edu.cit.projectsync.Entity.UserEntity;
import edu.cit.projectsync.Service.ProjectService;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @PostMapping("/createproject")
    public ResponseEntity<ProjectEntity> createProject(@RequestBody ProjectEntity project) {
        Long authenticatedUserId = getAuthenticatedUserId(); // Get the authenticated user's ID
        UserEntity owner = new UserEntity();
        owner.setUserId(authenticatedUserId); // Set the authenticated user as the owner
        project.setOwner(owner); // Assign the owner to the project
        ProjectEntity createdProject = projectService.createProject(project);
        return ResponseEntity.status(201).body(createdProject);
    }

    @PutMapping("/updateproject/{projectId}/")
    public ResponseEntity<ProjectEntity> updateProject(@PathVariable Long projectId, @RequestBody ProjectEntity updatedProject) {
        ProjectEntity project = projectService.updateProject(projectId, updatedProject);
        if (project != null) {
            return ResponseEntity.ok(project);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/getprojectbyid/{projectId}/")
    public ResponseEntity<ProjectEntity> getProjectById(@PathVariable Long projectId) {
        ProjectEntity project = projectService.getProjectById(projectId);
        if (project != null) {
            return ResponseEntity.ok(project);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/getallprojects")
    public ResponseEntity<List<ProjectEntity>> getAllProjects() {
        List<ProjectEntity> projects = projectService.getAllProjects();
        return ResponseEntity.ok(projects);
    }

    @DeleteMapping("/deleteproject/{projectId}/")
    public ResponseEntity<Void> deleteProject(@PathVariable Long projectId) {
        projectService.deleteProject(projectId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/getprojectbyuser/{userId}")
    public ResponseEntity<List<ProjectEntity>> getProjectsByUserId(@PathVariable Long userId) {
        List<ProjectEntity> projects = projectService.getProjectsByUserId(userId);
        if (projects != null && !projects.isEmpty()) {
            return ResponseEntity.ok(projects);
        }
        return ResponseEntity.noContent().build();
    }

    // Method to get the authenticated user's ID
    private Long getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserEntity) {
            UserEntity user = (UserEntity) authentication.getPrincipal();
            return user.getUserId(); // Assuming UserEntity contains the userId field
        }
        throw new IllegalStateException("No authenticated user found");
    }
}