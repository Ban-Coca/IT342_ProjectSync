package edu.cit.projectsync.activities

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Toast
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import edu.cit.projectsync.R
import edu.cit.projectsync.adapters.ProjectAdapter
import edu.cit.projectsync.api.ProjectApi
import edu.cit.projectsync.api.ProjectRetrofitClient
import edu.cit.projectsync.models.Project
import edu.cit.projectsync.util.TokenManager
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.util.UUID
import kotlin.math.log

class ProjectsActivity : BaseActivity() {

    private lateinit var tokenManager: TokenManager
    private lateinit var recyclerView: RecyclerView
    private lateinit var emptyProjectContainer: View
    private lateinit var swipeRefreshLayout: androidx.swiperefreshlayout.widget.SwipeRefreshLayout


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_projects)

        emptyProjectContainer = findViewById(R.id.project_empty_projects_container)
        recyclerView = findViewById(R.id.recycler_view)

        tokenManager = TokenManager(this)

        // Get the User object
        val user = tokenManager.getUser()

        // Setup navigation and highlight Projects
        setupNavigation(R.id.nav_projects)

        setupProfileDropdown()

        // Fetch and display tasks and projects assigned to the user
        val userId = user?.userId
        if (userId != null) {
            fetchProjectsByUser(userId)
        } else {
            redirectToLogin()
        }
        // Initialize SwipeRefreshLayout
        swipeRefreshLayout = findViewById(R.id.swipe_refresh_layout)
        swipeRefreshLayout.setOnRefreshListener {
            refreshActivity() // Call the refresh method from BaseActivity
        }
    }

    private fun fetchProjectsByUser(userId: UUID) {
        val projectApi = ProjectRetrofitClient.create(ProjectApi::class.java)
        Log.d("ProjectsActivity", "Fetching projects for userId: $userId")
        projectApi.getProjectsByUser(userId).enqueue(object : Callback<List<Project>> {
            override fun onResponse(call: Call<List<Project>>, response: Response<List<Project>>) {
                Log.d("ProjectsActivity", "Projects API Response Code: ${response.code()}")
                if (response.isSuccessful) {
                    val projects = response.body()
                    if (projects != null && projects.isNotEmpty()) {
                        Log.d("ProjectsActivity", "Projects received: $projects")
                        displayProjects(projects)
                    } else {
                        Log.d("ProjectsActivity", "No projects found or response is null")
                        showEmptyProjectsContainer()
                    }
                } else {
                    Log.e("ProjectsActivity", "Projects API call failed with code: ${response.code()}, error: ${response.errorBody()?.string()}")
                    Toast.makeText(this@ProjectsActivity, "Failed to fetch projects", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<List<Project>>, t: Throwable) {
                Log.e("ProjectsActivity", "Projects API call failed: ${t.message}")
                Toast.makeText(this@ProjectsActivity, "Error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun displayProjects(projects: List<Project>) {
        // Hide the empty projects container
        emptyProjectContainer.visibility = View.GONE

        // Set up the RecyclerView with the ProjectAdapter
        recyclerView.layoutManager = LinearLayoutManager(this)
        recyclerView.adapter = ProjectAdapter(projects) { project ->
            // Navigate to ProjectDetailsActivity with the projectId
            val intent = Intent(this, ProjectDetailsActivity::class.java)
            intent.putExtra("projectId", project.projectId.toString()) // Pass the projectId
            Log.e("ProjectsActivity","Project Id: ${project.projectId}")
            startActivity(intent)
        }
    }

    private fun showEmptyProjectsContainer() {
        emptyProjectContainer.visibility = View.VISIBLE
    }

    private fun redirectToLogin() {
        val intent = Intent(this, LoginActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        startActivity(intent)
        finish()
    }
}