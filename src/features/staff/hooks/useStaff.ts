import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { staffService } from "../services/staff.service";
import { QUERY_KEYS } from "@/constants/api.constants";
import type { StaffFormData } from "../types";

export const useStaffList = (params?: Record<string, any>, enabled: boolean = true) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ADMIN_STAFF.LIST, params],
    queryFn: () => staffService.getList(params),
    placeholderData: keepPreviousData,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};

export const useStaffCounts = (enabled: boolean = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.ADMIN_STAFF.COUNTS,
    queryFn: () => staffService.getCounts(),
    enabled,
  });
};

export const useStaffFormOptions = (enabled: boolean = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.ADMIN_STAFF.FORM_OPTIONS,
    queryFn: () => staffService.getFormOptions(),
    enabled,
    staleTime: Infinity, // Form options change rarely
  });
};

export const useStaffDetails = (id: number | string, enabled: boolean = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.ADMIN_STAFF.DETAILS(id),
    queryFn: () => staffService.getDetails(id),
    enabled: enabled && !!id,
  });
};

export const useCreateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StaffFormData) => staffService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_STAFF.LIST });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_STAFF.COUNTS });
      // queryClient.refetchQueries({ queryKey: QUERY_KEYS.ADMIN_STAFF.COUNTS });
    },
  });
};

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: StaffFormData }) => staffService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_STAFF.LIST });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_STAFF.COUNTS });
      // queryClient.refetchQueries({ queryKey: QUERY_KEYS.ADMIN_STAFF.COUNTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_STAFF.DETAILS(variables.id) });
    },
  });
};

export const useToggleStaffStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number | string; status: string | number }) => staffService.toggleStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_STAFF.LIST });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_STAFF.COUNTS });
      // queryClient.refetchQueries({ queryKey: QUERY_KEYS.ADMIN_STAFF.COUNTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_STAFF.DETAILS(variables.id) });
    },
  });
};

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => staffService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_STAFF.LIST });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_STAFF.COUNTS });
      // queryClient.refetchQueries({ queryKey: QUERY_KEYS.ADMIN_STAFF.COUNTS });
    },
  });
};

export const useExportStaff = () => {
  return useMutation({
    mutationFn: ({ format, params }: { format: string; params?: Record<string, any> }) => staffService.exportList(format, params),
  });
};
