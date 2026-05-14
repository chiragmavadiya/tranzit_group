import { Building2, X, Check } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/features/orders/components/OrderFormUI';
import { cn } from '@/lib/utils';
import { SectionHeader } from './Common';
import { useState } from 'react';

export const CreditApplicationTab = () => {
    const [formData, setFormData] = useState({
        registeredName: 'Shikhar',
        acn: '78454541545455',
        abn: '12345678945',
        tradingAs: 'SHIKHAR DIGISITE',
        businessType: 'Sole Trader'
    });

    return (
        <Card className="bg-white dark:bg-zinc-900 shadow-md border-none ring-0 shadow-md rounded-xl overflow-hidden animate-in fade-in slide-in-from-left-4 duration-500">
            <CardHeader className="pb-4 border-b border-slate-50 dark:border-zinc-800/50">
                <div className="flex items-center justify-between">
                    <SectionHeader title="Company Details" icon={Building2} />
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            className="h-8 rounded-lg gap-2"
                        >
                            <X className="h-3.5 w-3.5" />
                            Reject
                        </Button>
                        <Button
                            className="h-8 rounded-lg bg-primary hover:bg-primary-hover text-white gap-2 shadow-md shadow-primary/20"
                        >
                            <Check className="h-3.5 w-3.5" />
                            Approve
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="">
                <div className="grid grid-cols-12 gap-x-8 gap-y-5">
                    <FormInput
                        label="Registered Name (in full)"
                        value={formData.registeredName}
                        onChange={(val) => setFormData({ ...formData, registeredName: val })}
                        required
                        isHalf
                    />
                    <FormInput
                        label="ACN"
                        value={formData.acn}
                        onChange={(val) => setFormData({ ...formData, acn: val })}
                        required
                        isHalf
                    />
                    <FormInput
                        label="Company ABN"
                        value={formData.abn}
                        onChange={(val) => setFormData({ ...formData, abn: val })}
                        required
                        isHalf
                    />
                    <FormInput
                        label="Trading As"
                        value={formData.tradingAs}
                        onChange={(val) => setFormData({ ...formData, tradingAs: val })}
                        required
                        isHalf
                    />
                    <div className="col-span-12 space-y-2">
                        <div className="text-[11px] font-extrabold text-slate-700 dark:text-zinc-400 uppercase tracking-wider ml-0.5">
                            Business Type <span className="text-destructive">*</span>
                        </div>
                        <div className="flex items-center gap-6">
                            {['Sole Trader', 'Partnership', 'Pty Ltd'].map((type) => (
                                <div
                                    key={type}
                                    className="flex items-center gap-2 cursor-pointer group"
                                    onClick={() => setFormData({ ...formData, businessType: type })}
                                >
                                    <div className={cn(
                                        "h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all",
                                        formData.businessType === type ? "border-slate-900 bg-slate-900 dark:border-white dark:bg-white" : "border-slate-200 dark:border-zinc-800"
                                    )}>
                                        {formData.businessType === type && <div className="h-1.5 w-1.5 rounded-full bg-white dark:bg-zinc-950" />}
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-600 dark:text-zinc-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{type}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
