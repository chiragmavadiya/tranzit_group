import React, { useState } from 'react';
import { Plus, ShoppingCart, Loader2, CheckCircle2, Box, Store, Settings2, Link2Off, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import { Drawer } from '@/components/ui/drawer';
import { FormInput, FormSelect } from '@/features/orders/components/OrderFormUI';
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

const platforms = [
  { id: 'shopify', name: 'Shopify', icon: ShoppingCart, status: 'available' },
  { id: 'woocommerce', name: 'WooCommerce', icon: Store, status: 'available' },
  { id: 'ebay', name: 'eBay', icon: Box, status: 'available' },
  { id: 'amazon', name: 'Amazon', icon: Store, status: 'coming_soon' },
];

export default function EcommerceIntegrationsPage() {
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // Fetch status of the individual platforms to build the table
  const shopifyStatus = useIntegrationStatus('shopify');
  const woocommerceStatus = useIntegrationStatus('woocommerce');
  const ebayStatus = useIntegrationStatus('ebay');

  const connectMutation = useConnectIntegration();
  const syncMutation = useSyncIntegration();
  const disconnectMutation = useDisconnectIntegration();

  // Combine query status values
  const loadingList = shopifyStatus.isLoading || woocommerceStatus.isLoading || ebayStatus.isLoading;

  const integrationsData = React.useMemo(() => {
    const list = [];
    const shData = shopifyStatus.data?.data;
    // const wcData = woocommerceStatus.data?.data;
    const ebData = ebayStatus.data?.data;

    if (shData?.connected) {
      list.push({
        id: 'shopify',
        platform: 'Shopify',
        account: shData.shop_domain || 'Connected',
        status: 'Connected',
        lastSync: shData.last_synced_at || 'Never',
        logo: ShoppingCart,
        raw: shData
      });
    }

    // if (wcData?.connected) {
    //   list.push({
    //     id: 'woocommerce',
    //     platform: 'WooCommerce',
    //     account: wcData.store_url || 'Connected',
    //     status: 'Connected',
    //     lastSync: wcData.last_synced_at || 'Never',
    //     logo: Store,
    //     raw: wcData
    //   });
    // }

    if (ebData?.connected) {
      list.push({
        id: 'ebay',
        platform: 'eBay',
        account: ebData.account_label || 'Connected',
        status: 'Connected',
        lastSync: ebData.last_synced_at || 'Never',
        logo: Box,
        raw: ebData
      });
    }

    return list;
  }, [shopifyStatus.data, ebayStatus.data]);

  const handleSync = (providerId: string) => {
    syncMutation.mutate(providerId);
  };

  const handleEdit = (providerId: string) => {
    const provider = integrationsData.find(item => item.id === providerId);
    if (provider) {
      setSelectedPlatform(providerId);
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
      header: 'Platform',
      key: 'platform',
      cell: (_: any, row: any) => {
        const Icon = row.logo;
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
              <Icon className="w-4 h-4 text-gray-700 dark:text-zinc-300" />
            </div>
            <span className="font-semibold text-gray-900 dark:text-zinc-100">{row.platform}</span>
          </div>
        );
      }
    },
    {
      header: 'Connected Account',
      key: 'account',
      cell: (val: string) => <span className="text-gray-500 dark:text-zinc-400">{val}</span>
    },
    {
      header: 'Status',
      key: 'status',
      cell: (val: string) => (
        <Badge className={val === 'Connected' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400'}>
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
          <Button
            variant="ghost"
            size="icon-sm"
            className="h-8 w-8 text-slate-400 hover:text-slate-900 dark:hover:text-white"
            onClick={() => handleEdit(row.id)}
          >
            <Settings2 className="w-4 h-4" />
          </Button>
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
        </div>
      )
    }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const requiredFields: Record<string, string[]> = {
      shopify: ['shop'],
      woocommerce: ['store_url', 'consumer_key', 'consumer_secret'],
      ebay: []
    };

    const fieldsToValidate = requiredFields[selectedPlatform!] || [];
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
    const platform = selectedPlatform!;
    connectMutation.mutate({ provider: platform, data: formData }, {
      onSuccess: (response: any) => {
        setIsLoading(false);
        if (response?.status && response.data?.authorization_url) {
          window.open(response.data.authorization_url);
        } else {
          // WooCommerce or eBay direct save
          setCurrentStep(2);
          setTimeout(() => {
            setCurrentStep(3);
            queryClient.invalidateQueries({ queryKey: ["integration-status", platform] });
          }, 1500);
        }
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
      setSelectedPlatform(null);
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
      errormsg: errors[name]
    });

    switch (selectedPlatform) {
      case 'shopify':
        return (
          <div className="space-y-4">
            <FormInput label="Shop Domain" {...commonProps("shop")} placeholder="your-store.myshopify.com" />
          </div>
        );
      case 'woocommerce':
        return (
          <div className="space-y-4">
            <FormInput label="Store URL" {...commonProps("store_url")} placeholder="https://your-store.com" />
            <FormInput label="Consumer Key" {...commonProps("consumer_key")} />
            <FormInput label="Consumer Secret" {...commonProps("consumer_secret")} type="password" />
          </div>
        );
      case 'ebay':
        return (
          <div className="space-y-4">
            <FormSelect
              label="Marketplace Region"
              options={[{ label: 'Australia', value: 'au' }, { label: 'US', value: 'us' }]}
              value={formData.region || ''}
              onValueChange={(val) => handleInputChange(val, "region")}
            />
          </div>
        );
      default:
        return (
          <div className="py-10 text-center">
            <p className="text-slate-500">Configuration is coming soon.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {integrationsData.length === 0 && !loadingList ? (
        <div className="flex flex-col flex-1">
          {/* Header */}
          {/* <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-800 p-4">
              <div className="flex flex-col">
                <h1 className="text-lg font-bold text-gray-800 dark:text-zinc-200 my-0">Ecommerce Integrations</h1>
                <p className="text-sm text-gray-500 dark:text-zinc-400 mb-0">Connect your online stores to automatically sync orders.</p>
              </div>
              <Button onClick={() => setIsAddOpen(true)} className="h-8 bg-primary hover:bg-primary/90 text-white gap-2 rounded-sm">
                <Plus className="w-4 h-4" />
                Add Integration
              </Button>
            </div> */}

          {/* Centered Empty State Box */}
          <div className="flex-1 flex items-center justify-center p-8 bg-gray-50/30 dark:bg-zinc-950/20">
            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-10 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none text-center flex flex-col items-center max-w-sm w-full gap-5">
              <div className="w-12 h-12 rounded-xl bg-primary/5 dark:bg-primary/10 flex items-center justify-center text-primary">
                <Store className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium leading-relaxed max-w-[280px]">
                Our platform integrates with all your stores and marketplaces and with your favorite couriers. So you can batch orders, print labels, and send tracking to your customers in fewer clicks than ever.
              </p>
              <Button onClick={() => setIsAddOpen(true)} className="h-8 bg-primary hover:bg-primary/90 text-white font-semibold text-[13px] px-6 rounded-sm">
                Click to connect your first Ecommerce Store
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden flex flex-col flex-1">

          <DataTable
            data={integrationsData}
            columns={columns}
            headerTitle="Ecommerce Integrations"
            headerDescription="Connect your online stores to automatically sync orders."
            searchable
            searchPlaceholder="Search integrations..."
            className='pb-3'
            totalItems={integrationsData.length}
            loading={loadingList}
            customHeader={
              <Button onClick={() => setIsAddOpen(true)} className="h-8 bg-primary hover:bg-primary/90 text-white gap-2 rounded-sm">
                <Plus className="w-4 h-4" />
                Add Integration
              </Button>
            }
          />
        </div>
      )}

      <Drawer
        open={isAddOpen}
        onClose={resetFlow}
        title={selectedPlatform ? `Configure ${platforms.find(p => p.id === selectedPlatform)?.name}` : "Add Integration"}
        description="Connect a new ecommerce platform to your account."
        className="max-w-[800px]"
        footer={
          currentStep < 2 || currentStep === 3 ? (
            <div className="flex justify-between items-center w-full">
              <div>
                {currentStep === 1 && (
                  <Button variant="outline" onClick={() => setCurrentStep(0)} className="h-8 text-[13px] rounded-sm">Back</Button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={resetFlow} className="h-8 text-[13px] rounded-sm">Cancel</Button>
                {currentStep === 0 && (
                  <Button disabled={!selectedPlatform} onClick={() => setCurrentStep(1)} className="h-8 text-[13px] rounded-sm">Continue</Button>
                )}
                {currentStep === 1 && (
                  <Button onClick={handleConnect} disabled={isLoading} className="h-8 text-[13px] rounded-sm">
                    {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : null}
                    Connect
                  </Button>
                )}
                {currentStep === 3 && (
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
              { title: 'Select', icon: Box },
              { title: 'Configure', icon: Settings2 },
              { title: 'Validate', icon: Loader2 },
              { title: 'Done', icon: CheckCircle2 },
            ]}
          />

          <div className="mt-8 px-4 h-[350px] overflow-y-auto no-scrollbar">
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="grid grid-cols-2 sm:grid-cols-3 gap-4"
                >
                  {platforms.map((platform) => {
                    const isSelected = selectedPlatform === platform.id;
                    const isComingSoon = platform.status === 'coming_soon';

                    return (
                      <div
                        key={platform.id}
                        onClick={() => !isComingSoon && setSelectedPlatform(platform.id)}
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
                        <platform.icon className={`w-8 h-8 ${isSelected ? 'text-primary' : 'text-gray-400'}`} />
                        <span className={`text-[13px] font-bold ${isSelected ? 'text-primary' : 'text-gray-700 dark:text-zinc-300'}`}>
                          {platform.name}
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
                  className="space-y-6 max-w-md mx-auto"
                >
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      {platforms.find(p => p.id === selectedPlatform)?.icon && React.createElement(platforms.find(p => p.id === selectedPlatform)!.icon, { className: "w-6 h-6 text-primary" })}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100">Connect {platforms.find(p => p.id === selectedPlatform)?.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-zinc-400">Enter your store credentials to authorize access.</p>
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
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100">Validating Credentials</h3>
                  <p className="text-sm text-gray-500 dark:text-zinc-400 max-w-xs mx-auto">We are securely verifying your store connection. This may take a few seconds.</p>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full space-y-4 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-2 text-emerald-600">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100">Connected Successfully</h3>
                  <p className="text-sm text-gray-500 dark:text-zinc-400 max-w-xs mx-auto">Your {platforms.find(p => p.id === selectedPlatform)?.name} store is now connected. Orders will begin syncing shortly.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
