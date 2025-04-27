package edu.cit.projectsync.activities

import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.PopupWindow
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import edu.cit.projectsync.R
import edu.cit.projectsync.util.TokenManager

open class BaseActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    protected fun setupProfileDropdown() {
        val profileAvatar = findViewById<TextView>(R.id.profile_avatar) // Assuming it's a TextView
        val tokenManager = TokenManager(this)
        val user = tokenManager.getUser()

        // Set the initials of the user's first and last name
        if (user != null) {
            val initials = "${user.firstName?.firstOrNull()?.uppercase() ?: ""}${
                user.lastName?.firstOrNull()?.uppercase() ?: ""}"
            profileAvatar?.text = initials
        }

        profileAvatar?.setOnClickListener { view ->
            showCustomDropdown(view)
        }
    }

    protected fun setupNavigation(selectedItemId: Int) {
        // Highlight the current page
        highlightCurrentPage(selectedItemId)

        // Set click listeners for navigation items
        findViewById<LinearLayout>(R.id.nav_home)?.setOnClickListener {
            if (selectedItemId != R.id.nav_home) {
                val intent = Intent(this, HomeActivity::class.java)
                startActivity(intent)
                applyCustomTransition()
                finish() // Close the current activity
            }
        }
        findViewById<LinearLayout>(R.id.nav_projects)?.setOnClickListener {
            if (selectedItemId != R.id.nav_projects) {
                val intent = Intent(this, ProjectsActivity::class.java)
                startActivity(intent)
                applyCustomTransition()
                finish()
            }
        }
        findViewById<LinearLayout>(R.id.nav_calendar)?.setOnClickListener {
            if (selectedItemId != R.id.nav_calendar) {
                // Add intent for CalendarActivity if needed
                // If implemented, add applyCustomTransition() after startActivity()
            }
        }
        findViewById<LinearLayout>(R.id.nav_tasks)?.setOnClickListener {
            if (selectedItemId != R.id.nav_tasks) {
                val intent = Intent(this, TasksActivity::class.java)
                startActivity(intent)
                applyCustomTransition()
                finish()
            }
        }
    }

    private fun applyCustomTransition() {
        // Apply the custom transition animations
        overridePendingTransition(R.anim.fade_in, R.anim.fade_out)
    }

    private fun highlightCurrentPage(selectedItemId: Int) {
        val navigationItems = listOf(
            R.id.nav_home,
            R.id.nav_projects,
            R.id.nav_calendar,
            R.id.nav_tasks,
        )
        for (itemId in navigationItems) {
            val view = findViewById<View>(itemId)
            view?.isSelected = false // Only set isSelected if the view exists
        }
        findViewById<View>(selectedItemId)?.isSelected = true
    }

    private fun showCustomDropdown(anchorView: View) {
        // Inflate the dropdown layout
        val dropdownView = layoutInflater.inflate(R.layout.profile_dropdown, null)

        // Retrieve user details from TokenManager
        val tokenManager = TokenManager(this)
        val user = tokenManager.getUser()

        // Set the user's full name and email in the dropdown
        val fullNameTextView = dropdownView.findViewById<TextView>(R.id.dropdown_fullName)
        val emailTextView = dropdownView.findViewById<TextView>(R.id.dropdown_email)

        if (user != null) {
            fullNameTextView.text = "${user.firstName} ${user.lastName}"
            emailTextView.text = user.email
        } else {
            fullNameTextView.text = "Guest"
            emailTextView.text = "guest@example.com"
        }

        // Create a popup window
        val popupWindow = PopupWindow(
            dropdownView,
            ViewGroup.LayoutParams.WRAP_CONTENT,
            ViewGroup.LayoutParams.WRAP_CONTENT,
            true
        )

        // Set elevation for the popup (for API 21+)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            popupWindow.elevation = 10f
        }

        // Set click listeners for options
        val profileOption = dropdownView.findViewById<LinearLayout>(R.id.profile_option)
        val logoutOption = dropdownView.findViewById<LinearLayout>(R.id.logout_option)

        profileOption.setOnClickListener {
            // Navigate to profile screen
            startActivity(Intent(this, ProfileActivity::class.java))
            popupWindow.dismiss()
        }

        logoutOption.setOnClickListener {
            // Clear user session or token
            tokenManager.clearToken()

            // Navigate to login screen
            startActivity(Intent(this, LoginActivity::class.java))
            finishAffinity() // Close all activities in the stack
            popupWindow.dismiss()
        }

        // Show the popup below the anchor view
        popupWindow.showAsDropDown(
            anchorView,
            -popupWindow.contentView.measuredWidth + anchorView.width,
            0
        )
    }
}