package edu.cit.projectsync.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import edu.cit.projectsync.R
import edu.cit.projectsync.models.Task

class TaskAdapter(private val tasks: List<Task>) : RecyclerView.Adapter<TaskAdapter.TaskViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): TaskViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_task, parent, false)
        return TaskViewHolder(view)
    }

    override fun onBindViewHolder(holder: TaskViewHolder, position: Int) {
        val task = tasks[position]
        holder.bind(task)
    }

    override fun getItemCount(): Int {
        return tasks.size
    }

    class TaskViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val taskName: TextView = itemView.findViewById(R.id.task_taskName)
        private val taskDescription: TextView = itemView.findViewById(R.id.task_taskDescription)
        private val taskStatusIcon: ImageView = itemView.findViewById(R.id.task_taskStatus_icon)
        private val taskStatusText: TextView = itemView.findViewById(R.id.task_taskStatus_text)
        private val taskDueDate: TextView = itemView.findViewById(R.id.task_taskDueDate)
        private val taskPriority: TextView = itemView.findViewById(R.id.task_priority)
        private val assigneesContainer: LinearLayout = itemView.findViewById(R.id.task_assignees_container)

        fun bind(task: Task) {
            // Bind task name and description
            taskName.text = task.title
            taskDescription.text = task.description

            // Bind task status
            taskStatusText.text = toCamelCase(task.status)
            when (task.status.lowercase()) {
                "to-do" -> taskStatusIcon.setImageResource(R.drawable.ic_status_todo)
                "in-progress" -> taskStatusIcon.setImageResource(R.drawable.ic_status_in_progress)
                "done" -> taskStatusIcon.setImageResource(R.drawable.ic_status_done)
                else -> taskStatusIcon.setImageResource(R.drawable.ic_status_todo)
            }

            // Bind due date
            taskDueDate.text = task.dueDate ?: "No Due Date"

            // Bind priority
            taskPriority.text = toCamelCase(task.priority)
            when (task.priority.lowercase()) {
                "high" -> {
                    taskPriority.setBackgroundResource(R.drawable.rounded_priority_high)
                    taskPriority.setTextColor(itemView.context.getColor(R.color.priority_high_text))
                }
                "medium" -> {
                    taskPriority.setBackgroundResource(R.drawable.rounded_priority_medium)
                    taskPriority.setTextColor(itemView.context.getColor(R.color.priority_medium_text))
                }
                "low" -> {
                    taskPriority.setBackgroundResource(R.drawable.rounded_priority_low)
                    taskPriority.setTextColor(itemView.context.getColor(R.color.priority_low_text))
                }
                else -> {
                    taskPriority.setBackgroundResource(R.drawable.rounded_yellow_bg)
                    taskPriority.setTextColor(itemView.context.getColor(R.color.priority_low_bg))
                }
            }

            // Bind assignees (if any)
            assigneesContainer.removeAllViews()
            task.assignedTo?.let { assignees ->
                for (assignee in assignees) {
                    val assigneeView = LayoutInflater.from(itemView.context)
                        .inflate(R.layout.item_assignee, assigneesContainer, false)

                    // Set initials (e.g., "AJ" for Alex Johnson)
                    val assigneeInitials = assigneeView.findViewById<TextView>(R.id.assignee_initials)
                    assigneeInitials.text = getInitials(assignee.firstName, assignee.lastName)

                    // Set full name (e.g., "Alex Johnson")
                    val assigneeName = assigneeView.findViewById<TextView>(R.id.assignee_name)
                    assigneeName.text = "${assignee.firstName} ${assignee.lastName}"

                    // Add the assignee view to the container
                    assigneesContainer.addView(assigneeView)
                }
            }
        }

        private fun getInitials(firstName: String?, lastName: String?): String {
            val firstInitial = firstName?.firstOrNull()?.uppercaseChar() ?: ""
            val lastInitial = lastName?.firstOrNull()?.uppercaseChar() ?: ""
            return "$firstInitial$lastInitial"
        }

        private fun toCamelCase(input: String): String {
            return input.split(" ") // Split the string by spaces
                .joinToString(" ") { word ->
                    word.lowercase().replaceFirstChar { it.uppercaseChar() } // Capitalize the first letter
                }
        }
    }
}