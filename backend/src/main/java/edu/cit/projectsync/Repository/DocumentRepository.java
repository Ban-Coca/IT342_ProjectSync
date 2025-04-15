package edu.cit.projectsync.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.cit.projectsync.Entity.DocumentEntity;

@Repository
public interface DocumentRepository extends JpaRepository<DocumentEntity, Integer> {
    List<DocumentEntity> findByProject_ProjectId(int projectId);
    List<DocumentEntity> findByFileNameContaining(String query); // Search documents by file name
}