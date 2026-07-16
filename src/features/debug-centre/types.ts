export type TraceStatus = 'success' | 'failed' | 'pending' | 'cancelled' | 'processing';
export type Severity = 'critical' | 'warning' | 'info' | 'high' | 'low' | 'medium';
export type Provider = 'Australia Post' | 'StarTrack' | 'MyPost Business' | 'Shopify' | 'WooCommerce';

// Timeline event for trace detail
export interface TimelineEvent {
  id: string | number;
  time?: string;
  duration?: number;
  status: string;
  title?: string;
  icon?: string;
  description?: string;

  // Real API properties
  trace_id?: string;
  event_type?: string;
  event_name?: string;
  provider?: string | null;
  status_code?: number | null;
  duration_ms?: number;
  error_message?: string | null;
  exception_class?: string | null;
  created_at?: string;
}

// External API call details
export interface ExternalApiCall {
  provider: Provider;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  status: number;
  duration: number;
  retryCount: number;
  request: Record<string, any>;
  response: Record<string, any>;
  headers?: Record<string, string>;
}

// Job failure details
export interface JobFailureDetail {
  jobName: string;
  queue: string;
  attempts: number;
  failedAt: string;
  exception: string;
  errorMessage: string;
  stackTrace: string;
}

// Main entities
export interface DebugTrace {
  id: string;
  trace_id?: string;
  user_name?: string;
  customer?: string;
  user?: string;
  action?: string;
  main_action?: string;
  endpoint?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  status?: TraceStatus;
  statusCode?: number;
  status_code?: number;
  duration?: number;
  duration_ms?: number;
  source?: 'api' | 'webhook' | 'cron' | 'manual' | 'scheduler';
  createdAt?: string;
  created_at?: string;
  environment?: 'production' | 'staging' | 'development';
}

export interface DebugAlert {
  id: string;
  alert: string;
  severity: Severity;
  customer: string;
  source: string;
  status: 'active' | 'resolved' | 'acknowledged' | 'open';
  createdAt: string;
}

export interface FailedJob {
  id: string;
  jobName: string;
  queue: string;
  attempts: number;
  customer: string;
  error: string;
  status: TraceStatus;
  createdAt: string;
}

export interface ExternalApiFailure {
  id: string;
  provider: Provider;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  statusCode: number;
  duration: number;
  retryCount: number;
  customer: string;
  createdAt: string;
  request_trace: {
    endpoint: string;
    method: string;
    status_code: number;
    duration_ms: number;
    environment: string;
    user_agent: string;
    operatingSystem: string;
    ip_address: string;
    device: string;
    sessionId: string;
    created_at: string;
    user_name: string;
  }
}

export interface SlowRequest {
  id: string;
  endpoint: string;
  duration: number;
  threshold: number;
  customer: string;
  source: string;
  createdAt: string;
}

export interface SlowExternalCall {
  id: string;
  provider: Provider;
  endpoint: string;
  duration: number;
  threshold: number;
  customer: string;
  createdAt: string;
  request_trace: {
    endpoint: string;
    method: string;
    status_code: number;
    duration_ms: number;
    environment: string;
    user_agent: string;
    operatingSystem: string;
    ip_address: string;
    device: string;
    sessionId: string;
    created_at: string;
    user_name: string;
  }
}

export interface CustomerActivity {
  id: string;
  customer: string;
  user: string;
  module: string;
  action: string;
  browser: string;
  ipAddress: string;
  createdAt: string;
}

export interface DebugCentreStats {
  total_traces?: number;
  total_failed_requests?: number;
  total_active_alerts?: number;
  total_failed_jobs?: number;
  total_external_api_failures?: number;
  total_slow_requests?: number;
}

// Trace detail with all related data
export interface TraceDetail {
  id: string;
  customer?: string;
  user?: string;
  action?: string;
  endpoint?: string;
  method?: string;
  status?: TraceStatus;
  statusCode?: number;
  duration?: number;
  environment?: string;
  browser?: string;
  operatingSystem?: string;
  ipAddress?: string;
  device?: string;
  sessionId?: string;
  createdAt?: string;

  // Real API properties
  trace_summary?: {
    id: string;
    trace_id: string;
    user_name: string;
    user_email: string;
    main_action: string;
    endpoint: string;
    method: string;
    source: string;
    status: TraceStatus;
    status_code: number;
    duration_ms: number;
    environment: string;
    user_agent: string;
    operatingSystem: string;
    ip_address: string;
    device: string;
    sessionId: string;
    created_at: string;
    error_message: string;
  };
  duration_ms?: number;

  timeline: TimelineEvent[];
  request_payload?: Record<string, any>;
  response_payload?: Record<string, any>;
  request?: Record<string, any>;
  response?: Record<string, any>;
  externalApis?: ExternalApiCall[];
  external_api_payloads?: any[];
  jobFailure?: JobFailureDetail;
  job_failure_details?: any[];
  alerts?: DebugAlert[];
  system_alerts?: any[];
}

// Filter types
export interface DebugFilters {
  search?: string;
  user_id?: string;
  endpoint?: string;
  status?: string;
  source?: string;
  from_date?: string;
  to_date?: string;
  fromDate?: string;
  toDate?: string;
  customer?: string;
  page?: number;
  per_page?: number;
}

// API response types
export interface ListMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface DebugListResponse<T> {
  status: boolean;
  message: string;
  data: T[];
  meta: ListMeta;
}

export interface DebugDetailResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

export interface DebugStatsResponse {
  status: boolean;
  message: string;
  data: DebugCentreStats;
}
