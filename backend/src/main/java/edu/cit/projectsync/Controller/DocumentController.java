package edu.cit.projectsync.Controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import edu.cit.projectsync.Entity.DocumentEntity;
import edu.cit.projectsync.Entity.ProjectEntity;
import edu.cit.projectsync.Entity.UserEntity;
import edu.cit.projectsync.Service.DocumentService;
import edu.cit.projectsync.Service.ProjectService;
import edu.cit.projectsync.Service.UserService;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @Autowired
    private ProjectService projectService; 
    @Autowired
    private UserService userService;

    @PostMapping("/upload")
    public ResponseEntity<DocumentEntity> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("project_id") int projectId,
            @RequestParam("uploaded_by") int userId) {
        try {
            // Define the upload directory
            String uploadDir = "uploads/";
            String filePath = uploadDir + file.getOriginalFilename();

            // Save the file to the uploads folder
            java.nio.file.Path path = java.nio.file.Paths.get(filePath);
            java.nio.file.Files.createDirectories(path.getParent()); // Ensure the directory exists
            file.transferTo(path.toFile()); // Save the file

            // Validate and fetch the user and project entities
            UserEntity user = userService.getUserById(userId); // Ensure userService exists
            ProjectEntity project = projectService.getProjectById(projectId); // Ensure projectService exists

            if (user == null || project == null) {
                return ResponseEntity.badRequest().body(null); // Return 400 if user or project is invalid
            }

            // Create a new DocumentEntity
            DocumentEntity document = new DocumentEntity();
            document.setFileName(file.getOriginalFilename());
            document.setFileType(file.getContentType());
            document.setFileSize(file.getSize());
            document.setFilePath(filePath); 
            document.setUploadedAt(LocalDateTime.now());
            document.setUploadedBy(user);
            document.setProject(project);

            // Save the document metadata to the database
            DocumentEntity savedDocument = documentService.uploadDocument(document);
            return ResponseEntity.status(201).body(savedDocument);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("getdocumentbyid/{id}")
    public ResponseEntity<DocumentEntity> getDocumentById(@PathVariable int id) {
        DocumentEntity document = documentService.getDocumentById(id);
        if (document != null) {
            return ResponseEntity.ok(document);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/deletedocument/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable int id) {
        documentService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/getalldocuments")
    public ResponseEntity<List<DocumentEntity>> getAllDocuments() {
        List<DocumentEntity> documents = documentService.getAllDocuments();
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<DocumentEntity>> getDocumentsByProject(@PathVariable int projectId) {
        List<DocumentEntity> documents = documentService.getDocumentsByProjectId(projectId);
        if (documents.isEmpty()) {
            return ResponseEntity.noContent().build(); // Return 204 if no documents found
        }
        return ResponseEntity.ok(documents);
    }
}