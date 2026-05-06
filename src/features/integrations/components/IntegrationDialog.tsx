import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/features/orders/components/OrderFormUI";
import { useIntegrationStatus, useConnectIntegration, useSyncIntegration } from "../hooks/useIntegrations";
import { Loader2, RefreshCw } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { showToast } from "@/components/ui/custom-toast";

interface IntegrationDialogProps {
    provider: { id: string; name: string; type: string };
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function IntegrationDialog({ provider, isOpen, onOpenChange }: IntegrationDialogProps) {
    const { data: statusResponse, isLoading: loadingStatus } = useIntegrationStatus(provider.id, isOpen);
    const connectMutation = useConnectIntegration();
    const syncMutation = useSyncIntegration();

    const [formData, setFormData] = useState<any>({});
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (statusResponse?.data) {
            setFormData(statusResponse.data);
        } else if (!isOpen) {
            setFormData({});
            setSubmitted(false);
            setErrors({});
        }
    }, [statusResponse, isOpen]);

    const handleInputChange = (value: any, name: any) => {
        setFormData((prev: any) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        const requiredFields: Record<string, string[]> = {
            auspost: ['api_key', 'api_password', 'base_url', 'account_number', 'account_label'],
            aramex: ['client_id', 'client_secret', 'account_name', 'account_label'],
            mypostbusiness: ['merchant_token', 'base_url', 'account_label'],
            directfreight: ['token', 'account', 'site_id', 'base_url', 'consignment_token', 'account_label'],
            shopify: ['shop'],
            woocommerce: ['store_url', 'consumer_key', 'consumer_secret']
        };

        const fieldsToValidate = requiredFields[provider.id] || [];
        fieldsToValidate.forEach(field => {
            if (!formData[field] || (typeof formData[field] === 'string' && !formData[field].trim())) {
                const label = field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                newErrors[field] = `${label} is required`;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);

        if (!validateForm()) {
            showToast("Please fill in all required fields.", "error");
            return;
        }

        connectMutation.mutate({ provider: provider.id, data: formData }, {
            onSuccess: () => {

                onOpenChange(false);
            },
        });
    };

    const renderFields = () => {
        const commonProps = (name: string) => ({
            name,
            value: formData[name] || "",
            onChange: (val: any) => handleInputChange(val, name),
            required: true,
            error: submitted && !!errors[name],
            errormsg: errors[name]
        });

        switch (provider.id) {
            case 'auspost':
                return (
                    <>
                        <FormInput label="API Key" {...commonProps("api_key")} />
                        <FormInput label="API Password" {...commonProps("api_password")} type="password" />
                        <FormInput label="Base URL" {...commonProps("base_url")} placeholder="https://digitalapi.auspost.com.au/test/" />
                        <FormInput label="Account Number" {...commonProps("account_number")} />
                        <FormInput label="Account Label" {...commonProps("account_label")} />
                    </>
                );
            case 'aramex':
                return (
                    <>
                        <FormInput label="Client ID" {...commonProps("client_id")} />
                        <FormInput label="Client Secret" {...commonProps("client_secret")} type="password" />
                        <FormInput label="Account Name" {...commonProps("account_name")} />
                        <FormInput label="Account Label" {...commonProps("account_label")} />
                    </>
                );
            case 'mypostbusiness':
                return (
                    <>
                        <FormInput label="Merchant Token" {...commonProps("merchant_token")} />
                        <FormInput label="Base URL" {...commonProps("base_url")} placeholder="https://digitalapi.auspost.com.au/test" />
                        <FormInput label="Account Label" {...commonProps("account_label")} />
                    </>
                );
            case 'directfreight':
                return (
                    <>
                        <FormInput label="Token" {...commonProps("token")} />
                        <FormInput label="Account" {...commonProps("account")} />
                        <FormInput label="Site ID" {...commonProps("site_id")} />
                        <FormInput label="Base URL" {...commonProps("base_url")} />
                        <FormInput label="Consignment Token" {...commonProps("consignment_token")} />
                        <FormInput label="Account Label" {...commonProps("account_label")} />
                    </>
                );
            case 'shopify':
                return (
                    <>
                        <FormInput label="Shop Domain" {...commonProps("shop")} placeholder="your-store.myshopify.com" />
                    </>
                );
            case 'woocommerce':
                return (
                    <>
                        <FormInput label="Store URL" {...commonProps("store_url")} placeholder="https://your-store.com" />
                        <FormInput label="Consumer Key" {...commonProps("consumer_key")} />
                        <FormInput label="Consumer Secret" {...commonProps("consumer_secret")} type="password" />
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] py-0 gap-0">
                <DialogHeader className="border-b ">
                    <DialogTitle className="flex items-center">
                        {provider.name} Settings
                    </DialogTitle>
                    <DialogDescription>
                        Configure your {provider.name} integration credentials below.
                    </DialogDescription>
                </DialogHeader>

                {loadingStatus ? (
                    <div className="flex items-center justify-center py-10">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    </div>
                ) : (
                    <form onSubmit={onSubmit} className="space-y-4 py-4">
                        {renderFields()}

                        {statusResponse?.data?.connected && provider.type === 'ecommerce' && (
                            <Alert className="bg-blue-50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/20">
                                <RefreshCw className="h-4 w-4 text-blue-600" />
                                <AlertTitle className="text-sm font-bold text-blue-800 dark:text-blue-300">Sync Data</AlertTitle>
                                <AlertDescription className="text-xs text-blue-700 dark:text-blue-400 flex items-center justify-between mt-2">
                                    Last synced: {statusResponse.data.last_synced_at || 'Never'}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="h-7 text-[10px] bg-white"
                                        onClick={() => syncMutation.mutate(provider.id)}
                                        disabled={syncMutation.isPending}
                                    >
                                        {syncMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <RefreshCw className="w-3 h-3 mr-1" />}
                                        Sync Now
                                    </Button>
                                </AlertDescription>
                            </Alert>
                        )}

                        <DialogFooter className="pt-4">
                            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-[#0060FE] hover:bg-blue-700 text-white"
                                disabled={connectMutation.isPending}
                            >
                                {connectMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                {statusResponse?.data?.connected ? "Update Settings" : "Connect Integration"}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
