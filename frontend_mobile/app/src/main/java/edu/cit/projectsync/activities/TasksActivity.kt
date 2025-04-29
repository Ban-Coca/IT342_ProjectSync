package edu.cit.projectsync.activities

import android.content.Intent
import android.os.Bundle
import android.widget.TextView
import android.widget.Toast
import androidx.core.content.ContentProviderCompat.requireContext
import androidx.fragment.app.Fragment
import edu.cit.projectsync.R
import edu.cit.projectsync.fragments.TasksBoardFragment
import edu.cit.projectsync.fragments.TasksCalendarFragment
import edu.cit.projectsync.fragments.TasksTableFragment
import edu.cit.projectsync.util.TokenManager

class TasksActivity : BaseActivity() {

    private lateinit var tokenManager: TokenManager
    private lateinit var tabTable: TextView
    private lateinit var tabBoard: TextView
    private lateinit var tabCalendar: TextView
    private lateinit var swipeRefreshLayout: androidx.swiperefreshlayout.widget.SwipeRefreshLayout


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_tasks)

        // Initialize TokenManager
        tokenManager = TokenManager(this)

        // Initialize tabs
        tabTable = findViewById(R.id.tab_table)
        tabBoard = findViewById(R.id.tab_board)
        tabCalendar = findViewById(R.id.tab_calendar)

        // Fetch and display tasks assigned to the user
        val user = tokenManager.getUser()
        val userId = user?.userId

        if (userId != null) {
            loadFragment(TasksTableFragment())
        } else {
            redirectToLogin()
        }

        // Initialize SwipeRefreshLayout
        swipeRefreshLayout = findViewById(R.id.swipe_refresh_layout)
        swipeRefreshLayout.setOnRefreshListener {
            refreshActivity() // Call the refresh method from BaseActivity
        }

        // Set click listeners for tabs
        tabTable.setOnClickListener {
            loadFragment(TasksTableFragment())
            highlightTab(tabTable)
        }

        tabBoard.setOnClickListener {
            loadFragment(TasksBoardFragment())
            highlightTab(tabBoard)
        }

        tabCalendar.setOnClickListener {
            loadFragment(TasksCalendarFragment())
            highlightTab(tabCalendar)
        }


        // Setup navigation and highlight Tasks
        setupNavigation(R.id.nav_tasks)
        setupProfileDropdown()
    }

    private fun loadFragment(fragment: Fragment) {
        supportFragmentManager.beginTransaction()
            .replace(R.id.task_tab, fragment)
            .commit()
    }

    private fun highlightTab(selectedTab: TextView) {
        // Reset all tabs to default style
        tabTable.setBackgroundResource(0)
        tabBoard.setBackgroundResource(0)
        tabCalendar.setBackgroundResource(0)

        tabTable.setTextColor(resources.getColor(R.color.white))
        tabBoard.setTextColor(resources.getColor(R.color.white))
        tabCalendar.setTextColor(resources.getColor(R.color.white))

        // Highlight the selected tab
        selectedTab.setBackgroundResource(R.drawable.rounded_button_white)
        selectedTab.setTextColor(resources.getColor(R.color.black))
    }

    private fun redirectToLogin() {
        val intent = Intent(this, LoginActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        startActivity(intent)
        finish()
    }
}