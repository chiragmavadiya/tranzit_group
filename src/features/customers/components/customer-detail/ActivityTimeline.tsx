import { Activity } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { SectionHeader, TimelineItem } from './Common';
import { MOCK_ACTIVITIES } from './constants';

export const ActivityTimeline = () => {
    return (
        <Card className="bg-white dark:bg-zinc-900 shadow-lg border-none rounded-3xl overflow-hidden h-full">
            <CardHeader className="pb-8 border-b border-slate-50 dark:border-zinc-800/50">
                <SectionHeader title="Activity Timeline" icon={Activity} />
            </CardHeader>
            <CardContent className="pt-8">
                <div className="max-w-2xl">
                    {MOCK_ACTIVITIES.map((activity, idx) => (
                        <TimelineItem
                            key={activity.id}
                            item={activity}
                            isLast={idx === MOCK_ACTIVITIES.length - 1}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
