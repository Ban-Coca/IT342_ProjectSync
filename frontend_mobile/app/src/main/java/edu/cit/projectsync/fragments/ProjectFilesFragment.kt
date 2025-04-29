package edu.cit.projectsync.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import edu.cit.projectsync.R

class ProjectFilesFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_project_files, container, false)
    }

    companion object {
        fun newInstance(): ProjectFilesFragment {
            return ProjectFilesFragment()
        }
    }
}