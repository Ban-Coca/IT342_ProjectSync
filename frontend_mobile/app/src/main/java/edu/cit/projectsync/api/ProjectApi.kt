package edu.cit.projectsync.api

import edu.cit.projectsync.model.Project
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface ProjectApi {
    @GET("getprojectbyuser/{userId}")
    fun getProjectsByUser(@Path("userId") userId: String): Call<List<Project>>
}