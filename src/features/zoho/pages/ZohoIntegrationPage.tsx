import { useState, useCallback, useEffect } from 'react';
import { ZohoConnectionCard } from '../components/ZohoConnectionCard';
import { ZohoSettingsCard } from '../components/ZohoSettingsCard';
import { useZohoConfig, useSaveZohoConfig, useZohoRedirect } from '../hooks/useZoho';
import { showToast } from '@/components/ui/custom-toast';

export default function ZohoIntegrationPage() {
  const { data: configResponse, isLoading: isFetching } = useZohoConfig();
  const { mutate: saveConfig, isPending: isSaving } = useSaveZohoConfig();
  const { mutate: startOAuth, isPending: isRedirecting } = useZohoRedirect();

  const [isConnected, setIsConnected] = useState(false);

  const [formData, setFormData] = useState({
    clientId: '',
    clientSecret: '',
    organizationId: '',
    booksBaseUrl: '',
    accountsBaseUrl: '',
    scopes: '',
    defaultCountry: ''
  });

  // Populate form when data is fetched
  useEffect(() => {
    if (configResponse?.data) {
      const config = configResponse.data;
      setFormData({
        clientId: config.client_id || '',
        clientSecret: config.client_secret || '',
        organizationId: config.org_id || '',
        booksBaseUrl: config.base_url || '',
        accountsBaseUrl: config.accounts_base_url || '',
        scopes: config.scopes || '',
        defaultCountry: config.default_country || ''
      });
      // If we have credentials, we can assume it's "connected" in terms of config existence
      // The actual OAuth status might be different, but for UI purposes:
      if (config.client_id && config.client_secret) {
        setIsConnected(true);
      }
    }
  }, [configResponse]);

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = async () => {
    saveConfig({
      client_id: formData.clientId,
      client_secret: formData.clientSecret,
      org_id: formData.organizationId,
      base_url: formData.booksBaseUrl,
      accounts_base_url: formData.accountsBaseUrl,
      scopes: formData.scopes,
      default_country: formData.defaultCountry,
    }, {
      onSuccess: (data) => {
        showToast(data.message || 'Settings saved successfully', 'success');
        setIsConnected(true);
      },
      onError: (error: any) => {
        showToast(error.message || 'Failed to save settings', 'error');
      }
    });
  };

  const handleStartOAuth = () => {
    startOAuth(undefined, {
      onError: (error: any) => {
        showToast(error.message || 'Failed to initiate Zoho redirect', 'error');
      }
    });
  };

  if (isFetching) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500 font-medium italic">Loading configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 gap-4 p-page-padding min-h-0 animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30 overflow-y-auto">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        {/* Connection Status Column */}
        <div className="xl:col-span-5 h-full">
          <ZohoConnectionCard
            clientId={formData.clientId}
            organizationId={formData.organizationId}
            isConnected={isConnected}
            onStartOAuth={handleStartOAuth}
          />
        </div>

        {/* Settings Form Column */}
        <div className="xl:col-span-7">
          <ZohoSettingsCard
            formData={formData}
            onChange={handleInputChange}
            onSave={handleSave}
            isLoading={isSaving || isRedirecting}
          />
        </div>
      </div>
    </div>
  );
}
