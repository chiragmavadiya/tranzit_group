import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Store } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { ShopifyStoreMissingParcelDefaults } from '@/features/auth/auth.types';

interface ShopifyParcelDefaultsModalProps {
  open: boolean;
  stores: ShopifyStoreMissingParcelDefaults[];
}

// The four values the setup form asks for, shown up front so the task looks as small as it is.
const MEASUREMENTS = [
  { label: 'Length', unit: 'cm' },
  { label: 'Width', unit: 'cm' },
  { label: 'Height', unit: 'cm' },
  { label: 'Weight', unit: 'kg' },
];

export default function ShopifyParcelDefaultsModal({ open, stores }: ShopifyParcelDefaultsModalProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // One store is handled at a time: saving it clears it from the ME response, and the next
  // one (if any) takes its place.
  const nextStore = stores[0];

  const handleSetUp = () => {
    if (!nextStore) return;
    // That store's own settings page, which is also where this modal steps aside.
    navigate(`/settings/ecommerce/shopify/${nextStore.id}`);
  };

  return (
    // Not dismissible: `open` is driven by the ME flag, so ignoring onOpenChange blocks
    // the close icon, outside clicks and the escape key. `modal` traps focus and locks scroll.
    <Dialog open={open} onOpenChange={() => { }} modal disablePointerDismissal>
      <DialogContent
        ref={popupRef}
        // Default focus lands on the first tabbable element; focus the dialog itself instead,
        // so it is announced without the call-to-action looking pre-pressed.
        initialFocus={popupRef}
        showCloseButton={false}
        className="flex flex-col gap-0 overflow-hidden p-0 sm:p-0 min-w-0 sm:max-w-[540px]"
      >
        <div className="relative overflow-hidden border-b border-slate-200 dark:border-zinc-800 bg-gradient-to-br from-primary/10 via-primary/[0.04] to-transparent dark:from-primary/20 dark:via-primary/5 px-5 sm:px-6 py-4">
          {/* Soft glow in the corner, purely decorative. */}
          <div className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full bg-primary/15 blur-3xl" />

          <div className="relative min-w-0">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700 dark:text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              Action Required
            </span>
            <DialogTitle className="mt-1.5 mb-0 text-lg sm:text-xl font-bold leading-snug text-slate-900 dark:text-zinc-50">
              Default Shopify Parcel Details Required
            </DialogTitle>
            <DialogDescription className="mb-0 mt-1 text-[13px] leading-relaxed">
              Default parcel details have not yet been configured for your connected Shopify store.
            </DialogDescription>
          </div>
        </div>

        <div className="space-y-3.5 px-5 sm:px-6 py-4">
          <ul className="m-0 list-none space-y-2.5 p-0 text-[13px] leading-relaxed text-slate-600 dark:text-zinc-400">
            <li className="flex gap-2.5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                To sync and process Shopify orders through Tranzit, please provide your default parcel{' '}
                <span className="font-bold text-slate-800 dark:text-zinc-200">length, width, height and fallback weight</span>.
              </span>
            </li>
            <li className="flex gap-2.5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                Once completed, Tranzit Group will automatically use these values whenever the required parcel
                information is unavailable from Shopify.
              </span>
            </li>
          </ul>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
            {MEASUREMENTS.map(({ label, unit }) => (
              <div
                key={label}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-900/40 py-1.5 px-2"
              >
                <span className="text-[11px] font-bold leading-none text-slate-700 dark:text-zinc-200">{label}</span>
                <span className="text-[10px] font-semibold uppercase leading-none tracking-wide text-slate-400 dark:text-zinc-500">
                  {unit}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400 dark:text-zinc-500">
              {stores.length === 1 ? 'Store awaiting setup' : `${stores.length} stores awaiting setup`}
            </span>
            <div className="max-h-[180px] overflow-y-auto rounded-xl border border-slate-200 dark:border-zinc-800 divide-y divide-slate-200 dark:divide-zinc-800">
              {stores.map((store) => (
                <div key={store.id} className="flex items-center gap-3 p-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-zinc-800">
                    <Store className="h-4 w-4 text-slate-500 dark:text-zinc-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-bold text-slate-800 dark:text-zinc-200">
                      {store.shop_name || store.shop_domain || `Shopify store #${store.id}`}
                    </div>
                    {store.shop_domain && (
                      <div className="truncate text-xs text-slate-500 dark:text-zinc-500">{store.shop_domain}</div>
                    )}
                  </div>
                  <span className="shrink-0 rounded-full border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                    Missing
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="m-0 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 rounded-none border-t border-gray-300 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 px-5 sm:px-6 py-4">
          <span className="text-xs text-slate-500 dark:text-zinc-500">Takes less than a minute.</span>
          <Button
            type="button"
            onClick={handleSetUp}
            className="group w-full sm:w-auto px-5 h-9 bg-primary hover:bg-primary-hover text-white font-semibold transition-all shadow-md shadow-primary/20 dark:shadow-none active:scale-[0.98]"
          >
            Configure Parcel Details
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
