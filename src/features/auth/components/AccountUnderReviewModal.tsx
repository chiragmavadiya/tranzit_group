import { useNavigate } from 'react-router-dom';
import { Clock, Zap } from 'lucide-react';
import * as Sentry from '@sentry/react';
import { CustomModel } from '@/components/ui/dialog';
import { useTheme } from '@/app/providers/theme-provider';
import { useAppDispatch } from '@/hooks/store.hooks';
import { useLogout } from '@/features/auth/hooks/useAuth';
import { logout } from '@/features/auth/authSlice';
import brandLogo from '@/assets/Tranzit_Logo.svg';
import brandLogoDark from '@/assets/Tranzit_Logo_dark.svg';

const SUPPORT_EMAIL = 'info@tranzitgroup.com.au';

interface AccountUnderReviewModalProps {
  businessName?: string;
}

/**
 * Decorative only. The real portal is never mounted for an unapproved account, so this
 * stands in behind the modal: static placeholder shapes, no data and no API calls.
 */
const PortalBackdrop = () => (
  <div aria-hidden className="pointer-events-none absolute inset-0 select-none overflow-hidden blur-[3px]">
    <div className="flex h-full">
      <div className="hidden w-56 shrink-0 flex-col gap-2 border-r border-slate-200 bg-white p-4 sm:flex dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-4 h-7 w-28 rounded bg-slate-200 dark:bg-zinc-800" />
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex items-center gap-2.5 rounded-lg px-2 py-2">
            <div className="h-4 w-4 rounded bg-slate-200 dark:bg-zinc-800" />
            <div className="h-3 rounded bg-slate-200 dark:bg-zinc-800" style={{ width: `${55 + ((i * 13) % 40)}%` }} />
          </div>
        ))}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="h-8 w-64 rounded-lg bg-slate-100 dark:bg-zinc-900" />
          <div className="flex items-center gap-3">
            <div className="h-8 w-20 rounded-lg bg-slate-100 dark:bg-zinc-900" />
            <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-zinc-800" />
          </div>
        </div>

        <div className="flex-1 space-y-4 p-5">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2 rounded-xl border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                <div className="h-3 w-16 rounded bg-slate-200 dark:bg-zinc-800" />
                <div className="h-6 w-24 rounded bg-slate-200 dark:bg-zinc-800" />
              </div>
            ))}
          </div>
          <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="h-4 w-40 rounded bg-slate-200 dark:bg-zinc-800" />
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 border-t border-slate-100 pt-3 dark:border-zinc-900">
                <div className="h-3 w-3 rounded bg-slate-200 dark:bg-zinc-800" />
                <div className="h-3 flex-1 rounded bg-slate-100 dark:bg-zinc-900" />
                <div className="h-3 w-20 rounded bg-slate-100 dark:bg-zinc-900" />
                <div className="h-5 w-16 rounded-full bg-slate-100 dark:bg-zinc-900" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function AccountUnderReviewModal({ businessName }: AccountUnderReviewModalProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const logoutMutation = useLogout();

  const subject = businessName ? `Urgent Activation - ${businessName}` : 'Urgent Activation';

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      // The session has to end locally even if the API call fails, otherwise the
      // blocking screen is the only thing this account can ever reach.
      onSettled: () => {
        Sentry.setUser(null);
        dispatch(logout());
        navigate('/login');
      },
    });
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-slate-50 dark:bg-zinc-950">
      <PortalBackdrop />
      <div className="absolute inset-0 bg-slate-900/25 dark:bg-black/50" />
      {/* Not dismissible: ignoring onOpenChange blocks outside clicks and the escape key,
          and the close icon is hidden. No portal route is mounted behind this screen. */}
      <CustomModel
        open
        onOpenChange={() => { }}
        disablePointerDismissal
        showCloseButton={false}
        title="Welcome to Tranzit Group 👋"
        description={`Hi${businessName ? ` ${businessName}` : ''}, and thanks for joining Tranzit Group.`}
        contentClass="min-w-0 sm:min-w-xl sm:max-w-[640px]"
        cancelLoading={logoutMutation.isPending}
        cancelText="Log out"
        onCancel={handleLogout}
        submitText="Request Urgent Activation"
        onSubmit={() => { window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}`; }}
      >
        <div className="space-y-4 text-[13px] leading-relaxed text-slate-600 dark:text-zinc-400">
          <img
            src={theme === 'dark' ? brandLogoDark : brandLogo}
            alt="Tranzit Group"
            className="h-9 w-auto object-contain"
          />

          <p className="mb-2">
            We know managing orders, consignments, carriers and deliveries can take up valuable time.
            That’s exactly why Tranzit Group is here — to make shipping simpler, faster and easier to manage.
          </p>

          <div className="rounded-xl border border-amber-200/70 dark:border-amber-900/40 bg-amber-50/70 dark:bg-amber-950/20 p-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400">
                <Clock className="h-4 w-4" />
              </span>
              <h3 className="my-0 text-sm font-bold text-amber-900 dark:text-amber-300">
                We’ll be in touch within 24 hours
              </h3>
            </div>
            <p className="mb-0 mt-3 text-amber-900/80 dark:text-amber-200/70">
              Our team will be in touch with you in the next 24 hours to understand your logistics setup and help
              you onboard to Tranzit Group.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-900/40 p-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Zap className="h-4 w-4" />
              </span>
              <h3 className="my-0 text-sm font-bold text-slate-900 dark:text-zinc-100">
                Need your account activated urgently?
              </h3>
            </div>
            <p className="mb-0 mt-3">
              No worries — if you require priority activation, simply email us at{' '}
              <a href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}`} className="font-semibold text-primary hover:underline">
                {SUPPORT_EMAIL}
              </a>{' '}
              — or just hit{' '}
              <span className="font-semibold text-slate-700 dark:text-zinc-300">Request Urgent Activation</span> below
              and we’ll take care of the rest.
            </p>
          </div>

          <div className="pt-1">
            <p className="mb-0">
              Thanks again for choosing Tranzit Group. We look forward to helping make your shipping easier.
            </p>
            <p className="mb-0 mt-2 font-semibold text-slate-700 dark:text-zinc-300">The Tranzit Group Team</p>
          </div>
        </div>
      </CustomModel>
    </div>
  );
}
