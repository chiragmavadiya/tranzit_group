import { useCallback, useMemo, useState, useEffect, useEffectEvent } from 'react';
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
} from './useOrders';
import { useGlobalCouriers } from '@/features/courier-surcharge/hooks/useGlobalCouriers';
import type { AddressData, WalletCheckResponse } from '../types';
import { useDefaultItem } from '@/features/items/hooks/useItems';

const initialAddressData = {
  name: '',
  email: '',
  phone: '',
  company: '',
  building: '',
  instructions: '',
  address: '',
  address1: '',
  street: '',
  suburb: '',
  state: '',
  city: '',
  unit_number: '',
  street_number: '',
  postcode: '',
  country: 'AUSTRALIA',
  saveToAddressBook: false,
}

export const useOrderWorkflow = () => {
  const { orderType, orderID } = useParams<{ orderType: string; orderID: string }>();
  const { role, user } = useAppSelector((state) => state.auth);
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
      console.log("Default item set....2")
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
      console.log("Default item set....")
      setDefaultItemData(defaultItem.data)
    }
  }, [defaultItem, setItemsData, orderType]);

  console.log(itemsData, 'itemsData')

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
          phone: user.office_number || '',
          company: user.company_name || '',
          address: user.addresses?.[0]?.address || '',
          address1: user.addresses?.[0]?.address || '',
          suburb: user.addresses?.[0]?.suburb || '',
          state: user.addresses?.[0]?.state || '',
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
      setAddressData({
        sender: {
          name: orderDetail.sender_details?.name || '',
          email: orderDetail.sender_details?.email || '',
          phone: orderDetail.sender_details?.mobile || '',
          company: orderDetail.sender_details?.company || '',
          building: orderDetail.sender_details?.address_detail?.building || '',
          instructions: orderDetail.sender_details?.address_detail?.instructions || '',
          address1: orderDetail.sender_details?.address_detail?.address_line || '',
          address: orderDetail.sender_details?.address || '',
          suburb: orderDetail.sender_details?.address_detail?.suburb || '',
          street: orderDetail.sender_details?.address_detail?.street || '',
          state: orderDetail.sender_details?.address_detail?.state || '',
          city: orderDetail.sender_details?.address_detail?.city || '',
          postcode: orderDetail.sender_details?.address_detail?.postcode || '',
          country: 'Australia',
          saveToAddressBook: false,
        },
        receiver: {
          name: orderDetail.receiver_details?.name || '',
          email: orderDetail.receiver_details?.email || '',
          phone: orderDetail.receiver_details?.mobile || '',
          company: orderDetail.receiver_details?.company || '',
          building: orderDetail.receiver_details?.address_detail?.building || '',
          instructions: orderDetail.receiver_details?.address_detail?.instructions || '',
          address1: orderDetail.receiver_details?.address_detail?.address_line || '',
          address: orderDetail.receiver_details?.address || '',
          suburb: orderDetail.receiver_details?.address_detail?.suburb || '',
          street: orderDetail.receiver_details?.address_detail?.street || '',
          state: orderDetail.receiver_details?.address_detail?.state || '',
          city: orderDetail.receiver_details?.address_detail?.city || '',
          postcode: orderDetail.receiver_details?.address_detail?.postcode || '',
          country: 'Australia',
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
      return acc + ((w * h * l) / 1000000) * q;
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

  // Order Submission/Saving Flow
  const handleOnSave = useCallback((skipWalletCheckArg?: any) => {
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

    if (!termsAccepted || !ratesAccepted) {
      showToast('You must accept all Terms & Conditions and Futile Pickup declarations.', 'error');
      return;
    }

    if (!dangerousGoodsAccepted) {
      showToast("Please confirm that this consignment does not contain dangerous goods", 'error');
      return;
    }

    if (calculation.totalItems > 4 && skipWalletCheckArg !== 'skipItemCountCheck' && skipWalletCheckArg !== true) {
      setShowItemCountModal(true);
      return;
    }

    const payload: any = {
      ...addressData,
      parcels: itemsData,
      service: {
        ...courierData,
        cover_limited_liability: insuranceSelected ? 1 : 0,
        signature_required: signatureSelected ? 1 : 0,
      },
      surcharges: [],
      delivery_instructions: deliveryInstructions,
      terms_and_conditions: termsAccepted,
      totals: {
        subtotal: quoteData?.courier?.base || 0,
        gst: quoteData?.courier?.gst || 0,
        total: quoteData?.courier?.price || 0,
        freight_levy: quoteData?.courier?.freight_levy || 0,
      },
      capture: role === 'admin' || (walletCheckData?.wallet_balance ?? 0) > calculation.grandTotal,
      save_address: addressData?.receiver?.saveToAddressBook ? 1 : 0,
      customer_id: selectedCustomer || undefined,
      ...(orderType === 'create-menual' ? {
        tracking_number: manualOrderData.trackingNumber,
        courier_id: manualOrderData.courierId,
        amount: manualOrderData.amount,
      } : {}),
    };

    const executeCreateOrder = () => {
      createOrder(payload, {
        onSuccess: (response) => {
          if (response.status) {
            showToast('Orders Created successfully', 'success');
            navigate(`${role === 'admin' ? '/admin' : ''}/orders/view/${response.order_number}`);
            setWalletCheckOpen(false);
            if (response.order_number) {
              printLabel(response.order_number);
            }
          } else {
            showToast(response.message || 'Failed to create orders', 'error');
          }
        },
        onError: (err: any) => {
          showToast(err?.response?.data?.message || 'Failed to create orders', 'error');
        },
      });
    };

    if (skipWalletCheckArg === true || role === 'admin') {
      executeCreateOrder();
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
  }, [itemsData, addressData, role, selectedCustomer, termsAccepted, ratesAccepted, dangerousGoodsAccepted, calculation.totalItems, calculation.grandTotal, courierData, insuranceSelected, signatureSelected, deliveryInstructions, quoteData?.courier?.base, quoteData?.courier?.gst, quoteData?.courier?.price, quoteData?.courier?.freight_levy, walletCheckData?.wallet_balance, orderType, manualOrderData.trackingNumber, manualOrderData.courierId, manualOrderData.amount, checkWallet, createOrder, navigate, printLabel]);

  // Order Cancellation Flow
  const onCancelOrder = useCallback((manual: boolean = false) => {
    if (orderID) {
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

  // Order Consignment Flow
  const handleConsign = useCallback(() => {
    if (!termsAccepted || !ratesAccepted || !dangerousGoodsAccepted) {
      showToast('You must accept all Terms & Conditions, Dangerous Goods, and Futile Pickup declarations.', 'error');
      return;
    }

    const payload = {
      customer_id: selectedCustomer || orderDetail?.sender_details?.customer_id,
      sender: {
        name: addressData.sender.name,
        company: addressData.sender.company,
        phone: addressData.sender.phone,
        email: addressData.sender.email,
        address1: addressData.sender.address1,
        suburb: addressData.sender.suburb,
        state: addressData.sender.state,
        postcode: addressData.sender.postcode,
        country: addressData.sender.country || 'AU',
      },
      receiver: {
        name: addressData.receiver.name,
        company: addressData.receiver.company,
        phone: addressData.receiver.phone,
        email: addressData.receiver.email,
        address1: addressData.receiver.address1,
        suburb: addressData.receiver.suburb,
        state: addressData.receiver.state,
        postcode: addressData.receiver.postcode,
        country: addressData.receiver.country || 'AU',
      },
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
      surcharges: [],
      delivery_instructions: deliveryInstructions,
      terms_and_conditions: termsAccepted,
      totals: {
        subtotal: quoteData?.courier?.base || calculation.servicePrice,
        gst: quoteData?.courier?.gst || calculation.gst,
        total: quoteData?.courier?.price || calculation.grandTotal,
      },
      capture: true,
      ...(orderType === 'create-menual' ? {
        tracking_number: manualOrderData.trackingNumber,
        courier_id: manualOrderData.courierId,
        amount: manualOrderData.amount,
      } : {}),
    };

    if (orderID) {
      consignOrder(
        { orderId: orderID, data: payload },
        {
          onSuccess: () => {
            showToast('Order consigned successfully', 'success');
            navigate(`${role === 'admin' ? '/admin' : ''}/orders/view/${orderID}`);
          },
          onError: (err: any) => {
            showToast(err?.response?.data?.message || 'Failed to consign order', 'error');
          },
        }
      );
    }
  }, [
    termsAccepted,
    ratesAccepted,
    dangerousGoodsAccepted,
    selectedCustomer,
    orderDetail?.sender_details?.customer_id,
    addressData.sender,
    addressData.receiver,
    itemsData,
    courierData,
    insuranceSelected,
    signatureSelected,
    deliveryInstructions,
    quoteData?.courier,
    calculation,
    orderType,
    manualOrderData,
    orderID,
    consignOrder,
    navigate,
    role,
  ]);

  useEffect(() => {
    const savedAddressStr = sessionStorage.getItem('address');
    if (savedAddressStr) {
      try {
        const savedAddr = JSON.parse(savedAddressStr);
        const splitAddress = savedAddr.address.split(',');
        setAddressData(prev => ({
          ...prev,
          receiver: {
            name: savedAddr.contact_person || '',
            email: savedAddr.email || '',
            phone: savedAddr.phone || '',
            company: savedAddr.company || '',
            building: savedAddr.building || '',
            instructions: savedAddr.instructions || '',
            address: savedAddr.address || '',
            address1: splitAddress[0] || '',
            street: savedAddr.street || '',
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
    const qItems = sessionStorage.getItem('quote_items');
    const qCourier = sessionStorage.getItem('quote_courier');

    if (qSender || qReceiver || qItems || qCourier) {
      try {
        if (qSender && qReceiver) {
          setAddressData(prev => ({
            ...prev,
            // sender: JSON.parse(qSender),
            receiver: JSON.parse(qReceiver),
          }));
        }
        if (qItems) {
          setItemsData(JSON.parse(qItems));
        }
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
      sessionStorage.removeItem('quote_items')
    }
  }, [setItemsData, setQuoteData, setCourierData]);

  return {
    orderType,
    orderID,
    role,
    user,
    saveLoading,
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
    handleConsign,
    downloadLabel,
  };
};
