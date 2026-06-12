import { User, CreditCard, Contact, AtSign, Phone, MapPin } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { ActivityTimeline } from './ActivityTimeline';
import { useCustomerProfile } from '../../hooks/useCustomers';
import { cn } from '@/lib/utils';

interface ProfileTabProps {
    customerId: string;
}

export const ProfileTab = ({ customerId }: ProfileTabProps) => {
    const { data: response, isLoading } = useCustomerProfile(customerId);

    if (isLoading) {
        return <div className="p-8 flex justify-center"><span className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;
    }

    const customer = response?.data;
    if (!customer) return null;

    const markups = [
        customer.charges_markups.aus_post,
        customer.charges_markups.direct_freight,
        customer.charges_markups.pallet
    ].filter(Boolean);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-left-4 duration-500">
            {/* Left Column: Details */}
            <div className="lg:col-span-6 flex flex-col gap-4">
                {/* Basic Information Card */}
                <Card className="bg-white dark:bg-zinc-950 rounded-xl border border-slate-150 dark:border-zinc-800 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between px-4 py-3  bg-gray-100">
                        <div className="flex items-center gap-2">
                            <User className="w-4.5 h-4.5 text-slate-600 dark:text-zinc-400" />
                            <h3 className="my-0 text-base font-bold text-slate-900 dark:text-white">Basic Information</h3>
                        </div>
                    </CardHeader>
                    <CardContent className="p-5 pt-0">
                        <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-xs font-medium text-slate-600 dark:text-zinc-500 ">Full Name</span>
                                <span className="text-sm font-semibold text-slate-900 dark:text-white">{customer.about.full_name}</span>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-xs font-medium text-slate-600 dark:text-zinc-500 ">Business Name</span>
                                <span className="text-sm font-semibold text-slate-900 dark:text-white">{customer.about.business_name || "N/A"}</span>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-xs font-medium text-slate-600 dark:text-zinc-500 ">GST Number</span>
                                <span className="text-sm font-semibold text-slate-900 dark:text-white">{customer.about.gst?.toString() || 'N/A'}</span>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-xs font-medium text-slate-600 dark:text-zinc-500 ">Role</span>
                                <span className="text-sm font-semibold text-slate-900 dark:text-white capitalize">{customer.about.role}</span>
                            </div>
                            <div className="flex flex-col gap-0.5 col-span-2">
                                <span className="text-xs font-medium text-slate-600 dark:text-zinc-500 ">Status</span>
                                <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-white">
                                    <span className={cn("w-2 h-2 rounded-full", customer.about.status_code === '1' ? "bg-emerald-500" : "bg-red-500")} />
                                    <span className='capitalize'>{customer.about.status_code === '1' ? 'Active' : 'Inactive'}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Details Card */}
                <Card className="bg-white dark:bg-zinc-950 rounded-xl border border-slate-150 dark:border-zinc-800 shadow-sm">
                    <CardHeader className="flex flex-row items-center gap-2  px-4 py-3  bg-gray-100">
                        <Contact className="w-4.5 h-4.5 text-slate-600 dark:text-zinc-400" />
                        <h3 className="text-base my-0 font-bold text-slate-900 dark:text-white">Contact Details</h3>
                    </CardHeader>
                    <CardContent className="p-5 pt-0">
                        <div className="flex flex-col gap-3">
                            {/* Phone */}
                            <div className='flex gap-4 w-full '>
                                <div className="flex flex-1 items-center gap-3  rounded-md dark:border-zinc-800">
                                    <div className="w-10 h-10 rounded-lg bg-white dark:bg-zinc-950 border border-slate-150 dark:border-zinc-800 flex items-center justify-center flex-shrink-0 text-slate-600 dark:text-zinc-400">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Phone</span>
                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{customer.contacts.contact || "N/A"}</span>
                                    </div>
                                </div>
                                {/* Email */}
                                <div className="flex flex-1 items-center gap-3  rounded-md dark:border-zinc-800">
                                    <div className="w-10 h-10 rounded-lg bg-white dark:bg-zinc-950 border border-slate-150 dark:border-zinc-800 flex items-center justify-center flex-shrink-0 text-slate-600 dark:text-zinc-400">
                                        <AtSign className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Email</span>
                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{customer.contacts.email || "N/A"}</span>
                                    </div>
                                </div>
                            </div>
                            {/* Address */}
                            <div className="flex items-center gap-3  rounded-md dark:border-zinc-800">
                                <div className="w-10 h-10 rounded-lg bg-white dark:bg-zinc-950 border border-slate-150 dark:border-zinc-800 flex items-center justify-center flex-shrink-0 text-slate-600 dark:text-zinc-400">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Pickup Address</span>
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {customer?.pickup_address?.address_info || (customer?.pickup_address?.address ? `${customer?.pickup_address?.address}, ${customer?.pickup_address?.post_code}` : "No Address")}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3  rounded-md dark:border-zinc-800">
                                <div className="w-10 h-10 rounded-lg bg-white dark:bg-zinc-950 border border-slate-150 dark:border-zinc-800 flex items-center justify-center flex-shrink-0 text-slate-600 dark:text-zinc-400">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Billing Address</span>
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {customer?.billing_address?.address_info || (customer?.billing_address?.address ? `${customer?.billing_address?.address}, ${customer?.pickup_address?.post_code}` : "No Address")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Charges & Markups Card */}
                <Card className="bg-white dark:bg-zinc-950 rounded-xl border border-slate-150 dark:border-zinc-800 shadow-sm">
                    <CardHeader className="flex flex-row items-center gap-2 px-4 py-3  bg-gray-100">
                        <CreditCard className="w-4.5 h-4.5 text-slate-600 dark:text-zinc-400" />
                        <h3 className="text-base my-0  font-bold text-slate-900 dark:text-white">Charges & Markups</h3>
                    </CardHeader>
                    <CardContent className="p-5 pt-0">
                        <div className="grid grid-cols-3 gap-3">
                            {markups.map((m, i) => (
                                <div key={i} className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800 flex flex-col gap-2.5">
                                    <span className="text-[14px] font-bold text-slate-600 dark:text-zinc-500 uppercase tracking-wide">{m.title}</span>
                                    <div className="flex flex-col gap-1.5 text-sm">
                                        <div className="flex justify-between items-center text-slate-600 dark:text-zinc-400">
                                            <span>Markup:</span>
                                            <span className="font-bold text-slate-900 dark:text-white">{Number(m.markup).toFixed(2)}%</span>
                                        </div>
                                        <div className="flex justify-between items-center text-slate-600 dark:text-zinc-400">
                                            <span>Pickup:</span>
                                            <span className="font-bold text-slate-900 dark:text-white">${Number(m.pickup).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column: Timeline */}
            <div className="lg:col-span-6">
                <ActivityTimeline activities={customer.activity_timeline} />
            </div>
        </div>
    );
};
