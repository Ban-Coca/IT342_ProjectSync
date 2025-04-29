package edu.cit.projectsync.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import android.widget.Toast
import androidx.recyclerview.widget.RecyclerView
import edu.cit.projectsync.R
import edu.cit.projectsync.models.Project

class ProjectAdapter(
    private val projects: List<Project>,
    private val onProjectClick: (Project) -> Unit
) : RecyclerView.Adapter<ProjectAdapter.ViewHolder>() {

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val projectName: TextView = view.findViewById(R.id.project_Name)
        val projectDescription: TextView = view.findViewById(R.id.project_description)
        val projectMenuButton: ImageButton = view.findViewById(R.id.btn_project_card_menu)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.project_card, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val project = projects[position]

        // Bind project data to the views
        holder.projectName.text = project.name
        holder.projectDescription.text = project.description

        // Handle project card click
        holder.itemView.setOnClickListener {
            onProjectClick(project)
        }

        // Handle menu button click
        holder.projectMenuButton.setOnClickListener {
            Toast.makeText(
                holder.itemView.context,
                "Menu clicked for project: ${project.name}",
                Toast.LENGTH_SHORT
            ).show()
        }
    }

    override fun getItemCount() = projects.size
}