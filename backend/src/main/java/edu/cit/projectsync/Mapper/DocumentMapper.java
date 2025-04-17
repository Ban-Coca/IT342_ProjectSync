package edu.cit.projectsync.Mapper;

import edu.cit.projectsync.DTO.DocumentDTO;
import edu.cit.projectsync.Entity.DocumentEntity;
import edu.cit.projectsync.Entity.ProjectEntity;
import edu.cit.projectsync.Entity.UserEntity;

public class DocumentMapper {

    public static DocumentDTO toDTO(DocumentEntity document) {
        DocumentDTO dto = new DocumentDTO();
        dto.setDocumentId(document.getDocumentId());
        dto.setFileName(document.getFileName());
        dto.setFileType(document.getFileType());
        dto.setFileSize(document.getFileSize());
        dto.setFilePath(document.getFilePath());
        dto.setUploadedAt(document.getUploadedAt());
        dto.setUploadedBy(document.getUploadedBy().getUserId());
        dto.setProjectId(document.getProject().getProjectId());
        return dto;
    }
    
    public static DocumentEntity toEntity(DocumentDTO documentDTO) {
        DocumentEntity documentEntity = new DocumentEntity();
        documentEntity.setDocumentId(documentDTO.getDocumentId());
        documentEntity.setFileName(documentDTO.getFileName());
        documentEntity.setFileType(documentDTO.getFileType());
        documentEntity.setFileSize(documentDTO.getFileSize());
        documentEntity.setFilePath(documentDTO.getFilePath());
        documentEntity.setUploadedAt(documentDTO.getUploadedAt());

        // Map uploadedBy (user ID) to UserEntity
        UserEntity userEntity = new UserEntity();
        userEntity.setUserId(documentDTO.getUploadedBy());
        documentEntity.setUploadedBy(userEntity);

        // Map projectId to ProjectEntity
        ProjectEntity projectEntity = new ProjectEntity();
        projectEntity.setProjectId(documentDTO.getProjectId());
        documentEntity.setProject(projectEntity);

        return documentEntity;
    }
}