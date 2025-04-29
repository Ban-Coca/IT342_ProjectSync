package edu.cit.projectsync.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import edu.cit.projectsync.R
import edu.cit.projectsync.models.Task

class CalendarAdapter(private var tasks: List<Task>) : RecyclerView.Adapter<CalendarAdapter.TaskViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): TaskViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.home_task_card, parent, false)
        return TaskViewHolder(view)
    }

    override fun onBindViewHolder(holder: TaskViewHolder, position: Int) {
        val task = tasks[position]
        holder.bind(task)
    }

    override fun getItemCount(): Int = tasks.size

    fun updateTasks(newTasks: List<Task>) {
        tasks = newTasks
        notifyDataSetChanged()
    }

    class TaskViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val taskName: TextView = itemView.findViewById(R.id.home_taskName)
        private val taskDescription: TextView = itemView.findViewById(R.id.home_taskDescription)
        private val taskStatus: TextView = itemView.findViewById(R.id.home_taskStatus)

        fun bind(task: Task) {
            taskName.text = task.title
            taskDescription.text = task.description
            taskStatus.text = toCamelCase(task.status)
        }

        private fun toCamelCase(input: String): String {
            return input.split("-", " ") // Split by hyphen or space
                .joinToString(" ") { word ->
                    word.lowercase().replaceFirstChar { it.uppercaseChar() } // Capitalize the first letter
                }
        }
    }
}