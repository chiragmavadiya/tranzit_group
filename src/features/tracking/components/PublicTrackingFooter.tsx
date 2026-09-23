import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';
import brandLogo from '@/assets/Tranzit_Logo.svg';
import brandLogoDark from '@/assets/Tranzit_Logo_dark.svg';
import { useTheme } from '@/app/providers/theme-provider';

export const PublicTrackingFooter = () => {
  const { theme } = useTheme();
  const logoSrc = theme === 'dark' ? brandLogoDark : brandLogo;

  return (
  <footer className="mt-auto border-t border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
    <div className="mx-auto w-full max-w-6xl px-4 py-7 sm:px-6 lg:px-8">
      <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3.5 dark:border-zinc-800 dark:bg-zinc-900/40">
        <Info
          className="mt-0.5 size-4 shrink-0 text-slate-400 dark:text-zinc-500"
          aria-hidden="true"
        />
        <p className="my-0 text-[13px] leading-relaxed text-slate-600 dark:text-zinc-400">
          Tracking updates are provided by the courier carrying your parcel and may take a few
          hours to appear. For questions about your order, contact the store you purchased from.
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]">
        <img
          src={logoSrc}
          alt="Tranzit Group"
          className="h-6 w-auto shrink-0 object-contain"
        />
        <span className="font-semibold text-slate-500 dark:text-zinc-500">
          &copy; {new Date().getFullYear()} Tranzit Group
        </span>
        <Link
          to="/privacy-policy"
          className="font-medium text-slate-600 underline-offset-4 transition-colors hover:text-primary hover:underline dark:text-zinc-400"
        >
          Privacy Policy
        </Link>
        <Link
          to="/terms-and-conditions"
          className="font-medium text-slate-600 underline-offset-4 transition-colors hover:text-primary hover:underline dark:text-zinc-400"
        >
          Terms &amp; Conditions
        </Link>
      </div>
    </div>
  </footer>
  );
};
