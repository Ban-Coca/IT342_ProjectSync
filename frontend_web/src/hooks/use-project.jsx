import { useQuery, useMutation } from '@tanstack/react-query';
import { getProjectsByUserId, createProject, updateProject, deleteProject, getProjectById } from "@/service/ProjectService/projectService";
import { toast } from 'sonner';

export function useProject ({
    projectId,
    currentUser,
    queryClient, 
    getAuthHeader, 
    onCreateSuccess,
    onUpdateSuccess,
    onDeleteSuccess 
}){

    const projectsQuery = useQuery({
        queryKey: ["projects", currentUser?.userId],
        queryFn: () => getProjectsByUserId(currentUser?.userId, getAuthHeader()),
        enabled: !!currentUser?.userId,
    })

    const createProjectMutation = useMutation({
        mutationFn: (newProject) => createProject(newProject, getAuthHeader()),
        onSuccess: (data) => {
            queryClient.invalidateQueries(["projects", currentUser?.userId]);
            if(onCreateSuccess) onCreateSuccess(data)
            toast.success("Project created successfully")
        },
        onError: (error) => {
            toast.error("Failed to create project. Please try again.")
        },
    })

    const editProjectMutation = useMutation({
        mutationFn: (updatedProject) => updateProject(updatedProject, getAuthHeader()),
        onSuccess: (data) => {
            queryClient.invalidateQueries(["projects", currentUser?.userId]);
            if(onUpdateSuccess) onUpdateSuccess(data)
            toast.success("Project updated successfully")
        },
        onError: (error) => {
            toast.error("Failed to update project. Please try again.")
        },
    })

    const deleteProjectMutation = useMutation({
        mutationFn: (projectId) => deleteProject(projectId, getAuthHeader()),
        onSuccess: () => {
            queryClient.invalidateQueries(["projects", currentUser?.userId]);
            if(onDeleteSuccess) onDeleteSuccess()
            toast.success("Project deleted successfully")
        },
        onError: (error) => {
            toast.error("Failed to delete project. Please try again.")
        },
    });
    const projectQuery = useQuery({
            queryKey: ["project", projectId],
            queryFn: () => getProjectById(projectId, getAuthHeader()),
            enabled: !!currentUser?.userId,
            onError: (error) => {
                toast.error("Failed to fetch project details. Please try again.")
            },
        })
    return {

        projects: projectsQuery.data || [],
        isLoading: projectsQuery.isPending,
        error: projectsQuery.error,
        
        project: projectQuery.data || { teamMemberIds: [], tasks: [], name: "", projectId: "" },
        isProjectLoading: projectQuery.isPending,
        projectError: projectQuery.error,
        // Mutations
        createProjectMutation,
        editProjectMutation,
        deleteProjectMutation

    };
}