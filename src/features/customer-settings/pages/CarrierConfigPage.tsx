import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Link2Off, Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useConnectIntegration,
  useDisconnectIntegration,
  useIntegrationStatusMutation,
  useIntegrationsList
} from '@/features/integrations/hooks/useIntegrations';
import CarrierConfigForm from '../components/CarrierConfigForm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function CarrierConfigPage() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [fetchingData, setFetchingData] = useState(true);

  const { data: listResponse } = useIntegrationsList();
  const { mutate: getIntegrationStatus } = useIntegrationStatusMutation();
  const connectMutation = useConnectIntegration();
  const disconnectMutation = useDisconnectIntegration();

  const currentSlug = slug || 'auspost';

  const carrierIntegration = listResponse?.data?.courier_integrations?.find(
    (c) => c.slug === currentSlug
  );
  const logoUrl = carrierIntegration?.logo_url;
  const carrierName = carrierIntegration?.name || currentSlug;

  useEffect(() => {
    setFetchingData(true);
    getIntegrationStatus(currentSlug, {
      onSuccess: (response) => {
        setFormData(response.data || {});
        setFetchingData(false);
      },
      onError: () => {
        setFetchingData(false);
      }
    });
  }, [getIntegrationStatus, currentSlug]);

  const handleConnect = (data: any) => {
    setIsLoading(true);
    connectMutation.mutate({ provider: currentSlug, data }, {
      onSuccess: () => {
        setIsLoading(false);
        queryClient.invalidateQueries({ queryKey: ["integration-status", currentSlug] });
        navigate('/settings/carriers');
      },
      onError: () => {
        setIsLoading(false);
      }
    });
  };

  const handleDisconnect = () => {
    disconnectMutation.mutate(currentSlug, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["integration-status", currentSlug] });
        navigate('/settings/carriers');
      }
    });
  };

  return (
    <div className="rounded-sm shadow-sm flex flex-col gap-6 min-h-[calc(100vh-120px)]">
      {/* Top Header Bar */}
      <div className='min-h-[calc(100vh-120px)] bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-page-padding rounded-sm flex flex-col flex-1'>
        <div className="flex flex-col gap-4 pb-4 border-b border-gray-100 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => navigate('/settings/carriers')}
              variant={'ghost'}
              size='sm'
              className={"flex gap-2 items-center py-4 text-xs font-semibold transition-colors duration-200 group/btn"}
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover/btn:-translate-x-1 transition-transform" />
              Back
            </Button>

            {carrierIntegration?.connected && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs font-bold border-red-200 text-red-500 hover:text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-950/20"
                onClick={handleDisconnect}
                disabled={disconnectMutation.isPending}
              >
                {disconnectMutation.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                ) : (
                  <Link2Off className="w-3.5 h-3.5 mr-1.5" />
                )}
                Disconnect
              </Button>
            )}
          </div>

          {/* Centered Logo & Header */}
          {!fetchingData && (
            <div className="flex gap-3">
              <div>
                {logoUrl && (
                  <div className="flex justify-center">
                    <div className="bg-white dark:bg-zinc-950 p-3 rounded-xl border border-gray-250/60 dark:border-zinc-800 shadow-xs flex items-center justify-center">
                      <img src={logoUrl} alt={carrierName} className="h-12! w-12! object-contain" />
                    </div>
                  </div>
                )}
              </div>
              <div className='flex flex-col justify-center text-left'>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight my-0">
                    Configure {carrierName}
                  </h1>
                  <Badge
                    variant={carrierIntegration?.connected ? "default" : "secondary"}
                    className={cn(
                      "font-semibold text-[11px] uppercase leading-none tracking-wider py-1 px-2.5 rounded-full border shrink-0 mt-0.5",
                      carrierIntegration?.connected
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30"
                        : "bg-slate-50 text-slate-400 border-slate-100 dark:bg-zinc-900 dark:text-zinc-500 dark:border-zinc-800"
                    )}
                  >
                    {carrierIntegration?.connected ? "Connected" : "Not Connected"}
                  </Badge>
                </div>
                <p className="my-0 text-sm text-slate-500 dark:text-zinc-400 leading-normal mt-1">
                  Connect your {carrierName} account to automate label generation, track shipments, and manage eParcel products directly from Tranzit.
                </p>
              </div>
            </div>
          )}
        </div>

        {fetchingData ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2">
            <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <span className="text-sm text-slate-500 dark:text-zinc-400 font-medium">Loading configurations...</span>
          </div>
        ) : (
          <CarrierConfigForm
            selectedCarrier={currentSlug}
            initialValues={formData}
            onSubmit={handleConnect}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}
