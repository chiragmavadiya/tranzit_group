import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Clock, AlertCircle, Zap, Check, X, Braces, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTraceDetail } from '../hooks';
import PageLoading from '@/components/common/Loader';
import { SectionCard } from '../components/shared/SectionCard';
import { KeyValueGrid } from '../components/shared/KeyValueGrid';
import { JsonViewer } from '../components/shared/JsonViewer';
import { StatusBadge } from '../components/badges/StatusBadge';
import { DurationBadge } from '../components/badges/DurationBadge';
import { SeverityBadge } from '../components/badges/SeverityBadge';
import { CopyDebugSummaryButton } from '../components/detail/CopyDebugSummaryButton';
import { format, parseISO } from 'date-fns';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const PROVIDER_NAMES: Record<string, string> = {
  mypost_business: 'MyPost Business',
  aramex: 'Aramex',
  auspost: 'AusPost',
  couriersplease: 'CouriersPlease',
  direct_freight: 'Direct Freight',
};

const getProviderBadgeClass = (provider: string) => {
  switch (provider.toLowerCase()) {
    case 'mypost_business':
    case 'auspost':
      return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30';
    case 'aramex':
      return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/30';
    case 'couriersplease':
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30';
    case 'direct_freight':
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800';
  }
};

const formatEventName = (name: string) => {
  if (!name) return '';
  const maps: Record<string, string> = {
    mypost_api_called: 'MyPost API Called',
    aramex_api_called: 'Aramex API Called',
    auspost_api_called: 'AusPost API Called',
    couriersplease_api_called: 'CouriersPlease API Called',
    directfreight_api_called: 'Direct Freight API Called',
  };
  if (maps[name.toLowerCase()]) return maps[name.toLowerCase()];

  return name
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const safeFormatDate = (dateStr?: string) => {
  if (!dateStr) return '';
  try {
    if (dateStr.includes('/')) {
      return dateStr;
    }
    return format(parseISO(dateStr), 'MMM dd, HH:mm:ss');
  } catch {
    return dateStr;
  }
};

export default function TraceDetailPage() {
  const { traceId } = useParams<{ traceId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromTab = searchParams.get('fromTab');
  const { data: response, isLoading } = useTraceDetail(traceId);
  const trace = response?.data;

  const { copy: copyRequest, copied: copiedRequest } = useCopyToClipboard('Request payload copied');
  const { copy: copyResponse, copied: copiedResponse } = useCopyToClipboard('Response payload copied');

  const handleBackClick = () => {
    if (fromTab) {
      navigate(`/admin/debug-centre?tab=${fromTab}`);
    } else {
      navigate('/admin/debug-centre');
    }
  };

  if (isLoading) {
    return <PageLoading />;
  }

  if (!trace) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center p-page-padding h-full min-h-[400px] text-center animate-in fade-in duration-300">
        <div className="p-4 bg-slate-100 dark:bg-zinc-900 rounded-full mb-4">
          <AlertCircle className="w-8 h-8 text-slate-400 dark:text-zinc-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-200 mb-1">Trace Not Found</h3>
        <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-xs mb-6">
          The requested debug trace could not be loaded, or it may have expired.
        </p>
        <Button
          onClick={handleBackClick}
          className="gap-2 h-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Debug Centre
        </Button>
      </div>
    );
  }

  const traceSummary = trace?.trace_summary;
  return (
    <div className="flex-1 p-page-padding min-h-0 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30 overflow-y-auto">
      {/* Back Button & Header */}
      <div className="flex items-start justify-between gap-4 flex-shrink-0">
        <div className="flex flex-col gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-4 gap-1 px-2 -ml-2 group/back-btn hover:bg-slate-200/60 text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-900 text-xs font-semibold rounded-lg w-fit transition-colors"
            onClick={handleBackClick}
          >
            <ChevronLeft className="h-4 w-4 group-hover/back-btn:-translate-x-1 transition-transform duration-300" />
            Back to Debug Centre
          </Button>
          <div className="flex items-center gap-3 mt-2">
            <h1 className="my-0 text-xl text-slate-900 dark:text-white">Trace Detail : {traceId}</h1>
            <StatusBadge status={traceSummary?.status || 'success'} />
            <DurationBadge duration={traceSummary?.duration_ms || 0} />
          </div>
        </div>
        <CopyDebugSummaryButton trace={trace} />
      </div>

      {/* Summary Card */}
      <SectionCard title="Trace Summary" icon={Zap}>
        <KeyValueGrid
          items={[
            { label: 'Trace ID', value: traceSummary?.trace_id },
            { label: 'Customer', value: traceSummary?.user_name },
            { label: 'Source', value: traceSummary?.source, className: 'capitalize' },
            ...(traceSummary?.user_email ? [{ label: 'Email', value: traceSummary?.user_email }] : []),
            { label: 'Action', value: traceSummary?.main_action ? String(traceSummary?.main_action).replace(/[_-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : '' },
            { label: 'Endpoint', value: traceSummary?.endpoint },
            { label: 'Method', value: traceSummary?.method },
            { label: 'Status', value: traceSummary?.status },
            { label: 'Status Code', value: traceSummary?.status_code },
            { label: 'Duration', value: traceSummary?.duration_ms ? `${traceSummary?.duration_ms}ms` : '-' },
            // { label: 'Environment', value: traceSummary?.environment },
            { label: 'Browser', value: traceSummary?.user_agent },
            // { label: 'OS', value: traceSummary?.operatingSystem },
            { label: 'IP Address', value: traceSummary?.ip_address },
            // { label: 'Device', value: traceSummary?.device },
            // { label: 'Session ID', value: traceSummary?.sessionId },
            { label: 'Created', value: traceSummary?.created_at },
          ]}
        />
      </SectionCard>

      {/* Timeline */}
      <Accordion multiple defaultValue={['timeline']} className="w-full">
        <AccordionItem value="timeline" className="rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-950 overflow-hidden">
          <AccordionTrigger className="hover:no-underline hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors w-full py-3.5 px-5 [&>svg]:text-primary cursor-pointer border-b border-slate-200 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold text-slate-900 dark:text-white">Timeline</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-5 px-5">
            <div className="relative pl-1 pr-2">
              {trace?.timeline?.map((event, idx) => {
                const title = event.event_name || event.title || '';
                const time = event.created_at || event.time || '';
                const duration = event.duration_ms || event.duration || 0;
                const status = event.status || 'success';
                const isFailed = status === 'failed' || status === 'error' || !!event.error_message;

                return (
                  <div
                    key={event.id}
                    className="relative flex gap-4 items-center py-4 first:pt-0 last:pb-0 border-b border-slate-100 dark:border-zinc-800/60 last:border-0"
                  >
                    {/* Connecting Line */}
                    {idx < trace.timeline.length - 1 && (
                      <span
                        className="absolute top-8 left-[15px] bottom-0 w-0.5 bg-slate-200 dark:bg-zinc-800"
                        aria-hidden="true"
                      />
                    )}
                    {/* Timeline node circle */}
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full border bg-white dark:bg-zinc-950 flex-shrink-0 z-10 transition-colors ${isFailed
                        ? 'border-rose-200 text-rose-500 bg-rose-50/50 dark:border-rose-900/30 dark:bg-rose-950/20'
                        : status === 'success'
                          ? 'border-emerald-250 text-emerald-600 bg-emerald-50/50 dark:border-emerald-900/30 dark:bg-emerald-950/20'
                          : 'border-blue-200 text-blue-600 bg-blue-50/50 dark:border-blue-900/30 dark:bg-blue-950/20'
                        }`}
                    >
                      {isFailed ? (
                        <X className="h-4 w-4 stroke-[2.5]" />
                      ) : status === 'success' ? (
                        <Check className="h-4 w-4 stroke-[2.5]" />
                      ) : (
                        <Zap className="h-3.5 w-3.5 fill-current" />
                      )}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        {/* Left Side: Title + Badges */}
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm text-slate-800 dark:text-zinc-200">
                              {formatEventName(title)}
                            </span>

                            {event.provider && (
                              <span className={`text-[12px] font-bold px-2 py-0.5 rounded border uppercase ${getProviderBadgeClass(event.provider)}`}>
                                {PROVIDER_NAMES[event.provider] || event.provider}
                              </span>
                            )}

                            {event.status_code && (
                              <span className={`text-[12px] font-mono font-bold px-1.5 py-0.5 rounded border ${event.status_code >= 200 && event.status_code < 300
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'
                                : 'bg-rose-50 text-rose-700 border-rose-250 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30'
                                }`}>
                                HTTP {event.status_code}
                              </span>
                            )}
                          </div>

                          {/* Description */}
                          {event.description && (
                            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">
                              {event.description}
                            </p>
                          )}
                        </div>

                        {/* Right Side: Time & Duration */}
                        <div className="flex items-center gap-4 flex-shrink-0 md:text-right">
                          <div className="flex flex-row md:flex-col items-center md:items-end gap-2 md:gap-1">
                            <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 font-mono">
                              {time}
                            </span>
                            <span className={`text-xs font-semibold ${duration > 1500
                              ? 'text-rose-600 dark:text-rose-400'
                              : duration > 750
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-slate-500 dark:text-zinc-400'
                              }`}>
                              {duration}ms
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Error Alert Box */}
                      {isFailed && (event.error_message || event.exception_class) && (
                        <div className="mt-3 p-3 bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100/50 dark:border-rose-900/20 rounded-lg text-xs space-y-1">
                          <div className="font-semibold text-rose-800 dark:text-rose-400 flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                            {event.exception_class || 'Error'}
                          </div>
                          <p className="font-mono text-rose-700 dark:text-rose-300 break-all leading-relaxed whitespace-pre-wrap">
                            {event.error_message}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {
                trace.timeline.length === 0 && (
                  <div className="text-center text-slate-500 dark:text-zinc-400 py-4">
                    No timeline events found.
                  </div>
                )
              }
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Request Payload */}
      <Accordion multiple defaultValue={['request-payload']} className="w-full">
        <AccordionItem value="request-payload" className="rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-950 overflow-hidden">
          <AccordionTrigger className="hover:no-underline hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors w-full py-3.5 px-5 [&>svg]:text-primary cursor-pointer border-b border-slate-200 dark:border-zinc-800">
            <div className="flex items-center justify-between w-full pr-4">
              <div className="flex items-center gap-3">
                <Braces className="w-5 h-5 text-primary" />
                <span className="text-sm font-bold text-slate-900 dark:text-white">Request Payload</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  copyRequest(JSON.stringify(trace?.request_payload || {}, null, 2));
                }}
                className="h-7 px-2 gap-1 hover:bg-slate-200 dark:hover:bg-zinc-800/80 rounded-md text-xs text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
              >
                {copiedRequest ? (
                  <Check className="w-3.5 h-3.5 text-green-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>Copy</span>
              </Button>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-5 px-5">
            <JsonViewer data={trace?.request_payload || {}} showCopyButton={false} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Response Payload */}
      <Accordion multiple defaultValue={['response-payload']} className="w-full">
        <AccordionItem value="response-payload" className="rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-950 overflow-hidden">
          <AccordionTrigger className="hover:no-underline hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors w-full py-3.5 px-5 [&>svg]:text-primary cursor-pointer border-b border-slate-200 dark:border-zinc-800">
            <div className="flex items-center justify-between w-full pr-4">
              <div className="flex items-center gap-3">
                <Braces className="w-5 h-5 text-primary" />
                <span className="text-sm font-bold text-slate-900 dark:text-white">Response Payload</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  copyResponse(JSON.stringify(trace?.response_payload || {}, null, 2));
                }}
                className="h-7 px-2 gap-1 hover:bg-slate-200 dark:hover:bg-zinc-800/80 rounded-md text-xs text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
              >
                {copiedResponse ? (
                  <Check className="w-3.5 h-3.5 text-green-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>Copy</span>
              </Button>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-5 px-5">
            <JsonViewer data={trace?.response_payload || {}} showCopyButton={false} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* External APIs */}
      {(() => {
        const externalApisList = trace.external_api_payloads || trace.externalApis || [];
        if (externalApisList.length === 0) return null;
        const defaultExpanded = externalApisList.map((_, idx) => `api-${idx}`);
        return (
          <Accordion multiple defaultValue={defaultExpanded} className="space-y-4">
            {externalApisList.map((api, idx) => {
              const provider = api.provider || '';
              const title = PROVIDER_NAMES[provider] || provider || api.event_name || 'External API';
              const status = api.status || 'success';
              const statusCode = api.status_code || api.statusCode;
              const duration = api.duration_ms || api.duration || 0;
              const requestData = api.request_payload || api.request || {};
              const responseData = api.response_payload || api.response || {};
              const time = api.created_at || api.createdAt || '';

              return (
                <AccordionItem key={api.id || idx} value={`api-${idx}`} className="rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-950 overflow-hidden">
                  <AccordionTrigger className="hover:no-underline hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors w-full py-3.5 px-5 [&>svg]:text-primary cursor-pointer border-b border-slate-200 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-primary" />
                      <span className="text-sm font-bold text-slate-900 dark:text-white">External API: {title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-5 px-5">
                    <div className="space-y-4">
                      <KeyValueGrid
                        items={[
                          { label: 'Event Name', value: api.event_name || '' },
                          { label: 'Provider', value: PROVIDER_NAMES[provider] || provider },
                          { label: 'Status', value: <StatusBadge status={status} /> },
                          { label: 'Status Code', value: statusCode ? String(statusCode) : 'N/A' },
                          { label: 'Duration', value: <DurationBadge duration={duration} /> },
                          { label: 'Timestamp', value: time },
                        ]}
                      />
                      <div className="border-t border-slate-200 dark:border-zinc-800 pt-4 space-y-4">
                        <div>
                          <h4 className="text-xs font-semibold text-slate-700 dark:text-zinc-400 mb-2 uppercase">Request</h4>
                          <JsonViewer data={requestData} />
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-slate-700 dark:text-zinc-400 mb-2 uppercase">Response</h4>
                          <JsonViewer data={responseData} />
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        );
      })()}

      {/* Job Failure */}
      {(() => {
        const jobFailuresList = trace.job_failure_details || (trace.jobFailure ? [trace.jobFailure] : []);
        if (jobFailuresList.length === 0) return null;
        const defaultExpanded = jobFailuresList.map((_, idx) => `job-${idx}`);
        return (
          <Accordion multiple defaultValue={defaultExpanded} className="space-y-4">
            {jobFailuresList.map((job, idx) => {
              const jobName = job.job_name || job.jobName || '';
              const queue = job.queue || '';
              const attempts = job.attempts || 0;
              const failedAt = job.failed_at || job.failedAt || job.created_at || '';
              const exception = job.exception_class || job.exception || '';
              const errorMessage = job.error_message || job.errorMessage || '';
              const stackTrace = job.stack_trace || job.stackTrace || '';

              return (
                <AccordionItem key={idx} value={`job-${idx}`} className="rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-950 overflow-hidden">
                  <AccordionTrigger className="hover:no-underline hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors w-full py-3.5 px-5 [&>svg]:text-primary cursor-pointer border-b border-slate-200 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-primary" />
                      <span className="text-sm font-bold text-slate-900 dark:text-white">Job Failure: {jobName}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-5 px-5">
                    <div className="space-y-4">
                      <KeyValueGrid
                        items={[
                          { label: 'Job Name', value: jobName },
                          { label: 'Queue', value: queue },
                          { label: 'Attempts', value: attempts },
                          { label: 'Failed At', value: safeFormatDate(failedAt) },
                          { label: 'Exception', value: exception },
                          { label: 'Error Message', value: errorMessage },
                        ]}
                      />
                      {stackTrace && (
                        <div className="border-t border-slate-200 dark:border-zinc-800 pt-4">
                          <h4 className="text-xs font-semibold text-slate-700 dark:text-zinc-400 mb-2 uppercase">Stack Trace</h4>
                          <pre className="text-xs bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-zinc-800 overflow-auto max-h-48 text-slate-700 dark:text-slate-300">
                            {stackTrace}
                          </pre>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        );
      })()}

      {/* Alerts */}
      {(() => {
        const alertsList = trace.system_alerts || trace.alerts || [];
        if (alertsList.length === 0) return null;
        return (
          <Accordion multiple defaultValue={['associated-alerts']} className="w-full">
            <AccordionItem value="associated-alerts" className="rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-950 overflow-hidden">
              <AccordionTrigger className="hover:no-underline hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors w-full py-3.5 px-5 [&>svg]:text-primary cursor-pointer border-b border-slate-200 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-primary" />
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Associated Alerts</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-5 px-5">
                <div className="space-y-2">
                  {alertsList.map((alert, idx) => {
                    const alertMsg = alert.title || alert.alert || alert.message || '';
                    const alertDesc = alert.description || '';
                    const severity = alert.severity || 'warning';
                    const time = alert.created_at || alert.createdAt || '';
                    return (
                      <div key={alert.id || idx} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-zinc-800">
                        <SeverityBadge severity={severity} />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{alertMsg}</p>
                          {alertDesc && (
                            <p className="text-xs text-slate-600 dark:text-zinc-400 mt-0.5">{alertDesc}</p>
                          )}
                          {time && (
                            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                              {safeFormatDate(time)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );
      })()}
    </div>
  );
}
