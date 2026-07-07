import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { ShoppingCart, Loader2, Box, Store, RefreshCw, Check, Link2Off } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Drawer } from '@/components/ui/drawer';
import { FormInput } from '@/features/orders/components/OrderFormUI';
import { Switch } from '@/components/ui/switch';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import {
  useConnectIntegration,
  useDisconnectIntegration,
  useIntegrationsList,
  useIntegrationStatusMutation,
  useSyncIntegration,
  useToggleEbayAutoSync,
  useToggleEbayAutoFulfillment,
  useToggleShopifyAutoFulfillment
} from '@/features/integrations/hooks/useIntegrations';
import { showToast } from '@/components/ui/custom-toast';
import RenderIntegrationSection from '@/features/integrations/components/RenderIntegrationSection';
import { useSearchParams } from 'react-router-dom';
import { useAppSelector } from '@/hooks/store.hooks';

const platforms = [
  { id: 'shopify', name: 'Shopify', icon: ShoppingCart, status: 'available' },
  { id: 'woocommerce', name: 'WooCommerce', icon: Store, status: 'available' },
  { id: 'ebay', name: 'eBay', icon: Box, status: 'available' },
  { id: 'amazon', name: 'Amazon', icon: Store, status: 'coming_soon' },
];

export default function EcommerceIntegrationsPage() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams()
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // Fetch e-commerce integrations list
  const { data: listResponse, isLoading: listLoading } = useIntegrationsList();
  const { is_sub_user, team_access } = useAppSelector((state) => state.auth)
  const canReadWrite = useMemo(() => !is_sub_user || team_access?.permissions?.settings_integrations === 'full', [is_sub_user, team_access]);

  // Fetch status mutation for config loading
  const { mutate: getIntegrationStatus, isPending: statusLoading, variables: statusVariables } = useIntegrationStatusMutation();

  const connectMutation = useConnectIntegration();
  const disconnectMutation = useDisconnectIntegration();
  const { mutate: toggleAutoSync, isPending: isTogglingAutoSync } = useToggleEbayAutoSync();
  const { mutate: toggleAutoFulfillment, isPending: isTogglingAutoFulfillment } = useToggleEbayAutoFulfillment();
  const { mutate: toggleShopifyAutoFulfillment, isPending: isTogglingShopifyAutoFulfillment } = useToggleShopifyAutoFulfillment();
  const { mutate: manualSync, isPending: isSyncing } = useSyncIntegration();

  const selectedConnection = listResponse?.data?.ecommerce_connections?.find(
    (c: any) => c.slug === selectedPlatform
  );
  const isConnected = selectedConnection?.connected;

  const handleEdit = useCallback((providerId: string) => {
    getIntegrationStatus(providerId, {
      onSuccess: (response) => {
        setSelectedPlatform(providerId);
        setFormData(response.data || {});
        setSubmitted(false);
        setErrors({});
        setIsAddOpen(true);
      },
    });
  }, [getIntegrationStatus]);

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

  const onConnect = useCallback((providerId: string) => {
    setSelectedPlatform(providerId);
    setSubmitted(false);
    setErrors({});
    setIsAddOpen(true);
  }, []);

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
          setTimeout(() => {
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
      errormsg: errors[name],
      isHalf: true
    });

    switch (selectedPlatform) {
      case 'shopify':
        if (isConnected) {
          const store = formData?.store || {};
          return (
            <div className="col-span-12 space-y-6">
              {/* Connection Status Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 dark:from-emerald-500/10 dark:to-teal-500/10 border border-emerald-500/20 dark:border-emerald-500/30 rounded-2xl gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    <Check className="w-5 h-5 stroke-[2.5px]" />
                    <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                  </div>
                  <div className="text-left">
                    <h4 className="my-0 text-base font-bold text-slate-800 dark:text-zinc-100">
                      {store.shop_name || "Shopify Store"} Connected
                    </h4>
                    <p className="my-0 text-xs text-slate-500 dark:text-zinc-400">
                      Automatically syncing your orders and customer details.
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/80 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                    Active Connection
                  </span>
                </div>
              </div>

              {/* Store Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800/80 rounded-2xl p-5 text-left">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide block">Store Domain</span>
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-zinc-200">
                    <span className="truncate">{store.shop_domain || "-"}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide block">Store Owner Email</span>
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-zinc-200">
                    <span className="truncate">{store.shop_owner_email || "-"}</span>
                  </div>
                </div>
                <div className="space-y-1 md:col-span-2 pt-2 border-t border-slate-100 dark:border-zinc-800/60">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide block">Installed On</span>
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-zinc-200">
                    <span>{store.installed_at ? new Date(store.installed_at).toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) : "-"}</span>
                  </div>
                </div>
              </div>

              {/* Settings and Actions */}
              {canReadWrite && (
                <div className="space-y-5 pt-3 text-left">
                  <h4 className="my-0 text-sm font-bold text-slate-800 dark:text-zinc-200 tracking-wide">Sync Settings</h4>

                  {/* Auto-fulfillment Toggle */}
                  <div className="flex items-center justify-between p-4 bg-slate-50/30 dark:bg-zinc-900/30 border border-slate-100 dark:border-zinc-800/60 rounded-xl">
                    <div className="space-y-0.5 max-w-[80%]">
                      <label className="text-sm font-bold text-slate-800 dark:text-zinc-200">Enable Auto-fulfillment</label>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        When enabled, orders from Shopify will be fulfilled automatically (tracking sent to Shopify) when the order status changes to Printed.
                      </p>
                    </div>
                    <Switch
                      checked={store.auto_fulfillment_enabled ?? false}
                      onCheckedChange={(checked) => {
                        setFormData((prev: any) => ({
                          ...prev,
                          store: {
                            ...prev.store,
                            auto_fulfillment_enabled: checked
                          }
                        }));
                        toggleShopifyAutoFulfillment(checked, {
                          onError: () => {
                            setFormData((prev: any) => ({
                              ...prev,
                              store: {
                                ...prev.store,
                                auto_fulfillment_enabled: !checked
                              }
                            }));
                          }
                        });
                      }}
                      disabled={isTogglingShopifyAutoFulfillment}
                    />
                  </div>

                  {/* Actions Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-zinc-800/60">
                    <Button
                      variant="outline"
                      className="w-full h-10 font-bold border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900 flex items-center justify-center gap-2 rounded-xl transition-all"
                      onClick={() => manualSync('shopify')}
                      disabled={isSyncing}
                    >
                      {isSyncing ? (
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      ) : (
                        <RefreshCw className="w-4 h-4 text-primary" />
                      )}
                      <span>Sync Orders Now</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full h-10 font-bold text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 border border-red-200/50 dark:border-red-900/30 flex items-center justify-center gap-2 rounded-xl transition-all"
                      onClick={() => {
                        disconnectMutation.mutate('shopify', {
                          onSuccess: () => resetFlow()
                        });
                      }}
                      disabled={disconnectMutation.isPending}
                    >
                      {disconnectMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Link2Off className="w-4 h-4" />
                      )}
                      <span>Disconnect Store</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        }
        return (
          <div className="grid grid-cols-12 gap-x-4 gap-y-3.5">
            <FormInput label="Shop Domain" {...commonProps("shop")} isHalf={false} isFullWidth={true} placeholder="your-store.myshopify.com" />
          </div>
        );
      case 'woocommerce':
        if (isConnected) {
          const store = formData || {};
          return (
            <div className="col-span-12 space-y-6">
              {/* Connection Status Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 dark:from-emerald-500/10 dark:to-teal-500/10 border border-emerald-500/20 dark:border-emerald-500/30 rounded-2xl gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    <Check className="w-5 h-5 stroke-[2.5px]" />
                    <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                  </div>
                  <div className="text-left">
                    <h4 className="my-0 text-base font-bold text-slate-800 dark:text-zinc-100">
                      WooCommerce Connected
                    </h4>
                    <p className="my-0 text-xs text-slate-500 dark:text-zinc-400">
                      Automatically syncing your WooCommerce orders.
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/80 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                    Active Connection
                  </span>
                </div>
              </div>

              {/* Store Details */}
              <div className="bg-slate-50/50 dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800/80 rounded-2xl p-5 space-y-1 text-left">
                <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide block">Store URL</span>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-zinc-200">
                  <span className="truncate">{store.store_url || "-"}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-zinc-800/60">
                <Button
                  variant="outline"
                  className="w-full h-10 font-bold border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900 flex items-center justify-center gap-2 rounded-xl transition-all"
                  onClick={() => manualSync('woocommerce')}
                  disabled={isSyncing}
                >
                  {isSyncing ? (
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  ) : (
                    <RefreshCw className="w-4 h-4 text-primary" />
                  )}
                  <span>Sync Orders Now</span>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full h-10 font-bold text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 border border-red-200/50 dark:border-red-900/30 flex items-center justify-center gap-2 rounded-xl transition-all"
                  onClick={() => {
                    disconnectMutation.mutate('woocommerce', {
                      onSuccess: () => resetFlow()
                    });
                  }}
                  disabled={disconnectMutation.isPending}
                >
                  {disconnectMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Link2Off className="w-4 h-4" />
                  )}
                  <span>Disconnect Store</span>
                </Button>
              </div>
            </div>
          );
        }
        return (
          <div className="grid grid-cols-12 gap-x-4 gap-y-3.5">
            <FormInput label="Store URL" {...commonProps("store_url")} placeholder="https://your-store.com" />
            <FormInput label="Consumer Key" {...commonProps("consumer_key")} />
            <FormInput label="Consumer Secret" {...commonProps("consumer_secret")} type="password" />
          </div>
        );
      case 'ebay':
        if (isConnected) {
          return (
            <div className="col-span-12 space-y-6">
              <div className="flex items-center justify-between p-4 bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Check className="w-4 h-4 stroke-[3px]" />
                  </div>
                  <div>
                    <h5 className="my-0 font-bold text-slate-800 dark:text-zinc-200 text-sm">eBay Connected</h5>
                    <p className="my-0 text-xs text-slate-500 dark:text-zinc-400">Tranzit is authorized to sync your eBay store.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <h4 className="my-0 font-bold text-slate-800 dark:text-zinc-200 text-sm border-b pb-2">Sync Settings</h4>

                {/* Auto-Sync Toggle */}
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <label className="text-sm font-bold text-slate-800 dark:text-zinc-200">Automatic Order Sync</label>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">Automatically import new orders from eBay periodically.</p>
                  </div>
                  <Switch
                    checked={formData.auto_sync ?? false}
                    onCheckedChange={(checked) => {
                      setFormData((prev: any) => ({ ...prev, auto_sync: checked }));
                      toggleAutoSync(checked, {
                        onError: () => {
                          setFormData((prev: any) => ({ ...prev, auto_sync: !checked }));
                        }
                      });
                    }}
                    disabled={isTogglingAutoSync}
                  />
                </div>

                {/* Auto-Fulfillment Toggle */}
                <div className="flex items-center justify-between py-2 border-t pt-4">
                  <div className="space-y-0.5">
                    <label className="text-sm font-bold text-slate-800 dark:text-zinc-200">Automatic Tracking Upload</label>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">Automatically upload tracking details to eBay once shipped.</p>
                  </div>
                  <Switch
                    checked={formData.auto_fulfillment ?? false}
                    onCheckedChange={(checked) => {
                      setFormData((prev: any) => ({ ...prev, auto_fulfillment: checked }));
                      toggleAutoFulfillment(checked, {
                        onError: () => {
                          setFormData((prev: any) => ({ ...prev, auto_fulfillment: !checked }));
                        }
                      });
                    }}
                    disabled={isTogglingAutoFulfillment}
                  />
                </div>

                {/* Manual Sync Button */}
                <div className="flex items-center justify-between py-2 border-t pt-4">
                  <div className="space-y-0.5">
                    <label className="text-sm font-bold text-slate-800 dark:text-zinc-200">Manual Synchronization</label>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">Manually trigger a sync of eBay orders right now.</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 leading-none font-bold"
                    onClick={() => manualSync('ebay')}
                    disabled={isSyncing}
                  >
                    {isSyncing ? (
                      <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="w-3.5 h-3.5 mr-2" />
                    )}
                    Sync Orders
                  </Button>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed border-slate-200 dark:border-zinc-800 rounded-xl bg-slate-50/50 dark:bg-zinc-900/50 col-span-12">
            <Store className="w-10 h-10 text-primary mb-3" />
            <h4 className="font-bold text-slate-800 dark:text-zinc-200 text-sm mb-1 my-0">Authorize eBay Integration</h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mb-4">
              You will be redirected to eBay to securely authorize Tranzit to access and sync your orders.
            </p>
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

  useEffect(() => {
    if (searchParams.get('shopify') === 'connected') {
      handleEdit('shopify')
      setSearchParams('')
    }
  }, [searchParams, handleEdit, setSearchParams])


  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="bg-white p-page-padding dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden flex flex-col flex-1">
        <div className="flex flex-col gap-1 mb-3">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-zinc-100 my-0">
            <ShoppingCart className="w-6 h-6 text-primary" />
            E-commerce Integrations
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mb-2">Connect your e-commerce stores to streamline your workflow.</p>
        </div>

        <div className="flex flex-col gap-10">
          <RenderIntegrationSection
            // title="E-commerce Integrations"
            // Icon={ShoppingCart}
            data={listResponse?.data?.ecommerce_connections}
            disconnectMutation={disconnectMutation}
            onConnect={onConnect}
            onConfigure={handleEdit}
            isLoading={listLoading}
            configLoadingProvider={statusLoading ? statusVariables : undefined}
            canReadWrite={canReadWrite}
          />
        </div>
      </div>

      <Drawer
        open={isAddOpen}
        onClose={resetFlow}
        title={selectedPlatform ? `Configure ${platforms.find(p => p.id === selectedPlatform)?.name}` : "Add Integration"}
        description="Connect a new ecommerce platform to your account."
        className="max-w-[800px]"
        footer={
          <div className='flex justify-end gap-2'>
            {isConnected ? (
              <Button onClick={resetFlow} variant="outline" className="h-8 text-[13px] rounded-sm font-semibold">
                Close
              </Button>
            ) : (
              <Button onClick={handleConnect} disabled={isLoading} className="h-8 text-[13px] rounded-sm font-semibold">
                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : null}
                Connect
              </Button>
            )}
          </div>
        }
      >
        <div className="pb-4">
          <div className="mt-8 px-4 max-h-[calc(100vh-220px)] overflow-y-auto no-scrollbar">
            <AnimatePresence mode="wait">

              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6 max-w-2xl mx-auto"
              >
                <div className="mb-6 flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    {platforms.find(p => p.id === selectedPlatform)?.icon && React.createElement(platforms.find(p => p.id === selectedPlatform)!.icon, { className: "w-6 h-6 text-primary" })}
                  </div>
                  <div>
                    <h3 className="my-0 text-lg font-bold text-gray-900 dark:text-zinc-100">Connect {platforms.find(p => p.id === selectedPlatform)?.name}</h3>
                    <p className="my-0 text-sm text-gray-500 dark:text-zinc-400">Enter your store credentials to authorize access.</p>
                  </div>
                </div>

                {renderFields()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
