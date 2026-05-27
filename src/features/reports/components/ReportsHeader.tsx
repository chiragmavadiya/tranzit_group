import { useState, useEffect } from 'react';
// import { Calendar as CalendarIcon } from 'lucide-react';
// import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
// import { Calendar } from '@/components/ui/calendar';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { cn } from '@/lib/utils';
import DatePicker from '@/components/common/DatePicker';
import type { ReportType } from '../types';
import { CustomModel } from '@/components/ui/dialog';
import { FormSelect, FormInput } from '@/features/orders/components/OrderFormUI';
// import RangeDatePicker from '@/components/common/RangeDatePicker';
// import type { DateRange } from 'react-day-picker';
// import { addDays } from 'date-fns';

interface ReportsHeaderProps {
  // onApply: (startDate: Date | undefined, endDate: Date | undefined) => void;
  startDate: Date | undefined;
  endDate: Date | undefined;
  // setStartDate: (date: Date | undefined) => void;
  // setEndDate: (date: Date | undefined) => void;
  activeTab: ReportType;
}

export function ReportsHeader({ startDate, endDate, activeTab }: ReportsHeaderProps) {
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [reportType, setReportType] = useState<ReportType>(activeTab);
  const [dialogStartDate, setDialogStartDate] = useState<Date | undefined>(startDate);
  const [dialogEndDate, setDialogEndDate] = useState<Date | undefined>(endDate);

  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [scheduleReportType, setScheduleReportType] = useState<ReportType>(activeTab);
  const [recipients, setRecipients] = useState('');
  const [frequency, setFrequency] = useState('daily');

  useEffect(() => {
    if (isGenerateOpen) {
      setReportType(activeTab);
      setDialogStartDate(startDate);
      setDialogEndDate(endDate);
    }
  }, [isGenerateOpen, activeTab, startDate, endDate]);

  useEffect(() => {
    if (isScheduleOpen) {
      setScheduleReportType(activeTab);
      setRecipients('');
      setFrequency('daily');
    }
  }, [isScheduleOpen, activeTab]);

  const handleGenerate = () => {
    setIsGenerateOpen(false);
  };

  const handleSchedule = () => {
    console.log('Scheduled:', { scheduleReportType, recipients, frequency });
    setIsScheduleOpen(false);
  };

  return (
    <div className="flex justify-between gap-6 p-4 pb-0 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950 rounded-t-lg">
      <div className="flex flex-col items-start">
        <h1 className="my-0 text-xl font-bold text-gray-900 dark:text-white capitalize">{activeTab} Reports</h1>
        {startDate && endDate && (
          <div className="my-0 text-[13px] text-gray-500 dark:text-zinc-400">
            Reports generated from <span className="font-semibold text-gray-900 dark:text-zinc-200">{startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span> to <span className="font-semibold text-gray-900 dark:text-zinc-200">{endDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-end gap-4">
        {/* <div className="flex flex-col">
          <DatePicker
            label="Start Date"
            date={startDate}
            setDate={setStartDate}
            className="w-[180px]"
          />
        </div>

        <div className="flex flex-col">
          <DatePicker
            label="End Date"
            date={endDate}
            setDate={setEndDate}
            className="w-[180px]"
          />
        </div>

        <Button
          onClick={handleApply}
          variant="default"
          size="sm"
          className="h-8 p-3"
        >
          Apply
        </Button> */}

        <Button
          onClick={() => setIsGenerateOpen(true)}
          // variant="outline"
          size="sm"
          className="h-8 p-3"
        >
          Generate Report
        </Button>
        <Button
          onClick={() => setIsScheduleOpen(true)}
          // variant="outline"
          size="sm"
          className="h-8 p-3"
        >
          Schedule Report
        </Button>

        <CustomModel
          open={isGenerateOpen}
          onOpenChange={setIsGenerateOpen}
          title="Generate Report"
          submitText="Generate"
          cancelText="Cancel"
          onSubmit={handleGenerate}
          contentClass="sm:max-w-md"
        >
          <div className="flex flex-col gap-4 py-3">
            <FormSelect
              label="Report Type"
              value={reportType}
              onValueChange={(val) => setReportType(val as ReportType)}
              options={[
                { label: 'Shipment Report', value: 'shipment' },
                { label: 'Transaction Report', value: 'transaction' },
                { label: 'Invoice Report', value: 'invoice' },
                { label: 'Parcel Report', value: 'parcel' },
              ]}
              allowClear={false}
              isFullWidth
            />
            <div className="grid grid-cols-2 gap-4">
              <DatePicker
                label="Start Date"
                date={dialogStartDate}
                setDate={setDialogStartDate}
              />
              <DatePicker
                label="End Date"
                date={dialogEndDate}
                setDate={setDialogEndDate}
              />
            </div>
          </div>
        </CustomModel>

        <CustomModel
          open={isScheduleOpen}
          onOpenChange={setIsScheduleOpen}
          title="Schedule Report"
          submitText="Schedule"
          cancelText="Cancel"
          onSubmit={handleSchedule}
          contentClass="sm:max-w-md"
        >
          <div className="flex flex-col gap-4 py-3">
            <FormSelect
              label="Report Type"
              value={scheduleReportType}
              onValueChange={(val) => setScheduleReportType(val as ReportType)}
              options={[
                { label: 'Shipment Report', value: 'shipment' },
                { label: 'Transaction Report', value: 'transaction' },
                { label: 'Invoice Report', value: 'invoice' },
                { label: 'Parcel Report', value: 'parcel' },
              ]}
              allowClear={false}
              isFullWidth
            />
            <FormInput
              label="Recipients"
              placeholder="Enter email addresses (comma separated)"
              value={recipients}
              onChange={(val) => setRecipients(val)}
              required
              isFullWidth
            />
            <FormSelect
              label="Frequency"
              value={frequency}
              onValueChange={(val) => setFrequency(val || 'daily')}
              options={[
                { label: 'Daily', value: 'daily' },
                { label: 'Weekly', value: 'weekly' },
                { label: 'Monthly', value: 'monthly' },
              ]}
              allowClear={false}
              isFullWidth
            />
          </div>
        </CustomModel>
      </div>
    </div>
  );
}
