package edu.cit.projectsync.activities

import android.os.Bundle
import android.widget.TextView
import androidx.core.content.ContextCompat
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import edu.cit.projectsync.R

class TasksActivity : BaseActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_tasks)

        // Handle edge-to-edge insets
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        // Setup navigation and highlight Tasks
        setupNavigation(R.id.nav_tasks)
        setupProfileDropdown()

        val taskPriorityTextView: TextView = findViewById(R.id.task_priority)

        val priority = "High" // Change this to "Medium" or "Low" to test

        when (priority) {
            "High" -> {
                taskPriorityTextView.background = ContextCompat.getDrawable(this, R.drawable.rounded_priority_high)
                taskPriorityTextView.text = "High"
                taskPriorityTextView.setTextColor(ContextCompat.getColor(this, R.color.priority_high_text))
            }
            "Medium" -> {
                taskPriorityTextView.background = ContextCompat.getDrawable(this, R.drawable.rounded_priority_medium)
                taskPriorityTextView.text = "Medium"
                taskPriorityTextView.setTextColor(ContextCompat.getColor(this, R.color.priority_medium_text))
            }
            "Low" -> {
                taskPriorityTextView.background = ContextCompat.getDrawable(this, R.drawable.rounded_priority_low)
                taskPriorityTextView.text = "Low"
                taskPriorityTextView.setTextColor(ContextCompat.getColor(this, R.color.priority_low_text))
            }
        }
    }
}