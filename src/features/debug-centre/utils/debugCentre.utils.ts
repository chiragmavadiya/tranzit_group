import type { TraceDetail } from '../types';

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export function isSlow(duration: number, threshold: number): boolean {
  return duration > threshold;
}

export function buildCopySummary(trace: TraceDetail): string {
  const summary = trace.trace_summary;
  const requestId = summary?.trace_id || trace.id || '';
  const customer = summary?.user_name || trace.customer || trace.user || '';
  const method = (summary?.method || trace.method || '').toUpperCase();
  const endpoint = summary?.endpoint || trace.endpoint || '';
  const endpointStr = method ? `${method} ${endpoint}` : endpoint;
  const statusCode = summary?.status_code || trace.statusCode || summary?.status || trace.status || '';
  const issue = summary?.error_message || trace.jobFailure?.errorMessage || '';
  const time = summary?.created_at || trace.createdAt || '';

  const lines = [
    `Request ID: ${requestId}`,
    `Customer: ${customer}`,
    `Endpoint: ${endpointStr}`,
    `Status: ${statusCode}`,
  ];

  if (issue) {
    lines.push(`Issue: ${issue}`);
  }

  lines.push(`Time: ${time}`);

  return lines.join('\n');
}
