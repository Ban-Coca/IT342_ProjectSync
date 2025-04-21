package edu.cit.projectsync.Service;

import java.util.List;
import java.util.UUID;

import com.backblaze.b2.client.structures.*;
import edu.cit.projectsync.Entity.ProjectEntity;
import edu.cit.projectsync.Entity.UserEntity;
import edu.cit.projectsync.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import edu.cit.projectsync.Entity.DocumentEntity;
import edu.cit.projectsync.Repository.DocumentRepository;
import edu.cit.projectsync.Repository.ProjectRepository;

import com.backblaze.b2.client.B2StorageClient;
import com.backblaze.b2.client.B2StorageClientFactory;
import com.backblaze.b2.client.contentHandlers.B2ContentMemoryWriter;
import com.backblaze.b2.client.contentSources.B2ContentSource;
import com.backblaze.b2.client.contentSources.B2ContentTypes;
import com.backblaze.b2.client.contentSources.B2FileContentSource;
import com.backblaze.b2.client.exceptions.B2Exception;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Value("${backblaze.application-key-id}")
    private String applicationKeyId;

    @Value("${backblaze.application-key}")
    private String applicationKey;

    @Value("${backblaze.bucket-id}")
    private String bucketId;

    @Value("${backblaze.bucket-name}")
    private String bucketName;

    private String userAgent = "ProjectSync/1.0";

    public B2StorageClient storageClient;
    @Autowired
    private UserRepository userRepository;

    private B2StorageClient getB2Client(){
        if (storageClient == null) {
            storageClient = B2StorageClientFactory.createDefaultFactory().create( applicationKeyId, applicationKey, userAgent );
        }
        return storageClient;
    }

    public DocumentEntity uploadDocument(MultipartFile file, UUID projectId, UUID userId) throws IOException, B2Exception {

        if(!projectRepository.existsById(projectId)) {
            throw new IllegalArgumentException("Project does not exist");
        }

        File tempFile = convertMultipartFileToFile(file);

        try{
            B2ContentSource contentSource = B2FileContentSource.builder(tempFile).build();
            String fileName = file.getOriginalFilename();
            String contentType = file.getContentType() != null ? file.getContentType() : B2ContentTypes.B2_AUTO;

            String b2FilePath = "project/" + projectId + "/" + UUID.randomUUID() + "/" + fileName;

            B2UploadFileRequest request = B2UploadFileRequest.builder(bucketId, b2FilePath, contentType, contentSource).build();

            B2FileVersion fileVersion = getB2Client().uploadSmallFile(request);

            DocumentEntity document = new DocumentEntity();
            document.setFileName(fileName);
            document.setFileType(file.getContentType());
            document.setFileSize(file.getSize());
            document.setFilePath(b2FilePath);
            document.setUploadedAt(LocalDateTime.now());

            document.setB2FileId(fileVersion.getFileId());
            document.setB2BucketId(bucketId);
            document.setB2BucketName(bucketName);
            document.setB2FileUrl(getB2Client().getDownloadByIdUrl(fileVersion.getFileId()));
            document.setB2ContentSha1(fileVersion.getContentSha1());

            ProjectEntity project = projectRepository.getReferenceById(projectId);
            UserEntity user = userRepository.getReferenceById(userId);

            document.setProject(project);
            document.setUploadedBy(user);

            return documentRepository.save(document);
        } finally {
            if (tempFile.exists()) {
                tempFile.delete();
            }
        }
    }

    public byte[] downloadDocument(UUID documentId) throws B2Exception {
        DocumentEntity document = getDocumentById(documentId);
        if (document == null) {
            throw new IllegalArgumentException("Document not found");
        }

        B2DownloadByIdRequest request = B2DownloadByIdRequest.builder(document.getB2FileId()).build();
        B2ContentMemoryWriter contentHandler = B2ContentMemoryWriter.build();

        getB2Client().downloadById(request, contentHandler);

        return contentHandler.getBytes();
    }

    public void deleteDocument(UUID documentId) throws B2Exception {
        DocumentEntity document = getDocumentById(documentId);
        if (document == null) {
            throw new IllegalArgumentException("Document not found");
        }
        boolean fileFound = false;
        B2ListFileVersionsRequest  deleteRequest = B2ListFileVersionsRequest
                .builder(bucketId)
                .setStartFileName(document.getFileName())
                .setPrefix(document.getFileName())
                .build();

        for (B2FileVersion version : getB2Client().fileVersions(deleteRequest)) {
            if (version.getFileName().equals(document.getFileName())) {
                getB2Client().deleteFileVersion(version);
                fileFound = true;
            } else {
                break;
            }
        }


        documentRepository.deleteById(documentId);
    }

    public DocumentEntity getDocumentById(UUID id) {
        return documentRepository.findById(id).orElse(null);
    }

    public List<DocumentEntity> getAllDocuments() {
        return documentRepository.findAll();
    }

    public List<DocumentEntity> getDocumentsByProjectId(UUID projectId) {
        return documentRepository.findByProject_ProjectId(projectId);
    }

    public List<DocumentEntity> searchDocumentsByQuery(String query) {
        return documentRepository.findByFileNameContaining(query);
    }

    public boolean projectExistsById(UUID projectId) {
        return projectRepository.existsById(projectId);
    }

    public DocumentEntity renameDocument(UUID documentId, String newFileName) {
        DocumentEntity document = getDocumentById(documentId);
        if (document != null) {
            document.setFileName(newFileName);
            return documentRepository.save(document);
        }
        return null;
    }

    private File convertMultipartFileToFile(MultipartFile file) throws IOException {
        File tempFile = File.createTempFile("b2upload-", "-" + file.getOriginalFilename());
        try (FileOutputStream fos = new FileOutputStream(tempFile)) {
            fos.write(file.getBytes());
        }
        return tempFile;
    }
}