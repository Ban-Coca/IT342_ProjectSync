package edu.cit.projectsync.Service;

import java.util.List;
import java.util.UUID;

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
import com.backblaze.b2.client.structures.B2FileVersion;
import com.backblaze.b2.client.structures.B2UploadFileRequest;
import com.backblaze.b2.client.structures.B2DeleteFileVersionRequest;
import com.backblaze.b2.client.structures.B2DownloadByIdRequest;

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

    public DocumentEntity uploadDocument(DocumentEntity document) {
        return documentRepository.save(document);
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

    public void deleteDocument(UUID id) {
        documentRepository.deleteById(id);
    }

    public boolean projectExistsById(UUID projectId) {
        return projectRepository.existsById(projectId);
    }
}