package edu.cit.projectsync.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.switchmaterial.SwitchMaterial
import edu.cit.projectsync.R
import edu.cit.projectsync.adapters.TaskAdapter
import edu.cit.projectsync.api.TaskApi
import edu.cit.projectsync.api.TaskRetrofitClient
import edu.cit.projectsync.models.Project
import edu.cit.projectsync.models.Task
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.util.UUID

class ProjectTableFragment : Fragment() {

    private lateinit var project: Project
    private val tasks = mutableListOf<Task>()
    private var fetchTasksCall: Call<List<Task>>? = null

    private lateinit var taskRecyclerView: RecyclerView
    private lateinit var emptyTasksContainer: LinearLayout
    private lateinit var taskAdapter: TaskAdapter
    private lateinit var visibilitySwitch: SwitchMaterial
    private lateinit var visibilityText: TextView

    private var showCompletedTasks = false // Tracks the state of the switch

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        val view = inflater.inflate(R.layout.fragment_project_table, container, false)

        // Initialize views
        taskRecyclerView = view.findViewById(R.id.task_taskContainer)
        emptyTasksContainer = view.findViewById(R.id.task_empty_tasks_container)
        visibilitySwitch = view.findViewById(R.id.visibility_switch)
        visibilityText = view.findViewById(R.id.visibility_text)

        // Set up RecyclerView
        setupRecyclerView()

        // Set up visibility switch
        setupVisibilitySwitch()

        // Fetch tasks for the project
        fetchTasksAssignedToProject(project.projectId)

        return view
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        arguments?.let {
            project = it.getSerializable(ARG_PROJECT) as Project // Retrieve the Project object
        }
    }

    private fun setupRecyclerView() {
        taskAdapter = TaskAdapter(tasks)
        taskRecyclerView.layoutManager = LinearLayoutManager(requireContext())
        taskRecyclerView.adapter = taskAdapter
    }

    private fun setupVisibilitySwitch() {
        visibilitySwitch.setOnCheckedChangeListener { _, isChecked ->
            showCompletedTasks = isChecked
            updateVisibilityText()
            filterTasks()
        }
    }

    private fun updateVisibilityText() {
        if (showCompletedTasks) {
            visibilityText.text = "Showing completed tasks"
        } else {
            visibilityText.text = "Hiding completed tasks"
        }
    }

    private fun filterTasks() {
        val filteredTasks = if (showCompletedTasks) {
            tasks // Show all tasks
        } else {
            tasks.filter { it.status.lowercase() != "done" } // Exclude tasks with status "done"
        }

        taskAdapter.updateTasks(filteredTasks)
        if (filteredTasks.isEmpty()) {
            showEmptyState()
        } else {
            showTasks()
        }
    }

    private fun fetchTasksAssignedToProject(projectId: UUID) {
        val taskApi = TaskRetrofitClient.create(TaskApi::class.java)

        fetchTasksCall = taskApi.getTasksByProjectId(projectId)
        fetchTasksCall?.enqueue(object : Callback<List<Task>> {
            override fun onResponse(call: Call<List<Task>>, response: Response<List<Task>>) {
                if (!isAdded) return

                if (response.isSuccessful) {
                    val fetchedTasks = response.body()
                    if (!fetchedTasks.isNullOrEmpty()) {
                        tasks.clear()
                        tasks.addAll(fetchedTasks)
                        filterTasks() // Apply the filter based on the switch state
                    } else {
                        showEmptyState()
                    }
                } else {
                    Toast.makeText(requireContext(), "Failed to fetch tasks", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<List<Task>>, t: Throwable) {
                if (isAdded) {
                    Toast.makeText(requireContext(), "Error: ${t.message}", Toast.LENGTH_SHORT).show()
                }
            }
        })
    }

    private fun showTasks() {
        taskRecyclerView.visibility = View.VISIBLE
        emptyTasksContainer.visibility = View.GONE
    }

    private fun showEmptyState() {
        taskRecyclerView.visibility = View.GONE
        emptyTasksContainer.visibility = View.VISIBLE
    }

    override fun onDestroyView() {
        super.onDestroyView()
        fetchTasksCall?.cancel()
    }

    companion object {
        const val ARG_PROJECT = "arg_project" // Key for passing the Project object

        fun newInstance(project: Project): ProjectTableFragment {
            val fragment = ProjectTableFragment()
            val args = Bundle()
            args.putSerializable(ARG_PROJECT, project) // Pass the Project object as a Serializable
            fragment.arguments = args
            return fragment
        }
    }
}