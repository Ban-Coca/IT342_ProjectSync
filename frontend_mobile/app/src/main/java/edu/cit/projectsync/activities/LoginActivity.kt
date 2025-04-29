package edu.cit.projectsync.activities

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import com.google.android.material.button.MaterialButton
import edu.cit.projectsync.R
import edu.cit.projectsync.api.UserRetrofitClient
import edu.cit.projectsync.api.UserApi
import edu.cit.projectsync.models.User
import edu.cit.projectsync.util.TokenManager
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.util.UUID

class LoginActivity : Activity() {

    private lateinit var tokenManager: TokenManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        tokenManager = TokenManager(this)

        // Check if the user is already logged in
        if (tokenManager.getToken() != null) {
            // Redirect to HomeActivity
            val intent = Intent(this, HomeActivity::class.java)
            startActivity(intent)
            finish()
            return
        }

        val edittextEmail = findViewById<EditText>(R.id.emailLoginInput)
        val edittextPassword = findViewById<EditText>(R.id.passwordInput)

        val buttonLogin = findViewById<MaterialButton>(R.id.loginButton)
        buttonLogin.setOnClickListener {
            val email = edittextEmail.text.toString().trim()
            val password = edittextPassword.text.toString().trim()

            if (email.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Email and Password cannot be empty", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            // Call the login API
            loginUser(email, password)
        }

        val buttonForgotPassword = findViewById<TextView>(R.id.forgotPasswordLink)
        buttonForgotPassword.setOnClickListener {
            val intent = Intent(this, ForgotActivity::class.java)
            startActivity(intent)
        }

        val buttonRegister = findViewById<TextView>(R.id.registerButton)
        buttonRegister.setOnClickListener {
            val intent = Intent(this, RegisterActivity::class.java)
            startActivity(intent)
        }
    }
    private fun loginUser(email: String, password: String) {
        val userApi = UserRetrofitClient.create(UserApi::class.java)
        val loginRequest = mapOf("email" to email, "password" to password)

        userApi.login(loginRequest).enqueue(object : Callback<Map<String, Any>> {
            override fun onResponse(call: Call<Map<String, Any>>, response: Response<Map<String, Any>>) {
                if (response.isSuccessful) {
                    val responseBody = response.body()
                    val token = responseBody?.get("token") as? String
                    val user = responseBody?.get("user") as? Map<String, Any>

                    if (token != null && user != null) {
                        // Create a User object
                        val userId = UUID.fromString(user["userId"] as? String)
                        val firstName = user["firstName"] as? String ?: ""
                        val lastName = user["lastName"] as? String ?: ""
                        val email = user["email"] as? String ?: ""

                        val userObject = User(userId, email, firstName, lastName)

                        // Save the token and user object
                        tokenManager.saveToken(token)
                        tokenManager.saveUser(userObject)

                        // Navigate to HomeActivity
                        val intent = Intent(this@LoginActivity, HomeActivity::class.java)
                        startActivity(intent)
                        finish()
                    } else {
                        Toast.makeText(this@LoginActivity, "Invalid response from server", Toast.LENGTH_SHORT).show()
                    }
                } else {
                    if (response.code() == 401) {
                        Toast.makeText(this@LoginActivity, "Email or password does not match", Toast.LENGTH_SHORT).show()
                    } else {
                        val errorMessage = response.errorBody()?.string() ?: "Unknown error"
                        Toast.makeText(this@LoginActivity, "Login failed: $errorMessage", Toast.LENGTH_SHORT).show()
                    }
                }
            }

            override fun onFailure(call: Call<Map<String, Any>>, t: Throwable) {
                Toast.makeText(this@LoginActivity, "Error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }
}