import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { CustomerIntegration } from '@/features/customers/types';
import { cn } from '@/lib/utils';
import { Link2, Link2Off, Loader2, Settings2, Check } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface RenderIntegrationSectionProps {
    title?: string;
    Icon?: any;
    data: CustomerIntegration[] | undefined;
    disconnectMutation?: any;
    setDefaultMutation?: any;
    fromCustomer?: boolean;
    onConnect?: (providerId: string) => void;
    onConfigure?: (providerId: string) => void;
    isLoading?: boolean;
    configLoadingProvider?: string;
}

const RenderIntegrationSection = ({
    title,
    Icon,
    data,
    onConnect,
    disconnectMutation,
    setDefaultMutation,
    fromCustomer = false,
    onConfigure,
    isLoading = false,
    configLoadingProvider
}: RenderIntegrationSectionProps) => {
    return (
        <div className="space-y-2">
            {title ? <div className="flex items-center gap-2 px-1">
                <Icon className="w-5 h-5 text-primary" />
                <h2 className="my-0 text-lg font-bold text-slate-800 dark:text-zinc-100">{title}</h2>
            </div> : null}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, idx) => (
                        <Card key={idx} className="py-4 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start">
                                    <Skeleton className="w-12 h-12 rounded-xl mb-3" />
                                    <Skeleton className="h-5 w-24 rounded-full" />
                                </div>
                                <Skeleton className="h-5 w-32 mt-2" />
                                <div className="space-y-2 mt-3">
                                    <Skeleton className="h-3 w-full" />
                                    <Skeleton className="h-3 w-4/5" />
                                </div>
                            </CardHeader>
                            {!fromCustomer && (
                                <CardContent className="pt-0 flex gap-2">
                                    <Skeleton className="h-8 flex-1" />
                                    <Skeleton className="h-8 w-8" />
                                </CardContent>
                            )}
                        </Card>
                    ))
                ) : (
                    <>
                        {data?.map((provider) => {
                            const isConnected = provider.connected;
                            const isDefault = provider.is_default;
                            return (
                                <Card key={provider.slug} className="py-4 group relative overflow-hidden transition-all hover:shadow-md border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                                    <CardHeader className="pb-4 bg-transparent">
                                        <div className="flex justify-between items-start">
                                            <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                <img src={provider.logo_url} alt={provider.name} className="h-full w-full object-contain" />
                                            </div>
                                            <div className="flex flex-col gap-1.5 items-end">
                                                <Badge variant={isConnected ? "default" : "secondary"} className={cn(
                                                    "font-semibold text-[12px] pt-1 uppercase leading-100 tracking-wide flex items-center justify-center",
                                                    isConnected ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30" : "bg-slate-50 text-slate-400 border-slate-100 dark:bg-zinc-900 dark:text-zinc-500 dark:border-zinc-800"
                                                )}>
                                                    {isConnected ? "Connected" : "Not Connected"}
                                                </Badge>
                                                {isDefault ? (
                                                    <Badge variant="default" className="font-medium text-[12px] px-2.5  leading-relaxed tracking-wide flex items-center gap-1 bg-blue-600 text-white hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-500 border-none shadow-sm rounded-full">
                                                        <Check className="w-3.5 h-3.5 stroke-[3px]" />
                                                        Default
                                                    </Badge>
                                                ) : (
                                                    isConnected && setDefaultMutation && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setDefaultMutation.mutate(provider.slug);
                                                            }}
                                                            disabled={setDefaultMutation.isPending && setDefaultMutation.variables === provider.slug}
                                                            className="text-[12px] font-bold text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 transition-colors bg-transparent border-0 cursor-pointer p-0 leading-none h-5"
                                                        >
                                                            {setDefaultMutation.isPending && setDefaultMutation.variables === provider.slug ? (
                                                                <Loader2 className="w-2.5 h-2.5 animate-spin" />
                                                            ) : (
                                                                "Set Default"
                                                            )}
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                        <CardTitle className="text-base font-bold text-slate-900 dark:text-zinc-100">{provider.name}</CardTitle>
                                        <CardDescription className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-2 min-h-[32px]">
                                            {provider.description}
                                        </CardDescription>
                                    </CardHeader>
                                    {!fromCustomer && (
                                        <CardContent className="pt-0 flex gap-2">
                                            {isConnected ? (
                                                <>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex-1 h-8 leading-none text-xs font-bold border-slate-200 dark:border-zinc-800"
                                                        onClick={() => onConfigure?.(provider.slug)}
                                                        disabled={configLoadingProvider === provider.slug}
                                                    >
                                                        {configLoadingProvider === provider.slug ? (
                                                            <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                                                        ) : (
                                                            <Settings2 className="w-3.5 h-3.5 mr-1.5" />
                                                        )}
                                                        Configurations
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 px-2"
                                                        onClick={() => disconnectMutation.mutate(provider.slug)}
                                                        disabled={disconnectMutation.isPending && disconnectMutation.variables === provider.slug}
                                                    >
                                                        {disconnectMutation.isPending && disconnectMutation.variables === provider.slug ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Link2Off className="w-3.5 h-3.5" />}
                                                        Disconnect
                                                    </Button>
                                                </>
                                            ) : (
                                                <Button
                                                    className="w-full h-8 text-xs leading-none font-bold text-white transition-all shadow-sm active:scale-[0.98]"
                                                    onClick={() => onConnect?.(provider.slug)}
                                                >
                                                    <Link2 className="w-3.5 h-3.5 mr-1.5" />
                                                    Connect
                                                </Button>
                                            )}
                                        </CardContent>
                                    )}
                                </Card>
                            );
                        })}

                        {!isLoading && data?.length === 0 && (
                            <div className="col-span-12 h-20 flex items-center justify-center">
                                <p className="text-gray-500 dark:text-gray-400">No {title} found</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default RenderIntegrationSection;