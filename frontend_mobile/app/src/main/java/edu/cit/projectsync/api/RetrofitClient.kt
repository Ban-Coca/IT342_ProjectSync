package edu.cit.projectsync.api

import android.content.Context
import okhttp3.logging.HttpLoggingInterceptor
import edu.cit.projectsync.util.TokenManager
import okhttp3.OkHttpClient
import okhttp3.Request
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object TaskRetrofitClient {

//    private const val BASE_URL = "http://192.168.1.57:8080/api/tasks/"
    private const val BASE_URL = "https://projectsync-68pm.onrender.com/api/projects/"

    val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY // Log request and response bodies
    }

    fun <T> create(service: Class<T>, context: Context): T {
        // Create an OkHttpClient with an Interceptor to add the Authorization header
        val okHttpClient = OkHttpClient.Builder()
            .connectTimeout(60, TimeUnit.SECONDS)
            .readTimeout(60, TimeUnit.SECONDS)
            .writeTimeout(60, TimeUnit.SECONDS)
            .addInterceptor(loggingInterceptor) // Add logging interceptor
            .addInterceptor { chain ->
                val token = TokenManager.getInstance(context).getToken()
                val request: Request = if (token != null) {
                    chain.request().newBuilder()
                        .addHeader("Authorization", "Bearer $token")
                        .build()
                } else {
                    chain.request()
                }
                chain.proceed(request)
            }
            .build()

        // Create and return the Retrofit instance
        val retrofit = Retrofit.Builder()
            .baseUrl(TaskRetrofitClient.BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()

        return retrofit.create(service)
    }
}