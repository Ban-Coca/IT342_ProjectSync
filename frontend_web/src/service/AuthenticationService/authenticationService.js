import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_USER_SERVICE

export const signUpUser = async (formData) => {
    try{
        const response = await axios.post(`${API_BASE_URL}/postuserrecord`, {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
        });
        return response.data;
    } catch (error){
        console.error('Error signing up:', error);
        throw error;
    }
}

export const loginUser = async (credential) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, {
            email: credential.email,
            password: credential.password,
        });
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
}

export const requestPasswordReset = async (email) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/request-reset`, {
            email: email
        });
        return response.data;
    } catch (error) {
        console.error('Error requesting password reset:', error);
        throw error;
    }
}

export const verifyResetCode = async (email, code) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/verify-reset-code`, {
            email: email,
            code: code
        });
        return response.data;
    } catch (error) {
        console.error('Error verifying reset code:', error);
        throw error;
    }
}

export const resetPassword = async (credential) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/reset-password`, {
            email: credential.email,
            resetToken: credential.resetToken,
            password: credential.password
        });
        return response.data;
    } catch (error) {
        console.error('Error resetting password:', error);
        throw error;
    }
}