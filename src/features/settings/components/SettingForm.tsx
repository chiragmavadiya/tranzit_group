import { useEffect, useState } from 'react'
import { useSettingDetails, useUpdateSetting } from '../hooks/useSettings';
import { Loader2, Save, ShieldCheck } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FormInput } from '@/features/orders/components/OrderFormUI';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { showToast } from '@/components/ui/custom-toast';

const SettingForm = ({ category }: { category: any }) => {
    const { data: detailResponse, isLoading } = useSettingDetails(category.slug || null);
    const { mutate: updateSetting, isPending } = useUpdateSetting();

    const [payload, setPayload] = useState<Record<string, any>>({});

    const handlePayloadChange = (key: string, val: string) => {
        setPayload(prev => ({
            ...prev,
            [key]: val
        }));
    };

    const onSubmit = () => {
        if (!category?.slug) return;

        updateSetting({
            id: category.slug,
            data: { payload }
        }, {
            onSuccess: (res) => showToast(res.message || "Settings updated successfully", "success"),
            onError: (err) => showToast(err.message || "Failed to update settings", "error")
        });
    };

    const formatLabel = (key: string) => {
        return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    useEffect(() => {
        if (detailResponse?.data) {
            const initialPayload: Record<string, any> = {};

            if (detailResponse.data.payload) {
                Object.keys(detailResponse.data.payload).forEach(key => {
                    initialPayload[key] = detailResponse.data.payload![key];
                });
            }
            setPayload(initialPayload);
        }
    }, [detailResponse]);



    if (isLoading) {
        return (
            <div className="flex items-center justify-center  w-full h-full">
                <Loader2 className="animate-spin text-blue-400 h-10 w-10" />
            </div>
        );
    }
    return (
        <Card className="bg-white dark:bg-zinc-950 rounded-xl border ring-0 border-gray-100 dark:border-zinc-800 shadow-md p-6 fade-in slide-in-from-bottom-4 duration-500">
            <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-zinc-100">
                    {category.name} Settings
                </CardTitle>
                <CardDescription>
                    Configure your {category.name} integration credentials below.
                </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit();
                }}>
                    <div className="space-y-6 pt-2">
                        <Alert className="bg-amber-50/50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-900/20 rounded-xl">
                            <ShieldCheck className="h-4 w-4 text-amber-600" />
                            <AlertDescription className="text-[11px] font-medium text-amber-700 dark:text-amber-400">
                                This setting contains confidential information. Current values are hidden for security. Entering a new value will overwrite the existing one.
                            </AlertDescription>
                        </Alert>

                        <div className="space-y-5">
                            <div className="grid grid-cols-1 gap-5">
                                {Object.keys(payload).length > 0 ? (
                                    Object.keys(payload).map((key) => (
                                        <div key={key} className="relative">
                                            <FormInput
                                                label={formatLabel(key)}
                                                value={payload[key]}
                                                onChange={(val) => handlePayloadChange(key, val)}
                                                placeholder={`Enter new ${formatLabel(key).toLowerCase()}`}
                                                type="password"
                                                autoComplete="new-password"
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-dashed border-slate-200 dark:border-zinc-800">
                                        <p className="text-xs text-slate-400 font-medium">No additional fields for this setting.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="pt-6 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-end gap-3">

                        <Button
                            type="submit"
                            className="bg-[#0060FE] hover:bg-blue-700 text-white min-w-[140px] font-bold"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4 mr-2" />
                            )}
                            Save Settings
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

export default SettingForm