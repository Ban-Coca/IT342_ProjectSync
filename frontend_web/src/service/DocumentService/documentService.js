import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL_DOCUMENT_SERVICE;

export const uploadDocument = async (formData, header) => {
    try{
        const response = await axios.post(`${API_URL}/upload`, formData, {
            headers: {
                ...header,
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }catch(error){
        throw error.response ? error.response.data : 'Error uploading document';
    }
}

export const downloadDocument = async (documentId, header) => {
    try {
        const response = await axios.get(`${API_URL}/download/${documentId}`, {
            headers: header,
            responseType: 'blob', // Important for binary data
        });
        
        // Get filename from content-disposition header if available
        const contentDisposition = response.headers['content-disposition'];
        let filename = '';
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="(.+)"/);
            if (filenameMatch) {
                filename = filenameMatch[1];
            }
        }
        
        return {
            data: response.data,
            filename: filename || `document-${documentId}`,
            contentType: response.headers['content-type']
        };
    } catch (error) {
        throw error.response ? error.response.data : 'Error downloading document';
    }
}

export const deleteDocument = async (documentId, header) => {
    try {
        const response = await axios.delete(`${API_URL}/deletedocument/${documentId}`, {
            headers: header
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : `Error deleting document with ID: ${documentId}`;
    }
}

export const getAllDocuments = async (header) => {
    try {
        const response = await axios.get(`${API_URL}/getalldocuments`, {
            headers: header
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : 'Error retrieving all documents';
    }
}

export const getDocumentsByProject = async (projectId, header) => {
    try {
        const response = await axios.get(`${API_URL}/project/${projectId}`, {
            headers: header
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : `Error retrieving documents for project with ID: ${projectId}`;
    }
}

