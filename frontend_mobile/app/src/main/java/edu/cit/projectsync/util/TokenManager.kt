package edu.cit.projectsync.util

import android.content.Context
import android.content.SharedPreferences
import com.google.gson.Gson
import edu.cit.projectsync.model.User
import java.util.UUID

class TokenManager(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
    private val gson = Gson()

    fun saveToken(token: String) {
        prefs.edit().putString(TOKEN_KEY, token).apply()
    }

    fun getToken(): String? {
        return prefs.getString(TOKEN_KEY, null)
    }

    fun saveUser(user: User) {
        val userJson = gson.toJson(user)
        prefs.edit().putString(USER_KEY, userJson).apply()
    }

    fun getUser(): User? {
        val userJson = prefs.getString(USER_KEY, null)
        return if (userJson != null) gson.fromJson(userJson, User::class.java) else null
    }

    fun saveUserId(userId: UUID) {
        prefs.edit().putString(USER_ID_KEY, userId.toString()).apply()
    }

    fun getUserId(): UUID? {
        val userIdString = prefs.getString(USER_ID_KEY, null)
        return if (userIdString != null) UUID.fromString(userIdString) else null
    }

    fun clearToken() {
        prefs.edit().remove(TOKEN_KEY).remove(USER_KEY).remove(USER_ID_KEY).apply()
    }

    companion object {
        private const val PREF_NAME = "user_prefs"
        private const val TOKEN_KEY = "auth_token"
        private const val USER_KEY = "user"
        private const val USER_ID_KEY = "user_id"
    }
}