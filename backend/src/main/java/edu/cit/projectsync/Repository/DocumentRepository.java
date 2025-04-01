package edu.cit.projectsync.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.cit.projectsync.Entity.DocumentEntity;

@Repository
public interface DocumentRepository extends JpaRepository<DocumentEntity, Long> {
    
    List<DocumentEntity> findByProjectId(Long projectId); // Search documents by project ID
    List<DocumentEntity> findByFileNameContaining(String query); // Search documents by file name
}