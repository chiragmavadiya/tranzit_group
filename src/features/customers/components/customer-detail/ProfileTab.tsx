import { Users, CheckCircle2, Settings, FileText, Building2, Mail, Phone, MapPin, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SectionHeader, DetailItem } from './Common';
import { ActivityTimeline } from './ActivityTimeline';
import type { CustomerDetail } from './types';

interface ProfileTabProps {
    customer: CustomerDetail;
}

export const ProfileTab = ({ customer }: ProfileTabProps) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-left-4 duration-500">
            {/* Left Column: Details */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                <Card className="bg-white dark:bg-zinc-900 shadow-lg border-none rounded-3xl overflow-hidden">
                    <CardHeader className="pb-4">
                        <SectionHeader title="About" icon={Users} />
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <DetailItem label="Full Name" value={customer.fullName} icon={Users} />
                        <DetailItem label="Status" value={customer.status} icon={CheckCircle2} />
                        <DetailItem label="Role" value={customer.role} icon={Settings} />
                        <DetailItem label="GST" value={customer.gst} icon={FileText} />
                        <DetailItem label="Business Name" value={customer.businessName} icon={Building2} />

                        <Separator className="my-2 bg-slate-50 dark:bg-zinc-800" />

                        <SectionHeader title="Contacts" icon={Mail} />
                        <DetailItem label="Contact" value={customer.contact} icon={Phone} />
                        <DetailItem label="Email" value={customer.email} icon={Mail} />

                        <Separator className="my-2 bg-slate-50 dark:bg-zinc-800" />

                        <SectionHeader title="Pickup Address" icon={MapPin} />
                        <DetailItem label="Address" value={customer.address} icon={MapPin} />
                        <DetailItem label="Postcode" value={customer.postcode} icon={MapPin} />

                        <Separator className="my-2 bg-slate-50 dark:bg-zinc-800" />

                        <SectionHeader title="Charges & Markups" icon={TrendingUp} />
                        <div className="space-y-4">
                            {customer.markup.map((m, i) => (
                                <div key={i} className="flex flex-col gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-zinc-950/50 border border-slate-100 dark:border-zinc-800">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-900 dark:text-zinc-100">{m.courier}</span>
                                        <div className="flex items-center gap-1.5">
                                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                            <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">{m.markup}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pickup</span>
                                        <span className="text-xs font-bold text-slate-600 dark:text-zinc-400">{m.pickup}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column: Timeline */}
            <div className="lg:col-span-8">
                <ActivityTimeline />
            </div>
        </div>
    );
};
