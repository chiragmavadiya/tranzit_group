import { Zap, AlertTriangle, AlertCircle, Cpu, Gauge, Activity, Zap as ZapOff } from 'lucide-react';

export const DEBUG_TABS = [
  { key: 'traces', label: 'Traces', icon: Zap },
  { key: 'alerts', label: 'Alerts', icon: AlertTriangle },
  { key: 'failed-jobs', label: 'Failed Jobs', icon: AlertCircle },
  { key: 'external-api-failures', label: 'External API Failures', icon: Cpu },
  { key: 'slow-requests', label: 'Slow Requests', icon: Gauge },
  { key: 'slow-external-calls', label: 'Slow External Calls', icon: ZapOff },
  { key: 'customer-activity', label: 'Customer Activity', icon: Activity },
] as const;

export type TabKey = typeof DEBUG_TABS[number]['key'];
