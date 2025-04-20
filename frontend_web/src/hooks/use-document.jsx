import { useQuery, useMutation } from '@tanstack/react-query';
import { uploadDocument, downloadDocument, getDocumentsByProject, deleteDocument} from '@/service/DocumentService/documentService';
import { toast } from 'sonner';

export function useDocument({ 
    currentUser, 
    queryClient, 
    getAuthHeader,
    projectId
 }) {
    const uploadDocumentMutation = useMutation({
        mutationFn: (documentData) => uploadDocument(documentData, getAuthHeader()),
        onSuccess: (data) => {
            queryClient.invalidateQueries(['documents', currentUser?.userId]);
            toast.success('Document uploaded successfully');
        },
        onError: (error) => {
            toast.error('Failed to upload document. Please try again.');
        },
    });

    const downloadDocumentMutation = useMutation({
        mutationFn: (documentId) => downloadDocument(documentId, getAuthHeader()),
        onSuccess: (data) => {
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `document-${data.filename}`);
            document.body.appendChild(link);
            link.click();
            toast.success('Document downloaded successfully');
        },
        onError: (error) => {
            toast.error('Failed to download document. Please try again.');
        },
    });

    const deleteDocumentMutation = useMutation({
        mutationFn: (documentId) => deleteDocument(documentId, getAuthHeader()),
        onSuccess: () => {
            queryClient.invalidateQueries(['documents', currentUser?.userId]);
            toast.success('Document deleted successfully');
        },
        onError: (error) => {
            toast.error('Failed to delete document. Please try again.');
        },
    });

    const documentsQuery = useQuery({
        queryKey: ['documents', projectId],
        queryFn: () => getDocumentsByProject(projectId, getAuthHeader()),
        enabled: !!projectId,
    });

    return {
        uploadDocumentMutation,
        downloadDocumentMutation,
        deleteDocumentMutation,
        documents: documentsQuery.data,

        isUploading: uploadDocumentMutation.isPending,
        isDownloading: downloadDocumentMutation.isPending,
        isDeleting: deleteDocumentMutation.isPending,
        isLoadingDocuments: documentsQuery.isLoading,
        isDocumentsError: documentsQuery.isError,
        documentsError: documentsQuery.error,
    };
}
