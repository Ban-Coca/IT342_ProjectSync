import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL_USER_SERVICE;

export const searchUsers = async (keyword, header) => {
    try {
        const response = await axios.get(`${API_URL}/search?keyword=${keyword}`, {headers: header});
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : 'Error searching users';
    }
}

export default searchUsers;
