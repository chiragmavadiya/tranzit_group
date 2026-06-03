import React, { useState, useCallback } from 'react';
import { ShoppingCart, Loader2, Box, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Drawer } from '@/components/ui/drawer';
import { FormInput } from '@/features/orders/components/OrderFormUI';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import {
  useConnectIntegration,
  useDisconnectIntegration,
  useIntegrationsList,
  useIntegrationStatusMutation
} from '@/features/integrations/hooks/useIntegrations';
import { showToast } from '@/components/ui/custom-toast';
import RenderIntegrationSection from '@/features/integrations/components/RenderIntegrationSection';

const platforms = [
  { id: 'shopify', name: 'Shopify', icon: ShoppingCart, status: 'available' },
  { id: 'woocommerce', name: 'WooCommerce', icon: Store, status: 'available' },
  { id: 'ebay', name: 'eBay', icon: Box, status: 'available' },
  { id: 'amazon', name: 'Amazon', icon: Store, status: 'coming_soon' },
];

export default function EcommerceIntegrationsPage() {
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // Fetch e-commerce integrations list
  const { data: listResponse, isLoading: listLoading } = useIntegrationsList();

  // Fetch status mutation for config loading
  const { mutate: getIntegrationStatus, isPending: statusLoading, variables: statusVariables } = useIntegrationStatusMutation();

  const connectMutation = useConnectIntegration();
  const disconnectMutation = useDisconnectIntegration();

  const handleEdit = (providerId: string) => {
    getIntegrationStatus(providerId, {
      onSuccess: (response) => {
        setSelectedPlatform(providerId);
        setFormData(response.data || {});
        setSubmitted(false);
        setErrors({});
        setIsAddOpen(true);
      },
    });
  };

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
        return (
          <div className="grid grid-cols-12 gap-x-4 gap-y-3.5">
            <FormInput label="Shop Domain" {...commonProps("shop")} isHalf={false} isFullWidth={true} placeholder="your-store.myshopify.com" />
          </div>
        );
      case 'woocommerce':
        return (
          <div className="grid grid-cols-12 gap-x-4 gap-y-3.5">
            <FormInput label="Store URL" {...commonProps("store_url")} placeholder="https://your-store.com" />
            <FormInput label="Consumer Key" {...commonProps("consumer_key")} />
            <FormInput label="Consumer Secret" {...commonProps("consumer_secret")} type="password" />
          </div>
        );
      case 'ebay':
        return (
          <div className="grid grid-cols-12 gap-x-4 gap-y-3.5">
            {/* <FormSelect
              label="Marketplace Region"
              options={[{ label: 'Australia', value: 'au' }, { label: 'US', value: 'us' }]}
              value={formData.region || ''}
              onValueChange={(val) => handleInputChange(val, "region")}
              isHalf={true}
            /> */}
            <Button onClick={() => { }} className="col-span-12">
              Connect eBay Account
            </Button>
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
          <div className='flex justify-end'>
            <Button onClick={handleConnect} disabled={isLoading} className="h-8 text-[13px] rounded-sm">
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : null}
              Connect
            </Button>
          </div>
        }
      >
        <div className="pb-4">
          <div className="mt-8 px-4 h-[350px] overflow-y-auto no-scrollbar">
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
