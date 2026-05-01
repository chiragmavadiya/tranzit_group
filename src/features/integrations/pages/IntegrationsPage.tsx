import { useState } from "react";
import { useIntegrationsList, useDisconnectIntegration } from "../hooks/useIntegrations";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Truck, ShoppingCart, Settings2, Link2, Link2Off, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { IntegrationDialog } from "../components/IntegrationDialog";

const PROVIDERS = [
    { id: 'auspost', name: 'AusPost', type: 'courier', description: 'Australia Post eParcel integration.' },
    { id: 'aramex', name: 'Aramex', type: 'courier', description: 'Aramex (Fastway) shipping services.' },
    { id: 'mypostbusiness', name: 'MyPost Business', type: 'courier', description: 'Australia Post MyPost Business.' },
    { id: 'directfreight', name: 'Direct Freight', type: 'courier', description: 'Direct Freight Express integration.' },
    { id: 'shopify', name: 'Shopify', type: 'ecommerce', description: 'Sync orders and fulfillments with Shopify.' },
    { id: 'ebay', name: 'eBay', type: 'ecommerce', description: 'Sync orders and fulfillments with eBay.' },
    { id: 'woocommerce', name: 'WooCommerce', type: 'ecommerce', description: 'Sync orders and fulfillments with WooCommerce.' },
    { id: 'amazon', name: 'Amazon', type: 'ecommerce', description: 'Sync orders and fulfillments with Amazon.' },
];

export default function IntegrationsPage() {
    const { data: listResponse, isLoading } = useIntegrationsList();
    const disconnectMutation = useDisconnectIntegration();
    const [selectedProvider, setSelectedProvider] = useState<any>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const data = listResponse?.data;
    const connectedProviders = data ? [
        ...Object.keys(data.ecommerce_connections || {}).filter(key => data.ecommerce_connections[key]),
        ...Object.keys(data.courier_integrations || {}).filter(key => data.courier_integrations[key])
    ] : [];

    const renderIntegrationSection = (type: 'courier' | 'ecommerce', title: string, Icon: any) => {
        const filtered = PROVIDERS.filter(p => p.type === type);

        return (
            <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                    <Icon className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-100">{title}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filtered.map((provider) => {
                        // const isConnected = i % 2 === 0 ? true : connectedProviders.includes(provider.id);
                        const isConnected = connectedProviders.includes(provider.id);
                        return (
                            <Card key={provider.id} className="group relative overflow-hidden transition-all hover:shadow-md border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                                <CardHeader className="pb-4">
                                    <div className="flex justify-between items-start">
                                        <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            {provider.type === 'courier' ? <Truck className="w-6 h-6 text-blue-600" /> : <ShoppingCart className="w-6 h-6 text-purple-600" />}
                                        </div>
                                        <Badge variant={isConnected ? "default" : "secondary"} className={cn(
                                            "font-semibold text-[10px] uppercase tracking-wider",
                                            isConnected ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30" : "bg-slate-50 text-slate-400 border-slate-100 dark:bg-zinc-900 dark:text-zinc-500 dark:border-zinc-800"
                                        )}>
                                            {isConnected ? "Connected" : "Not Connected"}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-base font-bold text-slate-900 dark:text-zinc-100">{provider.name}</CardTitle>
                                    <CardDescription className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-2 min-h-[32px]">
                                        {provider.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-0 flex gap-2">
                                    {isConnected ? (
                                        <>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 h-8 text-[11px] font-bold border-slate-200 dark:border-zinc-800"
                                                onClick={() => {
                                                    setSelectedProvider(provider);
                                                    setIsDialogOpen(true);
                                                }}
                                            >
                                                <Settings2 className="w-3.5 h-3.5 mr-1.5" />
                                                Configure
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 px-2"
                                                onClick={() => disconnectMutation.mutate(provider.id)}
                                                disabled={disconnectMutation.isPending && disconnectMutation.variables === provider.id}
                                            >
                                                {disconnectMutation.isPending && disconnectMutation.variables === provider.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Link2Off className="w-3.5 h-3.5" />}
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            className="w-full h-8 text-[11px] font-bold bg-[#0060FE] hover:bg-blue-700 text-white transition-all shadow-sm active:scale-[0.98]"
                                            onClick={() => {
                                                setSelectedProvider(provider);
                                                setIsDialogOpen(true);
                                            }}
                                        >
                                            <Link2 className="w-3.5 h-3.5 mr-1.5" />
                                            Connect
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="h-full overflow-y-auto p-page-padding space-y-0 animate-in fade-in duration-700">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100 my-0">Integrations</h1>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mb-2">Connect your shipping couriers and e-commerce stores to streamline your workflow.</p>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            ) : (
                <div className="flex flex-col gap-10">
                    {renderIntegrationSection('courier', 'Courier Integrations', Truck)}
                    {renderIntegrationSection('ecommerce', 'E-commerce Integrations', ShoppingCart)}
                </div>
            )}

            {selectedProvider && (
                <IntegrationDialog
                    provider={selectedProvider}
                    isOpen={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                />
            )}
        </div>
    );
}
