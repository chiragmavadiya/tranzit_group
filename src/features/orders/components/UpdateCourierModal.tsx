import { CustomModel } from '@/components/ui/dialog'
import type { AddressData, Order } from '../types';
import { CarrierCard } from './order-details/CarrierCard';
import { useEffect, useMemo, useState } from 'react';
import { useOrderDetails, useUpdateOrderCourier } from '../hooks/useOrders';
import { showToast } from '@/components/ui/custom-toast';
import { Loader2 } from 'lucide-react';
import { initialAddressData } from '../constants';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface UpdateCourierModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    orderData: Order;
}

const UpdateCourierModal = (props: UpdateCourierModalProps) => {
    const { open, onOpenChange, orderData } = props;
    const [quoteData, setQuoteData] = useState<any>(null);
    const [courierData, setCourierData] = useState<any>(null);
    const [signatureSelected, setSignatureSelected] = useState<boolean>(false);
    const [insuranceSelected, setInsuranceSelected] = useState<boolean>(false);
    const [addressData, setAddressData] = useState<{ sender: AddressData; receiver: AddressData }>(() => ({
        sender: initialAddressData,
        receiver: initialAddressData,
    }));

    const { data: orderDetailsResponse, isLoading: isOrderDetailsLoading } = useOrderDetails(orderData?.order_number || '');

    const itemData = useMemo(() => {
        return orderDetailsResponse?.data?.order_details?.items?.map((item: any) => ({
            ...item,
            length: Number(item.length) || 0,
            width: Number(item.width) || 0,
            height: Number(item.height) || 0,
            weight: Number(item.weight) || 0,
        })) || []
    }, [orderDetailsResponse?.data?.order_details?.items])

    const updateCourier = useUpdateOrderCourier();

    const handleSubmit = () => {
        if (!courierData) {
            showToast("Please select a courier option first", "error");
            return;
        }

        const subtotal = quoteData?.courier?.base || 0;
        const gst = quoteData?.courier?.gst || 0;
        const freightLevy = quoteData?.courier?.freight_levy || 0;
        const markupCharge = quoteData?.courier?.markup_charge || 0;
        const total = (quoteData?.totalPrice || 0) + (insuranceSelected ? 6.0 : 0);

        const payload = {
            service: {
                courier: courierData.courier, // carrier_id
                product_id: courierData.product_id || "",
                product_type: courierData.product_type || "",
                shipment_summary: courierData.shipment_summary || "",
                cover_limited_liability: insuranceSelected ? 1 : 0,
                signature_required: signatureSelected ? 1 : 0,
            },
            totals: {
                subtotal: Number(subtotal.toFixed(2)),
                gst: Number(gst.toFixed(2)),
                freight_levy: Number(freightLevy.toFixed(2)),
                extra_surcharge: quoteData?.totalSurcharges,
                markup_charge: Number(markupCharge.toFixed(2)),
                total: Number(total.toFixed(2)),
            },
            surcharges: quoteData?.surcharges || [],
        };

        updateCourier.mutate(
            { orderNumber: orderData.order_number, data: payload },
            {
                onSuccess: () => {
                    onOpenChange(false);
                }
            }
        );
    };

    useEffect(() => {
        if (orderDetailsResponse?.status) {
            try {
                const { data } = orderDetailsResponse
                setAddressData({
                    sender: {
                        name: data?.sender_details?.name || '',
                        email: data?.sender_details?.email || '',
                        phone: data?.sender_details?.mobile || '',
                        company: data?.sender_details?.company || '',
                        instructions: data?.sender_details?.address_detail?.instructions || '',
                        address1: data?.sender_details?.address_detail?.address_line || '',
                        address_info: data?.sender_details?.address_detail?.address_info || data?.sender_details?.address || '',
                        suburb: data?.sender_details?.address_detail?.suburb || '',
                        street_name: data?.sender_details?.address_detail?.street_name || '',
                        street_number: data?.sender_details?.address_detail?.street_number || '',
                        unit_number: data?.sender_details?.address_detail?.unit_number || '',
                        state: data?.sender_details?.address_detail?.state || '',
                        postcode: data?.sender_details?.address_detail?.postcode || '',
                        country: 'AU',
                        saveToAddressBook: false,
                    },
                    receiver: {
                        name: data?.receiver_details?.name || '',
                        email: data?.receiver_details?.email || '',
                        phone: data?.receiver_details?.mobile || '',
                        company: data?.receiver_details?.company || '',
                        instructions: data?.receiver_details?.address_detail?.instructions || '',
                        address1: data?.receiver_details?.address_detail?.address_line || '',
                        address_info: data?.receiver_details?.address_detail?.address_info || '',
                        suburb: data?.receiver_details?.address_detail?.suburb || '',
                        street_name: data?.receiver_details?.address_detail?.street_name || '',
                        street_number: data?.receiver_details?.address_detail?.street_number || '',
                        unit_number: data?.receiver_details?.address_detail?.unit_number || '',
                        state: data?.receiver_details?.address_detail?.state || '',
                        postcode: data?.receiver_details?.address_detail?.postcode || '',
                        country: 'AU',
                        saveToAddressBook: false,
                    },
                });
                setCourierData(data?.courier_details);
                setQuoteData(data?.order_details);
                setInsuranceSelected(data?.limited_liability_cover?.covered || false);
                setSignatureSelected(data?.signature_required === 'yes');

            } catch {
                setCourierData(null);
                setQuoteData(null);
            }
        }
    }, [orderDetailsResponse])

    return (
        <CustomModel
            open={open}
            onOpenChange={onOpenChange}
            title={`Update carrier and product`}
            contentClass='min-w-5xl'
            submitText={'Update'}
            onSubmit={handleSubmit}
            isLoading={updateCourier.isPending}
        >
            {isOrderDetailsLoading && <div className='min-h-[200px] flex items-center justify-center'>
                <Loader2 className="animate-spin" />
            </div>}
            {!isOrderDetailsLoading && (
                <div className="grid grid-cols-12 gap-6 p-4 min-h-[200px]">

                    <>
                        <div className="col-span-12 lg:col-span-7">
                            <CarrierCard
                                addresses={addressData}
                                itemData={itemData}
                                initialSelectedCourierId={orderData?.courier_code + (orderData.product_id || '')}
                                onQuoteChange={setQuoteData}
                                setCourierData={setCourierData}
                                signatureSelected={signatureSelected}
                                orderDetail={orderDetailsResponse?.data}
                            />

                        </div>
                        <div className='col-span-12 lg:col-span-5'>
                            <Accordion defaultValue={['summary']} className="flex flex-col gap-3 sticky top-4">

                                <AccordionItem value="summary" className="border border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 shadow-xs px-5 border-b overflow-hidden transition-colors duration-300 [&>h3]:my-0">
                                    <AccordionTrigger className="hover:no-underline py-3 px-0 [&>svg]:text-primary">
                                        <div className="flex flex-wrap items-center gap-2.5 w-full text-left pr-6">
                                            <span className="text-base font-bold text-gray-900 dark:text-zinc-100">
                                                Quote Summary
                                            </span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="flex flex-col gap-2 pb-4 pt-1">

                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500 dark:text-zinc-400 font-medium">Shipping Services</span>
                                            <span className="font-bold text-gray-900 dark:text-zinc-100">${quoteData?.courier?.base?.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500 dark:text-zinc-400 font-medium">Extra surcharges</span>
                                            <span className="font-bold text-gray-900 dark:text-zinc-100">${quoteData?.totalSurcharges?.toFixed(2)}</span>
                                        </div>
                                        {insuranceSelected && (
                                            <div className="flex justify-between items-center text-sm text-primary animate-in fade-in slide-in-from-top-1">
                                                <span className="font-medium">Shipment Protection</span>
                                                <span className="font-bold">+$6.00</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500 dark:text-zinc-400 font-medium">GST</span>
                                            <span className="font-bold text-gray-900 dark:text-zinc-100">${quoteData?.courier?.gst?.toFixed(2)}</span>
                                        </div>

                                        <div className="border-t border-gray-100 dark:border-zinc-800 my-1 pt-2 flex justify-between items-center">
                                            <span className="text-base text-gray-900 dark:text-zinc-100 font-bold">Total Payable</span>
                                            <span className="text-base font-bold text-primary">${((quoteData?.totalPrice || 0) + (insuranceSelected ? 6.0 : 0))?.toFixed(2)}</span>
                                        </div>

                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </>
                </div>
            )}
        </CustomModel>
    )
}

export default UpdateCourierModal;