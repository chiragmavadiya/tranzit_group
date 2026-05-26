import React, { useState } from 'react';
import { Plus, Loader2, CheckCircle2, Truck, Settings2, Link2Off, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import { Drawer } from '@/components/ui/drawer';
import { FormInput } from '@/features/orders/components/OrderFormUI';
import { Badge } from '@/components/ui/badge';
import { Stepper } from '@/components/ui/stepper';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import {
  useIntegrationStatus,
  useConnectIntegration,
  useSyncIntegration,
  useDisconnectIntegration
} from '@/features/integrations/hooks/useIntegrations';
import { showToast } from '@/components/ui/custom-toast';
import { CustomTooltip } from '@/components/common/CustomTooltip';

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
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCarrier, setSelectedCarrier] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // Fetch status of the individual courier integrations
  const auspostStatus = useIntegrationStatus('auspost');
  const aramexStatus = useIntegrationStatus('aramex');
  const mypostStatus = useIntegrationStatus('mypostbusiness');
  const directStatus = useIntegrationStatus('directfreight');

  const connectMutation = useConnectIntegration();
  const syncMutation = useSyncIntegration();
  const disconnectMutation = useDisconnectIntegration();

  // Combine query loading states
  const loadingList =
    auspostStatus.isLoading ||
    aramexStatus.isLoading ||
    mypostStatus.isLoading ||
    directStatus.isLoading;

  const integrationsData = React.useMemo(() => {
    const list = [];
    const apData = auspostStatus.data?.data;
    const axData = aramexStatus.data?.data;
    const mpData = mypostStatus.data?.data;
    const dfData = directStatus.data?.data;

    if (apData?.connected) {
      list.push({
        id: 'auspost',
        carrier: 'Australia Post',
        account: apData.account_number || 'Connected',
        status: 'Active',
        lastSync: apData.last_synced_at || 'Never',
        logo: Truck,
        raw: apData
      });
    }

    if (axData?.connected) {
      list.push({
        id: 'aramex',
        carrier: 'Aramex',
        account: axData.account_name || 'Connected',
        status: 'Active',
        lastSync: axData.last_synced_at || 'Never',
        logo: Truck,
        raw: axData
      });
    }

    if (mpData?.connected) {
      list.push({
        id: 'mypostbusiness',
        carrier: 'MyPost Business',
        account: mpData.account_label || 'Connected',
        status: 'Active',
        lastSync: mpData.last_synced_at || 'Never',
        logo: Truck,
        raw: mpData
      });
    }

    if (dfData?.connected) {
      list.push({
        id: 'directfreight',
        carrier: 'Direct Freight',
        account: dfData.account || 'Connected',
        status: 'Active',
        lastSync: dfData.last_synced_at || 'Never',
        logo: Truck,
        raw: dfData
      });
    }

    return list;
  }, [auspostStatus.data, aramexStatus.data, mypostStatus.data, directStatus.data]);

  const handleSync = (providerId: string) => {
    syncMutation.mutate(providerId);
  };

  const handleEdit = (providerId: string) => {
    const provider = integrationsData.find(item => item.id === providerId);
    if (provider) {
      setSelectedCarrier(providerId);
      setFormData(provider.raw || {});
      setSubmitted(false);
      setErrors({});
      setCurrentStep(1); // Go straight to Configure step
      setIsAddOpen(true);
    }
  };

  const handleDisconnect = (providerId: string) => {
    if (window.confirm(`Are you sure you want to disconnect ${providerId}?`)) {
      disconnectMutation.mutate(providerId, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["integration-status", providerId] });
        }
      });
    }
  };

  const columns = [
    {
      header: 'Carrier',
      key: 'carrier',
      cell: (_: any, row: any) => {
        const Icon = row.logo;
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold text-gray-900 dark:text-zinc-100">{row.carrier}</span>
          </div>
        );
      }
    },
    {
      header: 'Account #',
      key: 'account',
      cell: (val: string) => <span className="text-gray-500 dark:text-zinc-400 font-medium">{val}</span>
    },
    {
      header: 'Status',
      key: 'status',
      cell: (val: string) => (
        <Badge className={val === 'Active' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400'}>
          {val}
        </Badge>
      )
    },
    {
      header: 'Last Sync',
      key: 'lastSync',
    },
    {
      header: 'Actions',
      key: 'actions',
      cell: (_: any, row: any) => (
        <div className="flex items-center gap-2">
          <CustomTooltip title="Sync">

            <Button
              variant="ghost"
              size="icon-sm"
              className="h-8 w-8 text-slate-400 hover:text-primary"
              onClick={() => handleSync(row.id)}
              disabled={syncMutation.isPending && syncMutation.variables === row.id}
            >
              {syncMutation.isPending && syncMutation.variables === row.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </Button>
          </CustomTooltip>

          <CustomTooltip title="Edit Settings">

            <Button
              variant="ghost"
              size="icon-sm"
              className="h-8 w-8 text-slate-400 hover:text-slate-900 dark:hover:text-white"
              onClick={() => handleEdit(row.id)}
            >
              <Settings2 className="w-4 h-4" />
            </Button>
          </CustomTooltip>

          <CustomTooltip title="Disconnect">
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-8 w-8 text-red-400 hover:text-red-600"
              onClick={() => handleDisconnect(row.id)}
              disabled={disconnectMutation.isPending && disconnectMutation.variables === row.id}
            >
              {disconnectMutation.isPending && disconnectMutation.variables === row.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Link2Off className="w-4 h-4" />
              )}
            </Button>
          </CustomTooltip>

        </div>
      )
    }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const requiredFields: Record<string, string[]> = {
      auspost: ['api_key', 'api_password', 'base_url', 'account_number', 'account_label'],
      aramex: ['client_id', 'client_secret', 'account_name', 'account_label'],
      mypostbusiness: ['merchant_token', 'base_url', 'account_label', 'account_number'],
      directfreight: ['token', 'account', 'site_id', 'base_url', 'consignment_token', 'account_label']
    };

    const fieldsToValidate = requiredFields[selectedCarrier!] || [];
    fieldsToValidate.forEach(field => {
      if (!formData[field] || (typeof formData[field] === 'string' && !formData[field].trim())) {
        const label = field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        newErrors[field] = `Please enter ${label}`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConnect = () => {
    setSubmitted(true);
    if (!validateForm()) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    setIsLoading(true);
    const platform = selectedCarrier!;
    connectMutation.mutate({ provider: platform, data: formData }, {
      onSuccess: () => {
        setIsLoading(false);
        setCurrentStep(2);
        queryClient.invalidateQueries({ queryKey: ["integration-status", platform] });
      },
      onError: () => {
        setIsLoading(false);
      }
    });
  };

  const resetFlow = () => {
    setIsAddOpen(false);
    setTimeout(() => {
      setCurrentStep(0);
      setSelectedCarrier(null);
      setFormData({});
      setSubmitted(false);
      setErrors({});
    }, 300);
  };

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

  const renderFields = () => {
    const commonProps = (name: string) => ({
      name,
      value: formData[name] || "",
      onChange: (val: any) => handleInputChange(val, name),
      required: true,
      error: submitted && !!errors[name],
      errormsg: errors[name],
      isHalf: true
    });

    switch (selectedCarrier) {
      case 'auspost':
        return (
          <div className="grid grid-cols-12 gap-x-4 gap-y-3.5">
            <FormInput label="API Key" {...commonProps("api_key")} />
            <FormInput label="API Password" {...commonProps("api_password")} type="password" />
            <FormInput label="Base URL" {...commonProps("base_url")} placeholder="https://digitalapi.auspost.com.au/test/" />
            <FormInput label="Account Number" {...commonProps("account_number")} />
            <FormInput label="Account Label" {...commonProps("account_label")} />
          </div>
        );
      case 'aramex':
        return (
          <div className="grid grid-cols-12 gap-x-4 gap-y-3.5">
            <FormInput label="Client ID" {...commonProps("client_id")} />
            <FormInput label="Client Secret" {...commonProps("client_secret")} type="password" />
            <FormInput label="Account Name" {...commonProps("account_name")} />
            <FormInput label="Account Label" {...commonProps("account_label")} />
          </div>
        );
      case 'mypostbusiness':
        return (
          <div className="grid grid-cols-12 gap-x-4 gap-y-3.5">
            <FormInput label="Merchant Token" {...commonProps("merchant_token")} />
            <FormInput label="Base URL" {...commonProps("base_url")} placeholder="https://digitalapi.auspost.com.au/test" />
            <FormInput label="Account Number" {...commonProps("account_number")} />
            <FormInput label="Account Label" {...commonProps("account_label")} />
          </div>
        );
      case 'directfreight':
        return (
          <div className="grid grid-cols-12 gap-x-4 gap-y-3.5">
            <FormInput label="Token" {...commonProps("token")} />
            <FormInput label="Account" {...commonProps("account")} />
            <FormInput label="Site ID" {...commonProps("site_id")} />
            <FormInput label="Base URL" {...commonProps("base_url")} />
            <FormInput label="Consignment Token" {...commonProps("consignment_token")} />
            <FormInput label="Account Label" {...commonProps("account_label")} />
          </div>
        );
      default:
        return (
          <div className="py-10 text-center col-span-12">
            <p className="text-slate-500">Configuration is coming soon.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden flex flex-col flex-1">
        {!integrationsData || integrationsData.length === 0 || loadingList ? (
          <div className="flex flex-col flex-1">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-800 p-4">
              <div className="flex flex-col">
                <h1 className="text-lg font-bold text-gray-800 dark:text-zinc-200 my-0">Carrier Integrations</h1>
                <p className="text-sm text-gray-500 dark:text-zinc-400 mb-0">Manage your shipping carriers and service connections.</p>
              </div>
              <Button onClick={() => setIsAddOpen(true)} className="h-8 bg-primary hover:bg-primary/90 text-white gap-2 rounded-sm">
                <Plus className="w-4 h-4" />
                Add Carrier
              </Button>
            </div>

            {/* Centered Empty State Box */}
            <div className="flex-1 flex items-center justify-center p-8 bg-gray-50/30 dark:bg-zinc-950/20">
              <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-10 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none text-center flex flex-col items-center max-w-sm w-full gap-5">
                <div className="w-12 h-12 rounded-xl bg-primary/5 dark:bg-primary/10 flex items-center justify-center text-primary">
                  <Truck className="w-6 h-6" />
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium leading-relaxed max-w-[280px]">
                  Our platform integrates with all your stores and marketplaces and with your favorite couriers. So you can batch orders, print labels, and send tracking to your customers in fewer clicks than ever.
                </p>
                <Button onClick={() => setIsAddOpen(true)} className="h-8 bg-primary hover:bg-primary/90 text-white font-semibold text-[13px] px-6 rounded-sm">
                  Click to connect your first channel
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <DataTable
            data={integrationsData}
            columns={columns}
            headerTitle="Carrier Integrations"
            headerDescription="Manage your shipping carriers and service connections."
            searchable
            searchPlaceholder="Search carriers..."
            className='pb-3'
            totalItems={integrationsData.length}
            loading={loadingList}
            customHeader={
              <Button onClick={() => setIsAddOpen(true)} className="h-8 bg-primary hover:bg-primary/90 text-white gap-2 rounded-sm">
                <Plus className="w-4 h-4" />
                Add Carrier
              </Button>
            }
          />
        )}
      </div>

      <Drawer
        open={isAddOpen}
        onClose={resetFlow}
        title={selectedCarrier ? `Configure ${carriers.find(c => c.id === selectedCarrier)?.name}` : "Add Shipping Carrier"}
        description="Connect a new carrier account to generate labels and get live rates."
        className="max-w-[800px]"
        footer={
          currentStep < 2 || currentStep === 2 ? (
            <div className="flex justify-between items-center w-full">
              <div>
                {currentStep === 1 && (
                  <Button variant="outline" onClick={() => setCurrentStep(0)} className="h-8 text-[13px] rounded-sm">Back</Button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={resetFlow} className="h-8 text-[13px] rounded-sm">Cancel</Button>
                {currentStep === 0 && (
                  <Button disabled={!selectedCarrier} onClick={() => setCurrentStep(1)} className="h-8 text-[13px] rounded-sm">Continue</Button>
                )}
                {currentStep === 1 && (
                  <Button onClick={handleConnect} disabled={isLoading} className="h-8 text-[13px] rounded-sm">
                    {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : null}
                    Save & Connect
                  </Button>
                )}
                {currentStep === 2 && (
                  <Button onClick={resetFlow} className="h-8 text-[13px] rounded-sm">Done</Button>
                )}
              </div>
            </div>
          ) : null
        }
      >
        <div className="pb-4">
          <Stepper
            currentStep={currentStep}
            steps={[
              { title: 'Select', icon: Truck },
              { title: 'Credentials', icon: Settings2 },
              { title: 'Done', icon: CheckCircle2 },
            ]}
          />

          <div className="mt-8 px-4 h-[400px] overflow-y-auto no-scrollbar">
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
                >
                  {carriers.map((carrier) => {
                    const isSelected = selectedCarrier === carrier.id;
                    const isComingSoon = carrier.status === 'coming_soon';

                    return (
                      <div
                        key={carrier.id}
                        onClick={() => !isComingSoon && setSelectedCarrier(carrier.id)}
                        className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 text-center ${isSelected
                          ? 'border-primary bg-primary/5'
                          : isComingSoon
                            ? 'border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 opacity-60 cursor-not-allowed'
                            : 'border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-primary/50'
                          }`}
                      >
                        {isComingSoon && (
                          <Badge variant="outline" className="absolute top-2 right-2 text-[8px] px-1.5 py-0">Soon</Badge>
                        )}
                        <carrier.icon className={`w-8 h-8 ${isSelected ? 'text-primary' : 'text-gray-400'}`} />
                        <span className={`text-[13px] font-bold ${isSelected ? 'text-primary' : 'text-gray-700 dark:text-zinc-300'}`}>
                          {carrier.name}
                        </span>
                      </div>
                    );
                  })}
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6 max-w-lg mx-auto"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100">API Credentials</h3>
                    <p className="text-sm text-gray-500 dark:text-zinc-400">Enter your {carriers.find(c => c.id === selectedCarrier)?.name} account details.</p>
                  </div>

                  {renderFields()}
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full space-y-4 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-2 text-emerald-600">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100">Carrier Connected!</h3>
                  <p className="text-sm text-gray-500 dark:text-zinc-400 max-w-xs mx-auto">Your {carriers.find(p => p.id === selectedCarrier)?.name} account is active and ready to generate labels.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
