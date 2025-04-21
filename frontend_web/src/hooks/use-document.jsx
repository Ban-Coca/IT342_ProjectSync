import { useQuery, useMutation } from '@tanstack/react-query';
import { uploadDocument, downloadDocument, getDocumentsByProject, deleteDocument, renameDocument} from '@/service/DocumentService/documentService';
import { toast } from 'sonner';

export function useDocument({ 
    currentUser, 
    queryClient, 
    getAuthHeader,
    documentId,
    projectId
 }) {
    const uploadDocumentMutation = useMutation({
        mutationFn: (documentData) => {
            return toast.promise(
                uploadDocument(documentData, getAuthHeader()),
                {
                    loading: 'Uploading document...',
                    success: 'Document uploaded successfully',
                    error: (error) => {
                        if (error.response) {
                            return error.response.data.message || 'Failed to upload document';
                        } else {
                            return 'Failed to upload document. Please try again.';
                        }
                    }
                }
            )
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['documents', currentUser?.userId]);
        },
    });

    const downloadDocumentMutation = useMutation({
        mutationFn: (documentId) => {
            return toast.promise(
                downloadDocument(documentId, getAuthHeader()),
                {
                    loading: 'Downloading document...',
                    success: 'Document downloaded successfully',
                    error: 'Failed to download document'
                }
            );
        },
        onSuccess: (result) => {
            
            const url = window.URL.createObjectURL(result.blob);

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', result.filename);
            document.body.appendChild(link);
            link.click();
            
            setTimeout(() => {
                link.remove();
                window.URL.revokeObjectURL(url);
            }, 100);    
        },
    });
    

    const deleteDocumentMutation = useMutation({
        mutationFn: (documentId) => {
            return toast.promise(
                deleteDocument(documentId, getAuthHeader()),
                {
                    loading: 'Deleting document...',
                    success: 'Document deleted successfully',
                    error: 'Failed to delete document'
                }
            )
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['documents', currentUser?.userId]);
        },
    });

    const documentsQuery = useQuery({
        queryKey: ['documents', projectId],
        queryFn: () => getDocumentsByProject(projectId, getAuthHeader()),
        enabled: !!projectId,
    });

    const renameDocumentMutation = useMutation({
        mutationFn: ({docmentId, newName}) => {
            return toast.promise(
                renameDocument(docmentId, newName, getAuthHeader()),
                {
                    loading: 'Renaming document...',
                    success: 'Document renamed successfully',
                    error: 'Failed to rename document'
                }
            )
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['documents', currentUser?.userId]);
        },
    })

    return {
        uploadDocumentMutation,
        downloadDocumentMutation,
        deleteDocumentMutation,
        renameDocumentMutation,
        documents: documentsQuery.data,

        isUploading: uploadDocumentMutation.isPending,
        isDownloading: downloadDocumentMutation.isPending,
        isDeleting: deleteDocumentMutation.isPending,
        isLoadingDocuments: documentsQuery.isPending,
        isDocumentsError: documentsQuery.isError,
        documentsError: documentsQuery.error,
    };
}
