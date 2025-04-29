package edu.cit.projectsync.fragments

import android.content.ClipData
import android.os.Bundle
import android.view.DragEvent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import edu.cit.projectsync.R
import edu.cit.projectsync.api.TaskApi
import edu.cit.projectsync.api.TaskRetrofitClient
import edu.cit.projectsync.models.Project
import edu.cit.projectsync.models.Task
import edu.cit.projectsync.util.TokenManager
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.util.UUID

class ProjectBoardFragment : Fragment() {

    private lateinit var tokenManager: TokenManager
    private lateinit var todoContainer: LinearLayout
    private lateinit var inProgressContainer: LinearLayout
    private lateinit var doneContainer: LinearLayout
    private lateinit var todoTaskCount: TextView
    private lateinit var inProgressTaskCount: TextView
    private lateinit var doneTaskCount: TextView
    private var fetchTasksCall: Call<List<Task>>? = null
    private val tasks = mutableListOf<Task>() // Store tasks locally for updates
    private lateinit var project: Project

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        arguments?.let {
            project = it.getSerializable(ARG_PROJECT) as Project // Retrieve the Project object
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_tasks_board, container, false)

        // Initialize TokenManager
        tokenManager = TokenManager(requireContext())

        // Initialize views
        todoContainer = view.findViewById(R.id.todoBoard_task_container)
        inProgressContainer = view.findViewById(R.id.inprogressBoard_task_container)
        doneContainer = view.findViewById(R.id.doneBoard_task_container)
        todoTaskCount = view.findViewById(R.id.todo_board_taskCount)
        inProgressTaskCount = view.findViewById(R.id.inProgress_board_taskCount)
        doneTaskCount = view.findViewById(R.id.done_board_taskCount)

        // Set drag listeners on containers
        setDragListeners()

        // Fetch and display tasks assigned to the project
        fetchTasksAssignedToProject(project.projectId)

        return view
    }

    private fun setDragListeners() {
        val dragListener = View.OnDragListener { view, event ->
            when (event.action) {
                DragEvent.ACTION_DRAG_STARTED -> true
                DragEvent.ACTION_DRAG_ENTERED -> {
                    view.setBackgroundResource(R.color.drag_highlight) // Highlight container
                    true
                }
                DragEvent.ACTION_DRAG_EXITED -> {
                    view.setBackgroundResource(android.R.color.transparent) // Remove highlight
                    true
                }
                DragEvent.ACTION_DROP -> {
                    view.setBackgroundResource(android.R.color.transparent) // Remove highlight
                    val taskId = event.clipData.getItemAt(0).text.toString()
                    val newStatus = when (view.id) {
                        R.id.todoBoard_task_container -> "to-do"
                        R.id.inprogressBoard_task_container -> "in-progress"
                        R.id.doneBoard_task_container -> "done"
                        else -> return@OnDragListener false
                    }
                    updateTaskStatus(UUID.fromString(taskId), newStatus)
                    true
                }
                DragEvent.ACTION_DRAG_ENDED -> {
                    view.setBackgroundResource(android.R.color.transparent) // Remove highlight
                    true
                }
                else -> false
            }
        }

        todoContainer.setOnDragListener(dragListener)
        inProgressContainer.setOnDragListener(dragListener)
        doneContainer.setOnDragListener(dragListener)
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
                        displayTasksOnBoard(tasks)
                    } else {
                        clearTaskBoard()
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

    private fun displayTasksOnBoard(tasks: List<Task>) {
        if (!isAdded) return

        // Clear existing tasks
        todoContainer.removeAllViews()
        inProgressContainer.removeAllViews()
        doneContainer.removeAllViews()

        // Categorize tasks
        val todoTasks = tasks.filter { it.status.equals("to-do", ignoreCase = true) }
        val inProgressTasks = tasks.filter { it.status.equals("in-progress", ignoreCase = true) }
        val doneTasks = tasks.filter { it.status.equals("done", ignoreCase = true) }

        // Display tasks in respective columns
        displayTasksInColumn(todoTasks, todoContainer)
        displayTasksInColumn(inProgressTasks, inProgressContainer)
        displayTasksInColumn(doneTasks, doneContainer)

        // Update task counts
        todoTaskCount.text = todoTasks.size.toString()
        inProgressTaskCount.text = inProgressTasks.size.toString()
        doneTaskCount.text = doneTasks.size.toString()
    }

    private fun displayTasksInColumn(tasks: List<Task>, container: LinearLayout) {
        for (task in tasks) {
            val taskView = layoutInflater.inflate(R.layout.item_task_board, container, false)

            // Set task details
            val taskTitle = taskView.findViewById<TextView>(R.id.task_boardTitle)
            taskTitle.text = task.title

            // Enable dragging
            taskView.setOnLongClickListener {
                val clipData = ClipData.newPlainText("taskId", task.taskId.toString())
                val dragShadow = View.DragShadowBuilder(taskView)
                taskView.startDragAndDrop(clipData, dragShadow, null, 0)
                true
            }

            container.addView(taskView)
        }
    }

    private fun updateTaskStatus(taskId: UUID, newStatus: String) {
        val task = tasks.find { it.taskId == taskId }
        if (task != null) {
            // Update the task status locally
            task.status = newStatus
            displayTasksOnBoard(tasks) // Refresh the UI

            // Create the updated task object
            val updatedTask = Task(
                taskId = task.taskId,
                title = task.title,
                description = task.description,
                priority = task.priority,
                dueDate = task.dueDate,
                status = newStatus,
                project = task.project,
                assignedTo = task.assignedTo
            )

            // Update the task status on the server
            val taskApi = TaskRetrofitClient.create(TaskApi::class.java)
            taskApi.updateTaskStatus(taskId, updatedTask).enqueue(object : Callback<Task> {
                override fun onResponse(call: Call<Task>, response: Response<Task>) {
                    if (response.isSuccessful) {
                        Toast.makeText(requireContext(), "Task status updated successfully", Toast.LENGTH_SHORT).show()
                    } else {
                        Toast.makeText(requireContext(), "Failed to update task status", Toast.LENGTH_SHORT).show()
                    }
                }

                override fun onFailure(call: Call<Task>, t: Throwable) {
                    Toast.makeText(requireContext(), "Error: ${t.message}", Toast.LENGTH_SHORT).show()
                }
            })
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        fetchTasksCall?.cancel()
    }

    private fun clearTaskBoard() {
        todoContainer.removeAllViews()
        inProgressContainer.removeAllViews()
        doneContainer.removeAllViews()

        todoTaskCount.text = "0"
        inProgressTaskCount.text = "0"
        doneTaskCount.text = "0"
    }

    companion object {
        const val ARG_PROJECT = "arg_project" // Key for passing the Project object

        fun newInstance(project: Project): ProjectBoardFragment {
            val fragment = ProjectBoardFragment()
            val args = Bundle()
            args.putSerializable(ARG_PROJECT, project) // Pass the Project object as a Serializable
            fragment.arguments = args
            return fragment
        }
    }
}