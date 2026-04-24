import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ZohoConnectionCard } from '../components/ZohoConnectionCard';
import { ZohoSettingsCard } from '../components/ZohoSettingsCard';

export default function ZohoIntegrationPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const [formData, setFormData] = useState({
    clientId: '',
    clientSecret: '',
    organizationId: '',
    booksBaseUrl: 'https://www.zohoapis.com/books/v3',
    accountsBaseUrl: 'https://accounts.zoho.com/oauth/v2',
    scopes: 'ZohoBooks.contacts.ALL,ZohoBooks.invoices.ALL,ZohoBooks.customerpayments.ALL,ZohoBooks.settings.ALL',
    defaultCountry: 'Australia'
  });

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = async () => {
    setIsConnected(true);
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving Zoho Settings:', formData);
      // toast.success('Settings saved successfully');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOAuth = () => {
    console.log('Starting OAuth Grant with:', formData.clientId);
    // window.location.href = `...`;
  };

  return (
    <div className="flex flex-col flex-1 gap-4 p-page-padding min-h-0 animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30 overflow-y-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-950 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-200 dark:shadow-none">
            <Share2 className="w-6 h-6" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-100 tracking-tight">Zoho Books Integration</h1>
            <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium italic">Authorize and manage synchronization between Tranzit and Zoho Books.</p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="h-9 px-4 border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900 text-slate-600 dark:text-zinc-400 font-bold uppercase tracking-widest text-[10px]"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        {/* Connection Status Column */}
        <div className="xl:col-span-4 h-full">
          <ZohoConnectionCard
            clientId={formData.clientId}
            organizationId={formData.organizationId}
            isConnected={isConnected}
            onStartOAuth={handleStartOAuth}
          />
        </div>

        {/* Settings Form Column */}
        <div className="xl:col-span-8">
          <ZohoSettingsCard
            formData={formData}
            onChange={handleInputChange}
            onSave={handleSave}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
