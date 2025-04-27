package edu.cit.projectsync.api

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object TaskRetrofitClient {

    private const val BASE_URL = "http://192.168.1.57:8080/api/tasks/"

    private val retrofit: Retrofit by lazy {
        Retrofit.Builder()
            .baseUrl(TaskRetrofitClient.BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    fun <T> create(service: Class<T>): T {
        return retrofit.create(service)
    }
}