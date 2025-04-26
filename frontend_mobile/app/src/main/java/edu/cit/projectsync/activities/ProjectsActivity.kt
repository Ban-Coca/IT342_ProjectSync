package edu.cit.projectsync.activities

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import edu.cit.projectsync.R
import edu.cit.projectsync.api.ProjectApi
import edu.cit.projectsync.api.ProjectRetrofitClient
import edu.cit.projectsync.model.Project
import edu.cit.projectsync.util.TokenManager
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class ProjectsActivity : BaseActivity() {

    private lateinit var tokenManager: TokenManager
    private lateinit var emptyProjectContainer: View
    private lateinit var projectContainer: LinearLayout

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_projects)

        emptyProjectContainer = findViewById(R.id.project_empty_projects_container)
        projectContainer = findViewById(R.id.projects_container)

        tokenManager = TokenManager(this)

        // Get the User object
        val user = tokenManager.getUser()


        // Setup navigation and highlight Projects
        setupNavigation(R.id.nav_projects)

        setupProfileDropdown()

        // Fetch and display tasks and projects assigned to the user
        val userId = user?.userId
        if (userId != null) {
            fetchProjectsByUser(userId.toString())
        } else {
            Toast.makeText(this, "User ID not found. Please log in again.", Toast.LENGTH_SHORT).show()
            redirectToLogin()
        }
    }

    private fun fetchProjectsByUser(userId: String) {
        val projectApi = ProjectRetrofitClient.create(ProjectApi::class.java)
        Log.d("HomeActivity", "Fetching tasks and projects for userId: $userId")
        projectApi.getProjectsByUser(userId).enqueue(object : Callback<List<Project>> {
            override fun onResponse(call: Call<List<Project>>, response: Response<List<Project>>) {
                Log.d("HomeActivity", "Projects API Response Code: ${response.code()}")
                if (response.isSuccessful) {
                    val projects = response.body()
                    if (projects != null && projects.isNotEmpty()) {
                        Log.d("HomeActivity", "Projects received: $projects")
                        displayProjects(projects)
                    } else {
                        Log.d("HomeActivity", "No projects found or response is null")
                        showEmptyProjectsContainer()
                    }
                    Log.d("HomeActivity", "Tasks API Response Code: ${response.code()}")
                    Log.d("HomeActivity", "Projects API Response Code: ${response.code()}")
                } else {
                    Log.e("HomeActivity", "Projects API call failed with code: ${response.code()}, error: ${response.errorBody()?.string()}")
                    Toast.makeText(this@ProjectsActivity, "Failed to fetch projects", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<List<Project>>, t: Throwable) {
                Log.e("HomeActivity", "Projects API call failed: ${t.message}")
                Toast.makeText(this@ProjectsActivity, "Error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun displayProjects(projects: List<Project>) {
        // Hide the empty projects container
        emptyProjectContainer.visibility = View.GONE

        // Clear the project container
        projectContainer.removeAllViews()

        // Inflate and populate the project cards
        for (project in projects) {
            val projectView = layoutInflater.inflate(R.layout.project_card, projectContainer, false)

            // Set project details
            val projectName = projectView.findViewById<TextView>(R.id.project_Name)
            val projectDetails = projectView.findViewById<TextView>(R.id.project_description)

            projectName.text = project.name
            projectDetails.text = project.description

            // Optionally, set a click listener for the project card
            projectView.setOnClickListener {
                Toast.makeText(this, "Clicked on project: ${project.name}", Toast.LENGTH_SHORT).show()
                // Navigate to project details if needed
            }

            // Add the project card to the container
            projectContainer.addView(projectView)
        }
    }

    private fun showEmptyProjectsContainer() {
        emptyProjectContainer.visibility = View.VISIBLE

        projectContainer.removeAllViews()
    }

    private fun redirectToLogin() {
        val intent = Intent(this, LoginActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        startActivity(intent)
        finish()
    }
}