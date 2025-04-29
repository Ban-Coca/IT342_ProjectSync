package edu.cit.projectsync.api

import edu.cit.projectsync.models.Task
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.PUT
import retrofit2.http.Path
import java.util.UUID

interface TaskApi {
    @GET("assignedToMe/{userId}")
    fun getTasksAssignedToUser(@Path("userId") userId: String): Call<List<Task>>

    @GET("project/{projectId}")
    fun getTasksByProjectId(@Path("projectId") projectId: UUID): Call<List<Task>>

    @PUT("updatetask/{taskId}")
    fun updateTaskStatus(@Path("taskId") taskId: UUID, @Body updatedTask: Task): Call<Task>


}