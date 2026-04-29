import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link2, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ZohoConnectionCardProps {
  clientId: string;
  organizationId: string;
  isConnected: boolean;
  onStartOAuth: () => void;
}

export function ZohoConnectionCard({
  clientId,
  organizationId,
  isConnected,
  onStartOAuth
}: ZohoConnectionCardProps) {
  const redirectUri = 'https://tranzit.digisite.net/admin/zoho/callback';

  return (
    <Card className="p-6 border-gray-100 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-950 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600">
          <Link2 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">Connection Status</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400">Manage your OAuth link with Zoho</p>
        </div>
      </div>

      <div className="space-y-4 flex-1">
        <div className="grid grid-cols-1 gap-4">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Client ID</span>
              <Badge variant={clientId ? 'outline' : 'secondary'} className="text-[9px] h-4">
                {clientId ? 'Configured' : 'Not Set'}
              </Badge>
            </div>
            <p className="text-sm font-medium text-slate-700 dark:text-zinc-300 truncate">
              {clientId || 'Enter your Client ID in settings'}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Organization ID</span>
              <Badge variant={organizationId ? 'outline' : 'secondary'} className="text-[9px] h-4">
                {organizationId ? 'Configured' : 'Not Set'}
              </Badge>
            </div>
            <p className="text-sm font-medium text-slate-700 dark:text-zinc-300">
              {organizationId || 'Enter your Org ID in settings'}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Whitelist Redirect URI
          </div>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
            Please ensure you have whitelisted the following URI in your <span className="font-bold text-blue-600 cursor-pointer hover:underline inline-flex items-center gap-0.5">Zoho API Console <ExternalLink className="w-2.5 h-2.5" /></span>:
          </p>
          <div className="group relative">
            <code className="block p-2.5 bg-slate-900 text-pink-400 rounded-md text-[10px] font-mono break-all border border-slate-800 select-all cursor-copy active:scale-[0.98] transition-transform">
              {redirectUri}
            </code>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-zinc-900">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Status</span>
            <div className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
              isConnected
                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20"
                : "bg-orange-50 text-orange-600 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20"
            )}>
              <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", isConnected ? "bg-emerald-500" : "bg-orange-500")} />
              {isConnected ? 'Connected' : 'Not Connected'}
            </div>
          </div>

          <Button
            onClick={onStartOAuth}
            disabled={!clientId}
            className="w-full h-10 bg-slate-900 hover:bg-slate-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950 font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-slate-200 dark:shadow-none transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            Start OAuth Grant
          </Button>

          <div className="mt-4 flex gap-2 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-500/5 border border-blue-100/50 dark:border-blue-500/10">
            <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-blue-600/80 dark:text-blue-400/80 leading-relaxed italic">
              After approval, the refresh token is stored securely and used automatically for future synchronization.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
