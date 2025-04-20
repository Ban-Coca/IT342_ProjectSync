package edu.cit.projectsync.DTO;

import java.time.LocalDateTime;
import java.util.UUID;

public class DocumentDTO {

    private UUID documentId;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private String filePath;
    private LocalDateTime uploadedAt;
    private UUID uploadedBy; // User ID of the uploader
    private UUID projectId;  // Project ID
    private String b2FileId;
    private String b2BucketId;
    private String b2BucketName;
    private String b2FileUrl;
    private String b2ContentSha1;

    // Getters and Setters
    public UUID getDocumentId() {
        return documentId;
    }

    public void setDocumentId(UUID documentId) {
        this.documentId = documentId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    public UUID getUploadedBy() {
        return uploadedBy;
    }

    public void setUploadedBy(UUID uploadedBy) {
        this.uploadedBy = uploadedBy;
    }

    public UUID getProjectId() {
        return projectId;
    }

    public void setProjectId(UUID projectId) {
        this.projectId = projectId;
    }

    public String getB2FileId() {
        return b2FileId;
    }

    public void setB2FileId(String b2FileId) {
        this.b2FileId = b2FileId;
    }

    public String getB2ContentSha1() {
        return b2ContentSha1;
    }

    public void setB2ContentSha1(String b2ContentSha1) {
        this.b2ContentSha1 = b2ContentSha1;
    }

    public String getB2FileUrl() {
        return b2FileUrl;
    }

    public void setB2FileUrl(String b2FileUrl) {
        this.b2FileUrl = b2FileUrl;
    }

    public String getB2BucketName() {
        return b2BucketName;
    }

    public void setB2BucketName(String b2BucketName) {
        this.b2BucketName = b2BucketName;
    }

    public String getB2BucketId() {
        return b2BucketId;
    }

    public void setB2BucketId(String b2BucketId) {
        this.b2BucketId = b2BucketId;
    }
}