package edu.cit.projectsync.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.cit.projectsync.Entity.DocumentEntity;
import edu.cit.projectsync.Repository.DocumentRepository;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    public DocumentEntity uploadDocument(DocumentEntity document) {
        return documentRepository.save(document);
    }

    public DocumentEntity getDocumentById(Long id) {
        return documentRepository.findById(id).orElse(null);
    }

    public List<DocumentEntity> searchDocumentsByProjectId(Long projectId) {
        return documentRepository.findByProjectId(projectId);
    }

    public List<DocumentEntity> searchDocumentsByQuery(String query) {
        return documentRepository.findByFileNameContaining(query);
    }

    public void deleteDocument(Long id) {
        documentRepository.deleteById(id);
    }
}