import { useCallback, useMemo, useState, useEffect, useEffectEvent, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '@/hooks/store.hooks';
import { showToast } from '@/components/ui/custom-toast';
import { useOrderItems } from './useOrderItems';
import {
  useCreateOrder,
  useOrderDetails,
  useDownloadLabel,
  useWalletCheck,
  useCancelOrder,
  useConsignOrder,
  useArchiveOrder,
} from './useOrders';
import { useGlobalCouriers } from '@/features/courier-surcharge/hooks/useGlobalCouriers';
import type { AddressData, WalletCheckResponse } from '../types';
import { useDefaultItem } from '@/features/items/hooks/useItems';
import { removeEmptyFields } from '@/lib/utils';

// address1 = street
const initialAddressData = {
  name: '',
  email: '',
  phone: '',
  company: '',
  building: '',
  instructions: '',
  address_info: '',
  address1: '',
  street_name: '',
  street_number: '',
  suburb: '',
  state: '',
  unit_number: '',
  postcode: '',
  country: 'AU',
  saveToAddressBook: false,
}

export const useOrderWorkflow = () => {
  const { orderType, orderID } = useParams<{ orderType: string; orderID: string }>();
  const { role, user, default_courier, default_item } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  // API Hooks
  const { mutate: createOrder, isPending: saveLoading } = useCreateOrder();
  const { mutate: checkWallet, isPending: walletLoading } = useWalletCheck();
  const { data: orderResponse, isLoading: isOrderLoading } = useOrderDetails(orderID || '');
  const { mutate: downloadLabel, isPending: isDownloadingLabel } = useDownloadLabel(false);
  const { mutate: printLabel } = useDownloadLabel(true);
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder();
  const { mutate: consignOrder, isPending: isConsigning } = useConsignOrder(role === 'admin');
  const { data: globalCouriers } = useGlobalCouriers(role === 'admin' && orderType === 'create-menual');

  const orderDetail = orderResponse?.data;
  const isEditable = orderType === 'create' || orderType === 'consign' || orderType === 'create-menual' || orderType === 'return';
  const isCreate = orderType === 'create' || orderType === 'create-menual' || orderType === 'return';

  const { data: defaultItem } = useDefaultItem(isCreate && (role !== 'admin'))
  // State Management
  const [walletCheckOpen, setWalletCheckOpen] = useState(false);
  const [walletCheckData, setWalletCheckData] = useState<WalletCheckResponse | null>(null);
  const [quoteData, setQuoteData] = useState<any>(null);
  const [courierData, setCourierData] = useState<any>(null);
  // const [isSaveAsDraft, setIsSaveAsDraft] = useState(false);
  const isSaveAsDraft = useRef(false);
  const [saveAction, setSaveAction] = useState<'draft' | 'consignment' | null>(null);

  useEffect(() => {
    if (!saveLoading && !walletLoading) {
      setSaveAction(null);
    }
  }, [saveLoading, walletLoading]);

  const [addressData, setAddressData] = useState<{ sender: AddressData; receiver: AddressData }>(() => ({
    sender: initialAddressData,
    receiver: initialAddressData,
  }));

  const [manualOrderData, setManualOrderData] = useState({
    trackingNumber: '',
    courierId: '',
    amount: '',
  });

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showItemCountModal, setShowItemCountModal] = useState(false);

  const [showArchiveModal, setShowArchiveModal] = useState(false);

  const initialDialogMode = useMemo(() => {
    if (isCreate && sessionStorage.getItem('address') === null) {
      if (orderType === 'return' && addressData.sender.address1 === '') {
        return 'sender';
      }
      if (orderType !== 'return' && addressData.receiver.address1 === '') {
        return 'receiver';
      }
    }
    return null;
  }, [addressData.receiver.address1, orderType, addressData.sender.address1, isCreate]);

  const [insuranceSelected, setInsuranceSelected] = useState<boolean>(false);
  const [signatureSelected, setSignatureSelected] = useState<boolean>(false);
  const [orderDialogMode, setOrderDialogMode] = useState<'sender' | 'receiver' | null>(initialDialogMode);
  const [deliveryInstructions, setDeliveryInstructions] = useState<string>('');
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [ratesAccepted, setRatesAccepted] = useState(true);
  const [dangerousGoodsAccepted, setDangerousGoodsAccepted] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<number>();
  const [showReceiverPhoneModal, setShowReceiverPhoneModal] = useState(false);
  const [receiverPhone, setReceiverPhone] = useState('');

  const {
    itemsData,
    updateItem,
    fullUpdateItem,
    addItem,
    removeItem,
    setItemsData,
  } = useOrderItems([
    {
      type: 'box',
      quantity: 1,
      weight: 0,
      length: 0,
      width: 0,
      height: 0,
    },
  ]);

  const setDefaultItemData = useEffectEvent((data: any) => {
    if ((itemsData.length === 1) || itemsData.length === 0) {
      setItemsData([
        {
          // ...defaultItem.data,
          weight: Number(data?.item_weight) || 0,
          length: Number(data?.item_length) || 0,
          width: Number(data?.item_width) || 0,
          height: Number(data?.item_height) || 0,
          quantity: 1,
          type: 'box',
        },
      ]);
    }
  })
  useEffect(() => {
    if (defaultItem && (orderType === 'create' || orderType === 'create-menual' || orderType === 'return')) {
      setDefaultItemData(defaultItem.data)
    }
  }, [defaultItem, setItemsData, orderType]);

  const isValidConsignOrder = useCallback((orderStatus: string | undefined) => {
    if (orderStatus !== 'new' && orderType === 'consign') {
      navigate(`${role === 'admin' ? '/admin' : ''}/orders/view/${orderID}`);
    }
  }, [role, orderID, navigate, orderType]);

  // Sync user profile sender address (Create Mode)
  useEffect(() => {
    if (role === 'customer' && user && (orderType === 'create' || orderType === 'create-menual' || orderType === 'return')) {
      const key = orderType === 'return' ? 'receiver' : 'sender';
      setAddressData((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          email: user.email || '',
          phone: user.office_number || user.personal_mobile || '',
          company: user.company_name || '',
          address_info: user.addresses?.[0]?.address_info || user.addresses?.[0]?.address || '',
          address1: user.addresses?.[0]?.address || '',
          suburb: user.addresses?.[0]?.suburb || '',
          state: user.addresses?.[0]?.state || '',
          unit_number: user.addresses?.[0]?.unit_number || '',
          street_name: user.addresses?.[0]?.street_name || '',
          street_number: user.addresses?.[0]?.street_number || '',
          postcode: user.addresses?.[0]?.postcode || '',
          name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        },
      }));
    }
  }, [user, role, orderType]);

  // Sync existing order details (Edit/Consign Mode)
  useEffect(() => {
    if (orderDetail && orderType !== 'create' && orderType !== 'create-menual') {
      const senderDetail = orderDetail.sender_details;
      const receiverDetail = orderDetail.receiver_details;
      setAddressData({
        sender: {
          name: senderDetail?.name || '',
          email: senderDetail?.email || '',
          phone: senderDetail?.mobile || '',
          company: senderDetail?.company || '',
          instructions: senderDetail?.address_detail?.instructions || '',
          address1: senderDetail?.address_detail?.address_line || '',
          address_info: senderDetail?.address_detail?.address_info || senderDetail?.address || '',
          suburb: senderDetail?.address_detail?.suburb || '',
          street_name: senderDetail?.address_detail?.street_name || '',
          street_number: senderDetail?.address_detail?.street_number || '',
          unit_number: senderDetail?.address_detail?.unit_number || '',
          state: senderDetail?.address_detail?.state || '',
          postcode: senderDetail?.address_detail?.postcode || '',
          country: 'AU',
          saveToAddressBook: false,
        },
        receiver: {
          name: receiverDetail?.name || '',
          email: receiverDetail?.email || '',
          phone: receiverDetail?.mobile || '',
          company: receiverDetail?.company || '',
          instructions: receiverDetail?.address_detail?.instructions || '',
          address1: receiverDetail?.address_detail?.address_line || '',
          address_info: receiverDetail?.address_detail?.address_info || '',
          suburb: receiverDetail?.address_detail?.suburb || '',
          street_name: receiverDetail?.address_detail?.street_name || '',
          street_number: receiverDetail?.address_detail?.street_number || '',
          unit_number: receiverDetail?.address_detail?.unit_number || '',
          state: receiverDetail?.address_detail?.state || '',
          postcode: receiverDetail?.address_detail?.postcode || '',
          country: 'AU',
          saveToAddressBook: false,
        },
      });
      setItemsData(orderDetail.order_details?.items?.map((item) => ({
        type: item.type,
        quantity: item.quantity,
        weight: item.weight,
        length: item.length,
        width: item.width,
        height: item.height,
        description: item.description || '',
      })) || []);
      setDeliveryInstructions(orderDetail.delivery_instructions || '');
      setInsuranceSelected(orderDetail.limited_liability_cover?.covered || false);
      setCourierData(orderDetail.courier_details);
      setQuoteData(orderDetail.order_details);
      isValidConsignOrder(orderDetail.order_status_category);
    }
  }, [isValidConsignOrder, orderDetail, orderType, setItemsData]);

  const handleAddressSubmit = useCallback((type: 'sender' | 'receiver' | 'customer', data: AddressData) => {
    setAddressData((prev) => ({ ...prev, [type]: data }));
    setOrderDialogMode(null);
  }, []);

  const onEditClick = useCallback((type: 'sender' | 'receiver') => {
    setOrderDialogMode(type);
    setIsEdit(true);
  }, []);

  const handleOptionalFieldsChange = useCallback((type: 'insurance' | 'signature' | 'delivery_instructions', value: string | boolean) => {
    if (type === 'insurance') {
      setInsuranceSelected(value as boolean);
    } else if (type === 'signature') {
      setSignatureSelected(value as boolean);
    } else if (type === 'delivery_instructions') {
      setDeliveryInstructions(value as string);
    }
  }, []);

  // Summary Metrics calculations
  const calculation = useMemo(() => {
    const totalItems = itemsData?.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0) || 0;
    const totalWeight = itemsData?.reduce((acc, item) => acc + (Number(item.weight) * (Number(item.quantity) || 1)), 0) || 0;

    const volumetric = itemsData?.reduce((acc, item) => {
      const w = Number(item.width) || 1;
      const h = Number(item.height) || 1;
      const l = Number(item.length) || 1;
      const q = Number(item.quantity) || 1;
      return acc + ((w * h * l * 250) / 1000000) * q;
    }, 0) || 0;
    const servicePrice = quoteData?.courier?.base || quoteData?.subtotal || 0;
    const gst = quoteData?.courier?.gst || quoteData?.tax || 0;
    const totalSurcharges = quoteData?.totalSurcharges || 0;
    const insuranceCost = insuranceSelected ? 6.0 : 0;
    const grandTotal = (quoteData?.totalPrice || quoteData?.total || 0) + insuranceCost;

    return {
      totalItems,
      totalWeight,
      volumetric,
      servicePrice,
      gst,
      totalSurcharges,
      insuranceCost,
      grandTotal,
      insurance: insuranceSelected,
    };
  }, [itemsData, quoteData, insuranceSelected]);

  const requiresManualLabel = useMemo(() => {
    if (orderType !== 'edit') return false;
    const noTrackingNumber = !orderDetail?.courier_details?.tracking_number;
    const hasManyItems = calculation.totalItems > 4;
    const hasHeavyItem = itemsData?.some((item) => Number(item.weight) > 28);
    return hasManyItems || hasHeavyItem || noTrackingNumber;
  }, [orderType, calculation.totalItems, itemsData, orderDetail?.courier_details?.tracking_number]);

  console.log(quoteData, 'quoteData...')
  // Order Submission/Saving Flow
  const handleOnSave = useCallback((skipWalletCheckArg?: any, overrideReceiverPhone?: string) => {
    const isValidItems = itemsData && itemsData.length > 0 && itemsData.every((item) =>
      item.type !== 'box' ||
      Number(item.height) > 0 && Number(item.width) > 0 && Number(item.length) > 0 && Number(item.weight) > 0 && Number(item.quantity) > 0
    );
    const hasSenderAddress = Boolean(addressData?.sender?.address1);
    const hasReceiverAddress = Boolean(addressData?.receiver?.address1);

    if (role === 'admin' && !selectedCustomer) {
      showToast('Please select a customer.', 'error');
      return;
    }

    if (!isValidItems || !hasSenderAddress || !hasReceiverAddress) {
      showToast('Please fill out item dimensions and complete both addresses.', 'error');
      return;
    }
    if (!courierData?.courier) {
      showToast('Please select a courier.', 'error');
      return;
    }

    if (!termsAccepted || !ratesAccepted) {
      showToast('You must accept all Terms & Conditions and Futile Pickup declarations.', 'error');
      return;
    }

    if (!dangerousGoodsAccepted) {
      showToast("Please confirm that this consignment does not contain dangerous goods", 'error');
      return;
    }

    if (calculation.totalItems > 4 && skipWalletCheckArg !== 'skipItemCountCheck' && skipWalletCheckArg !== 'saveAsDraft') {
      setShowItemCountModal(true);
      return;
    }

    const action = skipWalletCheckArg === 'saveAsDraft' ? 'draft' : 'consignment';
    setSaveAction(action);

    const getCapture = () => {
      if (role === 'admin') return true;
      if (skipWalletCheckArg == 'saveAsDraft') return false;
      if ((walletCheckData?.wallet_balance ?? 0) > calculation.grandTotal) return true;
    }

    const payload: any = {
      ...addressData,
      receiver: {
        ...addressData.receiver,
        phone: overrideReceiverPhone || addressData.receiver.phone,
      },
      parcels: itemsData,
      service: {
        ...courierData,
        cover_limited_liability: insuranceSelected ? 1 : 0,
        signature_required: signatureSelected ? 1 : 0,
      },
      surcharges: quoteData?.surcharges || [],
      delivery_instructions: deliveryInstructions,
      terms_and_conditions: termsAccepted,
      totals: {
        subtotal: quoteData?.courier?.base || 0,
        gst: quoteData?.courier?.gst || 0,
        extra_surcharge: calculation.totalSurcharges,
        total: calculation.grandTotal || 0,
        freight_levy: quoteData?.courier?.freight_levy || 0,
      },
      capture: getCapture(),
      save_address: addressData?.receiver?.saveToAddressBook ? 1 : 0,
      customer_id: selectedCustomer || undefined,
      ...(orderType === 'create-menual' ? {
        tracking_number: manualOrderData.trackingNumber,
        courier_id: manualOrderData.courierId,
        amount: manualOrderData.amount,
      } : {}),
    };

    const executeCreateOrder = (is_own?: boolean) => {
      createOrder({ ...payload, is_own }, {
        onSuccess: (response) => {
          if (response.status || response.ok) {
            showToast('Orders Created successfully', 'success');
            if (skipWalletCheckArg === 'saveAsDraft') {
              navigate(`${role === 'admin' ? '/admin' : ''}/orders`);
            } else {
              navigate(`${role === 'admin' ? '/admin' : ''}/orders/${response?.data?.order_status_category !== 'new' ? 'view' : 'consign'}/${response?.data?.order_number}`);
            }
            setWalletCheckOpen(false);
            if (response?.data?.order_number && (response?.data?.order_status_category !== 'new' || role === 'admin')) {
              printLabel(response?.data?.order_number);
            }
          } else {
            showToast(response.message || 'Failed to create orders', 'error');
          }
        },
        onError: (err: any) => {
          if (err?.response?.data?.receiver_contact_required) {
            setWalletCheckOpen(false);
            setShowReceiverPhoneModal(true);

            isSaveAsDraft.current = skipWalletCheckArg === 'saveAsDraft';
            return;
          }
          showToast(err?.response?.data?.message || 'Failed to create orders', 'error');
        },
      });
    };

    if (skipWalletCheckArg === 'saveAsDraft' || skipWalletCheckArg === true || role === 'admin' || courierData?.is_own) {
      executeCreateOrder(courierData?.is_own);
      return;
    }

    checkWallet(calculation.grandTotal, {
      onSuccess: (res) => {
        if (res.ok) {
          setWalletCheckData(res);
          setWalletCheckOpen(true);
        } else {
          executeCreateOrder();
        }
      },
      onError: () => {
        showToast('Failed to create orders', 'error');
      },
    });
  }, [itemsData, addressData, role, selectedCustomer, courierData, termsAccepted, ratesAccepted, dangerousGoodsAccepted, calculation.totalItems, calculation.totalSurcharges, calculation.grandTotal, insuranceSelected, signatureSelected, quoteData?.surcharges, quoteData?.courier?.base, quoteData?.courier?.gst, quoteData?.courier?.freight_levy, deliveryInstructions, orderType, manualOrderData.trackingNumber, manualOrderData.courierId, manualOrderData.amount, checkWallet, walletCheckData?.wallet_balance, createOrder, navigate, printLabel]);

  const handleReceiverPhoneSubmit = useCallback((phone: string) => {
    setAddressData((prev) => ({
      ...prev,
      receiver: {
        ...prev.receiver,
        phone,
      },
    }));
    setShowReceiverPhoneModal(false);
    handleOnSave(isSaveAsDraft.current ? 'saveAsDraft' : true, phone);
  }, [handleOnSave]);

  // Order Cancellation Flow
  const onCancelOrder = useCallback((manual: boolean = false) => {
    if (orderID) {
      console.log(manual, 'menual...')
      cancelOrder(
        { orderId: orderID, data: { manual: typeof manual === 'boolean' ? manual : false } },
        {
          onSuccess: (response) => {
            showToast(response?.message || 'Order cancelled successfully', 'success');
            navigate(`${role === 'admin' ? '/admin' : ''}/orders`);
          },
          onError: (err: any) => {
            showToast(err?.response?.data?.message || 'Failed to cancel order', 'error');
          },
        }
      );
    }
  }, [orderID, cancelOrder, navigate, role]);

  const archiveOrderMutation = useArchiveOrder();

  const onArchiveOrder = useCallback(() => {
    if (orderID) {
      archiveOrderMutation.mutate(orderID, {
        onSuccess: (response) => {
          showToast(response?.message || 'Order archived successfully', 'success');
          setShowArchiveModal(false);
          navigate(`${role === 'admin' ? '/admin' : ''}/orders`);
        },
        onError: (err: any) => {
          showToast(err?.response?.data?.message || 'Failed to archive order', 'error');
        },
      });
    }
  }, [orderID, archiveOrderMutation, navigate, role]);


  // Order Consignment Flow
  const handleConsign = useCallback((skipWalletCheckArg?: any) => {
    if (!termsAccepted || !ratesAccepted || !dangerousGoodsAccepted) {
      showToast('You must accept all Terms & Conditions, Dangerous Goods, and Futile Pickup declarations.', 'error');
      return;
    }

    const payload = {
      customer_id: selectedCustomer || orderDetail?.sender_details?.customer_id,
      sender: removeEmptyFields({
        name: addressData.sender.name,
        company: addressData.sender.company,
        phone: addressData.sender.phone,
        email: addressData.sender.email,
        address1: addressData.sender.address1,
        suburb: addressData.sender.suburb,
        state: addressData.sender.state,
        postcode: addressData.sender.postcode,
        country: addressData.sender.country || 'AU',
      }),
      receiver: removeEmptyFields({
        name: addressData.receiver.name,
        company: addressData.receiver.company,
        phone: addressData.receiver.phone,
        email: addressData.receiver.email,
        address1: addressData.receiver.address1,
        suburb: addressData.receiver.suburb,
        state: addressData.receiver.state,
        postcode: addressData.receiver.postcode,
        country: addressData.receiver.country || 'AU',
      }),
      parcels: itemsData.map((item) => ({
        type: item.type,
        quantity: item.quantity,
        weight: item.weight,
        length: item.length,
        width: item.width,
        height: item.height,
      })),
      service: {
        ...courierData,
        cover_limited_liability: insuranceSelected ? 1 : 0,
        signature_required: signatureSelected ? 1 : 0,
      },
      surcharges: quoteData?.surcharges || [],
      delivery_instructions: deliveryInstructions,
      terms_and_conditions: termsAccepted,
      totals: {
        subtotal: quoteData?.courier?.base || calculation.servicePrice,
        gst: quoteData?.courier?.gst || calculation.gst,
        total: quoteData?.courier?.price || calculation.grandTotal,
      },
      capture: role === 'admin' || !skipWalletCheckArg || (walletCheckData?.wallet_balance ?? 0) > calculation.grandTotal,
      ...(orderType === 'create-menual' ? {
        tracking_number: manualOrderData.trackingNumber,
        courier_id: manualOrderData.courierId,
        amount: manualOrderData.amount,
      } : {}),
    };

    const executeConsign = () => {
      if (orderID) {
        consignOrder(
          { orderId: orderID, data: payload },
          {
            onSuccess: () => {
              showToast('Order consigned successfully', 'success');
              navigate(`${role === 'admin' ? '/admin' : ''}/orders/view/${orderID}`);
              setWalletCheckOpen(false);
              if (orderID) {
                printLabel(orderID);
              }
            },
            onError: (err: any) => {
              if (err?.response?.data?.receiver_contact_required) {
                setShowReceiverPhoneModal(true);
                return;
              }
              showToast(err?.response?.data?.message || 'Failed to consign order', 'error');
            },
          }
        );
      }
    };

    if (skipWalletCheckArg === true || role === 'admin' || courierData?.is_own) {
      executeConsign();
      return;
    }

    checkWallet(calculation.grandTotal, {
      onSuccess: (res) => {
        if (res.ok) {
          setWalletCheckData(res);
          setWalletCheckOpen(true);
        } else {
          executeConsign();
        }
      },
      onError: () => {
        showToast('Failed to consign order', 'error');
      },
    });

  }, [termsAccepted, ratesAccepted, dangerousGoodsAccepted, selectedCustomer, orderDetail?.sender_details?.customer_id, addressData.sender.name, addressData.sender.company, addressData.sender.phone, addressData.sender.email, addressData.sender.address1, addressData.sender.suburb, addressData.sender.state, addressData.sender.postcode, addressData.sender.country, addressData.receiver.name, addressData.receiver.company, addressData.receiver.phone, addressData.receiver.email, addressData.receiver.address1, addressData.receiver.suburb, addressData.receiver.state, addressData.receiver.postcode, addressData.receiver.country, itemsData, courierData, insuranceSelected, signatureSelected, deliveryInstructions, quoteData?.courier?.base, quoteData?.courier?.gst, quoteData?.courier?.price, quoteData?.surcharges, calculation.servicePrice, calculation.gst, calculation.grandTotal, orderType, manualOrderData.trackingNumber, manualOrderData.courierId, manualOrderData.amount, orderID, consignOrder, navigate, role, printLabel, checkWallet, walletCheckData?.wallet_balance]);

  useEffect(() => {
    const savedAddressStr = sessionStorage.getItem('address');
    if (savedAddressStr) {
      try {
        const savedAddr = JSON.parse(savedAddressStr);
        setAddressData(prev => ({
          ...prev,
          receiver: {
            name: savedAddr.contact_person || '',
            email: savedAddr.email || '',
            phone: savedAddr.phone || '',
            company: savedAddr.business_name || '',
            building: savedAddr.building || '',
            instructions: savedAddr.instructions || '',
            address_info: savedAddr.address_info || '',
            address1: savedAddr.address || '',
            street_name: savedAddr.street_name || '',
            street_number: savedAddr.street_number || '',
            unit_number: savedAddr.unit_number || '',
            suburb: savedAddr.suburb || '',
            state: savedAddr.state || '',
            city: savedAddr.city || '',
            postcode: savedAddr.postcode || '',
            country: savedAddr.country || '',
            saveToAddressBook: false,
          }
        }));
      } catch (e) {
        console.error("Failed to parse address from sessionStorage:", e);
      }
    }

    const qSender = sessionStorage.getItem('quote_sender');
    const qReceiver = sessionStorage.getItem('quote_receiver');
    // const qItems = sessionStorage.getItem('quote_items');
    const qCourier = sessionStorage.getItem('quote_courier');

    if (qSender || qReceiver || qCourier) {
      try {
        if (qSender && qReceiver) {
          setAddressData(prev => ({
            ...prev,
            // sender: JSON.parse(qSender),
            receiver: JSON.parse(qReceiver),
          }));
        }
        // if (qItems) {
        //   setItemsData(JSON.parse(qItems));
        // }
        if (qCourier) {
          const parsedCourier = JSON.parse(qCourier);
          setQuoteData(parsedCourier);
          setCourierData({
            courier: parsedCourier.courier?.carrier_id,
            product_id: parsedCourier.courier?.product_id,
            product_type: parsedCourier.courier?.product_type,
            shipment_summary: parsedCourier.courier?.shipment_summary,
          });
        }
      } catch (e) {
        console.error("Failed to parse quote prefill from sessionStorage:", e);
      }
      // finally {
      //   sessionStorage.removeItem('quote_sender');
      //   sessionStorage.removeItem('quote_receiver');
      //   sessionStorage.removeItem('quote_items');
      //   sessionStorage.removeItem('quote_courier');
      // }
    }
    return () => {
      sessionStorage.removeItem('address')
      sessionStorage.removeItem('quote_sender')
      sessionStorage.removeItem('quote_receiver')
      // sessionStorage.removeItem('quote_items')
    }
  }, [setItemsData, setQuoteData, setCourierData]);

  const hasDefaultItemAndCourier = useMemo(() => Boolean(default_courier) && Boolean(default_item), [default_courier, default_item]);

  const isSavingDraft = saveLoading && saveAction === 'draft';
  const isCreatingConsignment = (saveLoading && saveAction === 'consignment') || walletLoading;
  console.log(quoteData, "quoteData...")
  return {
    orderType,
    orderID,
    role,
    user,
    saveLoading,
    isSavingDraft,
    isCreatingConsignment,
    walletLoading,
    isOrderLoading,
    isDownloadingLabel,
    isCancelling,
    isConsigning,
    globalCouriers,
    orderDetail,
    isEditable,
    walletCheckOpen,
    setWalletCheckOpen,
    walletCheckData,
    quoteData,
    setQuoteData,
    courierData,
    setCourierData,
    addressData,
    setAddressData,
    manualOrderData,
    setManualOrderData,
    showCancelModal,
    setShowCancelModal,
    showArchiveModal,
    setShowArchiveModal,
    showItemCountModal,
    setShowItemCountModal,
    insuranceSelected,
    signatureSelected,
    orderDialogMode,
    setOrderDialogMode,
    deliveryInstructions,
    isEdit,
    termsAccepted,
    setTermsAccepted,
    ratesAccepted,
    setRatesAccepted,
    dangerousGoodsAccepted,
    setDangerousGoodsAccepted,
    selectedCustomer,
    setSelectedCustomer,
    itemsData,
    updateItem,
    fullUpdateItem,
    addItem,
    removeItem,
    handleAddressSubmit,
    onEditClick,
    handleOptionalFieldsChange,
    calculation,
    requiresManualLabel,
    handleOnSave,
    onCancelOrder,
    onArchiveOrder,
    handleConsign,
    downloadLabel,
    hasDefaultItemAndCourier,
    default_courier,
    default_item,
    showReceiverPhoneModal,
    setShowReceiverPhoneModal,
    receiverPhone,
    setReceiverPhone,
    handleReceiverPhoneSubmit,
  };
};
