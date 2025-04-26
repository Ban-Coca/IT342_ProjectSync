package edu.cit.projectsync.activities

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.button.MaterialButton
import edu.cit.projectsync.R

class LoginActivity : Activity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        val edittext_email = findViewById<EditText>(R.id.emailLoginInput)
        val edittext_password = findViewById<EditText>(R.id.passwordInput)

        val button_login = findViewById<MaterialButton>(R.id.loginButton)
            button_login.setOnClickListener{
                val email = edittext_email.text
                val password = edittext_password.text

                if (email.isNullOrEmpty() || password.isNullOrEmpty()){
                    Toast.makeText(this,"Email and Password cannot be empty",Toast.LENGTH_LONG).show()
                    return@setOnClickListener
                }

            }

        val button_forgotPassword = findViewById<TextView>(R.id.forgotPasswordLink)
            button_forgotPassword.setOnClickListener{
                val intent = Intent(this, ForgotActivity::class.java)
                startActivity(intent)
            }


        val button_register = findViewById<TextView>(R.id.registerButton)
            button_register.setOnClickListener{
                val intent = Intent(this,RegisterActivity::class.java)
                startActivity(intent)
            }
    }
}