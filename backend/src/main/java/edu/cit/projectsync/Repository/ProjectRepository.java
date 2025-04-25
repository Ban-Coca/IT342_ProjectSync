package edu.cit.projectsync.Repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.cit.projectsync.Entity.ProjectEntity;

@Repository
public interface ProjectRepository extends JpaRepository<ProjectEntity, UUID> {
    List<ProjectEntity> findByOwnerUserIdOrTeamMembersUserId(UUID ownerId, UUID userId);
    boolean existsByName(String name);
    boolean existsByNameAndProjectIdNot(String name, UUID projectId);

}