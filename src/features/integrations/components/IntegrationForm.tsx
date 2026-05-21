import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/features/orders/components/OrderFormUI";
import { useIntegrationStatus, useConnectIntegration, useSyncIntegration, useDisconnectIntegration } from "../hooks/useIntegrations";
import { Loader2, RefreshCw, Save, Link2Off } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { showToast } from "@/components/ui/custom-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { useNavigate } from "react-router-dom";

interface IntegrationFormProps {
    provider: { id: string; name: string; type: string };
}

export function IntegrationForm({ provider }: IntegrationFormProps) {
    const { data: statusResponse, isLoading: loadingStatus } = useIntegrationStatus(provider.id, true);
    const connectMutation = useConnectIntegration();
    const syncMutation = useSyncIntegration();
    const disconnectMutation = useDisconnectIntegration();
    // const navigate = useNavigate();

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
                newErrors[field] = `Please enter ${label}`;
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
            onSuccess: (response: any) => {
                if (response?.status) {
                    window.location.href = response.data.authorization_url;

                    // navigate(response.data.authorization_url, { target: "_blank" })
                    // showToast(`${provider.name} settings updated successfully.`, "success");
                    // window.location.reload();
                }
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            <div className={`col-span-1 ${(provider.id === 'woocommerce' || provider.id === 'shopify') ? 'lg:col-span-6' : 'lg:col-span-12'}`}>
                <Card className="bg-white dark:bg-zinc-950 border ring-0 border-gray-100 dark:border-zinc-800 p-6 h-full flex flex-col">
                    <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-xl font-bold text-slate-900 dark:text-zinc-100">
                            {provider.name} Settings
                        </CardTitle>
                        <CardDescription>
                            Configure your {provider.name} integration credentials below.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-0 flex-1 flex flex-col">
                        <form onSubmit={onSubmit} className="flex flex-col flex-1">
                            <div className="flex flex-col gap-5 flex-1">
                                {renderFields()}
                            </div>

                            {isConnected && provider.type === 'ecommerce' && (
                                <Alert className="bg-primary/5 border-primary/20 dark:bg-primary/10 dark:border-primary/20 mt-6">
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

                            <div className="pt-6 mt-8 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between gap-3">
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
            </div>

            {(provider.id === 'woocommerce' || provider.id === 'shopify') && (
                <div className="col-span-1 lg:col-span-6 relative group h-full">
                    {/* Subtle Gradient background blur */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent blur-2xl group-hover:blur-3xl transition-all duration-700 opacity-60"></div>

                    <Card className="relative bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl p-6 border ring-0 border-gray-100 dark:border-zinc-800 shadow-md h-full transition-all overflow-hidden flex flex-col justify-center">
                        {/* Decorative top gradient line */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent"></div>

                        {provider.id === 'woocommerce' && (
                            <>
                                <CardHeader className="px-0 pt-0 pb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary/30 dark:to-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/10">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                                                How to connect?
                                            </CardTitle>
                                            <CardDescription className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
                                                Follow these simple steps
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="px-0 flex-1 flex flex-col justify-center">
                                    <div className="space-y-0 relative before:absolute before:inset-y-0 before:left-[15px] before:w-[2px] before:bg-slate-100 dark:before:bg-zinc-800 before:-z-10">
                                        {[
                                            "Go to your WordPress Admin Dashboard.",
                                            <span key={1}>Navigate to <strong className="text-primary dark:text-primary/90 font-bold">WooCommerce &gt; Settings &gt; Advanced &gt; REST API</strong>.</span>,
                                            <span key={2}>Click <strong className="text-slate-900 dark:text-white font-bold">Add Key</strong>.</span>,
                                            <span key={3}>Set permissions to <strong className="text-slate-900 dark:text-white font-bold">Read/Write</strong> <span className="opacity-70">(Required for Webhooks)</span>.</span>,
                                            <span key={4}>Copy the <strong className="text-slate-900 dark:text-white font-bold">Consumer Key</strong> and <strong className="text-slate-900 dark:text-white font-bold">Secret</strong> and paste them here.</span>
                                        ].map((step, idx) => (
                                            <div key={idx} className="flex gap-5 group/step mb-6 last:mb-0 relative">
                                                <div className="flex flex-col items-center pt-0.5">
                                                    <div className="h-8 w-8 rounded-full bg-white dark:bg-zinc-900 text-slate-400 dark:text-zinc-500 text-xs font-bold flex items-center justify-center border-2 border-slate-100 dark:border-zinc-800 group-hover/step:border-primary group-hover/step:bg-primary group-hover/step:text-white transition-all duration-300 shadow-sm">
                                                        {idx + 1}
                                                    </div>
                                                </div>
                                                <div className="pt-1.5 text-[15px] text-slate-600 dark:text-zinc-400 leading-relaxed font-medium transition-colors group-hover/step:text-slate-900 dark:group-hover/step:text-zinc-200">
                                                    {step}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 p-4 bg-gradient-to-r from-primary/10 to-transparent dark:from-primary/20 dark:to-transparent rounded-xl border border-primary/20 flex items-start gap-3">
                                        <div className="bg-white dark:bg-zinc-900 rounded-full p-1 shadow-sm mt-0.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M20 6 9 17l-5-5"></path></svg>
                                        </div>
                                        <p className="text-sm text-primary/90 dark:text-primary/80 font-bold m-0 leading-relaxed">
                                            We will automatically configure the webhook for you upon connection.
                                        </p>
                                    </div>
                                </CardContent>
                            </>
                        )}

                        {provider.id === 'shopify' && (
                            <>
                                <CardHeader className="px-0 pt-0 pb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary/30 dark:to-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/10">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                                                How it works
                                            </CardTitle>
                                            <CardDescription className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
                                                Shopify Integration Guide
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="px-0 flex-1 flex flex-col justify-center gap-6">
                                    <div className="flex gap-4 group/step">
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                            </div>
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-slate-900 dark:text-white text-[15px] mb-1">Automatic Import</h5>
                                            <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">On connect, paid and unfulfilled orders from the last 5 days are imported. New paid orders also arrive via webhooks.</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 group/step">
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" /></svg>
                                            </div>
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-slate-900 dark:text-white text-[15px] mb-1">Real-time Sync</h5>
                                            <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">Webhooks keep the portal aligned with Shopify for new paid orders, cancellations, and fulfillments completed in Shopify admin.</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 group/step">
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                            </div>
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-slate-900 dark:text-white text-[15px] mb-1">Seamless Fulfillment</h5>
                                            <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">When an order is Printed, tracking can be sent to Shopify automatically (optional), or you can use "Push fulfillment to Shopify" once on the order page.</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </>
                        )}
                    </Card>
                </div>
            )}
        </div>
    );
}
