import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL_TASK_SERVICE; 

// Create a new task
export const createTask = async (taskData, header) => {
  try {
    const response = await axios.post(`${API_URL}/createtask`, taskData, {headers: header});
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : 'Error creating task';
  }
};

// Update an existing task
export const updateTask = async (taskData, header) => {
  try {
    const taskId = taskData.taskId;
    console.log('taskId', taskId);
    const response = await axios.put(`${API_URL}/updatetask/${taskId}`, taskData, {headers: header});
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : 'Error updating task';
  }
};

// Get a task by ID
export const getTaskById = async (taskId, header) => {
  try {
    const response = await axios.get(`${API_URL}/gettaskid/${taskId}`, {headers: header});
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : 'Error fetching task';
  }
};

// Get all tasks for a specific project
export const getTasksByProjectId = async (projectId, header) => {
  try {
    const response = await axios.get(`${API_URL}/project/${projectId}`, {headers: header});
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : 'Error fetching project tasks';
  }
};

// Get all tasks
export const getAllTasks = async (header) => {
  try {
    const response = await axios.get(`${API_URL}/getalltask`, {headers: header});
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : 'Error fetching all tasks';
  }
};

// Delete a task
export const deleteTask = async (taskId, header) => {
  try {
    const response = await axios.delete(`${API_URL}/deletetask/${taskId}`, {headers: header});
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : 'Error deleting task';
  }
};

export const getTaskByUserId = async (userId, header) => {
  try {
    const response = await axios.get(`${API_URL}/assignedToMe/${userId}`, {headers: header});
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : 'Error fetching tasks assigned to user';
  }
}

export default {
  createTask,
  updateTask,
  getTaskById,
  getTaskByUserId,
  getTasksByProjectId,
  getAllTasks,
  deleteTask
};
