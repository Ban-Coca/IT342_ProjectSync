package edu.cit.projectsync.api

import edu.cit.projectsync.model.Task
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface TaskApi {
    @GET("assignedToMe/{userId}")
    fun getTasksAssignedToUser(@Path("userId") userId: String): Call<List<Task>>
}