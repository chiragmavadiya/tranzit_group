import type { Column } from '@/components/common/types/DataTable.types';
import { StatusBadge } from '../components/badges/StatusBadge';
import { DurationBadge } from '../components/badges/DurationBadge';
import { SeverityBadge } from '../components/badges/SeverityBadge';
import type {
  DebugTrace, DebugAlert, FailedJob, ExternalApiFailure, SlowExternalCall
  // , SlowRequest, , CustomerActivity 
} from '../types';
import { LinkCell } from '@/components/common';

const getTraceDetailPath = (traceId: string) => {
  const params = new URLSearchParams(window.location.search);
  const activeTab = params.get('tab');
  if (activeTab) {
    return `/admin/debug-centre/${traceId}?fromTab=${activeTab}`;
  }
  return `/admin/debug-centre/${traceId}`;
};

const statusConfig = {
  active: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  open: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  resolved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  ignored: "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400"
}

export const TRACES_COLUMNS: Column<DebugTrace>[] = [
  {
    key: 'trace_id',
    header: 'Trace ID',
    width: '120px',
    disableToggle: true,
    cell: (val) => <LinkCell value={val} path={getTraceDetailPath(val)} />
  },
  {
    key: 'user_name',
    header: 'Customer',
  },
  {
    key: 'source',
    header: 'Source',
  },
  {
    key: 'main_action',
    header: 'Action',
    cell: (value) => value ? String(value).replace(/[_-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : '-',
  },
  {
    key: 'endpoint',
    header: 'Endpoint',
  },
  {
    key: 'status',
    header: 'Status',
    className: 'capitalize',
    cell: (value) => <StatusBadge status={value} statusConfig={statusConfig} />,
  },
  {
    key: 'status_code',
    header: 'Code',
    width: '80px',
  },
  {
    key: 'duration_ms',
    header: 'Duration',
    cell: (value) => <DurationBadge duration={value} />,
  },
  {
    key: 'created_at',
    header: 'Created',
    cell: (value) => value,
  },
];

// export const ALERTS_COLUMNS = [...TRACES_COLUMNS]
// export const FAILED_JOBS_COLUMNS: Column<any>[] = [...TRACES_COLUMNS]
// export const EXTERNAL_API_FAILURES_COLUMNS: Column<any>[] = [...TRACES_COLUMNS]
export const SLOW_REQUESTS_COLUMNS: Column<any>[] = [...TRACES_COLUMNS]
// export const SLOW_EXTERNAL_CALLS_COLUMNS: Column<any>[] = [...TRACES_COLUMNS]
export const CUSTOMER_ACTIVITY_COLUMNS: Column<any>[] = [...TRACES_COLUMNS]
export const ALERTS_COLUMNS: Column<DebugAlert>[] = [
  {
    key: 'trace_id',
    header: 'Trace ID',
    width: '120px',
    disableToggle: true,
    cell: (val) => <LinkCell value={val} path={getTraceDetailPath(val)} />
  },
  {
    key: 'title',
    header: 'Title',
  },
  {
    key: 'severity',
    header: 'Severity',
    cell: (value) => <SeverityBadge severity={value} />,
  },
  // {
  //   key: 'user_name',
  //   header: 'Customer',
  // },
  // {
  //   key: 'source',
  //   header: 'Source',
  // },

  {
    key: 'status',
    header: 'Status',
    className: 'capitalize',
    cell: (value) => <StatusBadge status={value} statusConfig={statusConfig} />,
  },
  {
    key: 'created_at',
    header: 'Created',
  },
];

export const FAILED_JOBS_COLUMNS: Column<FailedJob>[] = [
  {
    key: 'trace_id',
    header: 'Trace ID',
    width: '120px',
    disableToggle: true,
    cell: (val) => <LinkCell value={val} path={getTraceDetailPath(val)} />
  },
  {
    key: 'event_name',
    header: 'Job Name',
    cell: (value) => value ? String(value).replace(/[_-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : '-',
  },
  {
    key: 'event_type',
    header: 'Queue',
  },
  {
    key: 'exception_class',
    header: 'Exception',
  },
  {
    key: 'error_message',
    header: 'Error',
  },
  {
    key: 'status',
    header: 'Status',
    cell: (value) => <StatusBadge status={value} />,
  },
  {
    key: 'created_at',
    header: 'Created',
  },
];

export const EXTERNAL_API_FAILURES_COLUMNS: Column<ExternalApiFailure>[] = [
  {
    key: 'trace_id',
    header: 'Trace ID',
    width: '120px',
    disableToggle: true,
    cell: (val) => <LinkCell value={val} path={getTraceDetailPath(val)} />
  },
  {
    key: 'user_name',
    header: 'Customer',
    cell: (_, row: ExternalApiFailure) => row?.request_trace?.user_name || '-',
  },
  {
    key: 'provider',
    header: 'Provider',
    cell: (val) => val ? String(val).replace(/[_-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : '-',

  },
  {
    key: 'endpoint',
    header: 'Endpoint',
    cell: (_, row: ExternalApiFailure) => row?.request_trace?.endpoint || '-',
  },
  // method
  {
    key: 'method',
    header: 'Method',
    cell: (_, row: ExternalApiFailure) => row?.request_trace?.method || '-',

  },

  // exception_class
  {
    key: 'exception_class',
    header: 'Exception',
  },

  {
    key: 'status',
    header: 'Status',
    width: '80px',
    className: 'capitalize',
    cell: (value) => <StatusBadge status={value} />,
  },
  {
    key: 'duration_ms',
    header: 'Duration',
    cell: (value) => <DurationBadge duration={value} />,
  },
  {
    key: 'created_at',
    header: 'Created',
  },
];

// export const SLOW_REQUESTS_COLUMNS: Column<SlowRequest>[] = [
//   {
//     key: 'trace_id',
//     header: 'Trace ID',
//     width: '120px',
//     cell: (val) => <LinkCell value={val} path={`/admin/debug-centre/${val}`} />
//   },
//   {
//     key: 'endpoint',
//     header: 'Endpoint',
//   },
//   {
//     key: 'duration_ms',
//     header: 'Duration',
//     cell: (value, row) => <DurationBadge duration={value} threshold={row.threshold} />,
//   },
//   {
//     key: 'threshold',
//     header: 'Threshold',
//     cell: (value) => <DurationBadge duration={value} />,
//   },
//   {
//     key: 'user_name',
//     header: 'Customer',
//   },
//   {
//     key: 'source',
//     header: 'Source',
//   },
//   {
//     key: 'created_at',
//     header: 'Created',
//   },
// ];

export const SLOW_EXTERNAL_CALLS_COLUMNS: Column<SlowExternalCall>[] = [
  {
    key: 'trace_id',
    header: 'Trace ID',
    width: '120px',
    disableToggle: true,
    cell: (val) => <LinkCell value={val} path={getTraceDetailPath(val)} />
  },
  {
    key: 'user_name',
    header: 'Customer',
    cell: (_, row: SlowExternalCall) => row?.request_trace?.user_name || '-',
  },
  {
    key: 'provider',
    header: 'Provider',
  },
  {
    key: 'endpoint',
    header: 'Endpoint',
    cell: (_, row: SlowExternalCall) => row?.request_trace?.endpoint || '-',
  },
  {
    key: 'duration_ms',
    header: 'Duration',
    cell: (value, row) => <DurationBadge duration={value} threshold={row.threshold} />,
  },
  {
    key: 'status',
    header: 'Status',
    width: '80px',
    className: 'capitalize',
    cell: (value) => <StatusBadge status={value} />,
  },
  {
    key: 'created_at',
    header: 'Created',
  },
];

// export const CUSTOMER_ACTIVITY_COLUMNS: Column<CustomerActivity>[] = [
//   {
//     key: 'trace_id',
//     header: 'Trace ID',
//     width: '120px',
//     cell: (val) => <LinkCell value={val} path={`/admin/debug-centre/${val}`} />
//   },
//   {
//     key: 'user_name',
//     header: 'Customer',
//   },
//   {
//     key: 'user',
//     header: 'User',
//   },
//   {
//     key: 'module',
//     header: 'Module',
//   },
//   {
//     key: 'action',
//     header: 'Action',
//   },
//   {
//     key: 'browser',
//     header: 'Browser',
//   },
//   {
//     key: 'ipAddress',
//     header: 'IP Address',
//   },
//   {
//     key: 'created_at',
//     header: 'Created',
//   },
// ];
