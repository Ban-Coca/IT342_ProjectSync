import { searchUsers } from '../service/UserService/userService.js';
import { useQuery } from '@tanstack/react-query';

export function useUser({
    keyword,
    queryClient,
    getAuthHeader,
    
}) {
    const searchQuery = useQuery({
        queryKey: ["searchUsers", keyword],
        queryFn: () => searchUsers(keyword, getAuthHeader()),
        enabled: !!keyword && keyword.length >= 2,
        staleTime: 3000,
        keepPreviousData: true,
    })

    return {
        searchQuery,
        isLoading: searchQuery.isLoading,
        isError: searchQuery.isError,
    }
}

