package edu.cit.projectsync.Controller;

import edu.cit.projectsync.Entity.ProjectEntity;
import edu.cit.projectsync.Entity.TaskEntity;
import edu.cit.projectsync.Entity.UserEntity;
import edu.cit.projectsync.Repository.ProjectRepository;
import edu.cit.projectsync.Repository.TaskRepository;
import edu.cit.projectsync.Repository.UserRepository;
import edu.cit.projectsync.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final UserService userService;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    @Autowired
    public DashboardController(UserService userService, ProjectRepository projectRepository,
                               TaskRepository taskRepository, UserRepository userRepository) {
        this.userService = userService;
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/analytics/{userId}")
    public ResponseEntity<Map<String, Object>> getDashboardAnalytics(
            @PathVariable UUID userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        UserEntity user = userService.findById(userId);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        // Default date range is last 30 days if not specified
        LocalDate today = LocalDate.now();
        LocalDate defaultStartDate = today.minusDays(30);
        startDate = startDate != null ? startDate : defaultStartDate;
        endDate = endDate != null ? endDate : today;

        Map<String, Object> dashboardData = new HashMap<>();

        // Get user's owned projects and team projects
        List<ProjectEntity> userProjects = user.getProjects();
        List<ProjectEntity> teamProjects = user.getTeamProjects();

        // Combine all projects the user is involved with
        Set<ProjectEntity> allUserProjects = new HashSet<>();
        allUserProjects.addAll(userProjects);
        allUserProjects.addAll(teamProjects);

        // Project statistics
        dashboardData.put("totalProjects", allUserProjects.size());
        dashboardData.put("ownedProjects", userProjects.size());
        dashboardData.put("teamProjects", teamProjects.size());

        // Task statistics
        List<TaskEntity> userTasks = user.getTasks();
        Map<String, Long> tasksByStatus = userTasks.stream()
                .collect(Collectors.groupingBy(TaskEntity::getStatus, Collectors.counting()));
        dashboardData.put("tasksByStatus", tasksByStatus);

        // Tasks by priority
        Map<String, Long> tasksByPriority = userTasks.stream()
                .collect(Collectors.groupingBy(TaskEntity::getPriority, Collectors.counting()));
        dashboardData.put("tasksByPriority", tasksByPriority);

        // Due soon tasks (due in the next 7 days)
        LocalDate nextWeek = today.plusDays(7);
        List<Map<String, Object>> dueSoonTasks = userTasks.stream()
                .filter(task -> {
                    LocalDate dueDate = task.getDueDate();
                    return dueDate != null &&
                            !dueDate.isBefore(today) &&
                            !dueDate.isAfter(nextWeek);
                })
                .map(task -> {
                    Map<String, Object> taskData = new HashMap<>();
                    taskData.put("id", task.getTaskId());
                    taskData.put("title", task.getTitle());
                    taskData.put("dueDate", task.getDueDate());
                    taskData.put("priority", task.getPriority());
                    taskData.put("projectName", task.getProject().getName());
                    return taskData;
                })
                .collect(Collectors.toList());
        dashboardData.put("dueSoonTasks", dueSoonTasks);

        // Overdue tasks
        List<Map<String, Object>> overdueTasks = userTasks.stream()
                .filter(task -> {
                    LocalDate dueDate = task.getDueDate();
                    return dueDate != null &&
                            dueDate.isBefore(today) &&
                            !"Completed".equalsIgnoreCase(task.getStatus());
                })
                .map(task -> {
                    Map<String, Object> taskData = new HashMap<>();
                    taskData.put("id", task.getTaskId());
                    taskData.put("title", task.getTitle());
                    taskData.put("dueDate", task.getDueDate());
                    taskData.put("daysOverdue", ChronoUnit.DAYS.between(task.getDueDate(), today));
                    taskData.put("priority", task.getPriority());
                    taskData.put("projectName", task.getProject().getName());
                    return taskData;
                })
                .collect(Collectors.toList());
        dashboardData.put("overdueTasks", overdueTasks);

        // Project progress data
        List<Map<String, Object>> projectProgress = allUserProjects.stream()
                .map(project -> {
                    Map<String, Object> progressData = new HashMap<>();
                    progressData.put("projectId", project.getProjectId());
                    progressData.put("projectName", project.getName());

                    List<TaskEntity> projectTasks = project.getTasks();
                    long totalTasks = projectTasks.size();
                    long completedTasks = projectTasks.stream()
                            .filter(task -> "Completed".equalsIgnoreCase(task.getStatus()))
                            .count();

                    double progressPercentage = totalTasks > 0 ?
                            ((double) completedTasks / totalTasks) * 100 : 0;

                    progressData.put("totalTasks", totalTasks);
                    progressData.put("completedTasks", completedTasks);
                    progressData.put("progressPercentage", progressPercentage);

                    // Calculate days until deadline
                    if (project.getEndDate() != null) {
                        long daysLeft = ChronoUnit.DAYS.between(today, project.getEndDate());
                        progressData.put("daysUntilDeadline", daysLeft);

                        // Check if project is at risk (less than 50% complete but over 70% of time elapsed)
                        if (project.getStartDate() != null) {
                            long totalDuration = ChronoUnit.DAYS.between(project.getStartDate(), project.getEndDate());
                            long daysElapsed = ChronoUnit.DAYS.between(project.getStartDate(), today);
                            double timeElapsedPercentage = totalDuration > 0 ?
                                    ((double) daysElapsed / totalDuration) * 100 : 0;

                            boolean atRisk = progressPercentage < 50 && timeElapsedPercentage > 70;
                            progressData.put("atRisk", atRisk);
                            progressData.put("timeElapsedPercentage", timeElapsedPercentage);
                        }
                    }

                    return progressData;
                })
                .collect(Collectors.toList());
        dashboardData.put("projectProgress", projectProgress);

        // Activity summary - tasks by due date
        LocalDate finalStartDate = startDate;
        LocalDate finalEndDate = endDate;
        Map<String, Long> tasksByDueDate = userTasks.stream()
                .filter(task -> {
                    LocalDate dueDate = task.getDueDate();
                    return dueDate != null &&
                            !dueDate.isBefore(finalStartDate) &&
                            !dueDate.isAfter(finalEndDate);
                })
                .collect(Collectors.groupingBy(
                        task -> task.getDueDate().toString(),
                        Collectors.counting()
                ));
        dashboardData.put("tasksByDueDate", tasksByDueDate);

        // Team performance (for owned projects)
        if (!userProjects.isEmpty()) {
            Map<String, Object> teamPerformance = new HashMap<>();
            Set<UserEntity> teamMembers = new HashSet<>();

            for (ProjectEntity project : userProjects) {
                teamMembers.addAll(project.getTeamMembers());
            }

            List<Map<String, Object>> memberStats = teamMembers.stream()
                    .map(member -> {
                        Map<String, Object> memberData = new HashMap<>();
                        memberData.put("userId", member.getUserId());
                        memberData.put("name", member.getFirstName() + " " + member.getLastName());

                        List<TaskEntity> memberTasks = member.getTasks();
                        long totalAssignedTasks = memberTasks.size();
                        long completedTasks = memberTasks.stream()
                                .filter(task -> "Completed".equalsIgnoreCase(task.getStatus()))
                                .count();

                        double completionRate = totalAssignedTasks > 0 ?
                                ((double) completedTasks / totalAssignedTasks) * 100 : 0;

                        memberData.put("totalTasks", totalAssignedTasks);
                        memberData.put("completedTasks", completedTasks);
                        memberData.put("completionRate", completionRate);

                        return memberData;
                    })
                    .collect(Collectors.toList());

            teamPerformance.put("memberStats", memberStats);
            dashboardData.put("teamPerformance", teamPerformance);
        }

        // Project Goals (from ElementCollection)
        Map<String, List<String>> projectGoals = new HashMap<>();
        for (ProjectEntity project : allUserProjects) {
            projectGoals.put(project.getName(), project.getGoals());
        }
        dashboardData.put("projectGoals", projectGoals);

        return ResponseEntity.ok(dashboardData);
    }

    @GetMapping("/trends/{userId}")
    public ResponseEntity<Map<String, Object>> getTaskTrends(
            @PathVariable UUID userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        UserEntity user = userService.findById(userId);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        // Default date range is last 90 days if not specified
        LocalDate today = LocalDate.now();
        LocalDate defaultStartDate = today.minusDays(90);
        startDate = startDate != null ? startDate : defaultStartDate;
        endDate = endDate != null ? endDate : today;

        Map<String, Object> trendsData = new HashMap<>();

        // Task due dates by month for trend analysis
        List<TaskEntity> userTasks = user.getTasks();
        Map<String, Long> tasksByMonth = userTasks.stream()
                .filter(task -> task.getDueDate() != null)
                .collect(Collectors.groupingBy(
                        task -> task.getDueDate().getYear() + "-" + task.getDueDate().getMonthValue(),
                        Collectors.counting()
                ));
        trendsData.put("tasksByMonth", tasksByMonth);

        // Task status distribution over time (creation date would be better but we'll use due date)
        Map<String, Map<String, Long>> statusDistributionByMonth = new HashMap<>();

        // Group tasks by month
        Map<String, List<TaskEntity>> taskGroupedByMonth = userTasks.stream()
                .filter(task -> task.getDueDate() != null)
                .collect(Collectors.groupingBy(
                        task -> task.getDueDate().getYear() + "-" + task.getDueDate().getMonthValue()
                ));

        // For each month, count tasks by status
        taskGroupedByMonth.forEach((month, tasks) -> {
            Map<String, Long> statusCounts = tasks.stream()
                    .collect(Collectors.groupingBy(
                            TaskEntity::getStatus,
                            Collectors.counting()
                    ));
            statusDistributionByMonth.put(month, statusCounts);
        });

        trendsData.put("statusDistributionByMonth", statusDistributionByMonth);

        // Project distribution (tasks per project)
        Map<String, Long> tasksPerProject = userTasks.stream()
                .collect(Collectors.groupingBy(
                        task -> task.getProject().getName(),
                        Collectors.counting()
                ));
        trendsData.put("tasksPerProject", tasksPerProject);

        return ResponseEntity.ok(trendsData);
    }
}
