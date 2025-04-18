import { useQuery, useMutation } from '@tanstack/react-query'
import { getTaskById, createTask, getTasksByProjectId, updateTask, deleteTask } from "@/service/TaskService/taskService";
import { toast } from 'sonner';

export function useTask({
    projectId,
    taskId,
    currentUser,
    queryClient,
    getAuthHeader,
    onCreateSuccess,
    onUpdateSuccess,
    onDeleteSuccess,

}) {
    const taskQuery = useQuery({
        queryKey: ["task", taskId],
        queryFn: () => getTaskById(taskId, getAuthHeader()),
        enabled: !!taskId,
    })
    const tasksQuery = useQuery({
        queryKey: ["tasks", projectId],
        queryFn: () => getTasksByProjectId(projectId, getAuthHeader()),
        enabled: !!projectId,
    })

    const createTaskMutation = useMutation({
        mutationFn: (newTask) => {
            const taskWithValidAssignedTo = {
                ...newTask,
                
                assignedTo: newTask.assignedTo || []
            };
            return createTask(taskWithValidAssignedTo, getAuthHeader());
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(["tasks", projectId])
            if(onCreateSuccess) onCreateSuccess(data)
            toast.success("Task created successfully")
        },
        onError: (error) => {
            toast.error("Failed to create task. Please try again.")
        },
    })

    const editTaskMutation = useMutation({
        mutationFn: (updatedTask) => updateTask(updatedTask, getAuthHeader()),
        onSuccess: (data) => {
            queryClient.invalidateQueries(["tasks", projectId])
            toast.success("Task updated successfully")
            onUpdateSuccess()
        },
        onError: (error) => {
            toast.error("Failed to update task. Please try again.")
        },
    })

    const deleteTaskMutation = useMutation({
        mutationFn: (taskId) => deleteTask(taskId, getAuthHeader()),
        onSuccess: () => {
            queryClient.invalidateQueries(["tasks", projectId])
            toast.success("Task deleted successfully")
            onDeleteSuccess()
        },
        onError: (error) => {
            toast.error("Failed to delete task. Please try again.")
        },
    })

    return {
        task: taskQuery.data,
        tasks: tasksQuery.data,

        isTaskLoading: taskQuery.isLoading,
        isTasksLoading: tasksQuery.isLoading,

        taskError: taskQuery.error,
        tasksError: tasksQuery.error,

        createTaskMutation,
        editTaskMutation,
        deleteTaskMutation,
    }
}