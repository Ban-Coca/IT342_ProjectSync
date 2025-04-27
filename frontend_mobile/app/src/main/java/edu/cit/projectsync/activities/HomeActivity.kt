package edu.cit.projectsync.activities

import android.app.AlertDialog
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
import edu.cit.projectsync.api.UserRetrofitClient
import edu.cit.projectsync.api.TaskApi
import edu.cit.projectsync.api.TaskRetrofitClient
import edu.cit.projectsync.databinding.ActivityHomeBinding
import edu.cit.projectsync.model.Project
import edu.cit.projectsync.model.Task
import edu.cit.projectsync.util.TokenManager
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class HomeActivity : BaseActivity() {

    private lateinit var tokenManager: TokenManager
    private lateinit var taskContainer: LinearLayout
    private lateinit var emptyTasksContainer: View
    private lateinit var emptyProjectContainer: View
    private lateinit var projectContainer: LinearLayout

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home)

        tokenManager = TokenManager(this)

        // Initialize views
        taskContainer = findViewById(R.id.home_taskContainer)
        projectContainer = findViewById(R.id.home_projectContainer)
        emptyTasksContainer = findViewById(R.id.home_empty_tasks_container)
        emptyProjectContainer = findViewById(R.id.home_empty_projects_container)

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
            fetchProjectsByUser(userId.toString())
        } else {
            Toast.makeText(this, "User ID not found. Please log in again.", Toast.LENGTH_SHORT).show()
            redirectToLogin()
        }
    }

    override fun onBackPressed() {
        if (isTaskRoot) {
            // Show a confirmation dialog
            AlertDialog.Builder(this)
                .setTitle("Exit App")
                .setMessage("Are you sure you want to exit?")
                .setPositiveButton("Yes") { _, _ -> finishAffinity() }
                .setNegativeButton("No", null)
                .show()
        } else {
            super.onBackPressed()
        }
    }

    private fun fetchTasksAssignedToUser(userId: String) {
        val taskApi = TaskRetrofitClient.create(TaskApi::class.java)

        taskApi.getTasksAssignedToUser(userId).enqueue(object : Callback<List<Task>> {
            override fun onResponse(call: Call<List<Task>>, response: Response<List<Task>>) {
                Log.d("HomeActivity", "Tasks API Response Code: ${response.code()}")
                if (response.isSuccessful) {
                    val tasks = response.body()
                    if (tasks != null && tasks.isNotEmpty()) {
                        Log.d("HomeActivity", "Tasks received: $tasks")
                        displayTasks(tasks)
                    } else {
                        Log.d("HomeActivity", "No tasks found or response is null")
                        showEmptyTasksContainer()
                    }
                    Log.d("HomeActivity", "Tasks API Response Code: ${response.code()}")
                } else {
                    Log.e("HomeActivity", "Tasks API call failed with code: ${response.code()}, error: ${response.errorBody()?.string()}")
                    Toast.makeText(this@HomeActivity, "Failed to fetch tasks", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<List<Task>>, t: Throwable) {
                Log.e("HomeActivity", "Tasks API call failed: ${t.message}")
                Toast.makeText(this@HomeActivity, "Error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
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
                    Toast.makeText(this@HomeActivity, "Failed to fetch projects", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<List<Project>>, t: Throwable) {
                Log.e("HomeActivity", "Projects API call failed: ${t.message}")
                Toast.makeText(this@HomeActivity, "Error: ${t.message}", Toast.LENGTH_SHORT).show()
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
            val projectView = layoutInflater.inflate(R.layout.home_project_card, projectContainer, false)

            // Set project details
            val projectName = projectView.findViewById<TextView>(R.id.home_projectName)
            val projectDetails = projectView.findViewById<TextView>(R.id.home_projectDetails)

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

    private fun displayTasks(tasks: List<Task>) {
        // Hide the empty tasks container
        emptyTasksContainer.visibility = View.GONE

        // Clear the task container
        taskContainer.removeAllViews()

        // Inflate and populate the task cards
        for (task in tasks) {
            val taskView = layoutInflater.inflate(R.layout.home_task_card, taskContainer, false)

            // Set task details
            val taskName = taskView.findViewById<TextView>(R.id.home_taskName)
            val taskDescription = taskView.findViewById<TextView>(R.id.home_taskDescription)
            val taskStatus = taskView.findViewById<TextView>(R.id.home_taskStatus)

            taskName.text = task.title
            taskDescription.text = task.description

            // Set priority background based on the priority level
            when (task.status.lowercase()) {
                "to-do" -> {
                    taskStatus.text = "To-do"
                    taskStatus.setBackgroundResource(R.drawable.rounded_status_todo)
                    taskStatus.setTextColor(R.color.status_todo_text)
                }
                "in-progress" -> {
                    taskStatus.text = "In-Progress"
                    taskStatus.setBackgroundResource(R.drawable.rounded_status_inprogress)
                    taskStatus.setTextColor(R.color.status_in_progress_text)
                }
                "done" -> {
                    taskStatus.text = "Done"
                    taskStatus.setBackgroundResource(R.drawable.rounded_status_done)
                    taskStatus.setTextColor(R.color.status_done_text)
                }
                else -> {
                    taskStatus.text = "Unknown"
                    taskStatus.setBackgroundResource(R.drawable.ic_status_todo) // Default to low
                }
            }

            // Optionally, set a click listener for the task card
            taskView.setOnClickListener {
                Toast.makeText(this, "Clicked on task: ${task.title}", Toast.LENGTH_SHORT).show()
                // Navigate to task details if needed
            }

            // Add the task card to the container
            taskContainer.addView(taskView)
        }
    }

    private fun showEmptyTasksContainer() {
        // Show the empty tasks container
        emptyTasksContainer.visibility = View.VISIBLE

        // Clear the task container
        taskContainer.removeAllViews()
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