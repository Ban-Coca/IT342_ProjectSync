package edu.cit.projectsync.Controller;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.backblaze.b2.client.exceptions.B2Exception;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import edu.cit.projectsync.DTO.DocumentDTO;
import edu.cit.projectsync.Entity.DocumentEntity;
import edu.cit.projectsync.Mapper.DocumentMapper;
import edu.cit.projectsync.Service.DocumentService;
import edu.cit.projectsync.Service.ProjectService;
import edu.cit.projectsync.Service.UserService;

import org.springframework.http.MediaType;
import org.springframework.http.HttpHeaders;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "http://localhost:5173")
public class DocumentController {

    private static final Logger log = LoggerFactory.getLogger(DocumentController.class);

    @Autowired
    private DocumentService documentService;

    @Autowired
    private ProjectService projectService; 
    @Autowired
    private UserService userService;

    @PostMapping("/upload")
    public ResponseEntity<Object> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("uploadedBy") UUID uploadedBy,
            @RequestParam("projectId") UUID projectId) {

        // Check if the project exists
        boolean projectExists = projectService.projectExistsById(projectId);
        if (!projectExists) {
            return ResponseEntity.status(404).body("Project with ID " + projectId + " does not exist.");
        }

        // Check if the user exists
        boolean userExists = userService.userExistsById(uploadedBy);
        if (!userExists) {
            return ResponseEntity.status(404).body("User with ID " + uploadedBy + " does not exist.");
        }

        try {
            // Use the new B2 upload functionality
            DocumentEntity savedDocument = documentService.uploadDocument(file, projectId, uploadedBy);

            // Map saved entity back to DTO
            DocumentDTO savedDocumentDTO = DocumentMapper.toDTO(savedDocument);
            return ResponseEntity.status(201).body(savedDocumentDTO);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to process file: " + e.getMessage());
        } catch (B2Exception e) {
            log.error("B2 upload error: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Failed to upload to B2: " + e.getMessage());

        }
    }

    @GetMapping("/download/{documentId}")
    public ResponseEntity<byte[]> downloadDocument(@PathVariable UUID documentId) {
        try {
            DocumentEntity document = documentService.getDocumentById(documentId);
            if (document == null) {
                return ResponseEntity.notFound().build();
            }

            byte[] fileData = documentService.downloadDocument(documentId);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(document.getFileType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + document.getFileName() + "\"")
                    .body(fileData);
        } catch (B2Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/test-upload")
    public ResponseEntity<String> testUpload(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is missing");
        }
        return ResponseEntity.ok("File uploaded: " + file.getOriginalFilename());
    }

    @GetMapping("getdocumentbyid/{documentId}")
    public ResponseEntity<Object> getDocumentById(@PathVariable UUID documentId) {
        DocumentEntity document = documentService.getDocumentById(documentId);
        if (document == null) {
            return ResponseEntity.status(404).body("Document with ID " + documentId + " does not exist.");
        }
        DocumentDTO documentDTO = DocumentMapper.toDTO(document);
        return ResponseEntity.ok(documentDTO);
    }

    @DeleteMapping("/deletedocument/{documentId}")
    public ResponseEntity<Object> deleteDocument(@PathVariable UUID documentId) {
        // Check if the document exists
        DocumentEntity document = documentService.getDocumentById(documentId);
        if (document == null) {
            return ResponseEntity.status(404).body("Document with ID " + documentId + " does not exist.");
        }

        try {
            // Delete the document from B2 and database
            documentService.deleteDocument(documentId);
            return ResponseEntity.ok("Document with ID " + documentId + " has been successfully deleted.");
        } catch (B2Exception e) {
            return ResponseEntity.status(500).body("Failed to delete from B2: " + e.getMessage());
        }
    }

    @GetMapping("/getalldocuments")
    public ResponseEntity<List<DocumentDTO>> getAllDocuments() {
        List<DocumentEntity> documents = documentService.getAllDocuments();
        List<DocumentDTO> documentDTOs = documents.stream()
                                                  .map(DocumentMapper::toDTO)
                                                  .toList();
        return ResponseEntity.ok(documentDTOs);
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<Object> getDocumentsByProject(@PathVariable UUID projectId) {
        boolean projectExists = projectService.projectExistsById(projectId);
        if (!projectExists) {
            return ResponseEntity.status(404).body("Project with ID " + projectId + " does not exist.");
        }

        List<DocumentEntity> documents = documentService.getDocumentsByProjectId(projectId);
        if (documents.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        List<DocumentDTO> documentDTOs = documents.stream()
                                                  .map(DocumentMapper::toDTO)
                                                  .toList();
        return ResponseEntity.ok(documentDTOs);
    }
}