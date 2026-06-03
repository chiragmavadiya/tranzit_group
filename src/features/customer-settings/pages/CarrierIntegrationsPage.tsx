import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck } from 'lucide-react';
import { Drawer } from '@/components/ui/drawer';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import {
  useConnectIntegration,
  useDisconnectIntegration,
  useIntegrationsList,
  useIntegrationStatusMutation
} from '@/features/integrations/hooks/useIntegrations';
import RenderIntegrationSection from '@/features/integrations/components/RenderIntegrationSection';
import CarrierConfigForm from '../components/CarrierConfigForm';

const carriers = [
  { id: 'auspost', name: 'Australia Post', icon: Truck, status: 'available' },
  { id: 'aramex', name: 'Aramex', icon: Truck, status: 'available' },
  { id: 'mypostbusiness', name: 'MyPost Business', icon: Truck, status: 'available' },
  { id: 'directfreight', name: 'Direct Freight', icon: Truck, status: 'available' },
  { id: 'startrack', name: 'StarTrack', icon: Truck, status: 'coming_soon' },
  { id: 'toll', name: 'Toll Priority', icon: Truck, status: 'coming_soon' },
  { id: 'dhl', name: 'DHL Express', icon: Truck, status: 'coming_soon' },
];

export default function CarrierIntegrationsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<any>({});

  // Fetch status of the individual courier integrations
  const { data: listResponse, isLoading: listLoading } = useIntegrationsList();
  // Fetch status of the individual courier integrations
  const { isPending: statusLoading, variables: statusVariables } = useIntegrationStatusMutation();

  const connectMutation = useConnectIntegration();
  const disconnectMutation = useDisconnectIntegration();

  const handleEdit = (providerId: string) => {
    navigate(`/settings/carriers/${providerId}`);
  };

  const onConnect = useCallback((providerId: string) => {
    navigate(`/settings/carriers/${providerId}`);
  }, [navigate]);

  const handleConnect = (data: any) => {
    setIsLoading(true);
    const platform = selectedCarrier!;
    connectMutation.mutate({ provider: platform, data }, {
      onSuccess: () => {
        setIsLoading(false);
        queryClient.invalidateQueries({ queryKey: ["integration-status", platform] });
        resetFlow();
      },
      onError: () => {
        setIsLoading(false);
      }
    });
  };

  const resetFlow = () => {
    setIsAddOpen(false);
    setTimeout(() => {
      setSelectedCarrier(null);
      setFormData({});
    }, 300);
  };

  return (
    <div className="flex flex-col gap-6 min-h-[calc(100vh-120px)] bg-white p-page-padding dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-sm shadow-sm">
      <div className=" flex flex-col flex-1">
        <div className="flex flex-col gap-1 mb-3">
          <h1 className="text-2xl flex items-center gap-2 font-bold text-slate-900 dark:text-zinc-100 my-0">
            <Truck className="w-6 h-6 text-primary" />
            Courier Integrations
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mb-2">Connect your shipping couriers to streamline your workflow.</p>
        </div>

        <div className="flex flex-col gap-10">
          <RenderIntegrationSection
            // title="Courier Integrations"
            // Icon={Truck}
            data={listResponse?.data?.courier_integrations}
            disconnectMutation={disconnectMutation}
            onConnect={onConnect}
            onConfigure={handleEdit}
            isLoading={listLoading}
            configLoadingProvider={statusLoading ? statusVariables : undefined}
          />
          {/* <RenderIntegrationSection
            title="E-commerce Integrations"
            Icon={ShoppingCart}
            data={listResponse?.data?.ecommerce_connections}
            disconnectMutation={disconnectMutation}
            onConnect={onConnect}
            isLoading={listLoading}
            configLoadingProvider={statusLoading ? statusVariables : undefined}
          /> */}
        </div>
      </div>

      <Drawer
        open={isAddOpen}
        onClose={resetFlow}
        title={
          selectedCarrier ? (
            <div className="flex items-center gap-3">
              {(() => {
                const carrierIntegration = listResponse?.data?.courier_integrations?.find(
                  (c) => c.slug === selectedCarrier
                );
                return carrierIntegration?.logo_url ? (
                  <div className="flex items-center h-8 shrink-0">
                    <img src={carrierIntegration.logo_url} alt={carrierIntegration.name} className="h-6 w-auto object-contain max-w-[120px]" />
                  </div>
                ) : null;
              })()}
              <span className="text-lg font-bold text-gray-900 dark:text-zinc-100">Configure {carriers.find(c => c.id === selectedCarrier)?.name}</span>
            </div>
          ) : (
            "Add Shipping Carrier"
          )
        }
        description="Connect a new carrier account to generate labels and get live rates."
        className="max-w-[800px]"
      >
        <div className="pb-4">
          <div className="mt-8 px-4 h-full overflow-y-auto no-scrollbar">
            <AnimatePresence mode="wait">
              {selectedCarrier && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6 max-w-2xl mx-auto"
                >
                  <CarrierConfigForm
                    selectedCarrier={selectedCarrier}
                    initialValues={formData}
                    onSubmit={handleConnect}
                    isLoading={isLoading}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
