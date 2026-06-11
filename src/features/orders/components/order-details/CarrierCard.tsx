import React, { memo, useEffect, useEffectEvent, useMemo, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Truck, AlertCircle, RefreshCw, Copy, Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

import { useGetQuoteServices } from '@/features/quote/hooks/useQuote'
import { showToast } from '@/components/ui/custom-toast'
import type { AddressData, ItemData } from '../../types'
import { useAppSelector } from '@/hooks/store.hooks'
import type { QuoteLocation } from '@/features/quote/types'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'

interface CarrierCardProps {
  itemData: ItemData[];
  addresses: { sender: AddressData | QuoteLocation | null, receiver: AddressData | QuoteLocation | null };
  onQuoteChange?: (data: any) => void;
  setCourierData?: React.Dispatch<React.SetStateAction<any>>;
  orderDetail?: any;
  module?: string;
  orderType?: string
  initialSelectedCourierId?: string
  default_courier?: any;
}

export const CarrierCard: React.FC<CarrierCardProps> = memo((props) => {
  const { itemData, addresses, onQuoteChange, setCourierData, orderDetail, module, orderType = 'create', initialSelectedCourierId = null } = props
  const { role } = useAppSelector((state) => state.auth);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(initialSelectedCourierId || '')
  const [couriers, setCouriers] = useState<any[]>([]);
  const [surchargesMap, setSurchargesMap] = useState<Record<string, any[]>>({});
  const [selectedSurchargesMap, setSelectedSurchargesMap] = useState<Record<string, string[]>>({});
  const [bestDeal, setBestDeal] = useState<string>('');
  const [copiedTracking, setCopiedTracking] = useState(false);

  // const [authorityToLeave, setAuthorityToLeave] = useState<boolean>(false);
  // const [signatureRequired, setSignatureRequired] = useState<boolean>(false);
  const handleCopyTracking = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTracking(true);
    showToast("Tracking number copied to clipboard", "success");
    setTimeout(() => {
      setCopiedTracking(false);
    }, 2000);
  };

  const { mutate: getServices, isPending: loading } = useGetQuoteServices(role);

  const getAddress = useMemo(() => (
    location: { address1?: string; address?: string; label?: string, suburb?: string, state?: string, postcode?: string, country?: string }
  ) => {
    if (module === 'quote') {
      return location?.label || '';
    }
    return location?.label || `${location?.suburb} ${location?.state} ${location?.postcode}, AU` || "";
  }, [module]);

  const handleServiceSuccess = useEffectEvent((data: any) => {

    setCouriers(data.services || []);
    setSurchargesMap(data.surcharges || {});
    if (data.surcharges) {
      const initialSelected: Record<string, string[]> = {};
      Object.keys(data.surcharges).forEach(code => {
        initialSelected[code] = [];
      });
      setSelectedSurchargesMap(initialSelected);
    }
    if (data.services && data.services.length > 0) {
      const getServiceTotalPrice = (service: any) => {
        // const surcharges = data.surcharges?.[service.courierCode] || [];
        // const totalSurcharges = surcharges.reduce((acc: number, curr: any) => acc + curr.amount, 0);
        return service.price;
      };
      const allCourierIds = [...data.services.map((service: any) => service.courierCode + (service.product_id || ''))];
      const minItem = data.services.reduce((min: any, curr: any) =>
        getServiceTotalPrice(curr) < getServiceTotalPrice(min) ? curr : min
      );
      setBestDeal(minItem.courierCode + (minItem.product_id || '') || '');
      // if (initialSelectedCourierId !== undefined && initialSelectedCourierId !== null && initialSelectedCourierId !== '' && !selectedServiceId) {
      //   console.log("Prev state.... 1", initialSelectedCourierId, !selectedServiceId);
      //   setSelectedServiceId(initialSelectedCourierId);
      //   return;
      // }
      const selectedFromQuote = sessionStorage.getItem('quote_courier');
      if (selectedFromQuote) {
        console.log("Prev state.... 2");
        const courier = JSON.parse(selectedFromQuote);
        setSelectedServiceId(courier.courier.courierCode + (courier.courier.product_id || '') || '');
      } else if (!selectedServiceId || !allCourierIds.includes(selectedServiceId)) {
        setSelectedServiceId((prev) => {
          console.log("Prev state....", prev);
          if (prev) return prev;
          // if (default_courier?.slug) {
          //   return default_courier.slug + (default_courier?.product_id || '') || '';
          // }
          return minItem.courierCode + (minItem.product_id || '') || '';
        });
      }
      // if (!selectedServiceId)
      //   setSelectedServiceId(minItem.product_id || minItem.courierCode || '');
    }
  })

  const fetchServices = () => {
    if (orderType !== 'create' && orderType !== 'consign' && orderType !== 'return') return;
    // Check if we have valid items with dimensions > 0
    const isValidItems = itemData && itemData.length > 0 && itemData.every(item =>
      Number(item.height) > 0 && Number(item.width) > 0 && Number(item.length) > 0 && Number(item.weight) > 0 && Number(item.quantity) > 0
    );
    if (!isValidItems) {
      showToast("Please add valid items with dimensions", "error");
      return;
    };

    // Check if we have both addresses
    const sender = addresses?.sender;
    const receiver = addresses?.receiver;

    const sender_addr1 = getAddress(sender!);
    const receiver_addr1 = getAddress(receiver!);
    console.log(sender, 'sender....')
    if (sender_addr1 === '' || receiver_addr1 === '' || sender?.suburb === '' || receiver?.suburb === '') {
      showToast("Please add valid addresses", "error");
      return;
    };

    const receiver_details = module === 'quote' ? receiver_addr1 : ` ${receiver?.suburb} ${receiver?.state} ${receiver?.postcode}, AU`.trim();

    const payload = {
      items: itemData,
      sender_details: sender_addr1,
      receiver_details: receiver_details,
      receiver_address: receiver?.address_info || receiver_addr1,
      is_order: module === 'quote' ? "no" as const : "yes" as const,
    }

    getServices(payload, {
      onSuccess: (data) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        handleServiceSuccess(data);
      },
      onError: (err: any) => {
        showToast(err?.response?.data?.message || 'Failed to fetch rates', "error");
      }
    });
  };

  useEffect(() => {
    console.log(orderType, module, 'orderType....')
    if (orderType !== 'create' && orderType !== 'consign' && orderType !== 'return') return;
    // Check if we have valid items with dimensions > 0
    const isValidItems = itemData && itemData.length > 0 && itemData.every(item =>
      Number(item.height) > 0 && Number(item.width) > 0 && Number(item.length) > 0 && Number(item.weight) > 0 && Number(item.quantity) > 0
    );
    if (!isValidItems) return;

    // Check if we have both addresses
    const sender = addresses?.sender;
    const receiver = addresses?.receiver;

    const sender_addr1 = getAddress(sender!);
    const receiver_addr1 = getAddress(receiver!);
    console.log(sender_addr1, receiver_addr1, 'sender_addr1, receiver_addr1....')
    if (sender_addr1 === '' || receiver_addr1 === '' || sender?.suburb === '' || receiver?.suburb === '') return;

    const timer = setTimeout(() => {
      const receiver_details = module === 'quote' ? receiver_addr1 : ` ${receiver?.suburb} ${receiver?.state} ${receiver?.postcode}, AU`.trim();

      const payload = {
        items: itemData,
        sender_details: sender_addr1,
        receiver_details: receiver_details,
        receiver_address: receiver?.address_info || receiver_addr1,
        is_order: module === 'quote' ? "no" as const : "yes" as const,
      }

      getServices(payload, {
        onSuccess: (data) => {
          handleServiceSuccess(data);
        },
        onError: (err: any) => {
          showToast(err?.response?.data?.message || 'Failed to fetch rates', "error");
        }
      });
    }, 500); // 500ms debounce
    // Cleanup previous timer
    return () => clearTimeout(timer);
  }, [itemData, addresses, getServices, orderType, module, getAddress])

  useEffect(() => {
    if (couriers.length > 0 && selectedServiceId) {
      const selectedCourier = couriers.find((c) => (c.courierCode + (c.product_id || '')) === selectedServiceId);
      if (selectedCourier) {
        const courierSurcharges = surchargesMap[selectedCourier.courierCode] || [];
        const selectedNames = selectedSurchargesMap[selectedCourier.courierCode] ?? [];
        const activeSurcharges = courierSurcharges.filter(charge => selectedNames.includes(charge.name));
        const totalSurcharges = activeSurcharges.reduce((acc: any, curr: any) => acc + curr.amount, 0);
        const totalPrice = selectedCourier.price + totalSurcharges;
        onQuoteChange?.({
          courier: selectedCourier,
          surcharges: activeSurcharges,
          totalSurcharges,
          totalPrice,
          // authorityToLeave,
          // signatureRequired
        });
        setCourierData?.({
          courierCode: selectedCourier.courierCode,
          courier: selectedCourier.carrier_id,
          product_id: selectedCourier.product_id,
          product_type: selectedCourier.product_type,
          shipment_summary: selectedCourier.shipment_summary,
          is_own: selectedCourier.is_own_courier
        })
      }
    }
  }, [selectedServiceId, couriers, surchargesMap, selectedSurchargesMap, onQuoteChange, setCourierData])

  // console.log(initialSelectedCourierId, 'initialSelectedCourierId')
  // console.log(selectedServiceId, 'selectedServiceId')
  // console.log(bestDeal, 'bestDeal')

  return (
    <Card className="border gap-0 border-gray-200 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b border-gray-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 transition-colors">
        <div className="flex justify-between w-full items-center gap-2">
          <div className='flex items-center gap-2'>
            <Truck className="h-5 w-5 text-primary" />
            <CardTitle className="text-base font-bold uppercase tracking-wide text-slate-800 dark:text-zinc-400">
              SHIPMENT OPTIONS
            </CardTitle>
          </div>
          {/* {loading && <RefreshCw className="h-4 w-4 animate-spin" />} */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchServices()}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 bg-white dark:bg-zinc-950">
        {orderType !== 'create' && orderType !== 'consign' && orderDetail ? (
          <div className="flex flex-col gap-3">
            <div className="relative flex flex-col p-4 rounded-xl border border-primary bg-primary/5 dark:bg-primary/10 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 flex items-center justify-center p-1 shadow-sm">
                    {orderDetail.courier_details?.image_url ? (<img
                      src={orderDetail.courier_details?.image_url}
                      alt={orderDetail.courier_details?.courier}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/100x40?text=Logo'
                      }}
                    />) : (<Truck className="w-6 h-6 text-primary" />)}


                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-tight">
                      {orderDetail.courier_details?.courier || 'Standard Delivery'}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase">Tracking:</span>
                      <span className="text-xs font-bold text-primary">{orderDetail.courier_details?.tracking_number || 'N/A'}</span>
                      {orderDetail.courier_details?.tracking_number && (
                        <button
                          onClick={() => handleCopyTracking(orderDetail.courier_details.tracking_number)}
                          className="flex items-center justify-center p-0.5 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 hover:text-primary transition-all duration-150 focus:outline-none"
                          title="Copy tracking number"
                        >
                          {copiedTracking ? (
                            <Check className="h-3.5 w-3.5 text-emerald-500 animate-in fade-in duration-200" />
                          ) : (
                            <Copy className="h-3.5 w-3.5 transition-transform hover:scale-110 active:scale-95" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-gray-900 dark:text-zinc-100 tracking-tighter">
                    ${orderDetail.order_details?.total?.toFixed(2) || '0.00'}
                  </div>
                  <div className="text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wide mt-0.5">
                    Total Inc. GST
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : loading && couriers.length === 0 ? (
          <div className="py-8 h-34 flex items-center justify-center text-sm text-gray-500 font-medium gap-2">
            <RefreshCw className="h-4 w-4 animate-spin text-primary" />
            Fetching available carriers...
          </div>
        ) : couriers.length === 0 ? (
          <div className="py-8 h-36 flex flex-col items-center justify-center text-base text-gray-500 font-medium gap-2">
            <AlertCircle className="h-5 w-5 text-gray-400" />
            No shipment options available yet.<br />
            <span className="text-sm">Please fill out item dimensions and complete both addresses.</span>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-3">
            <div className={`${module !== 'quote' ? 'col-span-12' : 'col-span-12'} flex flex-col gap-3`}>
              {couriers.map((courier) => {
                const serviceId = courier.courierCode + (courier.product_id || '') || '';

                // Map additional charges by courierCode
                const courierSurcharges = surchargesMap[courier.courierCode] || [];
                const selectedNames = selectedSurchargesMap[courier.courierCode] ?? [];
                const isSelected = selectedServiceId === serviceId
                console.log(selectedServiceId, 'selectedServiceId', initialSelectedCourierId, 'initialSelectedCourierId', serviceId, 'serviceId')
                if (courier.success === false) {
                  return (
                    <div
                      className="relative flex flex-col p-4 rounded-xl border border-red-300 dark:border-red-900/30 bg-red-100/50 dark:bg-red-950/10 shadow-xs"
                    >
                      <span className="font-bold text-red-900 dark:text-red-200 text-sm">
                        {courier.carrier}
                      </span>
                      <div key={serviceId} className="text-red-500 dark:text-red-500 text-[13px] mt-1 font-medium">
                        {courier.message}
                      </div>
                    </div>
                  )
                }

                return (
                  <div
                    key={serviceId}
                    onClick={() => setSelectedServiceId(serviceId)}
                    className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${isSelected
                      ? 'border-primary bg-primary/5 dark:bg-primary/10'
                      : 'border-slate-200 border! bg-white dark:bg-zinc-900 hover:border-gray-200 dark:hover:border-zinc-700 shadow-sm'
                      }`}
                  >
                    {/* Recommended Badge (Example logic: lowest price) */}
                    {serviceId === bestDeal && (
                      <div className="absolute -top-2.5 right-4">
                        <Badge className="bg-[#00A650] hover:bg-[#00A650] text-white text-[10px] uppercase font-bold px-2 py-0.5 shadow-sm">
                          Best Value
                        </Badge>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-4">
                      {/* Left Side: Logo & Info */}
                      <div className="flex items-center gap-4">
                        {/* Radio Button Visual */}
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-primary bg-primary' : 'border-gray-300 dark:border-zinc-600'
                          }`}>
                          {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>

                        {/* Logo Container */}
                        <div className="w-16 h-10 bg-white dark:bg-white rounded-md border border-gray-100 dark:border-zinc-200 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                          <img
                            src={courier.image}
                            alt={courier.carrier}
                            className="max-w-full max-h-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://placehold.co/100x40?text=Logo'
                            }}
                          />
                        </div>

                        {/* Carrier Info */}
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 dark:text-zinc-100 text-sm">
                            {courier.carrier}

                          </span>
                          <span className="text-xs text-gray-500 dark:text-zinc-400 font-medium mt-0.5">
                            {courier.product_type || courier.service_name || courier.service_code || 'Standard Delivery'}
                            {courier.estimate_delivery_date && ` • ETA: ${courier.estimate_delivery_date}`}
                          </span>
                        </div>
                        {serviceId === selectedServiceId && (
                          <Badge className="leading-100 font-bold px-2 py-0.5 shadow-sm">
                            Selected
                          </Badge>
                        )}
                      </div>

                      {/* Right Side: Pricing */}
                      <div className='flex gap-4 items-center'>
                        <div className="flex flex-col items-end justify-center">
                          <span className="text-lg font-bold text-gray-900 dark:text-zinc-100">
                            ${courier.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Surcharges list with checkboxes if selected */}
                    {isSelected && courierSurcharges.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-dashed border-gray-200 dark:border-zinc-800 flex flex-col gap-2">
                        <div className="text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                          Surcharge Options
                        </div>
                        <div className="flex flex-col gap-2">
                          {courierSurcharges.map((charge, index) => {
                            const isChecked = selectedNames.includes(charge.name);
                            return (
                              <label
                                key={index}
                                className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-zinc-300 cursor-pointer hover:text-gray-900 dark:hover:text-zinc-100"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Checkbox
                                  checked={isChecked}
                                  onCheckedChange={(checked) => {
                                    const currentlySelected = selectedSurchargesMap[courier.courierCode] ?? [];
                                    let nextSelected;
                                    if (checked) {
                                      nextSelected = [...currentlySelected, charge.name];
                                    } else {
                                      nextSelected = currentlySelected.filter(name => name !== charge.name);
                                    }
                                    setSelectedSurchargesMap(prev => ({
                                      ...prev,
                                      [courier.courierCode]: nextSelected
                                    }));
                                  }}
                                />
                                <div className="flex justify-between w-full">
                                  <span>{charge.name}</span>
                                  <span className="font-semibold text-gray-900 dark:text-zinc-100">+${charge.amount.toFixed(2)}</span>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  </div>
                )
              })}
            </div>
            {/* {selectedServiceId && module !== 'quote' && (
              <div className="col-span-4 flex flex-col gap-2dark:border-zinc-800 sticky top-0">
                <div className="text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                  OPTIONS
                </div>
                <div className="border-t border-gray-200 dark:border-zinc-800 my-1" />
                <div className="flex flex-col gap-3 mt-2">
                  <label className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-zinc-300 cursor-pointer hover:text-gray-900 dark:hover:text-zinc-100">
                    <Checkbox
                      checked={authorityToLeave}
                      onCheckedChange={(checked) => setAuthorityToLeave(!!checked)}
                    />
                    <span>Authority to Leave</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-zinc-300 cursor-pointer hover:text-gray-900 dark:hover:text-zinc-100">
                    <Checkbox
                      checked={signatureRequired}
                      onCheckedChange={(checked) => setSignatureRequired(!!checked)}
                    />
                    <span>Signature Required</span>
                  </label>
                </div>
              </div>
            )} */}
          </div>
        )}
      </CardContent>
    </Card>
  )
})
