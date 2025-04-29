package edu.cit.projectsync.models

import java.io.Serializable
import java.util.UUID


data class Project(
    val projectId: UUID,
    var name: String,
    var description: String,
    var startDate: String,
    var endDate: String,
    var ownerId:User,
    var goals:List<String>,
    var teamMembersIds:List<User>
): Serializable

data class CreateProject(
    val projectId: UUID,
    val name: String,
    val description: String,
    val startDate: String,
    val endDate: String,
    val owner:User,
    val goals:List<String>,
    val teamMembers:List<User>
)