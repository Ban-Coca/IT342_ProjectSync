package edu.cit.projectsync.adapters

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import edu.cit.projectsync.R
import edu.cit.projectsync.models.Task

class TaskBoardAdapter(
    private val context: Context,
    private val tasks: List<Task>,
    private val onTaskClick: (Task) -> Unit
) : RecyclerView.Adapter<TaskBoardAdapter.ViewHolder>() {

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val taskName: TextView = view.findViewById(R.id.task_taskName)
        val taskDescription: TextView = view.findViewById(R.id.task_taskDescription)
        val taskStatusText: TextView = view.findViewById(R.id.task_taskStatus_text)
        val taskStatusIcon: ImageView = view.findViewById(R.id.task_taskStatus_icon)
        val taskPriority: TextView = view.findViewById(R.id.task_priority)
        val taskAssigneesContainer: LinearLayout = view.findViewById(R.id.task_assignees_container)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_task, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val task = tasks[position]

        // Set task details
        holder.taskName.text = task.title
        holder.taskDescription.text = task.description

        // Set task status
        when (task.status.lowercase()) {
            "to-do" -> {
                holder.taskStatusText.text = "To-do"
                holder.taskStatusIcon.setImageResource(R.drawable.ic_status_todo)
            }
            "in-progress" -> {
                holder.taskStatusText.text = "In-Progress"
                holder.taskStatusIcon.setImageResource(R.drawable.ic_status_in_progress)
            }
            "done" -> {
                holder.taskStatusText.text = "Done"
                holder.taskStatusIcon.setImageResource(R.drawable.ic_status_done)
            }
            else -> {
                holder.taskStatusText.text = "Unknown"
                holder.taskStatusIcon.setImageResource(R.drawable.ic_status_todo) // Default to "To-do"
            }
        }

        // Set task priority
        when (task.priority.lowercase()) {
            "low" -> {
                holder.taskPriority.text = "Low"
                holder.taskPriority.setBackgroundResource(R.drawable.rounded_priority_low)
                holder.taskPriority.setTextColor(context.getColor(R.color.priority_low_text))
            }
            "medium" -> {
                holder.taskPriority.text = "Medium"
                holder.taskPriority.setBackgroundResource(R.drawable.rounded_priority_medium)
                holder.taskPriority.setTextColor(context.getColor(R.color.priority_medium_text))
            }
            "high" -> {
                holder.taskPriority.text = "High"
                holder.taskPriority.setBackgroundResource(R.drawable.rounded_priority_high)
                holder.taskPriority.setTextColor(context.getColor(R.color.priority_high_text))
            }
            else -> {
                holder.taskPriority.text = "Low"
                holder.taskPriority.setBackgroundResource(R.drawable.rounded_priority_low)
                holder.taskPriority.setTextColor(context.getColor(R.color.priority_low_text))
            }
        }

        // Populate assignees
        holder.taskAssigneesContainer.removeAllViews()
        for (assignee in task.assignedTo) {
            val assigneeView = LayoutInflater.from(context).inflate(R.layout.item_assignee, holder.taskAssigneesContainer, false)

            val assigneeInitials = assigneeView.findViewById<TextView>(R.id.assignee_initials)
            val assigneeName = assigneeView.findViewById<TextView>(R.id.assignee_name)

            val initials = "${assignee.firstName?.firstOrNull() ?: ""}${assignee.lastName?.firstOrNull() ?: ""}".uppercase()
            val fullName = "${assignee.firstName ?: ""} ${assignee.lastName ?: ""}".trim()

            assigneeInitials.text = initials
            assigneeName.text = fullName

            holder.taskAssigneesContainer.addView(assigneeView)
        }

        // Handle task click
        holder.itemView.setOnClickListener {
            onTaskClick(task)
        }
    }

    override fun getItemCount(): Int = tasks.size
}