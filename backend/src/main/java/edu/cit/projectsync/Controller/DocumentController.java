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
import edu.cit.projectsync.Service.DocumentService;

@RestController
@RequestMapping("/api/v1/documents")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @PostMapping("/upload")
    public ResponseEntity<DocumentEntity> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("project_id") Long projectId,
            @RequestParam("uploaded_by") String uploadedBy) {
        try {
            // Define the upload directory
            String uploadDir = "uploads/";
            String filePath = uploadDir + file.getOriginalFilename();

            // Save the file to the uploads folder
            java.nio.file.Path path = java.nio.file.Paths.get(filePath);
            java.nio.file.Files.createDirectories(path.getParent()); // Ensure the directory exists
            file.transferTo(path.toFile()); // Save the file

            // Create a new DocumentEntity
            DocumentEntity document = new DocumentEntity();
            document.setFileName(file.getOriginalFilename());
            document.setFileType(file.getContentType());
            document.setFileSize(file.getSize());
            document.setFilePath(filePath); // Save the relative path
            document.setUploadedAt(LocalDateTime.now());
            document.setUploadedBy(uploadedBy);
            document.setProject(new ProjectEntity());
            document.getProject().setId(projectId);

            // Save the document metadata to the database
            DocumentEntity savedDocument = documentService.uploadDocument(document);
            return ResponseEntity.status(201).body(savedDocument);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocumentEntity> getDocumentById(@PathVariable Long id) {
        DocumentEntity document = documentService.getDocumentById(id);
        if (document != null) {
            return ResponseEntity.ok(document);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<DocumentEntity>> searchDocuments(
            @RequestParam(value = "project_id", required = false) Long projectId,
            @RequestParam(value = "query", required = false) String query) {
        if (projectId != null) {
            return ResponseEntity.ok(documentService.searchDocumentsByProjectId(projectId));
        } else if (query != null) {
            return ResponseEntity.ok(documentService.searchDocumentsByQuery(query));
        }
        return ResponseEntity.badRequest().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }
}