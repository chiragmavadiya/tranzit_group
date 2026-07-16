import { Activity } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { SectionHeader, TimelineItem } from './Common';
import type { CustomerProfileActivity } from '../../types';

interface ActivityTimelineProps {
    activities: CustomerProfileActivity[];
}

export const ActivityTimeline = ({ activities }: ActivityTimelineProps) => {
    return (
        <Card className="bg-white dark:bg-zinc-950 rounded-xl border border-slate-150 dark:border-zinc-800 shadow-sm overflow-hidden h-full">
            <CardHeader className="px-4 py-2.5 bg-slate-50 dark:bg-zinc-900/50 border-b border-slate-150 dark:border-zinc-800">
                <SectionHeader title="Activity Timeline" icon={Activity} />
            </CardHeader>
            <CardContent className="pt-4">
                <div className="">
                    {activities.map((activity, idx) => (
                        <TimelineItem
                            key={activity.id}
                            item={{
                                id: activity.id.toString(),
                                type: activity.type,
                                title: activity.title,
                                description: activity.description,
                                timestamp: activity.created_at,
                            }}
                            isLast={idx === activities.length - 1}
                        />
                    ))}
                    {activities.length === 0 && (
                        <p className="text-sm text-slate-500">No recent activity.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
