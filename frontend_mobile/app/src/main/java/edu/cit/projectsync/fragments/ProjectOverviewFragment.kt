package edu.cit.projectsync.fragments

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import edu.cit.projectsync.R
import edu.cit.projectsync.databinding.FragmentProjectOverviewBinding
import edu.cit.projectsync.models.Project

class ProjectOverviewFragment : Fragment() {

    private var _binding: FragmentProjectOverviewBinding? = null
    private val binding get() = _binding!!

    private lateinit var project: Project

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        arguments?.let {
            project = it.getSerializable(ARG_PROJECT) as Project
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentProjectOverviewBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Populate project details
        binding.projectDescription.text = project.description
        binding.projectCreatedAt.text = "Created on ${project.startDate}"
        binding.projectDue.text = "Due by ${project.endDate}"
        binding.projectOwner.text = "${project.ownerId.firstName} ${project.ownerId.lastName}"

        // Dynamically populate the goals list
        populateGoals()
    }

    private fun populateGoals() {
        val goalsContainer = binding.root.findViewById<ViewGroup>(R.id.project_goals_container)
        goalsContainer.removeAllViews() // Clear any existing views

        if (project.goals.isEmpty()) {
            // Add a placeholder if no goals are available
            val noGoalsTextView = TextView(context).apply {
                text = "No goals available"
                setTextColor(resources.getColor(R.color.gray, null))
                textSize = 16f
                setPadding(8, 8, 8, 8)
            }
            goalsContainer.addView(noGoalsTextView)
            Log.d("ProjectOverviewFragment", "No goals available")
        } else {
            // Dynamically add goals
            for (goal in project.goals) {
                Log.d("ProjectOverviewFragment", "Adding goal: $goal") // Log each goal
                val goalView = LayoutInflater.from(context).inflate(R.layout.item_goal, goalsContainer, false)

                val goalText = goalView.findViewById<TextView>(R.id.goal_text)
                goalText.text = goal
                goalsContainer.addView(goalView)
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    companion object {
        private const val ARG_PROJECT = "project"

        fun newInstance(project: Project): ProjectOverviewFragment {
            val fragment = ProjectOverviewFragment()
            val args = Bundle()
            args.putSerializable(ARG_PROJECT, project)
            fragment.arguments = args
            return fragment
        }
    }
}