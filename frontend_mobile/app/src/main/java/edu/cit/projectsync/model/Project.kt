package edu.cit.projectsync.model

import java.util.UUID

data class Project(
    val projectId: UUID,
    val name: String,
    val description: String,
    val startDate: String,
    val endDate: String
)