import { useState, useEffect } from 'react';
import { CustomModel } from "@/components/ui/dialog";
import { FormInput } from "@/features/orders/components/OrderFormUI";
import type { Setting } from "@/features/settings/types";
import { useUpdateSetting, useSettingDetails } from "../hooks/useSettings";
import { Loader2, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EditSettingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    setting: Setting | null;
}

export function EditSettingDialog({ open, onOpenChange, setting }: EditSettingDialogProps) {
    const [payload, setPayload] = useState<Record<string, any>>({});

    const { data: detailResponse, isLoading: isLoadingDetails } = useSettingDetails(open ? setting?.slug || setting?.id || null : null);
    const { mutate: updateSetting, isPending } = useUpdateSetting();

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

    const handlePayloadChange = (key: string, val: string) => {
        setPayload(prev => ({
            ...prev,
            [key]: val
        }));
    };

    const handleSubmit = () => {
        if (!setting) return;

        updateSetting({
            id: setting.slug,
            data: { payload }
        }, {
            onSuccess: () => onOpenChange(false)
        });
    };

    const formatLabel = (key: string) => {
        return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    return (
        <CustomModel
            title={`Configure ${setting?.name || 'Setting'}`}
            open={open}
            onOpenChange={onOpenChange}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            isLoading={isPending}
            submitText="Save Configuration"
            contentClass="sm:max-w-[500px] w-[800px]"
        >
            <div className="relative">
                {isLoadingDetails && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-zinc-900/60 backdrop-blur-[1px] rounded-xl">
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Fetching Configurations...</p>
                        </div>
                    </div>
                )}

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
            </div>
        </CustomModel>
    );
}
