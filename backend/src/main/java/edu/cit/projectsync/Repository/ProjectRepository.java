package edu.cit.projectsync.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.cit.projectsync.Entity.ProjectEntity;

@Repository
public interface ProjectRepository extends JpaRepository<ProjectEntity, Integer> {
    List<ProjectEntity> findByOwnerUserIdOrTeamMembersUserId(int ownerId, int userId);
}