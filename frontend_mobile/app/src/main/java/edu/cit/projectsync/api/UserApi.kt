package edu.cit.projectsync.api

import edu.cit.projectsync.models.User
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface UserApi {
    @POST("login")
    fun login(@Body loginRequest: Map<String, String>): Call<Map<String, Any>>

    @POST("postuserrecord")
    fun register(@Body registerRequest: Map<String, String>): Call<Map<String, Any>>

    @GET("findbyid/{userId}")
    fun getUserById(@Path("userId") userId: String): Call<User>
}