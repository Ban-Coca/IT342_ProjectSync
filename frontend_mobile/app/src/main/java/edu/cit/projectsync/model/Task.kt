package edu.cit.projectsync.model

import java.util.UUID

data class Task(
    val taskId: UUID,
    val title: String,
    val description: String,
    val dueDate: String,
    val status: String
)