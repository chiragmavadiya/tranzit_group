import { StatCard } from '@/components/common/StatCard';
import { useDebugCentreStats } from '../hooks';
import { TrendingUp, AlertTriangle, AlertCircle, Zap, Cpu, Gauge } from 'lucide-react';

export const DebugStatsGrid = () => {
  const { data: statsData, isLoading } = useDebugCentreStats();
  //  
  // const isLoading = false;
  const stats = statsData?.data || {};

  const cards = [
    {
      label: 'Total Traces',
      value: stats?.total_traces ?? 0,
      icon: Zap,
      color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
      loading: isLoading,
    },
    {
      label: 'Failed Requests',
      value: stats?.total_failed_requests ?? 0,
      icon: AlertTriangle,
      color: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
      loading: isLoading,
    },
    {
      label: 'Active Alerts',
      value: stats?.total_active_alerts ?? 0,
      icon: AlertCircle,
      color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
      loading: isLoading,
    },
    {
      label: 'Failed Jobs',
      value: stats?.total_failed_jobs ?? 0,
      icon: TrendingUp,
      color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
      loading: isLoading,
    },
    {
      label: 'External API Failures',
      value: stats?.total_external_api_failures ?? 0,
      icon: Cpu,
      color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
      loading: isLoading,
    },
    {
      label: 'Slow Requests',
      value: stats?.total_slow_requests ?? 0,
      icon: Gauge,
      color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
      loading: isLoading,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card, idx) => (
        <StatCard
          key={idx}
          label={card.label}
          value={card.value}
          icon={card.icon}
          color={card.color}
          loading={card.loading}
        />
      ))}
    </div>
  );
};
