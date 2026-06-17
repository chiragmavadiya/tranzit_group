import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { teamUsersService } from "../services/team-users.service";
import { QUERY_KEYS } from "@/constants/api.constants";
import type { TeamUserFormData } from "../types";

export const useTeamUsersList = (params?: Record<string, any>, enabled: boolean = true) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.CUSTOMER_TEAM.LIST, params],
    queryFn: () => teamUsersService.getList(params),
    placeholderData: keepPreviousData,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};

export const useTeamUserFormOptions = (enabled: boolean = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.CUSTOMER_TEAM.FORM_OPTIONS,
    queryFn: () => teamUsersService.getFormOptions(),
    enabled,
    staleTime: Infinity,
  });
};

export const useTeamUserDetails = (id: number | string, enabled: boolean = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.CUSTOMER_TEAM.DETAILS(id),
    queryFn: () => teamUsersService.getDetails(id),
    enabled: enabled && !!id,
  });
};

export const useCreateTeamUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TeamUserFormData) => teamUsersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CUSTOMER_TEAM.LIST });
    },
  });
};

export const useUpdateTeamUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: TeamUserFormData }) =>
      teamUsersService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CUSTOMER_TEAM.LIST });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CUSTOMER_TEAM.DETAILS(variables.id) });
    },
  });
};

export const useToggleTeamUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => teamUsersService.toggleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CUSTOMER_TEAM.LIST });
    },
  });
};

export const useDeleteTeamUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => teamUsersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CUSTOMER_TEAM.LIST });
    },
  });
};
