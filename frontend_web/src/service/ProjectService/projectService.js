import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL_PROJECT_SERVICE;

// Create a new project
export const createProject = async (projectData, header) => {
  try {
    console.log("Project Data:", projectData);
    console.log("Header:", header);
    const response = await axios.post(`${API_URL}/createproject`, projectData, {headers: header});
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

export const updateProject = async (projectData, header) => {
  try {
    const projectId = projectData.projectId;
    if (!projectId) {
      throw new Error('Project ID is missing in the provided data');
    }
    
    const response = await axios.put(`${API_URL}/updateproject/${projectId}/`, projectData, {headers: header});
    return response.data;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

export const getProjectById = async (projectId, header) => {
  try {
    const response = await axios.get(`${API_URL}/getprojectbyid/${projectId}`,{headers: header});
    console.log("Project Data:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
};

// Delete a project
export const deleteProject = async (projectId, header) => {
  try {

    const response = await axios.delete(`${API_URL}/deleteproject/${projectId}`, {headers: header});
    return response.data;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

export const getProjectsByUserId = async (userId, header) => {
  try {
    const response = await axios.get(`${API_URL}/getprojectbyuser/${userId}`, {headers: header});
    return response.data;
  } catch (error) {
    throw error;
  }
};
