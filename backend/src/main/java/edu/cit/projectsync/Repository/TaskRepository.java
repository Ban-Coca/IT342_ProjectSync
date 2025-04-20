package edu.cit.projectsync.Repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import edu.cit.projectsync.Entity.TaskEntity;

@Repository
public interface TaskRepository extends JpaRepository<TaskEntity, UUID> {
    List<TaskEntity> findByProject_ProjectId(UUID projectId);
    boolean existsByTitle(String title);
    boolean existsByTitleAndTaskIdNot(String title, UUID id);
    @Query("SELECT t FROM TaskEntity t JOIN t.assignedTo a WHERE a.userId = :userId")
    List<TaskEntity> findTasksAssignedToUser(@Param("userId") UUID userId);
}