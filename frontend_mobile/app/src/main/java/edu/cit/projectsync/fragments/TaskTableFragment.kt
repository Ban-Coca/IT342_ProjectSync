package edu.cit.projectsync.fragments

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import edu.cit.projectsync.R
import edu.cit.projectsync.activities.LoginActivity
import edu.cit.projectsync.adapters.TaskBoardAdapter
import edu.cit.projectsync.api.TaskApi
import edu.cit.projectsync.api.TaskRetrofitClient
import edu.cit.projectsync.models.Task
import edu.cit.projectsync.util.TokenManager
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class TasksTableFragment : Fragment() {

    private lateinit var tokenManager: TokenManager
    private lateinit var recyclerView: RecyclerView
    private lateinit var emptyTasksContainer: View

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        val view = inflater.inflate(R.layout.fragment_tasks_table, container, false)

        // Initialize TokenManager
        tokenManager = TokenManager(requireContext())

        // Initialize views
        recyclerView = view.findViewById(R.id.task_taskContainer)
        emptyTasksContainer = view.findViewById(R.id.task_empty_tasks_container)

        // Fetch and display tasks assigned to the user
        val user = tokenManager.getUser()
        val userId = user?.userId
        if (userId != null) {
            fetchTasksAssignedToUser(userId.toString())
        } else {
            Toast.makeText(requireContext(), "User ID not found. Please log in again.", Toast.LENGTH_SHORT).show()
            redirectToLogin()
        }

        return view
    }

    private fun fetchTasksAssignedToUser(userId: String) {
        val taskApi = TaskRetrofitClient.create(TaskApi::class.java)

        taskApi.getTasksAssignedToUser(userId).enqueue(object : Callback<List<Task>> {
            override fun onResponse(call: Call<List<Task>>, response: Response<List<Task>>) {
                if (!isAdded) return // Ensure the Fragment is still attached

                Log.d("TasksTableFragment", "Tasks API Response Code: ${response.code()}")
                if (response.isSuccessful) {
                    val tasks = response.body()
                    if (tasks != null && tasks.isNotEmpty()) {
                        Log.d("TasksTableFragment", "Tasks received: $tasks")
                        displayTasks(tasks)
                    } else {
                        Log.d("TasksTableFragment", "No tasks found or response is null")
                        showEmptyTasksContainer()
                    }
                } else {
                    Log.e("TasksTableFragment", "Tasks API call failed with code: ${response.code()}, error: ${response.errorBody()?.string()}")
                    if (isAdded) {
                        Toast.makeText(requireContext(), "Failed to fetch tasks", Toast.LENGTH_SHORT).show()
                    }
                }
            }

            override fun onFailure(call: Call<List<Task>>, t: Throwable) {
                if (!isAdded) return // Ensure the Fragment is still attached

                Log.e("TasksTableFragment", "Tasks API call failed: ${t.message}")
                if (isAdded) {
                    Toast.makeText(requireContext(), "Error: ${t.message}", Toast.LENGTH_SHORT).show()
                }
            }
        })
    }

    private fun displayTasks(tasks: List<Task>) {
        // Hide the empty tasks container
        emptyTasksContainer.visibility = View.GONE

        // Set up the RecyclerView
        recyclerView.visibility = View.VISIBLE
        recyclerView.layoutManager = LinearLayoutManager(requireContext())
        recyclerView.adapter = TaskBoardAdapter(requireContext(), tasks) { task ->

        }
    }

    private fun showEmptyTasksContainer() {
        // Show the empty tasks container
        emptyTasksContainer.visibility = View.VISIBLE

        // Hide the RecyclerView
        recyclerView.visibility = View.GONE
    }

    private fun redirectToLogin() {
        val intent = Intent(requireContext(), LoginActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        startActivity(intent)
    }
}