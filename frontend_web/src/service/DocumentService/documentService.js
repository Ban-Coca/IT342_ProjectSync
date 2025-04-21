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
            responseType: 'blob',
        });

        let filename = `document-${documentId}`;
        const contentDisposition = response.headers['content-disposition'];
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
            if (filenameMatch && filenameMatch[1]) {
                filename = filenameMatch[1];
            }
        }
        
        return {
            blob: response.data,
            filename: filename
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

export const renameDocument = async (documentId, newName, header) => {
    try {
        const response = await axios.put(`${API_URL}/rename/${documentId}`, { newName }, {
            headers: header
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : `Error renaming document with ID: ${documentId}`;
    }
}
