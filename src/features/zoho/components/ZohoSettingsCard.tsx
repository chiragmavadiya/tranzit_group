import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings2, Save, Globe, Loader2 } from 'lucide-react';
import { FormInput } from '@/features/orders/components/OrderFormUI';

interface ZohoSettingsFormData {
  clientId: string;
  clientSecret: string;
  organizationId: string;
  booksBaseUrl: string;
  accountsBaseUrl: string;
  scopes: string;
  defaultCountry: string;
}

interface ZohoSettingsCardProps {
  formData: ZohoSettingsFormData;
  onChange: (field: keyof ZohoSettingsFormData, value: string) => void;
  onSave: () => void;
  isLoading: boolean;
}

export function ZohoSettingsCard({
  formData,
  onChange,
  onSave,
  isLoading
}: ZohoSettingsCardProps) {
  return (
    <Card className="p-4 border-gray-100 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-950 flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-zinc-900 flex items-center justify-center text-slate-600 dark:text-zinc-400">
            <Settings2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">Credentials & Settings</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">Configure your Zoho Books API access</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 dark:bg-zinc-900 rounded-full border border-slate-100 dark:border-zinc-800">
          <Globe className="w-3 h-3 text-slate-400" />
          <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-wider">Production</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Client ID"
            value={formData.clientId}
            onChange={(val) => onChange('clientId', val)}
            placeholder="e.g. 1000.XXXXXX..."
            required
            className="md:col-span-2"
          />
          <FormInput
            label="Client Secret"
            value={formData.clientSecret}
            onChange={(val) => onChange('clientSecret', val)}
            placeholder="••••••••••••••••"
            type="password"
            required
            className="md:col-span-2"
          />
          <FormInput
            label="Organization ID"
            value={formData.organizationId}
            onChange={(val) => onChange('organizationId', val)}
            placeholder="e.g. 7000XXXXXX"
            required
            className="md:col-span-2"
          />
        </div>

        <div className="pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Books Base URL"
              value={formData.booksBaseUrl}
              onChange={(val) => onChange('booksBaseUrl', val)}
              className="md:col-span-2"
              placeholder="https://www.zohoapis.com/books/v3"
            />
            <FormInput
              label="Accounts Base URL"
              value={formData.accountsBaseUrl}
              onChange={(val) => onChange('accountsBaseUrl', val)}
              className="md:col-span-2"
              placeholder="https://accounts.zoho.com/oauth/v2"
              errormsg="Change to .in, .eu, .com.cn as needed"
              error={false} // Shown as hint
            />
            <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-[-16px] ml-1 italic md:col-span-2">
              Tip: Change domain extension (.in, .eu, .com.au) based on your Zoho region.
            </p>
          </div>

          <FormInput
            label="Scopes"
            value={formData.scopes}
            onChange={(val) => onChange('scopes', val)}
            placeholder="Comma-separated scopes"
            className="md:col-span-2"
          />

          <FormInput
            label="Default Country"
            value={formData.defaultCountry}
            onChange={(val) => onChange('defaultCountry', val)}
            placeholder="Australia"
            className="md:col-span-2"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-zinc-900 flex justify-end">
          <Button
            onClick={onSave}
            disabled={isLoading}
            className="h-10 px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-100"
          >
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {isLoading ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
