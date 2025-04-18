package edu.cit.projectsync.Controller;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import edu.cit.projectsync.DTO.ProjectDTO;
import edu.cit.projectsync.Entity.ProjectEntity;
import edu.cit.projectsync.Mapper.ProjectMapper;
import edu.cit.projectsync.Service.ProjectService;
import edu.cit.projectsync.Service.UserService;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:5173")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private UserService userService;

    @PostMapping("/createproject")
    public ResponseEntity<Object> createProject(@RequestBody ProjectDTO projectDTO) {
        try {
            // Validate ownerId
            if (projectDTO.getOwnerId() == null ) {
                return ResponseEntity.badRequest().body("Owner ID is required."); // Return 400 with a meaningful error message
            }

            // Check if a project with the same name already exists
            boolean projectExists = projectService.projectExistsByName(projectDTO.getName());
            if (projectExists) {
                return ResponseEntity.status(409).body("A project with the name '" + projectDTO.getName() + "' already exists."); // Return 409 Conflict with a custom error message
            }

            // Map ProjectDTO to ProjectEntity
            ProjectEntity project = ProjectMapper.toEntity(projectDTO,userService);

            // Save the project
            ProjectEntity createdProject = projectService.createProject(project);

            // Map the saved ProjectEntity back to ProjectDTO
            ProjectDTO createdProjectDTO = ProjectMapper.toDTO(createdProject);

            return ResponseEntity.status(201).body(createdProjectDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("An error occurred while creating the project: " + e.getMessage()); // Return 400 with a detailed error message
        }
    }

    @PutMapping("/updateproject/{projectId}/")
    public ResponseEntity<Object> updateProject(@PathVariable UUID projectId, @RequestBody ProjectEntity updatedProject) {
        try {
            // Check if the project exists
            ProjectEntity existingProject = projectService.getProjectById(projectId);
            if (existingProject == null) {
                return ResponseEntity.status(404).body("Project with ID " + projectId + " does not exist."); // Return 404 if project doesn't exist
            }

            // Check if a project with the same name already exists (excluding the current project)
            boolean projectExists = projectService.projectExistsByNameExcludingId(updatedProject.getName(), projectId);
            if (projectExists) {
                return ResponseEntity.status(409).body("A project with the name '" + updatedProject.getName() + "' already exists."); // Return 409 Conflict
            }

            // Update the project
            ProjectEntity updatedEntity = projectService.updateProject(projectId, updatedProject);

            // Map the updated ProjectEntity to ProjectDTO
            ProjectDTO projectDTO = ProjectMapper.toDTO(updatedEntity);

            return ResponseEntity.ok(projectDTO);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An error occurred while updating the project: " + e.getMessage()); // Return 500 for unexpected errors
        }
    }

    @GetMapping("/getprojectbyid/{projectId}")
    public ResponseEntity<Object> getProjectById(@PathVariable UUID projectId) {
        // Check if the project exists
        boolean projectExists = projectService.projectExistsById(projectId);
        if (!projectExists) {
            return ResponseEntity.status(404).body("Project with ID " + projectId + " does not exist."); // Return 404 if project doesn't exist
        }

        // Retrieve the project
        ProjectEntity project = projectService.getProjectById(projectId);
        ProjectDTO projectDTO = ProjectMapper.toDTO(project);
        return ResponseEntity.ok(projectDTO);
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
    public ResponseEntity<Object> getProjectsByUserId(@PathVariable UUID userId) {
        // Check if the user exists
        boolean userExists = userService.userExistsById(userId);
        if (!userExists) {
            return ResponseEntity.status(404).body("User with ID " + userId + " does not exist."); // Return 404 if user doesn't exist
        }

        List<ProjectEntity> projects = projectService.getProjectsByUserId(userId);
        if (projects != null && !projects.isEmpty()) {
            List<ProjectDTO> projectDTOs = projects.stream()
                                                .map(ProjectMapper::toDTO)
                                                .collect(Collectors.toList());
            return ResponseEntity.ok(projectDTOs);
        }
        return ResponseEntity.noContent().build(); // Return 204 if no projects are found
    }

//    @GetMapping("/getprojectbyteammember/{userId}")
//    public ResponseEntity<Object> getProjectsByTeamMemberId(@PathVariable UUID userId) {
//        // Check if the user exists
//        boolean userExists = userService.userExistsById(userId);
//        if (!userExists) {
//            return ResponseEntity.status(404).body("User with ID " + userId + " does not exist."); // Return 404 if user doesn't exist
//        }
//
//        // Retrieve projects for the team member
//        List<ProjectEntity> projects = projectService.getProjectsByTeamMemberId(userId);
//        if (projects != null && !projects.isEmpty()) {
//            List<ProjectDTO> projectDTOs = projects.stream()
//                                                .map(ProjectMapper::toDTO)
//                                                .collect(Collectors.toList());
//            return ResponseEntity.ok(projectDTOs);
//        }
//        return ResponseEntity.noContent().build(); // Return 204 if no projects are found
//    }

}