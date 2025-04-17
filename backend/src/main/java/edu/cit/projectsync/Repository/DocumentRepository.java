package edu.cit.projectsync.Repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.cit.projectsync.Entity.DocumentEntity;

@Repository
public interface DocumentRepository extends JpaRepository<DocumentEntity, UUID> {
    List<DocumentEntity> findByProject_ProjectId(UUID projectId);
    List<DocumentEntity> findByFileNameContaining(String query); // Search documents by file name
}