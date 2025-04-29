package edu.cit.projectsync.viewModels

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import edu.cit.projectsync.models.Task

class TasksViewModel : ViewModel() {

    private val _tasks = MutableLiveData<List<Task>>()
    val tasks: LiveData<List<Task>> get() = _tasks

    fun setTasks(taskList: List<Task>) {
        _tasks.value = taskList
    }
}