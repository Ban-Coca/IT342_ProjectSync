package edu.cit.projectsync.api

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object ProjectRetrofitClient {

    private const val BASE_URL = "http://192.168.1.57:8080/api/projects/"

    private val retrofit: Retrofit = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .addConverterFactory(GsonConverterFactory.create())
        .build()

    fun <T> create(service: Class<T>): T {
        return retrofit.create(service)
    }
}