package edu.cit.projectsync.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.GridLayout
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import edu.cit.projectsync.R
import edu.cit.projectsync.adapters.CalendarAdapter
import edu.cit.projectsync.api.TaskApi
import edu.cit.projectsync.api.TaskRetrofitClient
import edu.cit.projectsync.models.Project
import edu.cit.projectsync.models.Task
import edu.cit.projectsync.util.TokenManager
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale
import java.util.UUID

class ProjectCalendarFragment : Fragment() {

    private lateinit var tokenManager: TokenManager
    private lateinit var calendarGrid: GridLayout
    private lateinit var monthYearText: TextView
    private lateinit var tasksForDateText: TextView
    private lateinit var noTaskText: LinearLayout
    private lateinit var taskRecyclerView: RecyclerView
    private lateinit var taskAdapter: CalendarAdapter
    private var tasks: List<Task> = emptyList()
    private val taskMap = mutableMapOf<String, MutableList<Task>>() // Map tasks by deadline
    private val calendar = Calendar.getInstance()
    private var selectedDayView: TextView? = null
    private lateinit var project: Project

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        arguments?.let {
            project = it.getSerializable(ProjectCalendarFragment.ARG_PROJECT) as Project // Retrieve the Project object
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_tasks_calendar, container, false)

        // Initialize views
        calendarGrid = view.findViewById(R.id.task_calendar_container)
        monthYearText = view.findViewById(R.id.tv_month_year)
        tasksForDateText = view.findViewById(R.id.tv_tasks_for_date)
        noTaskText = view.findViewById(R.id.calendar_noTask)
        taskRecyclerView = view.findViewById(R.id.task_recycler_view)

        // Initialize RecyclerView
        taskAdapter = CalendarAdapter(emptyList())
        taskRecyclerView.layoutManager = LinearLayoutManager(requireContext())
        taskRecyclerView.adapter = taskAdapter

        // Set up month navigation
        view.findViewById<View>(R.id.btn_prev_month).setOnClickListener {
            calendar.add(Calendar.MONTH, -1)
            updateCalendar()
        }
        view.findViewById<View>(R.id.btn_next_month).setOnClickListener {
            calendar.add(Calendar.MONTH, 1)
            updateCalendar()
        }

        // Fetch tasks assigned to the user
        fetchTasksAssignedToProject(project.projectId)

        // Inflate the layout for this fragment
        return view
    }

    companion object {
        const val ARG_PROJECT = "arg_project" // Key for passing the Project object

        fun newInstance(project: Project): ProjectCalendarFragment {
            val fragment = ProjectCalendarFragment()
            val args = Bundle()
            args.putSerializable(ARG_PROJECT, project) // Pass the Project object as a Serializable
            fragment.arguments = args
            return fragment
        }
    }

    private fun fetchTasksAssignedToProject(projectId: UUID) {
        val taskApi = TaskRetrofitClient.create(TaskApi::class.java)
        taskApi.getTasksByProjectId(projectId).enqueue(object : Callback<List<Task>> {

            override fun onResponse(call: Call<List<Task>>, response: Response<List<Task>>) {
                if (response.isSuccessful) {
                    tasks = response.body() ?: emptyList()
                    mapTasksByDeadline()
                    updateCalendar()
                } else {
                    Toast.makeText(requireContext(), "Failed to fetch tasks", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<List<Task>>, t: Throwable) {
                Toast.makeText(requireContext(), "Error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun mapTasksByDeadline() {
        taskMap.clear()
        val dateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
        for (task in tasks) {
            task.dueDate?.let { deadline ->
                val formattedDate = dateFormat.format(SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).parse(deadline)!!)
                taskMap.getOrPut(formattedDate) { mutableListOf() }.add(task)
            }
        }
    }

    private fun updateCalendar() {
        // Update month and year text
        val monthYearFormat = SimpleDateFormat("MMMM yyyy", Locale.getDefault())
        monthYearText.text = monthYearFormat.format(calendar.time)

        // Clear the calendar grid
        calendarGrid.removeAllViews()

        // Set up calendar days
        val firstDayOfMonth = calendar.clone() as Calendar
        firstDayOfMonth.set(Calendar.DAY_OF_MONTH, 1)
        val dayOfWeek = firstDayOfMonth.get(Calendar.DAY_OF_WEEK) - 1 // Adjust for Sunday = 0
        val daysInMonth = calendar.getActualMaximum(Calendar.DAY_OF_MONTH)

        // Add empty views for days before the first day of the month
        for (i in 0 until dayOfWeek) {
            calendarGrid.addView(createEmptyDayView())
        }

        // Add day views for the current month
        val dateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
        for (day in 1..daysInMonth) {
            val date = firstDayOfMonth.clone() as Calendar
            date.set(Calendar.DAY_OF_MONTH, day)
            val formattedDate = dateFormat.format(date.time)
            val dayView = createDayView(day, formattedDate)
            calendarGrid.addView(dayView)
        }
    }

    private fun createEmptyDayView(): View {
        val emptyView = TextView(requireContext())
        emptyView.layoutParams = GridLayout.LayoutParams().apply {
            width = 0
            height = ViewGroup.LayoutParams.WRAP_CONTENT
            columnSpec = GridLayout.spec(GridLayout.UNDEFINED, 1f)
        }
        return emptyView
    }

    private fun createDayView(day: Int, formattedDate: String): View {
        val dayView = TextView(requireContext())
        dayView.text = day.toString()
        dayView.gravity = android.view.Gravity.CENTER
        dayView.setPadding(8, 16, 8, 16)
        dayView.layoutParams = GridLayout.LayoutParams().apply {
            width = 0
            height = ViewGroup.LayoutParams.WRAP_CONTENT
            columnSpec = GridLayout.spec(GridLayout.UNDEFINED, 1f)
        }

        // Highlight days with tasks
        if (taskMap.containsKey(formattedDate)) {
            dayView.setBackgroundResource(R.drawable.rounded_day_with_tasks)
        }

        // Set click listener to show tasks for the selected date
        dayView.setOnClickListener {
            // Reset the background of the previously selected day
            selectedDayView?.let { previousDayView ->
                if (taskMap.containsKey(previousDayView.tag as String)) {
                    // If the previous day has tasks, keep the task highlight
                    previousDayView.setBackgroundResource(R.drawable.rounded_day_with_tasks)
                } else {
                    // Otherwise, reset to default background
                    previousDayView.setBackgroundResource(0)
                }
            }

            // Highlight the newly selected day
            dayView.setBackgroundResource(R.drawable.rounded_selected_day)
            selectedDayView = dayView

            // Store the selected date in the tag for reference
            dayView.tag = formattedDate

            // Show tasks for the selected date
            showTasksForDate(formattedDate)
        }

        // Store the date in the tag for reference
        dayView.tag = formattedDate

        return dayView
    }

    private fun showTasksForDate(date: String) {
        val tasksForDate = taskMap[date]

        if (tasksForDate.isNullOrEmpty()) {
            // Show empty state if no tasks exist for the selected date
            tasksForDateText.visibility = View.GONE
            noTaskText.visibility = View.VISIBLE
            taskAdapter.updateTasks(emptyList())
        } else {
            // Hide empty state and show tasks
            noTaskText.visibility = View.GONE
            tasksForDateText.visibility = View.VISIBLE

            // Format the date to "April 10, 2025"
            val inputDateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
            val outputDateFormat = SimpleDateFormat("MMMM dd, yyyy", Locale.getDefault())
            val formattedDate = outputDateFormat.format(inputDateFormat.parse(date)!!)

            tasksForDateText.text = "Tasks for $formattedDate"

            // Update RecyclerView with tasks
            taskAdapter.updateTasks(tasksForDate)
        }
    }
}