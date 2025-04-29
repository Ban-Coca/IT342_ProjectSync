package edu.cit.projectsync.activities

import android.app.AlertDialog
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.TextView
import android.widget.Toast
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import edu.cit.projectsync.R
import edu.cit.projectsync.adapters.HomeProjectAdapter
import edu.cit.projectsync.adapters.HomeTaskAdapter
import edu.cit.projectsync.adapters.ProjectAdapter
import edu.cit.projectsync.api.ProjectApi
import edu.cit.projectsync.api.ProjectRetrofitClient
import edu.cit.projectsync.api.TaskApi
import edu.cit.projectsync.api.TaskRetrofitClient
import edu.cit.projectsync.models.Project
import edu.cit.projectsync.models.Task
import edu.cit.projectsync.util.TokenManager
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.util.UUID

class HomeActivity : BaseActivity() {

    private lateinit var tokenManager: TokenManager
    private lateinit var projectRecyclerView: RecyclerView
    private lateinit var taskRecyclerView: RecyclerView
    private lateinit var emptyTasksContainer: View
    private lateinit var emptyProjectContainer: View
    private lateinit var swipeRefreshLayout: androidx.swiperefreshlayout.widget.SwipeRefreshLayout

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home)

        tokenManager = TokenManager(this)

        // Initialize views
        projectRecyclerView = findViewById(R.id.home_projectRecyclerView)
        taskRecyclerView = findViewById(R.id.home_taskRecyclerView)
        emptyTasksContainer = findViewById(R.id.home_empty_tasks_container)
        emptyProjectContainer = findViewById(R.id.home_empty_projects_container)

        // Initialize SwipeRefreshLayout
        swipeRefreshLayout = findViewById(R.id.swipe_refresh_layout)
        swipeRefreshLayout.setOnRefreshListener {
            refreshActivity() // Call the refresh method from BaseActivity
        }

        // Get the User object
        val user = tokenManager.getUser()
        val welcomeTextView = findViewById<TextView>(R.id.welcome_text)

        if (user != null) {
            welcomeTextView.text = "Welcome back, ${user.firstName}"
        } else {
            welcomeTextView.text = "Welcome!"
        }

        // Setup the profile dropdown
        setupProfileDropdown()

        // Setup navigation and highlight Home
        setupNavigation(R.id.nav_home)

        // Fetch and display tasks and projects assigned to the user
        val userId = user?.userId
        if (userId != null) {
            fetchTasksAssignedToUser(userId.toString())
            fetchProjectsByUser(userId)
        } else {
            redirectToLogin()
        }
    }

    private fun fetchTasksAssignedToUser(userId: String) {
        val taskApi = TaskRetrofitClient.create(TaskApi::class.java)

        taskApi.getTasksAssignedToUser(userId).enqueue(object : Callback<List<Task>> {
            override fun onResponse(call: Call<List<Task>>, response: Response<List<Task>>) {
                if (response.isSuccessful) {
                    val tasks = response.body()
                    if (tasks != null && tasks.isNotEmpty()) {
                        displayTasks(tasks)
                    } else {
                        showEmptyTasksContainer()
                    }
                } else {
                    Toast.makeText(this@HomeActivity, "Failed to fetch tasks", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<List<Task>>, t: Throwable) {
                Toast.makeText(this@HomeActivity, "Error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun fetchProjectsByUser(userId: UUID) {
        val projectApi = ProjectRetrofitClient.create(ProjectApi::class.java)

        projectApi.getProjectsByUser(userId).enqueue(object : Callback<List<Project>> {
            override fun onResponse(call: Call<List<Project>>, response: Response<List<Project>>) {
                if (response.isSuccessful) {
                    val projects = response.body()
                    if (projects != null && projects.isNotEmpty()) {
                        displayProjects(projects)
                    } else {
                        showEmptyProjectsContainer()
                    }
                } else {
                    Toast.makeText(this@HomeActivity, "Failed to fetch projects", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<List<Project>>, t: Throwable) {
                Toast.makeText(this@HomeActivity, "Error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun displayProjects(projects: List<Project>) {
        emptyProjectContainer.visibility = View.GONE
        projectRecyclerView.visibility = View.VISIBLE

        projectRecyclerView.layoutManager = LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false)
        projectRecyclerView.adapter = HomeProjectAdapter(projects) { project ->
            // Navigate to ProjectDetailsActivity with the projectId
            val intent = Intent(this, ProjectDetailsActivity::class.java)
            intent.putExtra("projectId", project.projectId.toString()) // Pass the projectId
            Log.e("ProjectsActivity","Project Id: ${project.projectId}")
            startActivity(intent)
        }
    }

    private fun displayTasks(tasks: List<Task>) {
        emptyTasksContainer.visibility = View.GONE
        taskRecyclerView.visibility = View.VISIBLE

        taskRecyclerView.layoutManager = LinearLayoutManager(this)
        taskRecyclerView.adapter = HomeTaskAdapter(tasks) { task ->
            Toast.makeText(this, "Clicked on task: ${task.title}", Toast.LENGTH_SHORT).show()
        }
    }

    private fun showEmptyTasksContainer() {
        emptyTasksContainer.visibility = View.VISIBLE
        taskRecyclerView.visibility = View.GONE
    }

    private fun showEmptyProjectsContainer() {
        emptyProjectContainer.visibility = View.VISIBLE
        projectRecyclerView.visibility = View.GONE
    }

    private fun redirectToLogin() {
        val intent = Intent(this, LoginActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        startActivity(intent)
        finish()
    }
}