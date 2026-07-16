import { api } from '@/services/api';
import { API_ENDPOINTS } from '@/constants/api.constants';
import { format, parse, isValid } from 'date-fns';
import type {
  DebugTrace,
  DebugAlert,
  FailedJob,
  ExternalApiFailure,
  SlowRequest,
  SlowExternalCall,
  CustomerActivity,
  TraceDetail,
  DebugFilters,
  DebugListResponse,
  DebugDetailResponse,
  DebugStatsResponse,
} from '../types';

const formatApiDate = (dateStr?: string) => {
  if (!dateStr) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  try {
    const parsed = parse(dateStr, 'dd/MM/yyyy', new Date());
    if (isValid(parsed)) {
      return format(parsed, 'yyyy-MM-dd');
    }
  } catch {
    // ignore
  }
  return dateStr;
};

const transformFilters = (filters: DebugFilters): DebugFilters => {
  return {
    ...filters,
    from_date: formatApiDate(filters.from_date),
    to_date: formatApiDate(filters.to_date),
  };
};

export const debugCentreService = {
  async getStats(): Promise<DebugStatsResponse> {
    const response = await api.get(API_ENDPOINTS.ADMIN_DEBUG_CENTRE.STATS);
    return response.data;
  },

  async getTraces(filters: DebugFilters): Promise<DebugListResponse<DebugTrace>> {
    const response = await api.get(API_ENDPOINTS.ADMIN_DEBUG_CENTRE.TRACES, { params: transformFilters(filters) });
    return response.data;
  },

  async getAlerts(filters: DebugFilters): Promise<DebugListResponse<DebugAlert>> {
    const response = await api.get(API_ENDPOINTS.ADMIN_DEBUG_CENTRE.ALERTS, { params: transformFilters(filters) });
    return response.data;
  },

  async getFailedJobs(filters: DebugFilters): Promise<DebugListResponse<FailedJob>> {
    const response = await api.get(API_ENDPOINTS.ADMIN_DEBUG_CENTRE.FAILED_JOBS, { params: transformFilters(filters) });
    return response.data;
  },

  async getExternalApiFailures(filters: DebugFilters): Promise<DebugListResponse<ExternalApiFailure>> {
    const response = await api.get(API_ENDPOINTS.ADMIN_DEBUG_CENTRE.EXTERNAL_API_FAILURES, { params: transformFilters(filters) });
    return response.data;
  },

  async getSlowRequests(filters: DebugFilters): Promise<DebugListResponse<SlowRequest>> {
    const response = await api.get(API_ENDPOINTS.ADMIN_DEBUG_CENTRE.SLOW_REQUESTS, { params: transformFilters(filters) });
    return response.data;
  },

  async getSlowExternalCalls(filters: DebugFilters): Promise<DebugListResponse<SlowExternalCall>> {
    const response = await api.get(API_ENDPOINTS.ADMIN_DEBUG_CENTRE.SLOW_EXTERNAL_CALLS, { params: transformFilters(filters) });
    return response.data;
  },

  async getCustomerActivity(filters: DebugFilters): Promise<DebugListResponse<CustomerActivity>> {
    const response = await api.get(API_ENDPOINTS.ADMIN_DEBUG_CENTRE.CUSTOMER_ACTIVITY, { params: transformFilters(filters) });
    return response.data;
  },

  async getTraceDetail(traceId: string): Promise<DebugDetailResponse<TraceDetail>> {
    const response = await api.get(API_ENDPOINTS.ADMIN_DEBUG_CENTRE.TRACE_DETAIL(traceId));
    return response.data;
  },

  async resolveAlert(id: string): Promise<{ status: boolean; message: string }> {
    const response = await api.post(`${API_ENDPOINTS.ADMIN_DEBUG_CENTRE.ALERTS}/${id}/resolve`);
    return response.data;
  },

  async ignoreAlert(id: string): Promise<{ status: boolean; message: string }> {
    const response = await api.post(`${API_ENDPOINTS.ADMIN_DEBUG_CENTRE.ALERTS}/${id}/ignore`);
    return response.data;
  },
};
