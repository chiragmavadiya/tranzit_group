import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Link2Off, Settings2, Check, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConformationModal } from '@/components/common/ConformationModal';
import { DataTable } from '@/components/common/DataTable';
import { Drawer } from '@/components/ui/drawer';
import { motion, AnimatePresence } from 'framer-motion';
import TNTLogo from '@/assets/coruiers_logo/TNT.webp';
import AlliedExpress from '@/assets/coruiers_logo/allied_express.png';
import TeamGloablexpress from '@/assets/coruiers_logo/team_gloabl_express.png';

import { useQueryClient } from '@tanstack/react-query';
import {
  useConnectIntegration,
  useDisconnectIntegration,
  useIntegrationsList,
  useSetDefaultIntegration,
  useRemoveDefaultIntegration
} from '@/features/integrations/hooks/useIntegrations';
import CarrierConfigForm from '../components/CarrierConfigForm';
import { useAppSelector } from '@/hooks/store.hooks';
import { cn } from '@/lib/utils';

const carriers = [
  { id: 'auspost', name: 'Australia Post', icon: Truck, status: 'available' },
  { id: 'aramex', name: 'Aramex', icon: Truck, status: 'available' },
  { id: 'mypostbusiness', name: 'MyPost Business', icon: Truck, status: 'available' },
  { id: 'directfreight', name: 'Direct Freight', icon: Truck, status: 'available' },
  { id: 'couriersplease', name: 'Couriers Please', icon: Truck, status: 'available' },
  { id: 'startrack', name: 'StarTrack', icon: Truck, status: 'available' },
  { id: 'fedex', name: 'FedEx', icon: Truck, status: 'coming_soon' },
  { id: 'tnt', name: 'TNT', icon: Truck, status: 'coming_soon', logo: TNTLogo },
  { id: 'alliedexpress', name: 'Allied Express', icon: Truck, status: 'coming_soon', logo: AlliedExpress },
  { id: 'tge', name: 'Team Global Express', icon: Truck, status: 'coming_soon', logo: TeamGloablexpress },
  // { id: 'toll', name: 'Toll Priority', icon: Truck, status: 'coming_soon' },
  // { id: 'dhl', name: 'DHL Express', icon: Truck, status: 'coming_soon' },
];

export default function CarrierIntegrationsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<any>({});

  // Confirmation modal states
  const [isConfirmDisconnectOpen, setIsConfirmDisconnectOpen] = useState(false);
  const [carrierToDisconnect, setCarrierToDisconnect] = useState<any>(null);

  // Fetch status of the individual courier integrations
  const { data: listResponse, isLoading: listLoading } = useIntegrationsList();
  const { is_sub_user, team_access } = useAppSelector((state) => state.auth);
  const canReadWrite = useMemo(() => !is_sub_user || team_access?.permissions?.settings_integrations === 'full', [is_sub_user, team_access]);

  const connectMutation = useConnectIntegration();
  const disconnectMutation = useDisconnectIntegration();
  const { mutate: setDefault, isPending: isSettingDefault, variables: setDefaultVars } = useSetDefaultIntegration();
  const { mutate: removeDefault, isPending: isRemovingDefault, variables: removeDefaultVars } = useRemoveDefaultIntegration();

  // Connected carriers
  const connectedCarriers = useMemo(() => {
    return listResponse?.data?.courier_integrations?.filter((p) => p.connected) || [];
  }, [listResponse]);

  const confirmDisconnect = useCallback((carrier: any) => {
    setCarrierToDisconnect(carrier);
    setIsConfirmDisconnectOpen(true);
  }, []);

  const handleEdit = useCallback((providerId: string) => {
    navigate(`/settings/carriers/${providerId}`);
  }, [navigate]);

  // Column definitions for the DataTable
  const columns = useMemo(() => [
    {
      header: 'Carrier',
      key: 'name',
      cell: (_: any, row: any) => {
        const isTranzit = row.slug.includes('tranzit') || false;
        return (
          <div
            onClick={() => handleEdit(row.slug)}
            className="flex items-center gap-3 cursor-pointer group/carrier select-none"
          >
            <div className="w-16 h-12 rounded-xl bg-white p-1.5 border border-slate-100 dark:border-zinc-800/80 flex items-center justify-center shrink-0 shadow-sm group-hover/row:border-primary/50 transition-colors">
              <img src={row.logo_url} alt={row.name} className="h-full w-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-slate-800 dark:text-zinc-200 group-hover/row:text-primary transition-colors">
                {row.name}
              </span>
              {isTranzit && (
                <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                  Platform Integration
                </span>
              )}
            </div>
          </div>
        );
      }
    },
    {
      header: 'Status',
      key: 'connected',
      cell: (isConnected: boolean) => (
        <Badge
          variant={isConnected ? "default" : "secondary"}
          className={cn(
            "font-semibold text-[11px] py-1 px-2.5 flex items-center justify-center w-fit gap-1",
            isConnected
              ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30"
              : "bg-slate-50 text-slate-400 border-slate-100 dark:bg-zinc-900 dark:text-zinc-500 dark:border-zinc-800"
          )}
        >
          {isConnected && <span className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse bg-green-400" />}
          <span>{isConnected ? "Connected" : "Not Connected"}</span>
        </Badge>
      )
    },
    {
      header: 'Default Courier',
      key: 'is_default',
      cell: (isDefault: boolean, row: any) => {
        const isConnected = row.connected;
        return isDefault ? (
          <div className="flex items-center gap-2">
            <Badge variant="default" className="font-semibold text-[11px] px-2.5 py-1 flex items-center gap-1 bg-blue-600 text-white hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-500 border-none shadow-sm rounded-full">
              <Check className="w-3 h-3 stroke-[3px]" />
              Default
            </Badge>
            {canReadWrite && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-[10px] font-bold text-slate-500 hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400 py-0 px-2"
                onClick={() => removeDefault(row.slug)}
                disabled={isRemovingDefault && removeDefaultVars === row.slug}
              >
                {isRemovingDefault && removeDefaultVars === row.slug ? (
                  <Loader2 className="w-3 h-3 animate-spin mr-1" />
                ) : null}
                Remove Default
              </Button>
            )}
          </div>
        ) : (
          isConnected && canReadWrite && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 py-0 px-2"
              onClick={() => setDefault(row.slug)}
              disabled={isSettingDefault && setDefaultVars === row.slug}
            >
              {isSettingDefault && setDefaultVars === row.slug ? (
                <Loader2 className="w-3 h-3 animate-spin mr-1" />
              ) : null}
              Set as Default
            </Button>
          )
        );
      }
    },
    {
      header: '',
      key: 'actions',
      className: '',
      width: '200px',
      static: '',
      cell: (_: any, row: any) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs font-bold border-slate-205 dark:border-zinc-850 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900 gap-1.5"
            onClick={() => handleEdit(row.slug)}
            title="Configure Carrier Settings"
          >
            <Settings2 className="w-4 h-4" />
            Configure
          </Button>

          {canReadWrite && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-500 hover:text-red-655 hover:bg-red-50 dark:hover:bg-red-950/20"
              onClick={() => confirmDisconnect(row)}
              title="Disconnect Carrier"
            >
              <Link2Off className="w-4 h-4" />
            </Button>
          )}
        </div>
      )
    }
  ], [canReadWrite, handleEdit, confirmDisconnect, setDefault, isSettingDefault, setDefaultVars, removeDefault, isRemovingDefault, removeDefaultVars]);

  const handleConfirmDisconnect = () => {
    if (carrierToDisconnect) {
      disconnectMutation.mutate({ provider: carrierToDisconnect.slug }, {
        onSuccess: () => {
          setIsConfirmDisconnectOpen(false);
          setCarrierToDisconnect(null);
          queryClient.invalidateQueries({ queryKey: ["integrations-list"] });
        }
      });
    }
  };

  const handleConnect = (data: any) => {
    setIsLoading(true);
    const platform = selectedCarrier!;
    connectMutation.mutate({ provider: platform, data }, {
      onSuccess: () => {
        setIsLoading(false);
        queryClient.invalidateQueries({ queryKey: ["integrations-list"] });
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
    <div className="flex flex-col gap-6 min-h-[calc(100vh-120px)] bg-white p-page-padding dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm">
      <div className="flex flex-col flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl flex items-center gap-2 font-bold text-slate-900 dark:text-zinc-100 my-0">
              <Truck className="w-6 h-6 text-primary" />
              Courier Integrations
            </h1>
            <p className="my-0 text-sm text-slate-500 dark:text-zinc-400">Connect your shipping couriers to streamline your workflow.</p>
          </div>
          {canReadWrite && (
            <Button
              onClick={() => {
                setSelectedCarrier(null);
                setIsAddOpen(true);
              }}
              size="sm"
              className="h-8 font-bold text-xs"
            >
              + Connect Carrier
            </Button>
          )}
        </div>

        <div className="flex-1 flex flex-col min-h-0 mt-4">
          {listLoading || connectedCarriers.length > 0 ? (
            <div className="overflow-hidden bg-white dark:bg-zinc-950">
              <DataTable
                data={connectedCarriers}
                columns={columns}
                loading={listLoading}
                header={false}
                pagination={false}
                searchable={false}
                exportable={false}
                totalItems={connectedCarriers.length}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-205 dark:border-zinc-800 rounded-2xl bg-slate-50/30 dark:bg-zinc-900/10">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                <Truck className="w-6 h-6 text-slate-450" />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-zinc-205 mb-1">No carriers connected</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mb-6">
                Connect your Australia Post, Aramex, or other courier accounts to access live rates and print labels.
              </p>
              {canReadWrite && (
                <Button
                  onClick={() => {
                    setSelectedCarrier(null);
                    setIsAddOpen(true);
                  }}
                  size="sm"
                  className="h-8 font-bold text-xs"
                >
                  + Connect Carrier
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <Drawer
        open={isAddOpen}
        onClose={resetFlow}
        title={
          selectedCarrier ? (
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-zinc-800"
                onClick={() => setSelectedCarrier(null)}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              {(() => {
                const carrierIntegration = listResponse?.data?.courier_integrations?.find(
                  (c) => c.slug === selectedCarrier
                );
                return carrierIntegration?.logo_url ? (
                  <div className="flex items-center h-8 shrink-0 bg-white p-1 rounded-md border border-slate-100 dark:border-zinc-800/80 shadow-xs">
                    <img src={carrierIntegration.logo_url} alt={carrierIntegration.name} className="h-6 w-auto object-contain max-w-[100px]" />
                  </div>
                ) : null;
              })()}
              <span className="text-lg font-bold text-gray-900 dark:text-zinc-100">
                {selectedCarrier === 'auspost' ? 'Connect Australia Post eParcel' : `Connect ${carriers.find(c => c.id === selectedCarrier)?.name}`}
              </span>
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
              {!selectedCarrier ? (
                <motion.div
                  key="list"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4 max-w-3xl mx-auto"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
                    {carriers.map((carrier) => {
                      const apiCarrier = listResponse?.data?.courier_integrations?.find(
                        (c) => c.slug === carrier.id
                      );
                      const isConnected = apiCarrier?.connected ?? false;
                      const isComingSoon = carrier.status === 'coming_soon';
                      const logoUrl = apiCarrier?.logo_url || carrier.logo || "";

                      return (
                        <div
                          key={carrier.id}
                          onClick={() => {
                            if (!isComingSoon) {
                              resetFlow();
                              handleEdit(carrier.id);
                            }
                          }}
                          className={cn(
                            "flex items-center justify-between p-4 border border-slate-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950 transition-all",
                            isComingSoon
                              ? "opacity-50 cursor-not-allowed border-dashed bg-slate-50/50 dark:bg-zinc-900/30"
                              : isConnected
                                ? "border-emerald-100 dark:border-emerald-900/25 bg-emerald-50/10 hover:border-emerald-300 dark:hover:border-emerald-800/80 cursor-pointer shadow-sm"
                                : "hover:shadow-md hover:border-slate-300 dark:hover:border-zinc-700 cursor-pointer"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-16 h-12 rounded-xl bg-white p-1.5 border border-slate-100 dark:border-zinc-800/80 flex items-center justify-center shrink-0 shadow-xs",
                              isComingSoon && "grayscale"
                            )}>
                              {logoUrl ? (
                                <img src={logoUrl} alt={carrier.name} className="h-full w-full object-contain" />
                              ) : (
                                <Truck className="w-5 h-5 text-slate-400" />
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-800 dark:text-zinc-200">
                                {carrier.name}
                              </span>
                              {isComingSoon && (
                                <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                                  Coming Soon
                                </span>
                              )}
                            </div>
                          </div>

                          {!isComingSoon && (
                            isConnected ? (
                              <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30 font-semibold text-[11px]">
                                Connected
                              </Badge>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-xs font-bold px-3"
                              >
                                Connect
                              </Button>
                            )
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6 max-w-2xl mx-auto"
                >
                  <CarrierConfigForm
                    selectedCarrier={selectedCarrier}
                    initialValues={formData}
                    onSubmit={handleConnect}
                    isLoading={isLoading}
                    canReadWrite={canReadWrite}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Drawer>

      <ConformationModal
        open={isConfirmDisconnectOpen}
        onOpenChange={setIsConfirmDisconnectOpen}
        title="Disconnect Carrier"
        description={`Are you sure you want to disconnect ${carrierToDisconnect ? carrierToDisconnect.name : 'this carrier'}? You will no longer be able to generate labels or get live rates for this courier.`}
        onConfirm={handleConfirmDisconnect}
        onCancel={() => {
          setIsConfirmDisconnectOpen(false);
          setCarrierToDisconnect(null);
        }}
        confirmText="Disconnect"
        cancelText="Cancel"
        confirmVariant="destructive"
        className="w-full"
        loading={disconnectMutation.isPending}
      />
    </div>
  );
}
