import { Users, CheckCircle2, MapPin, Calendar, Wallet, Edit3, UserMinus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { CustomerDetail } from './types';

interface CustomerHeaderProps {
    customer: CustomerDetail;
}

export const CustomerHeader = ({ customer }: CustomerHeaderProps) => {
    return (
        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 shadow-md border border-white/20 dark:border-zinc-800/50">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <Users className="h-36 w-36 text-slate-900" />
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8 p-8 relative z-10">
                <div className="relative">
                    <div className="flex h-18 w-18 items-center justify-center rounded-[1.8rem] bg-gradient-to-br from-blue-500 to-indigo-600 text-3xl font-black text-white shadow-2xl shadow-blue-500/20">
                        {customer.name.slice(0, 2).toUpperCase()}
                    </div>
                    {customer.verified && (
                        <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-zinc-900 p-1 shadow-lg">
                            <div className="flex h-full w-full items-center justify-center rounded-full bg-emerald-500 text-white">
                                <CheckCircle2 className="h-4 w-4" />
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex-1 flex flex-col items-center md:items-start gap-4">
                    <div className="flex flex-col items-center md:items-start">
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic">{customer.name}</h1>
                        <div className="flex flex-wrap items-center gap-4 mt-2">
                            <div className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400">
                                <MapPin className="h-4 w-4" />
                                <span className="text-xs font-bold uppercase tracking-widest">{customer.location}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400">
                                <Calendar className="h-4 w-4" />
                                <span className="text-xs font-bold uppercase tracking-widest">Joined {customer.joinedDate}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Wallet className="h-4 w-4 text-emerald-500" />
                                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Balance: {customer.balance}</span>
                            </div>
                            <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-none font-black px-3 py-1 uppercase text-[10px] tracking-widest">
                                Verified
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-8 rounded-xl gap-2">
                        <Edit3 className="h-3.5 w-3.5" />
                        Edit Details
                    </Button>
                    <Button variant="destructive" className="h-8 rounded-xl gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 border-none shadow-lg">
                        <UserMinus className="h-3.5 w-3.5" />
                        Deactivate Account
                    </Button>
                </div>
            </div>
        </div>
    );
};
