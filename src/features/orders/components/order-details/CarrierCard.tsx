import React, { memo, useEffect, useEffectEvent, useMemo, useRef, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Truck, RefreshCw, Copy, Check, Box, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

import { useGetQuoteServices } from '@/features/quote/hooks/useQuote'
import { showToast } from '@/components/ui/custom-toast'
import type { AddressData, ItemData } from '../../types'
import { useAppSelector } from '@/hooks/store.hooks'
import type { QuoteLocation } from '@/features/quote/types'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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
  signatureSelected?: boolean;
  isLoading?: boolean;
  selectedCustomer?: number;
  setDeliveryInstructions?: React.Dispatch<React.SetStateAction<any>>;
  activeSettings?: any;
  setActiveSettings?: React.Dispatch<React.SetStateAction<any>>;
  onLoadingChange?: (loading: boolean) => void;
}

export const CarrierCard: React.FC<CarrierCardProps> = memo((props) => {
  const { itemData, addresses, onQuoteChange, setCourierData, orderDetail, module, orderType = 'create', initialSelectedCourierId = null, signatureSelected = false, isLoading = false, selectedCustomer, setDeliveryInstructions, activeSettings, setActiveSettings, onLoadingChange } = props
  const { role, default_courier, courier_settings } = useAppSelector((state) => state.auth);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(initialSelectedCourierId || '')
  const [couriers, setCouriers] = useState<any[]>([]);
  const [surchargesMap, setSurchargesMap] = useState<Record<string, any[]>>({});
  const [selectedSurchargesMap, setSelectedSurchargesMap] = useState<Record<string, string[]>>({});
  const selectedSurchargesMapRef = useRef(selectedSurchargesMap);
  const selectedCourierRef = useRef<any>(null);

  useEffect(() => {
    selectedSurchargesMapRef.current = selectedSurchargesMap;
  }, [selectedSurchargesMap]);
  const [bestDeal, setBestDeal] = useState<string>('');
  const [copiedTracking, setCopiedTracking] = useState(false);
  // const [advanceSetting, setAdvanceSetting] = useState([])
  const mount = useRef(false);
  const settingsInitializedForRef = useRef<string | null>(null);
  const lastApiSigReqRef = useRef<boolean>(false);
  const prevSettingsRef = useRef({
    signature_required: activeSettings?.signature_required,
    authority_to_leave: activeSettings?.authority_to_leave
  });
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

  useEffect(() => {
    onLoadingChange?.(loading);
  }, [loading, onLoadingChange]);

  const getAddress = useMemo(() => (
    location: { address1?: string; address?: string; label?: string, suburb?: string, state?: string, postcode?: string, country?: string }
  ) => {
    if (module === 'quote') {
      return location?.label || '';
    }
    return location?.label || `${location?.suburb} ${location?.state} ${location?.postcode}, AU` || "";
  }, [module]);
  const handleServiceSuccess = useEffectEvent((data: any, onlyChangeSettings = false) => {
    if (onlyChangeSettings) {
      setCouriers((prevCouriers) => {
        const updatedCouriers = prevCouriers.map((courier) => {
          const matchingService = (data.services || []).find(
            (s: any) => s.courierCode === courier.courierCode && s.product_id === courier.product_id
          );
          if (matchingService) {
            return {
              ...courier,
              price: matchingService.price,
            };
          }
          return courier;
        });

        if (updatedCouriers.length > 0) {
          const getServiceTotalPrice = (service: any) => service.price;
          const minItem = updatedCouriers.reduce((min: any, curr: any) =>
            getServiceTotalPrice(curr) < getServiceTotalPrice(min) ? curr : min
          );
          setBestDeal(minItem.courierCode + (minItem.product_id || '') || '');
        }

        return updatedCouriers;
      });

      if (data.surcharges) {
        setSurchargesMap(prev => ({
          ...prev,
          ...data.surcharges
        }));
      }
    } else {
      setCouriers(data.services || []);
      setSurchargesMap(data.surcharges || {});
      if (data.surcharges) {
        const initialSelected: Record<string, string[]> = {};
        Object.keys(data.surcharges).forEach(code => {
          if (!mount.current && (code === orderDetail?.courier_details?.courier_code || localStorage.getItem('quote_surcharges'))) {
            initialSelected[code] = orderDetail?.order_details?.surcharges?.map((item: any) => item.name) || JSON.parse(localStorage.getItem('quote_surcharges') || '[]').map((item: any) => item.name) || [];
            localStorage.removeItem('quote_surcharges');
          } else {
            initialSelected[code] = selectedSurchargesMapRef.current[code] || [];
          }
        });
        setSelectedSurchargesMap(initialSelected);
      }

      if (data.services && data.services.length > 0) {
        const getServiceTotalPrice = (service: any) => {
          return service.price;
        };
        const allCourierIds = [...data.services.map((service: any) => service.courierCode + (service.product_id || ''))];
        const minItem = data.services.reduce((min: any, curr: any) =>
          getServiceTotalPrice(curr) < getServiceTotalPrice(min) ? curr : min
        );
        setBestDeal(minItem.courierCode + (minItem.product_id || '') || '');
        const selectedFromQuote = sessionStorage.getItem('quote_courier') || localStorage.getItem('quote_courier');
        if (selectedFromQuote) {
          const courier = JSON.parse(selectedFromQuote);
          setSelectedServiceId(courier.courier.courierCode + (courier.courier.product_id || '') || '');
        } else if (!selectedServiceId || !allCourierIds.includes(selectedServiceId)) {
          setSelectedServiceId((prev) => {
            if ((prev && allCourierIds.includes(prev)) || !mount.current) return prev;
            if (data.services.some((c: any) => c.rule_applied)) {
              const findCourier = data.services.find((courier: any) => courier.rule_applied);
              if (findCourier) {
                return findCourier.courierCode + (findCourier.product_id || '') || '';
              }
            }
            if (default_courier && default_courier.courier_id) {
              const findCourier = data.services.find((courier: any) => courier.carrier_id === default_courier.courier_id);
              if (findCourier) {
                return findCourier.courierCode + (findCourier.product_id || '') || '';
              }
            }
            return minItem.courierCode + (minItem.product_id || '') || '';
          });
        }
      }
    }
    mount.current = true;
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
      signature_required: (activeSettings?.signature_required ?? signatureSelected) ? 1 : 0,
      customer_id: selectedCustomer,
      atl: activeSettings?.authority_to_leave ? 1 : 0,
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
    if (orderType !== 'create' && orderType !== 'consign' && orderType !== 'return') return;
    // Check if we have valid items with dimensions > 0
    const isValidItems = itemData && itemData.length > 0 && itemData.every(item =>
      Number(item.height) > 0 && Number(item.width) > 0 && Number(item.length) > 0 && Number(item.weight) > 0 && Number(item.quantity) > 0
    );
    if (!isValidItems) return;

    // Check if we have both addresses
    const sender_addr1 = getAddress(addresses?.sender || {});
    const receiver_addr1 = getAddress(addresses?.receiver || {});
    if (sender_addr1 === '' || receiver_addr1 === '' || addresses?.sender?.suburb === '' || addresses?.receiver?.suburb === '') return;

    // Detect if settings changed
    const settingsChanged =
      prevSettingsRef.current.signature_required !== activeSettings?.signature_required ||
      prevSettingsRef.current.authority_to_leave !== activeSettings?.authority_to_leave;

    // Update ref
    prevSettingsRef.current = {
      signature_required: activeSettings?.signature_required,
      authority_to_leave: activeSettings?.authority_to_leave
    };

    const triggerApi = (onlyChangeSettings = false) => {
      const receiver_details = module === 'quote' ? receiver_addr1 : ` ${addresses?.receiver?.suburb} ${addresses?.receiver?.state} ${addresses?.receiver?.postcode}, AU`.trim();

      const sigReq = !!activeSettings?.signature_required;
      lastApiSigReqRef.current = sigReq;

      const selectedCourier = couriers.find((c) => (c.courierCode + (c.product_id || '')) === selectedServiceId);
      const payload = {
        items: itemData,
        sender_details: sender_addr1,
        receiver_details: receiver_details,
        receiver_address: addresses?.receiver?.address_info || receiver_addr1,
        is_order: module === 'quote' ? "no" as const : "yes" as const,
        signature_required: sigReq ? 1 : 0,
        customer_id: selectedCustomer,
        atl: activeSettings?.authority_to_leave ? 1 : 0,
        ...(onlyChangeSettings && { courier_code: selectedCourier?.courierCode || "couriersplease_tranzit_group" }),
      };

      getServices(payload, {
        onSuccess: (data) => {
          handleServiceSuccess(data, onlyChangeSettings);
        },
        onError: (err: any) => {
          showToast(err?.response?.data?.message || 'Failed to fetch rates', "error");
        }
      });
    };

    if (settingsChanged) {
      triggerApi(true);
      return;
    }

    const timer = setTimeout(() => {
      triggerApi();
    }, 500); // 500ms debounce
    // Cleanup previous timer
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemData, addresses?.sender?.suburb, addresses?.sender?.state, addresses?.sender?.postcode, addresses?.receiver?.suburb, addresses?.receiver?.state, addresses?.receiver?.postcode, getServices, orderType, module, getAddress, activeSettings?.signature_required, activeSettings?.authority_to_leave, selectedCustomer])

  useEffect(() => {
    if (couriers.length > 0 && selectedServiceId) {
      const selectedCourier = couriers.find((c) => (c.courierCode + (c.product_id || '')) === selectedServiceId);
      if (selectedCourier) {
        const courierSurcharges = surchargesMap[selectedCourier.courierCode] || [];
        const selectedNames = selectedSurchargesMap[selectedCourier.courierCode] ?? [];
        const activeSurcharges = courierSurcharges.filter(charge => selectedNames.includes(charge.name));
        const autoApplyCharges = selectedCourier?.applied_surcharges?.reduce((acc: any, curr: any) => acc + curr.amount, 0) || 0;
        const surcharges = activeSurcharges.filter((charge: any) => !charge.is_auto_apply).reduce((acc: any, curr: any) => acc + curr.amount, 0) || 0;
        const totalSurcharges = surcharges + autoApplyCharges
        const surchargesGst = (totalSurcharges || 0) * 0.1
        const totalGst = (selectedCourier?.gst || 0) + surchargesGst
        const totalPrice = selectedCourier.price + totalSurcharges + surchargesGst;
        onQuoteChange?.((prev: any) => ({
          courier: selectedCourier,
          surcharges: mount.current ? activeSurcharges : (prev?.surcharges?.length ? prev?.surcharges : activeSurcharges),
          totalSurcharges: totalSurcharges,
          totalPrice,
          gst: totalGst,
          // authorityToLeave,
          // signatureRequired
        }));
        setCourierData?.({
          courierCode: selectedCourier.courierCode,
          courier: selectedCourier.carrier_id,
          product_id: selectedCourier.product_id,
          product_type: selectedCourier.product_type,
          shipment_summary: selectedCourier.shipment_summary,
          is_own_courier: selectedCourier.is_own_courier
        })

      }
    }
  }, [selectedServiceId, couriers, surchargesMap, selectedSurchargesMap, onQuoteChange, setCourierData, setDeliveryInstructions])

  useEffect(() => {
    // advance settings
    if (selectedCourierRef.current === selectedServiceId) return;


    const selectedCourier = couriers.find((c) => (c.courierCode + (c.product_id || '')) === selectedServiceId);
    if (selectedCourier) {
      selectedCourierRef.current = selectedServiceId;
      const qActiveSettings = localStorage.getItem('quote_active_settings');
      if (qActiveSettings) {
        setActiveSettings?.(JSON.parse(qActiveSettings));
        localStorage.removeItem('quote_active_settings');
        return;
      }
      // Skip re-initializing settings if already done for this courier (e.g. couriers refreshed due to API call)
      if (settingsInitializedForRef.current === selectedServiceId) return;
      settingsInitializedForRef.current = selectedServiceId;

      // setDeliveryInstructions?.("Hello word")
      const setting = courier_settings?.find((c: any) => c.courierCode === selectedCourier.courierCode)
      if (setting) {
        setDeliveryInstructions?.(setting?.advanced_settings?.delivery_instruction || '')
        const targetObj = setting.advanced_settings?.settings || setting;
        const filteredSettings: Record<string, any> = {};

        if (Array.isArray(targetObj)) {
          targetObj.forEach((item: any) => {
            if (item && item.key && item.key !== 'delivery_instruction' && item.key !== 'delivery_instructions' && item.type === 'checkbox') {
              filteredSettings[item.key] = item.value;
            }
          });
        } else if (targetObj) {
          Object.keys(targetObj).forEach((key) => {
            if (key !== 'delivery_instruction' && key !== 'delivery_instructions' && key !== 'settings' && typeof targetObj[key] === 'boolean') {
              filteredSettings[key] = targetObj[key];
            }
          });
        }

        setActiveSettings?.((prev: any) => {
          const newSettings = { ...filteredSettings };
          // Only suppress the dep change when this courier actually has signature_required
          // AND its effective value matches what was last sent to the API.
          // Couriers without the key (e.g. Auspost) are left untouched — no stale key injected.
          if ('signature_required' in filteredSettings) {
            const effectiveNewSigReq = !!filteredSettings.signature_required;
            if (effectiveNewSigReq === lastApiSigReqRef.current) {
              newSettings.signature_required = prev?.signature_required || false;
            }
          }
          return newSettings;
        });
      } else {
        setActiveSettings?.({});
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedServiceId, couriers])

  return (
    <Card className="border gap-0 border-gray-200 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b border-gray-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 transition-colors">
        <div className="flex justify-between w-full items-center gap-2">
          <div className='flex items-center gap-2'>
            <Truck className="h-5 w-5 text-primary" />
            <CardTitle className="text-base font-bold text-slate-800 dark:text-zinc-400">
              Shipment Options
            </CardTitle>
          </div>
          {/* {loading && <RefreshCw className="h-4 w-4 animate-spin" />} */}
          {(orderType === 'create' || orderType === 'consign') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchServices()}
              disabled={loading || isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 bg-white dark:bg-zinc-950 relative">
        {(loading || isLoading) && (couriers.length > 0 || (orderType !== 'create' && orderType !== 'consign' && !!orderDetail)) && (
          <div className="absolute inset-0 bg-white/40 dark:bg-zinc-950/40 flex items-center justify-center z-10 transition-all duration-300 rounded-b-xl">
            <div className="flex flex-col items-center gap-2 bg-white dark:bg-zinc-900 px-6 py-4 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-200">
              <RefreshCw className="h-6 w-6 animate-spin text-primary" />
              <span className="text-[10px] font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">Recalculating Rates...</span>
            </div>
          </div>
        )}

        {orderType !== 'create' && orderType !== 'consign' && orderDetail ? (
          <div className={cn("flex flex-col gap-3 transition-all duration-300", (loading || isLoading) && "opacity-40 pointer-events-none")}>
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
                      {orderDetail.courier_details?.tracking_url ? (
                        <a
                          href={orderDetail.courier_details.tracking_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                        >
                          {orderDetail.courier_details.tracking_number}
                          <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-70" />
                        </a>
                      ) : (
                        <span className="text-xs font-bold text-primary">{orderDetail.courier_details?.tracking_number || 'N/A'}</span>
                      )}
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
                  <div className="text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase mt-0.5">
                    Total Incl. GST
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (loading || isLoading) && couriers.length === 0 ? (
          <div className="py-8 h-34 flex items-center justify-center text-sm text-gray-500 font-medium gap-2">
            <RefreshCw className="h-4 w-4 animate-spin text-primary" />
            Fetching available carriers...
          </div>
        ) : couriers.length === 0 ? (
          <div className="py-8 h-54 flex flex-col items-center justify-center text-xl text-gray-800 font-medium gap-2">
            <div className="shrink-0 relative">
              <div className="w-24 h-24 bg-linear-to-br from-blue-100 via-indigo-100 to-cyan-100 dark:from-blue-800/50 dark:via-indigo-800/50 dark:to-cyan-800/50 border border-slate-200/50 dark:border-zinc-700/50 rounded-2xl flex items-center justify-center shadow-inner group hover:shadow-lg transition-all duration-300 hover:rotate-3 hover:scale-105">
                <Box className={cn(
                  "w-12 h-12 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:text-primary dark:group-hover:text-primary",
                  "text-primary/60"
                )} />
              </div>
            </div>
            Ready for your shipment?<br />
            <span className="text-sm">Complete the sender and receiver details above to unlock real-time shipping rates and carrier options.</span>
          </div>
        ) : (
          <div className={cn("grid grid-cols-12 gap-4 transition-all duration-300", (loading || isLoading) && "opacity-40 pointer-events-none")}>
            <div className={`${module !== 'quote' ? 'col-span-12 lg:col-span-8' : 'col-span-12'} flex flex-col gap-3 max-h-100 overflow-y-auto pt-4 pr-1`}>
              {couriers.map((courier) => {
                const serviceId = courier.courierCode + (courier.product_id || '') || '';

                // Map additional charges by courierCode
                const courierSurcharges = surchargesMap[courier.courierCode] || [];
                const selectedNames = selectedSurchargesMap[courier.courierCode] ?? [];
                const isSelected = selectedServiceId === serviceId
                const allAutoApplyChargesName = courier?.applied_surcharges?.map((item: any) => item.name) || [];
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
                      : 'border-slate-200 border-2 bg-white dark:bg-zinc-900 hover:border-gray-200 dark:hover:border-zinc-700 shadow-sm'
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
                            {courier.product_id && `${courier.product_id} • `}
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
                        <div className="text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase">
                          Surcharge Options
                        </div>
                        <div className="flex flex-col gap-2">
                          {courierSurcharges.map((charge, index) => {
                            const isChecked = selectedNames.includes(charge.name);

                            const displaySurcharges = [
                              "airport_delivery_surcharge",
                              "exhibition_centre_surcharge",
                              "hand_unload",
                              "palletising",
                              "tailgate_pickup_delivery"
                            ]
                            if (!displaySurcharges.includes(charge.code)) return;
                            return (
                              <label
                                key={index}
                                className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-zinc-300 cursor-pointer hover:text-gray-900 dark:hover:text-zinc-100"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Checkbox
                                  checked={isChecked || allAutoApplyChargesName.includes(charge.name)}
                                  disabled={!charge.is_customer_selectable}
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
                                <div className={`flex justify-between w-full ${!charge.is_customer_selectable ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                  <span>{charge.name}</span>
                                  {/* <span className="font-semibold text-gray-900 dark:text-zinc-100">+${charge.amount.toFixed(2)}</span> */}
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
            {selectedServiceId && module !== 'quote' && (
              <div className="col-span-12 lg:col-span-4 flex flex-col gap-3 bg-slate-50/50 dark:bg-zinc-900/10 p-4 rounded-xl border border-slate-100 dark:border-zinc-800/60 lg:sticky lg:top-0 h-fit mt-4 lg:mt-0">
                <div className="text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                  OPTIONS
                </div>
                <div className="border-t border-gray-200 dark:border-zinc-800 my-1" />
                <div className="flex flex-col gap-3 mt-1">
                  {Object.keys(activeSettings).map((setting) => (
                    <label key={setting} className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-zinc-300 cursor-pointer hover:text-gray-900 dark:hover:text-zinc-100">
                      <Checkbox
                        checked={!!activeSettings[setting]}
                        onCheckedChange={(checked) => {
                          setActiveSettings?.((prev: any) => {
                            const next: any = { ...prev, [setting]: !!checked };
                            if (checked) {
                              if (setting === 'authority_to_leave' && 'signature_required' in prev) {
                                next.signature_required = false;
                              } else if (setting === 'signature_required' && 'authority_to_leave' in prev) {
                                next.authority_to_leave = false;
                              }
                            }
                            return next;
                          });
                        }}
                      />
                      <span>{setting.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
                    </label>
                  ))}
                  {/* <label className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-zinc-300 cursor-pointer hover:text-gray-900 dark:hover:text-zinc-100">
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
                  </label> */}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
})
