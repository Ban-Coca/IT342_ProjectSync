package edu.cit.projectsync.Controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

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

import edu.cit.projectsync.DTO.DocumentDTO;
import edu.cit.projectsync.Entity.DocumentEntity;
import edu.cit.projectsync.Mapper.DocumentMapper;
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

        // Save the file (you can implement file storage logic here)
        String filePath = "/uploads/" + file.getOriginalFilename(); // Example file path
        long fileSize = file.getSize();
        String fileType = file.getContentType();

        // Create a DocumentDTO
        DocumentDTO documentDTO = new DocumentDTO();
        documentDTO.setFileName(file.getOriginalFilename());
        documentDTO.setFileType(fileType);
        documentDTO.setFileSize(fileSize);
        documentDTO.setFilePath(filePath);
        documentDTO.setUploadedAt(LocalDateTime.now());
        documentDTO.setUploadedBy(uploadedBy);
        documentDTO.setProjectId(projectId);

        // Map DTO to Entity and save
        DocumentEntity documentEntity = DocumentMapper.toEntity(documentDTO);
        DocumentEntity savedDocument = documentService.uploadDocument(documentEntity);

        // Map saved entity back to DTO
        DocumentDTO savedDocumentDTO = DocumentMapper.toDTO(savedDocument);

        return ResponseEntity.status(201).body(savedDocumentDTO); // Return 201 Created with the saved document
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

        // Delete the document
        documentService.deleteDocument(documentId);
        return ResponseEntity.ok("Document with ID " + documentId + " has been successfully deleted.");
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