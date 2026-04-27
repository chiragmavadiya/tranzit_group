import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { activityLogService } from "../services/activity-log.service";
import { QUERY_KEYS } from "@/constants/api.constants";
import type { ActivityLogFilters } from "../types";

export const useActivityLog = (params: ActivityLogFilters) => {
    return useQuery({
        queryKey: [...QUERY_KEYS.ADMIN_ACTIVITIES.LIST, params],
        queryFn: () => activityLogService.getList(params),
        placeholderData: keepPreviousData,
    });
};
