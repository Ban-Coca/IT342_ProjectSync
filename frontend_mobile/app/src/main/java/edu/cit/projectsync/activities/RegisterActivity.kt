package edu.cit.projectsync.activities

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.widget.CheckBox
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import com.google.android.material.button.MaterialButton
import edu.cit.projectsync.R
import edu.cit.projectsync.api.UserRetrofitClient
import edu.cit.projectsync.api.UserApi
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class RegisterActivity : Activity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register)

        val edittextFirstName = findViewById<EditText>(R.id.fNameInput)
        val edittextLastName = findViewById<EditText>(R.id.lnameInput)
        val edittextEmail = findViewById<EditText>(R.id.emailRegisterInput)
        val edittextPassword = findViewById<EditText>(R.id.passwordInput)
        val edittextConfirmPassword = findViewById<EditText>(R.id.confirmPasswordInput)
        val checkboxAgree = findViewById<CheckBox>(R.id.AgreeBox)

        val buttonRegister = findViewById<MaterialButton>(R.id.registerButton)
        buttonRegister.setOnClickListener {
            val firstName = edittextFirstName.text.toString().trim()
            val lastName = edittextLastName.text.toString().trim()
            val email = edittextEmail.text.toString().trim()
            val password = edittextPassword.text.toString()
            val confirmPassword = edittextConfirmPassword.text.toString()

            if (firstName.isEmpty() || lastName.isEmpty() || email.isEmpty() || password.isEmpty() || confirmPassword.isEmpty()) {
                Toast.makeText(this, "All fields are required", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            if (password != confirmPassword) {
                Toast.makeText(this, "Passwords do not match", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            if (!checkboxAgree.isChecked) {
                Toast.makeText(this, "You must agree to the terms and conditions", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            // Call the register API
            registerUser(firstName, lastName, email, password)
        }

        val textviewSignin = findViewById<TextView>(R.id.register_loginButton)
        textviewSignin.setOnClickListener{
            intent = Intent(this, LoginActivity::class.java)
            startActivity(intent)
            finish()
        }
    }

    private fun registerUser(firstName: String, lastName: String, email: String, password: String) {
        val userApi = UserRetrofitClient.create(UserApi::class.java)
        val registerRequest = mapOf(
            "firstName" to firstName,
            "lastName" to lastName,
            "email" to email,
            "password" to password
        )

        userApi.register(registerRequest).enqueue(object : Callback<Map<String, Any>> {
            override fun onResponse(call: Call<Map<String, Any>>, response: Response<Map<String, Any>>) {
                if (response.isSuccessful) {
                    Toast.makeText(this@RegisterActivity, "Registration successful!", Toast.LENGTH_SHORT).show()

                    // Navigate to LoginActivity
                    val intent = Intent(this@RegisterActivity, LoginActivity::class.java)
                    startActivity(intent)
                    finish()
                } else {
                    val errorMessage = response.errorBody()?.string() ?: "Unknown error"
                    Toast.makeText(this@RegisterActivity, "Registration failed: $errorMessage", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<Map<String, Any>>, t: Throwable) {
                Toast.makeText(this@RegisterActivity, "Error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }
}