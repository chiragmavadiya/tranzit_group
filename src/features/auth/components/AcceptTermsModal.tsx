import { useRef, useState } from 'react';
import { AlertCircle, ExternalLink, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { showToast } from '@/components/ui/custom-toast';
import { useAcceptTerms } from '@/features/auth/hooks/useAuth';
import { TERMS_CONDITIONS_URL, PRIVACY_POLICY_URL } from '@/constants';

const FALLBACK_ERROR = 'Unable to accept the Terms and Conditions and Privacy Policy. Please try again.';

interface AcceptTermsModalProps {
  open: boolean;
}

export default function AcceptTermsModal({ open }: AcceptTermsModalProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const [accepted, setAccepted] = useState(false);
  const { mutate: acceptTerms, isPending, error } = useAcceptTerms();

  const errorMessage = error ? ((error as any)?.response?.data?.message || FALLBACK_ERROR) : null;

  const handleAccept = () => {
    acceptTerms(undefined, {
      // The ME cache is updated inside the hook, which closes this modal
      onSuccess: () => showToast('Updated Terms and Conditions & Privacy Policy accepted successfully.', 'success'),
    });
  };

  return (
    // Not dismissible: `open` is driven by the ME flag, so ignoring onOpenChange blocks
    // the close icon, outside clicks and the escape key. `modal` traps focus and locks scroll.
    <Dialog open={open} onOpenChange={() => { }} modal disablePointerDismissal>
      <DialogContent
        ref={popupRef}
        // Default focus lands on the first tabbable element (the Terms link); focus the
        // dialog itself instead, so it is still announced without highlighting the link.
        initialFocus={popupRef}
        showCloseButton={false}
        className="flex flex-col max-h-[85vh] md:max-h-[90vh] overflow-hidden gap-0 min-w-0 sm:min-w-xl sm:max-w-[640px]"
      >
        <DialogHeader className="border-b pb-3 border-gray-200 dark:border-zinc-800 gap-0 mb-3">
          <DialogTitle className="my-0 mb-0 text-2xl font-bold text-slate-900 dark:text-zinc-100">
            Updated Terms and Conditions & Privacy Policy
          </DialogTitle>
          <DialogDescription className="mb-0 mt-1">
            We’ve updated our Terms and Conditions & Privacy Policy. Please review and accept the latest version to continue using your account. (You will receive this via email after accepting it)
          </DialogDescription>
        </DialogHeader>

        {/* Only the Terms text scrolls, so the checkbox stays visible on short screens */}
        <div className="flex flex-1 min-h-0 flex-col mb-3">
          <div className="rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/30 p-4 flex-1 min-h-[120px] max-h-[220px] overflow-y-auto text-[13px] leading-relaxed text-slate-600 dark:text-zinc-400 space-y-3">
            <p className="mb-0">
              These Terms and Conditions (&quot;Terms&quot;) govern access to and use of the Tranzit Group website,
              shipping platform, applications, integrations, APIs and related freight-management services.
              Tranzit Group ABN 12 690 967 198 is referred to in these Terms as &quot;Tranzit Group&quot;,
              &quot;we&quot;, &quot;us&quot; or &quot;our&quot;.
            </p>
            <p className="mb-0">
              By creating an account, accessing the Platform, obtaining a quotation, booking a shipment, purchasing a
              shipping service or otherwise using our Services, you agree to be bound by these Terms. If you are using
              the Platform on behalf of a company or other organisation, you represent that you have authority to bind
              that organisation to these Terms.
            </p>
            <p className="mb-0">
              The updated Terms cover quoting and booking, shipment information and re-measurement, prohibited and
              dangerous goods, freight claims and transit cover, fees, payment and wallet balances, platform and API
              usage, liability, privacy and security. Please open the full document below to read every section before
              you accept.
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-y-2">
            <a
              href={TERMS_CONDITIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-sm text-[13px] font-semibold text-primary outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              Read the full Terms and Conditions
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a
              href={PRIVACY_POLICY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-sm text-[13px] font-semibold text-primary outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              Read the full Privacy Policy
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="mt-4 flex shrink-0 items-start space-x-3">
            <Checkbox
              id="accept-updated-terms"
              checked={accepted}
              disabled={isPending}
              onCheckedChange={(checked) => setAccepted(!!checked)}
              className="mt-0.5"
            />
            <Label
              htmlFor="accept-updated-terms"
              className="text-[13px] font-medium leading-relaxed text-slate-600 dark:text-zinc-400"
            >
              I have read and agree to the updated Terms and Conditions and Privacy Policy.
            </Label>
          </div>

          {errorMessage && (
            <div className="mt-3 flex shrink-0 items-start gap-2 rounded-lg border border-red-200 dark:border-red-950/40 bg-red-50 dark:bg-red-950/20 p-3">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-500" />
              <p className="mb-0 text-[13px] font-medium text-red-700 dark:text-red-400">{errorMessage}</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-3 flex flex-col-reverse sm:flex-row sm:justify-end p-3 sm:p-4 border-t border-gray-300 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 mt-auto -mx-3 sm:-mx-4 -mb-3 sm:-mb-4">
          <Button
            type="button"
            disabled={!accepted || isPending}
            onClick={handleAccept}
            className="w-full sm:w-auto px-4 bg-primary hover:bg-primary-hover text-white font-semibold transition-all shadow-md shadow-primary/20 dark:shadow-none active:scale-[0.98] h-8"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Accept and Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
