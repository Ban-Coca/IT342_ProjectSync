import axios from 'axios';

const API_URL = 'http://localhost:8080'; // Adjust this based on your backend URL

const TaskService = {
  // Create a new task
  createTask: async (taskData) => {
    try {
      const response = await axios.post(`${API_URL}/api/tasks/createtask`, taskData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Error creating task';
    }
  },

  // Update an existing task
  updateTask: async (taskId, taskData) => {
    try {
      const response = await axios.put(`${API_URL}/api/tasks/updatetask/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Error updating task';
    }
  },

  // Get a task by ID
  getTaskById: async (taskId) => {
    try {
      const response = await axios.get(`${API_URL}/api/tasks/gettaskid/${taskId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Error fetching task';
    }
  },

  // Get all tasks for a specific project
  getTasksByProjectId: async (projectId) => {
    try {
      const response = await axios.get(`${API_URL}/api/tasks/project/${projectId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Error fetching project tasks';
    }
  },

  // Get all tasks
  getAllTasks: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/tasks/getalltask`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Error fetching all tasks';
    }
  },

  // Delete a task
  deleteTask: async (taskId) => {
    try {
      const response = await axios.delete(`${API_URL}/api/tasks/deletetask/${taskId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Error deleting task';
    }
  }
};

export default TaskService;
