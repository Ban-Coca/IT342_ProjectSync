import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_NOTIFICATION_SERVICE;

export const getUserNotifications = async (userId, header) => {
    try {
        const response = await axios.get(`${API_URL}/${userId}`, { headers: header });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getUnread = async (userId, header) => {
    try {
        const response = await axios.get(`${API_URL}/unread/${userId}`, { headers: header });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getUnreadCount = async (userId, header) => {
    try{
        const response = await axios.get(`${API_URL}/unread/count/${userId}`, { headers: header });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const readNotification = async (notificationId, header) => {
    try {
        const response = await axios.put(`${API_URL}/${notificationId}/read`, {}, { headers: header });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const markAllAsRead = async (userId, header) => {
    try {
        const response = await axios.put(`${API_URL}/read-all/${userId}`, {}, { headers: header });
        return response.data;
    } catch (error) {
        throw error;
    }
}