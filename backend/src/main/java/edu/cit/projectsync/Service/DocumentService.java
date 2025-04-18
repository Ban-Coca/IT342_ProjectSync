package edu.cit.projectsync.Service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.cit.projectsync.Entity.DocumentEntity;
import edu.cit.projectsync.Repository.DocumentRepository;
import edu.cit.projectsync.Repository.ProjectRepository;

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