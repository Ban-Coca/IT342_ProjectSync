package edu.cit.projectsync.activities

import android.os.Bundle
import android.util.Log
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import edu.cit.projectsync.R
import edu.cit.projectsync.api.ProjectApi
import edu.cit.projectsync.api.ProjectRetrofitClient
import edu.cit.projectsync.fragments.ProjectBoardFragment
import edu.cit.projectsync.fragments.ProjectOverviewFragment
import edu.cit.projectsync.models.Project
import java.util.UUID
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class ProjectDetailsActivity : BaseActivity() {

    private lateinit var project: Project
    private lateinit var projectName: TextView
    private lateinit var swipeRefreshLayout: androidx.swiperefreshlayout.widget.SwipeRefreshLayout

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_project_details)

        // Initialize the project name TextView
        projectName = findViewById(R.id.project_Name)

        // Retrieve the projectId from the intent
        val projectId = intent.getStringExtra("projectId")
        Log.e("ProjectDetailsActivity", "Project Id: $projectId")
        if (projectId != null) {
            fetchProjectDetails(UUID.fromString(projectId))
        } else {
            Toast.makeText(this, "Project ID not found", Toast.LENGTH_SHORT).show()
            finish() // Close the activity if no projectId is provided
        }

        setupProfileDropdown()
        // Setup navigation and highlight Projects
        setupNavigation(R.id.nav_projects)

        // Set up tab navigation
        setupTabNavigation()

        // Initialize SwipeRefreshLayout
        swipeRefreshLayout = findViewById(R.id.swipe_refresh_layout)
        swipeRefreshLayout.setOnRefreshListener {
            refreshActivity() // Call the refresh method from BaseActivity
        }
    }

    private fun fetchProjectDetails(projectId: UUID) {
        val projectApi = ProjectRetrofitClient.create(ProjectApi::class.java)

        projectApi.getProjectById(projectId).enqueue(object : Callback<Project> {
            override fun onResponse(call: Call<Project>, response: Response<Project>) {
                if (response.isSuccessful) {
                    val project = response.body()
                    if (project != null) {
                        this@ProjectDetailsActivity.project = project
                        displayProjectDetails(project)

                        // Update the project name after the project is fetched
                        projectName.text = project.name
                    } else {
                        Toast.makeText(this@ProjectDetailsActivity, "Project not found", Toast.LENGTH_SHORT).show()
                    }
                } else {
                    Toast.makeText(this@ProjectDetailsActivity, "Failed to fetch project details", Toast.LENGTH_SHORT).show()
                    Log.e("ProjectDetailsActivity", "Error: ${response.errorBody()?.string()}")
                }
            }

            override fun onFailure(call: Call<Project>, t: Throwable) {
                Toast.makeText(this@ProjectDetailsActivity, "Error: ${t.message}", Toast.LENGTH_SHORT).show()
                Log.e("ProjectDetailsActivity", "API call failed: ${t.message}")
            }
        })
    }

    private fun displayProjectDetails(project: Project) {
        val fragment = ProjectOverviewFragment.newInstance(project)
        loadFragment(fragment)
    }

    private fun setupTabNavigation() {
        val tabOverview = findViewById<ImageView>(R.id.tab_overview)
        val tabTable = findViewById<ImageView>(R.id.tab_table)
        val tabBoard = findViewById<ImageView>(R.id.tab_board)
        val tabCalendar = findViewById<ImageView>(R.id.tab_calendar)
        val tabFiles = findViewById<ImageView>(R.id.tab_files)

        // List of all tabs for resetting highlights
        val tabs = listOf(tabOverview, tabTable, tabBoard, tabCalendar, tabFiles)

        // Helper function to reset all tab highlights
        fun resetTabHighlights() {
            tabs.forEach { tab ->
                tab.setBackgroundResource(android.R.color.black) // Reset background
                tab.setColorFilter(
                    resources.getColor(R.color.white, theme), // Replace with your desired color
                    android.graphics.PorterDuff.Mode.SRC_IN
                )
            }
        }

        // Highlight the selected tab
        fun highlightTab(selectedTab: ImageView) {
            resetTabHighlights()
            // Apply a tint color to the selected tab
            selectedTab.setColorFilter(
                resources.getColor(R.color.black, theme), // Replace with your desired color
                android.graphics.PorterDuff.Mode.SRC_IN
            )
            selectedTab.setBackgroundResource(R.drawable.rounded_button_white) // Add your custom highlight drawable
        }

        tabOverview.setOnClickListener {
            highlightTab(tabOverview)
            loadFragment(ProjectOverviewFragment.newInstance(project))
        }

        tabTable.setOnClickListener {
            highlightTab(tabTable)
            Toast.makeText(this, "Table tab clicked", Toast.LENGTH_SHORT).show()
            // Add navigation logic for the Table tab here
        }

        tabBoard.setOnClickListener {
            highlightTab(tabBoard)
            loadFragment(ProjectBoardFragment.newInstance(project))
        }

        tabCalendar.setOnClickListener {
            highlightTab(tabCalendar)
            Toast.makeText(this, "Calendar tab clicked", Toast.LENGTH_SHORT).show()
            // Add navigation logic for the Calendar tab here
        }

        tabFiles.setOnClickListener {
            highlightTab(tabFiles)
            Toast.makeText(this, "Files tab clicked", Toast.LENGTH_SHORT).show()
            // Add navigation logic for the Files tab here
        }

        // Set default tab highlight (e.g., Overview tab)
        highlightTab(tabOverview)
    }

    private fun loadFragment(fragment: Fragment) {
        supportFragmentManager.beginTransaction()
            .replace(R.id.project_description_tab, fragment)
            .commit()
    }
}