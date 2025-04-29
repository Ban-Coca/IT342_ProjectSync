package edu.cit.projectsync.api

import edu.cit.projectsync.models.CreateProject
import edu.cit.projectsync.models.Project
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path
import java.util.UUID

interface ProjectApi {
    @GET("getprojectbyuser/{userId}")
    fun getProjectsByUser(@Path("userId") userId: UUID): Call<List<Project>>

    @POST("/api/projects/createproject")
    fun createProject(@Body project: CreateProject): Call<ResponseBody>

    @GET("getprojectbyid/{projectId}/")
    fun getProjectById(@Path("projectId") projectId: UUID): Call<Project>
}