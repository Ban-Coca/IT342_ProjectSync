package edu.cit.projectsync.activities

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import com.google.android.material.button.MaterialButton
import edu.cit.projectsync.R

class ForgotActivity: Activity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_forgotpassword)

        val button_login = findViewById<MaterialButton>(R.id.backToSignin)
        button_login.setOnClickListener{
            intent = Intent(this, LoginActivity::class.java)
            startActivity(intent)
        }

        val button_signup = findViewById<MaterialButton>(R.id.backToSignup)
        button_signup.setOnClickListener{
            intent = Intent(this, RegisterActivity::class.java)
            startActivity(intent)
        }
    }
}