package edu.cit.projectsync.model

import java.util.*

data class User(
    val userId: UUID? = null,
    val email: String,
    val firstName: String? = null,
    val lastName: String? = null,
    val password: String? = null,
    val provider: String? = null,
    val isActive: Boolean = true,
    val createdAt: Date? = null,
    val lastLogin: Date? = null,
    val updatedAt: Date? = null
)
{
    fun getFullName(): String {
        return "$firstName $lastName"
    }
}