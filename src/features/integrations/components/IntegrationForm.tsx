import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/features/orders/components/OrderFormUI";
import { useIntegrationStatus, useConnectIntegration, useSyncIntegration, useDisconnectIntegration } from "../hooks/useIntegrations";
import { Loader2, RefreshCw, Save, Link2Off } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { showToast } from "@/components/ui/custom-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface IntegrationFormProps {
    provider: { id: string; name: string; type: string };
}

export function IntegrationForm({ provider }: IntegrationFormProps) {
    const { data: statusResponse, isLoading: loadingStatus } = useIntegrationStatus(provider.id, true);
    const connectMutation = useConnectIntegration();
    const syncMutation = useSyncIntegration();
    const disconnectMutation = useDisconnectIntegration();

    const [formData, setFormData] = useState<any>({});
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (statusResponse?.data) {
            setFormData(statusResponse.data);
        } else {
            setFormData({});
            setSubmitted(false);
            setErrors({});
        }
    }, [statusResponse, provider.id]);

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
                showToast(`${provider.name} settings updated successfully.`, "success");
            },
        });
    };

    const handleDisconnect = () => {
        if (window.confirm(`Are you sure you want to disconnect ${provider.name}?`)) {
            disconnectMutation.mutate(provider.id);
        }
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
                return (
                    <div className="py-10 text-center">
                        <p className="text-slate-500">Configuration for {provider.name} is coming soon.</p>
                    </div>
                );
        }
    };

    if (loadingStatus) {
        return (
            <div className="flex items-center justify-center  w-full h-full">
                <Loader2 className="animate-spin text-primary h-10 w-10" />
            </div>
        );
    }

    const isConnected = statusResponse?.data?.connected;

    return (
        <Card className="bg-white dark:bg-zinc-950 rounded-xl border ring-0 border-gray-100 dark:border-zinc-800 shadow-md p-6">
            <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-zinc-100">
                    {provider.name} Settings
                </CardTitle>
                <CardDescription>
                    Configure your {provider.name} integration credentials below.
                </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
                <form onSubmit={onSubmit} className="space-y-6 ">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderFields()}
                    </div>

                    {isConnected && provider.type === 'ecommerce' && (
                        <Alert className="bg-primary/5 border-primary/20 dark:bg-primary/10 dark:border-primary/20 max-w-2xl">
                            <RefreshCw className="h-4 w-4 text-primary" />
                            <AlertTitle className="text-sm font-bold text-primary/80 dark:text-primary/30">Sync Data</AlertTitle>
                            <AlertDescription className="text-xs text-primary/70 dark:text-primary/40 flex items-center justify-between mt-2">
                                Last synced: {statusResponse.data.last_synced_at || 'Never'}
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-7 text-[10px] bg-white border-primary/20 hover:bg-primary/5"
                                    onClick={() => syncMutation.mutate(provider.id)}
                                    disabled={syncMutation.isPending}
                                >
                                    {syncMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <RefreshCw className="w-3 h-3 mr-1" />}
                                    Sync Now
                                </Button>
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="pt-6 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between gap-3">
                        {isConnected ? (
                            <Button
                                type="button"
                                variant="ghost"
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 font-bold text-xs"
                                onClick={handleDisconnect}
                                disabled={disconnectMutation.isPending}
                            >
                                {disconnectMutation.isPending ? (
                                    <Loader2 className="w-4 h-4  animate-spin" />
                                ) : (
                                    <Link2Off className="w-4 h-4 " />
                                )}
                                Disconnect Integration
                            </Button>
                        ) : (
                            <div /> /* Spacer */
                        )}

                        <Button
                            type="submit"
                            className="bg-primary hover:bg-primary-hover text-white min-w-[140px] font-bold"
                            disabled={connectMutation.isPending}
                        >
                            {connectMutation.isPending ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4 mr-2" />
                            )}
                            {isConnected ? "Save Settings" : "Connect Integration"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
