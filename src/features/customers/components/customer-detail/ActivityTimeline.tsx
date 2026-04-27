import { Activity } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { SectionHeader, TimelineItem } from './Common';
import type { CustomerProfileActivity } from '../../types';

interface ActivityTimelineProps {
    activities: CustomerProfileActivity[];
}

export const ActivityTimeline = ({ activities }: ActivityTimelineProps) => {
    return (
        <Card className="bg-white dark:bg-zinc-900 shadow-lg border-none rounded-3xl overflow-hidden h-full">
            <CardHeader className="pb-2 border-b border-slate-100 dark:border-zinc-800/50">
                <SectionHeader title="Activity Timeline" icon={Activity} />
            </CardHeader>
            <CardContent className="pt-4">
                <div className="max-w-2xl">
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
