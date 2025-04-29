package edu.cit.projectsync.activities

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import edu.cit.projectsync.R

class SplashActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_splashscreen)
        // Navigate to the main activity after the splash screen
        startActivity(Intent(this, HomeActivity::class.java))
        finish() // Close the splash activity
    }
}