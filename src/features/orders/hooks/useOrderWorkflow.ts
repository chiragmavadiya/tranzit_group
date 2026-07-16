import { useCallback, useMemo, useState, useEffect, useEffectEvent, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/store.hooks';
import { showToast } from '@/components/ui/custom-toast';
import { useOrderItems } from './useOrderItems';
import {
  useCreateOrder,
  useCreateManualOrder,
  useOrderDetails,
  useDownloadLabel,
  useWalletCheck,
  useCancelOrder,
  useConsignOrder,
  useArchiveOrder,
  useUpdateOrder,
  // useOrderDetailsForClone,
} from './useOrders';
import type { AddressData, OrderDetailData, WalletCheckResponse } from '../types';
import { useDefaultItem } from '@/features/items/hooks/useItems';
import { cleanSpaces, removeEmptyFields } from '@/lib/utils';
import { useCustomerMe } from '@/features/customers/hooks/useCustomers';
import { setCourierSettings } from '@/features/auth/authSlice';

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
  const [searchParams] = useSearchParams();
  const { role, user, default_courier, default_item, team_access } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const isSubUser = useMemo(() => (role === 'customer' && team_access?.is_sub_user), [role, team_access]);
  const canReadWrite = useMemo(() => !isSubUser || team_access?.permissions?.order === 'full', [isSubUser, team_access]);
  const dispatch = useAppDispatch();

  // API Hooks
  const { mutate: createOrder, isPending: saveLoading } = useCreateOrder();
  const { mutate: createManualOrder, isPending: manualSaveLoading } = useCreateManualOrder();
  const { mutate: updateOrder, isPending: updateLoading } = useUpdateOrder();
  const { mutate: checkWallet, isPending: walletLoading } = useWalletCheck();
  const { data: orderResponse, isLoading: isOrderLoading } = useOrderDetails(orderID || localStorage.getItem('order_to_clone') || '');
  const { mutate: downloadLabel, isPending: isDownloadingLabel } = useDownloadLabel(false);
  const { mutate: printLabel } = useDownloadLabel(true);
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder();
  const { mutate: consignOrder, isPending: isConsigning } = useConsignOrder(role === 'admin');
  const orderDetail = orderResponse?.data;
  const isEditable = orderType === 'create' || orderType === 'consign' || orderType === 'create-menual' || orderType === 'return';
  const isCreate = orderType === 'create' || orderType === 'create-menual' || orderType === 'return';

  const { data: defaultItem } = useDefaultItem(isCreate && (role !== 'admin') && !localStorage.getItem('order_to_clone'))
  // State Management
  const [walletCheckOpen, setWalletCheckOpen] = useState(false);
  const [walletCheckData, setWalletCheckData] = useState<WalletCheckResponse | null>(null);
  const [quoteData, setQuoteData] = useState<any>(null);
  const [courierData, setCourierData] = useState<any>(null);
  // const [isSaveAsDraft, setIsSaveAsDraft] = useState(false);
  const isSaveAsDraft = useRef(false);
  const skipItemCountCheckRef = useRef(false);
  const [saveAction, setSaveAction] = useState<'draft' | 'consignment' | null>(null);
  const [activeSettings, setActiveSettings] = useState<any>({})

  useEffect(() => {
    if (!saveLoading && !walletLoading && !updateLoading) {
      setSaveAction(null);
    }
  }, [saveLoading, walletLoading, updateLoading]);

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
    if (isCreate && !(localStorage.getItem('quote_receiver') || localStorage.getItem('order_to_clone')) && sessionStorage.getItem('address') === null) {
      if (orderType === 'return' && addressData.sender.address1 === '') {
        return 'sender';
      }
      if ((orderType !== 'return' && addressData.receiver.address1 === '')) {
        return 'receiver';
      }
    }
    if (searchParams.get("require_phone") === 'true') {
      return 'receiver';
    }
    return null;
  }, [addressData.receiver.address1, orderType, addressData.sender.address1, isCreate, searchParams]);

  const [insuranceSelected, setInsuranceSelected] = useState<boolean>(false);
  const [signatureSelected, setSignatureSelected] = useState<boolean>(false);
  const [orderDialogMode, setOrderDialogMode] = useState<'sender' | 'receiver' | null>(initialDialogMode);
  const [deliveryInstructions, setDeliveryInstructions] = useState<string>('');
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [ratesAccepted, setRatesAccepted] = useState(true);
  const [dangerousGoodsAccepted, setDangerousGoodsAccepted] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<number>();
  const { data: customerMeData } = useCustomerMe(role === 'admin' ? selectedCustomer : undefined);
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

  useEffect(() => {
    skipItemCountCheckRef.current = false;
  }, [itemsData]);

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
  const isValidItems = useEffectEvent(() => {
    return itemsData && itemsData.length > 0 && itemsData.some((item) =>
      (Number(item.height) > 0 || Number(item.width) > 0 || Number(item.length) > 0 || Number(item.weight) > 0)
    );
  })
  useEffect(() => {
    if (defaultItem && !isValidItems() && (orderType === 'create' || orderType === 'create-menual' || orderType === 'return') && !localStorage.getItem('quote_to_clone') && !localStorage.getItem('quote_items')) {
      setDefaultItemData(defaultItem.data)
    }
  }, [defaultItem, setItemsData, orderType]);



  useEffect(() => {
    if (!customerMeData) return;

    dispatch(setCourierSettings({
      courier_settings: customerMeData.courier
    }));
    if (!customerMeData || (orderType !== 'create' && orderType !== 'create-menual')) return;
    const addr = customerMeData.address_detail.default;
    setAddressData((prev) => ({
      ...prev,
      sender: {
        ...prev.sender,
        name: `${customerMeData.user.first_name || ''} ${customerMeData.user.last_name || ''}`.trim(),
        email: customerMeData.user.email || '',
        phone: customerMeData.user.office_number || customerMeData.user.personal_mobile || '',
        company: customerMeData.user.company_name || '',
        address_info: addr?.address_info || `${addr?.address}, ${addr?.suburb} ${addr?.state} ${addr?.postcode}` || '',
        address1: addr?.address || '',
        unit_number: addr?.unit_number || '',
        street_name: addr?.street_name || '',
        street_number: addr?.street_number || '',
        suburb: addr?.suburb || '',
        state: addr?.state || '',
        postcode: addr?.postcode || '',
        country: addr?.country || 'AU',
      },
    }));

    const anc = !isValidItems();
    if (customerMeData.default_item && anc) {
      setItemsData([{
        weight: Number(customerMeData.default_item?.item_weight) || 0,
        length: Number(customerMeData.default_item?.item_length) || 0,
        width: Number(customerMeData.default_item?.item_width) || 0,
        height: Number(customerMeData.default_item?.item_height) || 0,
        type: 'box',
        quantity: 1,
      }])
    }
  }, [customerMeData, dispatch, orderType, setItemsData]);

  const isValidConsignOrder = useCallback((orderStatus: string | undefined) => {
    if (orderStatus !== 'new' && orderType === 'consign') {
      navigate(`${role === 'admin' ? '/admin' : ''}/orders/view/${orderID}`);
    }
  }, [role, orderID, navigate, orderType]);

  // Sync user profile sender address (Create Mode)
  useEffect(() => {
    if (role === 'customer' && user && (orderType === 'create' || orderType === 'create-menual' || orderType === 'return') && !localStorage.getItem('order_to_clone')) {
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

  const setOrdesDetailData = useCallback((data: OrderDetailData) => {
    const senderDetail = data.sender_details;
    const receiverDetail = data.receiver_details;
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
    setItemsData(data.order_details?.items?.map((item) => ({
      type: item.type,
      quantity: item.quantity,
      weight: item.weight,
      length: item.length,
      width: item.width,
      height: item.height,
      description: item.description || '',
    })) || []);
    setDeliveryInstructions(data.delivery_instructions || '');
    setInsuranceSelected(data.limited_liability_cover?.covered || false);
    setSignatureSelected(data.signature_required === 'yes');
    setCourierData(data.courier_details);
    setQuoteData(data.order_details);
    isValidConsignOrder(data.order_status_category);
    setSelectedCustomer(data.customer_id)
  }, [isValidConsignOrder, setItemsData])

  // Sync existing order details (Edit/Consign Mode)
  useEffect(() => {
    if (orderDetail && (orderType !== 'create' || localStorage.getItem('order_to_clone')) && orderType !== 'create-menual') {
      setOrdesDetailData(orderDetail)
    }
  }, [isValidConsignOrder, orderDetail, orderType, setItemsData, setOrdesDetailData]);



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
    const gst = quoteData?.gst || quoteData?.tax || 0;
    const totalSurcharges = isEditable ? (quoteData?.totalSurcharges || 0) : orderDetail?.order_details?.surcharge_amount;
    const insuranceCost = insuranceSelected ? 6.0 : 0;
    const grandTotal = (quoteData?.totalPrice || quoteData?.total || 0) + (orderType === 'view' ? 0 : insuranceCost);
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
  }, [itemsData, quoteData, isEditable, orderDetail?.order_details?.surcharge_amount, insuranceSelected, orderType]);

  const requiresManualLabel = useMemo(() => {
    const noTrackingNumber = orderDetail?.need_add_tracking;
    return noTrackingNumber;
  }, [orderDetail?.need_add_tracking]);

  // Order Submission/Saving Flow
  const handleOnSave = useCallback((skipWalletCheckArg?: any, overrideReceiverPhone?: string) => {
    if (skipWalletCheckArg === 'skipItemCountCheck') {
      skipItemCountCheckRef.current = true;
    }
    if (orderType === 'create-menual') {
      if (role === 'admin' && !selectedCustomer) {
        showToast('Please select a customer.', 'error');
        return;
      }
      if (!manualOrderData.trackingNumber || !manualOrderData.courierId || !manualOrderData.amount) {
        showToast('Please fill out all manual order details.', 'error');
        return;
      }
      const isValidItems = itemsData && itemsData.length > 0 && itemsData.every((item) =>
        item.type !== 'box' ||
        (Number(item.height) > 0 && Number(item.width) > 0 && Number(item.length) > 0 && Number(item.weight) > 0 && Number(item.quantity) > 0)
      );
      const hasSenderAddress = Boolean(addressData?.sender?.address1);
      const hasReceiverAddress = Boolean(addressData?.receiver?.address1);

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

      setSaveAction('consignment');

      const manualPayload = {
        customer_id: Number(selectedCustomer),
        label_number: manualOrderData.trackingNumber,
        amount: Number(manualOrderData.amount),
        courier: Number(manualOrderData.courierId),
        sender: {
          name: addressData.sender.name,
          phone: cleanSpaces(addressData.sender.phone),
          email: addressData.sender.email,
          company: addressData.sender.company || '',
          address1: addressData.sender.address1 || '',
          unit_number: addressData.sender.unit_number || '',
          suburb: addressData.sender.suburb,
          state: addressData.sender.state,
          postcode: addressData.sender.postcode,
        },
        receiver: {
          name: addressData.receiver.name,
          phone: cleanSpaces(overrideReceiverPhone || addressData.receiver.phone),
          email: addressData.receiver.email,
          company: addressData.receiver.company || '',
          address1: addressData.receiver.address1 || '',
          unit_number: addressData.receiver.unit_number || '',
          suburb: addressData.receiver.suburb,
          state: addressData.receiver.state,
          postcode: addressData.receiver.postcode,
        },
        parcels: itemsData.map(p => ({
          type: p.type || 'box',
          quantity: Number(p.quantity) || 1,
          weight: Number(p.weight) || 0,
          length: Number(p.length) || 0,
          width: Number(p.width) || 0,
          height: Number(p.height) || 0,
        })),
      };

      createManualOrder(manualPayload, {
        onSuccess: (response) => {
          if (response.status || response.ok) {
            showToast('Manual order created successfully', 'success');
            // navigate(`${role === 'admin' ? '/admin' : ''}/orders`);
            navigate(`${role === 'admin' ? '/admin' : ''}/orders/view/${response?.data?.order_number}`);
            if (response?.data?.order_number) {
              printLabel(response?.data?.order_number);
            }
          } else {
            showToast(response.message || 'Failed to create manual order', 'error');
          }
        },
        onError: (err: any) => {
          if (err?.response?.data?.receiver_contact_required) {
            setShowReceiverPhoneModal(true);
            return;
          }
          showToast(err?.response?.data?.message || 'Failed to create manual order', 'error');
        },
      });
      return;
    }

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

    if (skipWalletCheckArg !== 'saveAsDraft' && (!isValidItems || !hasSenderAddress || !hasReceiverAddress)) {
      showToast('Please fill out item dimensions and complete both addresses.', 'error');
      return;
    }
    if (skipWalletCheckArg !== 'saveAsDraft' && !courierData?.courier) {
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
    // if any item have weight above 28kg then will show itemCount model
    if (quoteData?.courier?.courierCode === 'direct_freight_express_tranzit_group' && (itemsData.length >= 6 || itemsData?.some((item) => Number(item.quantity) >= 6) || itemsData?.some((item) => Number(item.weight) >= 28)) && skipWalletCheckArg !== true && skipWalletCheckArg !== 'skipItemCountCheck' && skipWalletCheckArg !== 'saveAsDraft' && !skipItemCountCheckRef.current) {
      setShowItemCountModal(true);
      return;
    }

    const action = skipWalletCheckArg === 'saveAsDraft' ? 'draft' : 'consignment';
    setSaveAction(action);

    const getCapture = () => {
      if (skipWalletCheckArg == 'saveAsDraft') return false;
      if ((walletCheckData?.wallet_balance ?? 0) > calculation.grandTotal) return true;
      if (role === 'admin') return true;
    }

    const formattedActiveSettings = Object.fromEntries(
      Object.entries(activeSettings || {}).map(([key, val]) => [
        key,
        typeof val === 'boolean' ? (val ? 1 : 0) : val
      ])
    );

    const payload: any = {
      ...addressData,
      receiver: {
        ...addressData.receiver,
        phone: cleanSpaces(overrideReceiverPhone || addressData.receiver.phone),
      },
      parcels: itemsData,
      service: {
        ...courierData,
        cover_limited_liability: insuranceSelected ? 1 : 0,
        ...formattedActiveSettings,
        signature_required: activeSettings?.signature_required ? 1 : 0,
      },
      surcharges: quoteData?.surcharges || [],
      delivery_instructions: deliveryInstructions,
      terms_and_conditions: termsAccepted,
      totals: {
        subtotal: quoteData?.courier?.base || 0,
        gst: quoteData?.gst || 0,
        extra_surcharge: calculation.totalSurcharges,
        total: calculation.grandTotal || 0,
        freight_levy: quoteData?.courier?.freight_levy || 0,
        markup_charge: quoteData?.courier?.markup_charge || 0,
        pickup_value: quoteData?.courier?.pickup_value || 0,
      },
      capture: getCapture(),
      order_type: orderDetail?.order_type,
      save_address: addressData?.receiver?.saveToAddressBook ? 1 : 0,
      customer_id: selectedCustomer || undefined,
      ...(orderType === 'create-menual' ? {
        tracking_number: manualOrderData.trackingNumber,
        courier_id: manualOrderData.courierId,
        amount: manualOrderData.amount,
      } : {}),
      is_own_courier: courierData.is_own_courier ? 1 : 0,
    };

    const executeCreateOrder = (is_own_courier?: boolean) => {
      if (orderID) {
        updateOrder({ orderId: orderID, data: { ...payload, is_own_courier } }, {
          onSuccess: (response) => {
            if (response.status || response.ok) {
              showToast('Orders updated successfully', 'success');
              if (skipWalletCheckArg === 'saveAsDraft') {
                navigate(`${role === 'admin' ? '/admin' : ''}/orders`);
              } else {
                navigate(`${role === 'admin' ? '/admin' : ''}/orders/${response?.data?.order_status_category !== 'new' ? 'view' : 'consign'}/${response?.data?.order_number}`);
              }
              setWalletCheckOpen(false);
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

      } else {

        createOrder({ ...payload, is_own_courier }, {
          onSuccess: (response) => {
            if (response.status || response.ok) {
              showToast('Orders Created successfully', 'success');
              if (skipWalletCheckArg === 'saveAsDraft') {
                navigate(`${role === 'admin' ? '/admin' : ''}/orders`);
              } else {
                navigate(`${role === 'admin' ? '/admin' : ''}/orders/${response?.data?.order_status_category !== 'new' ? 'view' : 'consign'}/${response?.data?.order_number}`);
              }
              setWalletCheckOpen(false);
              if (response?.data?.order_number && (response?.data?.order_status_category !== 'new') && !response?.data?.need_add_tracking) {
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
      }
    };

    if (skipWalletCheckArg === 'saveAsDraft' || skipWalletCheckArg === true || courierData?.is_own_courier) {
      executeCreateOrder(courierData?.is_own_courier);
      return;
    }

    checkWallet({ total: calculation.grandTotal, customer_id: selectedCustomer || '', role }, {
      onSuccess: (res) => {
        if (res.ok) {
          setWalletCheckData({ ...res, skipWalletCheckArg: true });
          setWalletCheckOpen(true);
        } else {
          executeCreateOrder();
        }
      },
      onError: () => {
        showToast('Failed to create orders', 'error');
      },
    });
  }, [orderType, itemsData, addressData, role, selectedCustomer, courierData, termsAccepted, ratesAccepted, dangerousGoodsAccepted, quoteData?.courier?.courierCode, quoteData?.courier?.base, quoteData?.courier?.freight_levy, quoteData?.courier?.markup_charge, quoteData?.courier?.pickup_value, quoteData?.surcharges, quoteData?.gst, activeSettings, insuranceSelected, deliveryInstructions, calculation.totalSurcharges, calculation.grandTotal, orderDetail?.order_type, manualOrderData.trackingNumber, manualOrderData.courierId, manualOrderData.amount, checkWallet, createManualOrder, navigate, printLabel, walletCheckData?.wallet_balance, orderID, updateOrder, createOrder]);

  // Order Consignment Flow
  const handleConsign = useCallback((skipWalletCheckArg?: any, overrideReceiverPhone?: string) => {
    if (skipWalletCheckArg === 'skipItemCountCheck') {
      skipItemCountCheckRef.current = true;
    }
    if (!termsAccepted || !ratesAccepted || !dangerousGoodsAccepted) {
      showToast('You must accept all Terms & Conditions, Dangerous Goods, and Futile Pickup declarations.', 'error');
      return;
    }

    if (quoteData?.courier?.courierCode === 'direct_freight_express_tranzit_group' && (itemsData.length >= 4 || itemsData?.some((item) => Number(item.quantity) >= 4) || itemsData?.some((item) => Number(item.weight) >= 28)) && skipWalletCheckArg !== true && skipWalletCheckArg !== 'skipItemCountCheck' && !skipItemCountCheckRef.current) {
      setShowItemCountModal(true);
      return;
    }

    const formattedActiveSettings = Object.fromEntries(
      Object.entries(activeSettings || {}).map(([key, val]) => [
        key,
        typeof val === 'boolean' ? (val ? 1 : 0) : val
      ])
    );

    const payload = {
      customer_id: selectedCustomer || orderDetail?.sender_details?.customer_id,
      sender: removeEmptyFields({
        name: addressData.sender.name,
        company: addressData.sender.company,
        phone: cleanSpaces(addressData.sender.phone),
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
        phone: cleanSpaces(overrideReceiverPhone || addressData.receiver.phone),
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
        ...formattedActiveSettings,
        signature_required: signatureSelected ? 1 : 0,
      },
      surcharges: quoteData?.surcharges || [],
      delivery_instructions: deliveryInstructions,
      terms_and_conditions: termsAccepted,
      order_type: orderDetail?.order_type,
      totals: {
        subtotal: quoteData?.courier?.base || calculation.servicePrice,
        gst: quoteData?.gst || calculation.gst,
        total: calculation.grandTotal,
        extra_surcharge: calculation.totalSurcharges,
        freight_levy: quoteData?.courier?.freight_levy || 0,
        markup_charge: quoteData?.courier?.markup_charge || 0,
        pickup_value: quoteData?.courier?.pickup_value || 0,
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

    if (skipWalletCheckArg === true || role === 'admin' || courierData?.is_own_courier) {
      executeConsign();
      return;
    }

    checkWallet({ total: calculation.grandTotal, customer_id: selectedCustomer || '', role }, {
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

  }, [termsAccepted, ratesAccepted, dangerousGoodsAccepted, quoteData?.courier?.courierCode, quoteData?.courier?.base, quoteData?.courier?.freight_levy, quoteData?.courier?.markup_charge, quoteData?.courier?.pickup_value, quoteData?.surcharges, quoteData?.gst, itemsData, activeSettings, selectedCustomer, orderDetail?.sender_details?.customer_id, orderDetail?.order_type, addressData.sender.name, addressData.sender.company, addressData.sender.phone, addressData.sender.email, addressData.sender.address1, addressData.sender.suburb, addressData.sender.state, addressData.sender.postcode, addressData.sender.country, addressData.receiver.name, addressData.receiver.company, addressData.receiver.phone, addressData.receiver.email, addressData.receiver.address1, addressData.receiver.suburb, addressData.receiver.state, addressData.receiver.postcode, addressData.receiver.country, courierData, insuranceSelected, signatureSelected, deliveryInstructions, calculation.servicePrice, calculation.gst, calculation.grandTotal, calculation.totalSurcharges, role, walletCheckData?.wallet_balance, orderType, manualOrderData.trackingNumber, manualOrderData.courierId, manualOrderData.amount, checkWallet, orderID, consignOrder, navigate, printLabel]);


  const handleReceiverPhoneSubmit = useCallback((phone: string) => {
    setAddressData((prev) => ({
      ...prev,
      receiver: {
        ...prev.receiver,
        phone: cleanSpaces(phone),
      },
    }));
    setShowReceiverPhoneModal(false);
    if (orderType === 'consign') {
      handleConsign(false, cleanSpaces(phone));
    } else {
      handleOnSave(isSaveAsDraft.current ? 'saveAsDraft' : true, cleanSpaces(phone));
    }
  }, [handleConsign, handleOnSave, orderType]);

  // Order Cancellation Flow
  const onCancelOrder = useCallback((manual: boolean = false) => {
    if (orderID) {
      cancelOrder(
        { orderId: orderID, data: { manually: typeof manual === 'boolean' ? manual : false } },
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

    const qSender = sessionStorage.getItem('quote_sender') || localStorage.getItem('quote_sender');
    const qReceiver = sessionStorage.getItem('quote_receiver') || localStorage.getItem('quote_receiver');
    const qItems = sessionStorage.getItem('quote_items') || localStorage.getItem('quote_items');
    const qCourier = sessionStorage.getItem('quote_courier') || localStorage.getItem('quote_courier');
    const qSigneture = localStorage.getItem('quote_signature')
    const qInsurance = localStorage.getItem('quote_insurance')
    const qDeliveryInstructions = localStorage.getItem('quote_delivery_instructions')
    setDeliveryInstructions(qDeliveryInstructions || '')

    if (qSender && qReceiver || qItems || qCourier) {
      try {
        if (qSender && qReceiver) {
          setAddressData(prev => ({
            ...prev,
            sender: JSON.parse(qSender),
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
        setSignatureSelected(qSigneture === 'true')
        setInsuranceSelected(qInsurance === 'true')
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
    setTimeout(() => {
      localStorage.removeItem('quote_items');
      localStorage.removeItem('quote_courier');
      localStorage.removeItem('quote_sender');
      localStorage.removeItem('quote_receiver');
      localStorage.removeItem('quote_signature');
      localStorage.removeItem('quote_insurance');
      localStorage.removeItem('order_to_clone');
      localStorage.removeItem('quote_delivery_instructions');
    }, 5000);
    return () => {
      sessionStorage.removeItem('address')
      sessionStorage.removeItem('quote_sender')
      sessionStorage.removeItem('quote_receiver')
      // localStorage.removeItem('quote_items');
      // localStorage.removeItem('quote_courier');
    }
  }, [setItemsData, setQuoteData, setCourierData]);

  useEffect(() => {
    document.title = orderType === 'create' || orderType === 'create-menual' ? "Create Order | Tranzit" : `Order ${orderID} | Tranzit`;
  }, [orderType, orderID])


  const hasDefaultItemAndCourier = useMemo(() => Boolean(default_courier) && Boolean(default_item), [default_courier, default_item]);

  const isSavingDraft = useMemo(() => (saveLoading || updateLoading) && saveAction === 'draft', [saveLoading, saveAction, updateLoading]);
  const isCreatingConsignment = useMemo(() => (saveLoading && saveAction === 'consignment') || walletLoading || manualSaveLoading, [saveLoading, saveAction, walletLoading, manualSaveLoading]);
  return {
    orderType,
    orderID,
    role,
    user,
    saveLoading: saveLoading || manualSaveLoading,
    isSavingDraft,
    isCreatingConsignment,
    walletLoading,
    isOrderLoading,
    isDownloadingLabel,
    isCancelling,
    isConsigning,
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
    // isCloning,
    canReadWrite,
    setDeliveryInstructions,
    setActiveSettings,
    activeSettings
  };
};
