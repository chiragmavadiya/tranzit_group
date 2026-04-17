import { EnquiryForm } from '../components/EnquiryForm';
import {
  MessageSquare,
  HelpCircle,
  Clock,
  ShieldCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function EnquiryPage() {
  return (
    <div className="flex flex-col flex-1 gap-6 p-page-padding min-h-0 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-6xl mx-auto w-full overflow-auto">
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-zinc-500 font-medium">
          <NavLink to="/dashboard" className="hover:text-blue-500 transition-colors">Support</NavLink>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 dark:text-zinc-100">Submit an Enquiry</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">Help & Support</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content (Form) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm p-8 overflow-hidden relative">
            {/* Subtle Gradient Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 dark:bg-blue-900/5 blur-3xl -z-10 rounded-full translate-x-1/2 -translate-y-1/2" />

            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-zinc-100 italic">Submit an Enquiry</h2>
                <p className="text-xs text-gray-500 dark:text-zinc-400">We're here to help you with any issues or questions.</p>
              </div>
            </div>

            <EnquiryForm />
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm p-6">
            <h3 className="text-sm font-bold text-gray-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-500" />
              Quick Support Info
            </h3>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-900 dark:text-zinc-100 mb-1 leading-tight">Response Time</h4>
                  <p className="text-[11px] text-gray-500 dark:text-zinc-400">Our average response time is under 12 hours during business days.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-900 dark:text-zinc-100 mb-1 leading-tight">Priority Support</h4>
                  <p className="text-[11px] text-gray-500 dark:text-zinc-400">Enterprise customers receive priority response within 2 hours.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-zinc-800">
              <NavLink
                to="/help-center"
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-zinc-900 group hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors italic">Browse Help Center</span>
                  <span className="text-[10px] text-gray-500 dark:text-zinc-400">Find instant answers to FAQs</span>
                </div>
                <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </NavLink>
            </div>
          </div>

          <div className="px-2">
            <p className="text-[10px] text-gray-400 dark:text-zinc-500 leading-relaxed">
              By submitting this enquiry, you agree to our <span className="underline cursor-pointer">Support Terms</span> and understand that we may collect details to help resolve your issue.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
