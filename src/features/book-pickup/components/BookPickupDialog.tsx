import { useState, useEffect, useRef, useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';
import { CustomModel } from '@/components/ui/dialog';
import { ConformationModal } from '@/components/common/ConformationModal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showToast } from '@/components/ui/custom-toast';
import { api } from '@/services/api';
import { API_ENDPOINTS } from '@/constants/api.constants';
import { FormInput, FormSelect } from '@/features/orders/components/OrderFormUI';
import { getPickupDateOptions } from '../utils/pickupDate.utils';
import { useAppSelector } from '@/hooks/store.hooks';

interface CustomerBookPickupRequest {
    pickup_address: string;
    pickup_parcel: number;
    pickup_date: string;
    rough_ready_time: string;
}

function toAmPmTime(time24: string): string {
    const [hoursStr, minutes] = time24.split(':');
    const h = parseInt(hoursStr, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
}

const useCustomerBookPickup = () =>
    useMutation({
        mutationFn: (data: CustomerBookPickupRequest) =>
            api.post(API_ENDPOINTS.CUSTOMER_BOOK_PICKUP.BASE, data).then((r) => r.data),
        onSuccess: (res: any) => {
            showToast(res.message || 'Pickup booked successfully', 'success');
        },
        onError: (error: any) => {
            showToast(
                error?.response?.data?.message || 'Failed to book pickup. Please try again.',
                'error'
            );
        },
    });

interface BookPickupDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    defaultAddress?: string;
}

interface FormState {
    pickup_address: string;
    pickup_parcel: string;
    pickup_date: string;
    rough_ready_time: string;
}

export function BookPickupDialog({ open, onOpenChange, defaultAddress = '' }: BookPickupDialogProps) {
    const blackoutDays = useAppSelector((state) => state.auth.blackout_days);

    const blackoutDates = useMemo(() => {
        if (!blackoutDays || blackoutDays.length === 0) return [];
        return blackoutDays.map((item) => item.date);
    }, [blackoutDays]);

    const dateOptions = useMemo(() => getPickupDateOptions(blackoutDates), [blackoutDates]);
    const defaultPickupDate: string = dateOptions[0]?.value || '';

    const emptyForm = (): FormState => ({
        pickup_address: defaultAddress,
        pickup_parcel: '',
        pickup_date: defaultPickupDate,
        rough_ready_time: '',
    });

    const [form, setForm] = useState<FormState>(emptyForm);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const timeInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (dateOptions.length > 0 && !form.pickup_date) {
            setForm((prev) => ({ ...prev, pickup_date: dateOptions[0].value }));
        }
    }, [dateOptions, form.pickup_date]);

    useEffect(() => {
        if (defaultAddress) {
            setForm((prev) => ({ ...prev, pickup_address: defaultAddress }));
        }
    }, [defaultAddress]);

    const { mutate: bookPickup, isPending } = useCustomerBookPickup();

    const handleSubmit = () => {
        setSubmitted(true);
        if (!form.pickup_address.trim() || !form.pickup_parcel || !form.pickup_date || !form.rough_ready_time) {
            showToast('Please fill in all required fields', 'error');
            return;
        }
        setIsConfirmOpen(true);
    };

    const handleConfirm = () => {
        bookPickup(
            {
                pickup_address: form.pickup_address.trim(),
                pickup_parcel: parseInt(form.pickup_parcel, 10),
                pickup_date: form.pickup_date,
                rough_ready_time: toAmPmTime(form.rough_ready_time),
            },
            {
                onSuccess: () => {
                    setIsConfirmOpen(false);
                    onOpenChange(false);
                    setForm(emptyForm());
                    setIsSuccessOpen(true);
                },
                onError: (error: any) => {
                    setIsConfirmOpen(false);
                    showToast(
                        error?.response?.data?.message || 'Failed to book pickup. Please try again.',
                        'error'
                    );
                },
            }
        );
    };

    const handleDiscard = () => {
        setForm(emptyForm());
        onOpenChange(false);
    };

    const selectedDateLabel =
        dateOptions.find((o) => o.value === form.pickup_date)?.label ?? form.pickup_date;

    return (
        <>
            <CustomModel
                open={open}
                title="Book a Pickup"
                onOpenChange={onOpenChange}
                onSubmit={handleSubmit}
                onCancel={handleDiscard}
                submitText="Submit"
                cancelText="Discard"
                isLoading={isPending}
                contentClass="sm:max-w-lg"
                disablePointerDismissal={true}

            >
                <div className="flex flex-col gap-4 py-2">
                    <div className="flex flex-col gap-1.5">
                        <FormInput
                            label="Pickup Address"
                            value={form.pickup_address}
                            readOnly={!!form.pickup_address}
                            disabled={!!form.pickup_address}
                            required
                            placeholder="No address on file"
                            error={submitted && !form.pickup_address.trim()}
                            errormsg='Please enter Pickup address'

                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <FormInput
                            label="How Many Parcels for Pickup"
                            type="number"
                            required
                            min={1}
                            value={form.pickup_parcel}
                            onChange={(value) => setForm((prev) => ({ ...prev, pickup_parcel: value }))}
                            placeholder="Enter Parcels Pickup"
                            error={submitted && !form.pickup_parcel}
                            errormsg='Please enter Parcels for Pickup'
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        {/* <Label className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
                            Expected To Be Ready <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={form.pickup_date}
                            onValueChange={(val) => setForm((prev) => ({ ...prev, pickup_date: val ?? prev.pickup_date }))}
                        >
                            <SelectTrigger className="h-9 w-full">
                                <SelectValue placeholder="Select date" />
                            </SelectTrigger>
                            <SelectContent>
                                {dateOptions.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select> */}
                        <FormSelect
                            label="Expected To Be Ready"
                            required
                            value={form.pickup_date}
                            onValueChange={(value) => setForm((prev) => ({ ...prev, pickup_date: value }))}
                            placeholder="Select date"
                            options={dateOptions}
                            searchdisable
                            allowClear={false}
                            error={submitted && !form.pickup_date}
                            errormsg='Please select Expected To Be Ready'
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
                            Rough Time Ready for Pickup{' '}
                            <span className="text-gray-500 dark:text-zinc-500 font-normal text-xs">
                                (Can not be guaranteed)
                            </span>{' '}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            ref={timeInputRef}
                            type="time"
                            value={form.rough_ready_time}
                            onChange={(e) => setForm((prev) => ({ ...prev, rough_ready_time: e.target.value }))}
                            onClick={() => timeInputRef.current?.showPicker()}
                            className="h-9 cursor-pointer"
                            error={submitted && !form.rough_ready_time}
                            errormsg='Please select Rough Time Ready for Pickup'

                        />
                    </div>
                </div>
            </CustomModel>

            <ConformationModal
                open={isConfirmOpen}
                onOpenChange={setIsConfirmOpen}
                title="Confirm Pickup Booking"
                description={
                    <span>
                        Are you sure you want to book a pickup for{' '}
                        <strong>{selectedDateLabel}</strong> at{' '}
                        <strong>{form.rough_ready_time ? toAmPmTime(form.rough_ready_time) : '--'}</strong>?
                    </span>
                }
                onConfirm={handleConfirm}
                confirmText="Book Pickup"
                cancelText="Cancel"
                loading={isPending}
            />

            <ConformationModal
                open={isSuccessOpen}
                onOpenChange={setIsSuccessOpen}
                title="Pickup Booked!"
                description="Your pickup has been successfully booked. Our team will be in touch to confirm the details."
                onConfirm={() => setIsSuccessOpen(false)}
                confirmText="Done"
                cancelText=""
            />
        </>
    );
}
