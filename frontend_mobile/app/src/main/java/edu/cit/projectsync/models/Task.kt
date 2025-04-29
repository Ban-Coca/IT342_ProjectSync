package edu.cit.projectsync.models

import java.util.UUID

data class Task(
    val taskId: UUID,
    var title: String,
    var description: String,
    var dueDate: String,
    var status: String,
    var priority: String,
    var project: Project,
    var assignedTo: List<User>
)