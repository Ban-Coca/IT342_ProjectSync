package edu.cit.projectsync.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import android.widget.Toast
import androidx.recyclerview.widget.RecyclerView
import edu.cit.projectsync.R
import edu.cit.projectsync.models.Project

class HomeProjectAdapter(
    private val projects: List<Project>,
    private val onProjectClick: (Project) -> Unit
) : RecyclerView.Adapter<HomeProjectAdapter.ViewHolder>() {

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val projectName: TextView = view.findViewById(R.id.home_projectName)
        val projectDetails: TextView = view.findViewById(R.id.home_projectDetails)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.home_project_card, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val project = projects[position]
        holder.projectName.text = project.name
        holder.projectDetails.text = project.description

        // Handle project card click
        holder.itemView.setOnClickListener {
            onProjectClick(project)
        }
    }

    override fun getItemCount() = projects.size
}