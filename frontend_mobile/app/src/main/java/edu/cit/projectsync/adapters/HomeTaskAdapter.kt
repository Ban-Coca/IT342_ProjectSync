package edu.cit.projectsync.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import android.widget.Toast
import androidx.recyclerview.widget.RecyclerView
import edu.cit.projectsync.R
import edu.cit.projectsync.models.Task

class HomeTaskAdapter(
    private val tasks: List<Task>,
    private val onTaskClick: (Task) -> Unit
) : RecyclerView.Adapter<HomeTaskAdapter.ViewHolder>() {

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val taskName: TextView = view.findViewById(R.id.home_taskName)
        val taskDescription: TextView = view.findViewById(R.id.home_taskDescription)
        val taskStatus: TextView = view.findViewById(R.id.home_taskStatus)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.home_task_card, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val task = tasks[position]
        holder.taskName.text = task.title
        holder.taskDescription.text = task.description

        // Set status background and text color based on task status
        when (task.status.lowercase()) {
            "to-do" -> {
                holder.taskStatus.text = "To-do"
                holder.taskStatus.setBackgroundResource(R.drawable.rounded_status_todo)
                holder.taskStatus.setTextColor(holder.itemView.context.getColor(R.color.status_todo_text))
            }
            "in-progress" -> {
                holder.taskStatus.text = "In-Progress"
                holder.taskStatus.setBackgroundResource(R.drawable.rounded_status_inprogress)
                holder.taskStatus.setTextColor(holder.itemView.context.getColor(R.color.status_in_progress_text))
            }
            "done" -> {
                holder.taskStatus.text = "Done"
                holder.taskStatus.setBackgroundResource(R.drawable.rounded_status_done)
                holder.taskStatus.setTextColor(holder.itemView.context.getColor(R.color.status_done_text))
            }
            else -> {
                holder.taskStatus.text = "Unknown"
                holder.taskStatus.setBackgroundResource(R.drawable.rounded_status_todo)
            }
        }

        // Handle task card click
        holder.itemView.setOnClickListener {
            onTaskClick(task)
        }
    }

    override fun getItemCount() = tasks.size
}