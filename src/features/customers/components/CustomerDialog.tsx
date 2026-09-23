import { useState, useEffect, useMemo } from "react"
import {
  User,
  Truck,
  Building2,
  Phone,
  Mail,
  Receipt,
  Tag,
  Wallet,
  Loader2,
  DollarSign,
  Percent
} from "lucide-react"
import Favicon from '@/assets/favicon.png';
import { CustomModel } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { CustomLabel, FormInput, FormSelect } from "@/features/orders/components/OrderFormUI"
import { SENDER_NAME_MAX_LENGTH } from "@/constants"
import { STATES, WEIGHT_TIERS } from "../constants"
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion"
import { useCreateCustomer, useCustomerEditDetails, useUpdateCustomer } from "../hooks/useCustomers"
import { useXeroContacts } from "@/features/xero/hooks/useXero"
import { showToast } from "@/components/ui/custom-toast"
import { PlaceAutocomplete } from "@/components/common/AutoComplateAddress"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils";
import { cleanSpaces, isPhoneValid, PHONE_ERROR_MESSAGE } from "@/lib/phone";
import { useValidateLocality } from "@/hooks/useValidateLocality";
import { LocalityWarning } from "@/components/common/LocalityWarning";
import directFreightLogo from "@/assets/coruiers_logo/direct-freight.png"
import auspostLogo from "@/assets/coruiers_logo/logo-auspost.png"
import courierspleaseLogo from "@/assets/coruiers_logo/couriersplease.png"
import aramexLogo from "@/assets/coruiers_logo/aramex.png"
import fedexLogo from "@/assets/coruiers_logo/fedex.png"
import tntLogo from "@/assets/coruiers_logo/TNT.webp"
// import tegLogo from "@/assets/coruiers_logo/team_gloabl_express.png"
import type { XeroContact } from "@/features/xero/types";

interface CustomerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customerId?: string | number // If provided, we are in Edit mode
}

const STATE_OPTIONS = STATES.map(s => ({ label: s, value: s }));

const buildInitialCharges = () => {
  const couriers = ["AusPost", "DirectFreight", "CouriersPlease", "Aramex", "Fedex", "TNT", "Pallet"]; //  "TEG",
  return couriers.map(courier => {
    const chargeObj: any = { courier };
    WEIGHT_TIERS.forEach(tier => {
      chargeObj[tier.key] = 0;
    });
    return chargeObj;
  });
};

const INITIAL_FORM_DATA = {
  first_name: "",
  last_name: "",
  email: "",
  mobile: "",
  business_name: "",
  sender_name: "",
  account_activation: false,
  display_business_name_on_label: false,
  gst_number: "",
  billing_address_info: "",
  billing_address: "",
  billing_unit_number: "",
  billing_street_name: "",
  billing_street_number: "",
  billing_street_type: "",
  billing_suburb: "",
  billing_state: "",
  billing_postcode: "",
  billing_country: "Australia",
  address_info: "",
  address: "",
  unit_number: "",
  street_number: "",
  street_name: "",
  street_type: "",
  suburb: "",
  state: "",
  postcode: "",
  country: "Australia",
  direct_freight_active: 0,
  auspost_active: 0,
  couriersplease_active: 0,
  aramex_active: 0,
  pallet_active: 0,
  fedex_active: 0,
  tnt_active: 0,
  teg_active: 0,
  direct_freight_min_margin: 0,
  auspost_min_margin: 0,
  couriersplease_min_margin: 0,
  aramex_min_margin: 0,
  pallet_min_margin: 0,
  fedex_min_margin: 0,
  tnt_min_margin: 0,
  teg_min_margin: 0,
  manual_order_direct_freight: false,
  manual_order_auspost: false,
  manual_order_couriersplease: false,
  manual_order_aramex: false,
  manual_order_pallet: false,
  manual_order_fedex: false,
  manual_order_tnt: false,
  manual_order_teg: false,
  topup_enable: false,
  order_prefix: "",
  xero_contact_id: "",
  markup_charges: buildInitialCharges(),
  pickup_charges: buildInitialCharges(),
  byo_courier_invoice_enable: false,
  byo_courier_pricing_tiers: [
    { min_labels: 0, max_labels: 25, price_per_label: 0 },
    { min_labels: 26, max_labels: 50, price_per_label: 0 },
    { min_labels: 51, max_labels: 100, price_per_label: 0 },
    { min_labels: 101, max_labels: 250, price_per_label: 0 },
    { min_labels: 251, max_labels: 1000, price_per_label: 0 },
    { min_labels: 1001, max_labels: null, price_per_label: 0 }
  ]
};

export default function CustomerDialog({ open, onOpenChange, customerId }: CustomerDialogProps) {
  const isEdit = !!customerId
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)
  const [submited, setSubmited] = useState(false)

  const { mutate: createCustomer, isPending: isCreating } = useCreateCustomer();
  const { mutate: updateCustomer, isPending: isUpdating } = useUpdateCustomer();
  const { data: editData, isLoading: isLoadingDetails } = useCustomerEditDetails(customerId || "");
  // The saved id, not the form value — the list must not refetch every time a contact is picked.
  const assignedXeroContactId = editData?.data?.xero_contact_id || undefined;
  const { contacts: xeroContacts, isConnected: isXeroConnected, isLoading: isLoadingXeroContacts } = useXeroContacts(
    open && !isLoadingDetails,
    assignedXeroContactId
  );

  const [sameAsShipping, setSameAsShipping] = useState(false);

  const shippingLocality = useValidateLocality(formData.suburb, formData.state, formData.postcode, formData.address);
  const billingLocality = useValidateLocality(formData.billing_suburb, formData.billing_state, formData.billing_postcode, formData.billing_address);
  // With "same as shipping" ticked the billing fields mirror the shipping ones,
  // so only the shipping warning is worth showing
  const billingLocalityError = sameAsShipping ? '' : billingLocality.error;
  const isLocalityPending = shippingLocality.isPending || (!sameAsShipping && billingLocality.isPending);

  const xeroContactOptions = useMemo(() => xeroContacts.map((contact: XeroContact) => {
    const name = [contact.FirstName, contact.LastName].filter(Boolean).join(" ").trim() || contact.Name;
    const label = name
      ? contact.EmailAddress ? `${name} (${contact.EmailAddress})` : name
      : contact.EmailAddress || contact.ContactID;
    return { value: contact.ContactID, label };
  }), [xeroContacts]);

  const handleChargeChange = (
    type: 'markup' | 'pickup',
    courierName: string,
    key: string,
    value: number
  ) => {
    const fieldName = type === 'markup' ? 'markup_charges' : 'pickup_charges';
    setFormData((prev: any) => {
      const arr = Array.isArray(prev[fieldName]) ? [...prev[fieldName]] : [];
      let index = arr.findIndex((item: any) => item.courier === courierName);
      if (index === -1) {
        const newObj: any = { courier: courierName };
        WEIGHT_TIERS.forEach(tier => {
          newObj[tier.key] = 0;
        });
        arr.push(newObj);
        index = arr.length - 1;
      }
      arr[index] = {
        ...arr[index],
        [key]: value
      };
      return {
        ...prev,
        [fieldName]: arr
      };
    });
  };

  const handlePricingTierChange = (index: number, value: number) => {
    setFormData((prev: any) => {
      const updatedTiers = [...prev.byo_courier_pricing_tiers];
      updatedTiers[index] = {
        ...updatedTiers[index],
        price_per_label: value
      };
      return {
        ...prev,
        byo_courier_pricing_tiers: updatedTiers
      };
    });
  };

  const getChargeValue = (
    type: 'markup' | 'pickup',
    courierName: string,
    key: string
  ): string => {
    const fieldName = type === 'markup' ? 'markup_charges' : 'pickup_charges';
    const arr = formData[fieldName] || [];
    const item = arr.find((item: any) => item.courier === courierName);
    return item ? (item[key] ?? 0).toString() : '0';
  };

  const renderChargeTable = (courierName: string) => {
    return (
      <div className="overflow-x-auto rounded-lg border border-slate-100 dark:border-zinc-800 bg-slate-50/30 dark:bg-zinc-950/20 mt-1">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-150 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 text-slate-500 dark:text-zinc-400 font-bold uppercase tracking-wide text-[10px]">
              <th className="py-2.5 px-4">Weight Tier</th>
              <th className="py-2.5 px-4 w-[220px]">Markup Charge (%)</th>
              <th className="py-2.5 px-4 w-[220px]">Pickup Charge ($)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50">
            {WEIGHT_TIERS.map((tier) => (
              <tr key={tier.key} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                <td className="py-2 px-4 text-xs font-semibold text-slate-700 dark:text-zinc-300">{tier.label}</td>
                <td className="py-1 px-4 max-w-[120px]">
                  <FormInput
                    isCompact
                    type="number"
                    step="0.01"
                    icon={Percent}
                    value={getChargeValue('markup', courierName, tier.key)}
                    onChange={(val) => handleChargeChange('markup', courierName, tier.key, Number(val) || 0)}
                  />
                </td>
                <td className="py-1 px-4 max-w-[120px]">
                  <FormInput
                    isCompact
                    icon={DollarSign}
                    type="number"
                    step="0.01"
                    value={getChargeValue('pickup', courierName, tier.key)}
                    onChange={(val) => handleChargeChange('pickup', courierName, tier.key, Number(val) || 0)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  useEffect(() => {
    if (isEdit && editData?.data) {
      const data = editData.data;
      let loadedMarkupCharges = INITIAL_FORM_DATA.markup_charges;
      if (data.markup_charges && Array.isArray(data.markup_charges) && data.markup_charges.length > 0) {
        loadedMarkupCharges = data.markup_charges;
      }

      let loadedPickupCharges = INITIAL_FORM_DATA.pickup_charges;
      if (data.pickup_charges && Array.isArray(data.pickup_charges) && data.pickup_charges.length > 0) {
        loadedPickupCharges = data.pickup_charges;
      }

      const filteredData: any = {};
      Object.keys(INITIAL_FORM_DATA).forEach((key) => {
        filteredData[key] = (data as any)[key] !== undefined ? (data as any)[key] : (INITIAL_FORM_DATA as any)[key];
        // Manual order flags go back to the API as true/false, whatever shape they arrive in.
        if (key.startsWith("manual_order_")) filteredData[key] = !!filteredData[key];
      });
      // Merge with INITIAL_FORM_DATA to ensure all 4 couriers are always present
      const mergedMarkupCharges = INITIAL_FORM_DATA.markup_charges.map((defItem: any) => {
        const loadedItem = loadedMarkupCharges.find((item: any) => item.courier === defItem.courier);
        return loadedItem ? { ...defItem, ...loadedItem } : defItem;
      });

      const mergedPickupCharges = INITIAL_FORM_DATA.pickup_charges.map((defItem: any) => {
        const loadedItem = loadedPickupCharges.find((item: any) => item.courier === defItem.courier);
        return loadedItem ? { ...defItem, ...loadedItem } : defItem;
      });

      // const firstCharge = mergedPickupCharges[0] || {};
      filteredData.byo_courier_invoice_enable = data.byo_courier_invoice_enable ?? false;
      // Arrives as a boolean or a 1/0 flag depending on the endpoint; the API wants true/false back.
      filteredData.account_activation = !!data.account_activation;

      if (data.byo_courier_pricing_tiers && Array.isArray(data.byo_courier_pricing_tiers) && data.byo_courier_pricing_tiers.length > 0) {
        filteredData.byo_courier_pricing_tiers = data.byo_courier_pricing_tiers;
      } else {
        filteredData.byo_courier_pricing_tiers = INITIAL_FORM_DATA.byo_courier_pricing_tiers;
      }

      filteredData.markup_charges = mergedMarkupCharges;
      filteredData.pickup_charges = mergedPickupCharges;
      filteredData.xero_contact_id = data.xero_contact_id ?? "";
      filteredData.country = "Australia";
      filteredData.billing_country = "Australia";

      setFormData(filteredData);
      const isSame =
        data.billing_address === data.address &&
        data.billing_street_name === data.street_name &&
        data.billing_street_number === data.street_number &&
        data.billing_street_type === data.street_type &&
        data.billing_suburb === data.suburb &&
        data.billing_state === data.state &&
        data.billing_postcode === data.postcode
      setSameAsShipping(isSame);
    } else if (!isEdit && open) {
      setFormData(INITIAL_FORM_DATA);
      setSubmited(false);
      setSameAsShipping(false);
    }
  }, [isEdit, editData, open]);

  useEffect(() => {
    if (sameAsShipping) {
      setFormData((prev) => ({
        ...prev,
        billing_address_info: prev.address_info,
        billing_address: prev.address,
        billing_unit_number: prev.unit_number,
        billing_street_name: prev.street_name,
        billing_street_number: prev.street_number,
        billing_street_type: prev.street_type,
        billing_suburb: prev.suburb,
        billing_state: prev.state,
        billing_postcode: prev.postcode,
        billing_country: (prev as any).country || "Australia",
      }));
    }
  }, [
    sameAsShipping,
    formData.address,
    formData.suburb,
    formData.state,
    formData.postcode,
    formData.country,
    formData.street_number,
    formData.street_name,
    formData.street_type,
    formData.unit_number,
    formData.address_info,
  ]);

  const handleChange = (field: string, value: any) => {
    if (field === "sender_name" && value && value.length > SENDER_NAME_MAX_LENGTH) {
      showToast(`Sender name cannot be longer than ${SENDER_NAME_MAX_LENGTH} characters`, "error");
      return
    }
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    const requiredFields: string[] = [
      "first_name",
      "last_name",
      "email",
      "mobile",
      "business_name",
      "order_prefix",
      // "billing_address_info",
      "billing_address",
      "billing_street_name",
      // "billing_street_number",
      // "billing_street_type",
      "billing_suburb",
      "billing_state",
      "billing_postcode",
      "billing_country",
      // "address_info",
      "address",
      "street_name",
      // "street_number",
      // "street_type",
      "suburb",
      "state",
      "postcode",
      "country"
    ];

    if (formData.mobile && !isPhoneValid(formData.mobile)) {
      showToast(PHONE_ERROR_MESSAGE, "error");
      return false;
    }

    const missingFields = requiredFields.filter(
      (field) => {
        const val = (formData as any)[field];
        return val === undefined || val === null || val.toString().trim() === "";
      }
    );

    if (missingFields.length > 0) {
      const fieldLabels: Record<string, string> = {
        first_name: "First Name",
        last_name: "Last Name",
        email: "Email",
        mobile: "Mobile",
        business_name: "Business Name",
        order_prefix: "Order Prefix",
        billing_address_info: "Billing Address Info",
        billing_address: "Billing Address",
        billing_street_name: "Billing Street Name",
        billing_street_type: "Billing Street Type",
        billing_suburb: "Billing Suburb",
        billing_state: "Billing State",
        billing_postcode: "Billing Postcode",
        billing_country: "Billing Country",
        address_info: "Address Info",
        address: "Address",
        street_name: "Street Name",
        street_type: "Street Type",
        suburb: "Suburb",
        state: "State",
        postcode: "Postcode",
        country: "Country",
      };

      const labels = missingFields.map((field) => fieldLabels[field] || String(field).replace(/_/g, ' '));
      if (labels.length <= 3) {
        showToast(`Please fill in the required fields: ${labels.join(', ')}`, "error");
      } else {
        showToast(`Please fill in the required fields: ${labels.slice(0, 3).join(', ')} and ${labels.length - 3} more`, "error");
      }
      return false;
    }

    // Keep the modal open on an invalid locality — the inline banner explains why
    if (shippingLocality.error || billingLocalityError) {
      return false;
    }

    if (isLocalityPending) {
      showToast("Validating address, please wait", "error");
      return false;
    }

    if (formData.byo_courier_invoice_enable) {
      const hasEmptyPrice = formData.byo_courier_pricing_tiers.some(
        (tier) => tier.price_per_label === undefined || tier.price_per_label === null || tier.price_per_label.toString().trim() === ""
      );
      if (hasEmptyPrice) {
        showToast("Please enter prices for all volume tiers", "error");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = () => {
    setSubmited(true)
    if (!validateForm()) {
      return;
    }

    const { account_activation, ...createFields } = formData;
    const payload = {
      // Activation is only managed on an existing customer, never set at creation.
      ...(isEdit ? { ...formData, account_activation: !!account_activation } : createFields),
      mobile: cleanSpaces(formData.mobile),
      byo_courier_invoice_enable: !!formData.byo_courier_invoice_enable,
      byo_courier_pricing_tiers: !formData.byo_courier_invoice_enable
        ? formData.byo_courier_pricing_tiers.map((tier: any) => ({
          ...tier,
          price_per_label: 0
        }))
        : formData.byo_courier_pricing_tiers
    };

    const mutation = isEdit ? updateCustomer : createCustomer;
    const variables = isEdit ? { id: customerId!, data: payload as any } : payload as any;

    mutation(variables, {
      onSuccess: () => {
        onOpenChange(false)
        showToast(isEdit ? "Customer updated successfully!" : "Customer added successfully!", 'success')
      },
      onError: (error: any) => {
        if (error?.response?.data?.errors) {
          const beErrors = error.response.data.errors;
          Object.keys(beErrors).forEach(key => {
            showToast(beErrors[key][0], "error");
          });
        } else {
          showToast(error.message || `Failed to ${isEdit ? 'update' : 'add'} customer. Please check the form.`, "error");
        }
      }
    });
  }

  const isPending = isCreating || isUpdating;

  return (
    <CustomModel
      title={isEdit ? "Update Customer" : "Add New Customer"}
      // description={isEdit ? "Update the customer profile details." : "Fill in the details to onboard a new customer."}
      onSubmit={handleSubmit}
      open={open}
      isLoading={isPending}
      onOpenChange={onOpenChange}
      contentClass="w-[95vw] sm:max-w-none md:w-full md:max-w-3xl md:min-w-[720px] lg:min-w-[850px] lg:max-w-4xl"
      submitText={isEdit ? "Update Customer" : "Add Customer"}
    >
      <div className="px-1 sm:px-4 py-2 space-y-6 sm:space-y-8">
        {isLoadingDetails && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-zinc-900/60 backdrop-blur-[1px]">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Loading customer details...</p>
            </div>
          </div>
        )}
        <div className="grid grid-cols-12 gap-x-3 sm:gap-x-5 gap-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
          <FormInput
            label="First Name"
            icon={User}
            required
            placeholder="Enter first name"
            value={formData.first_name}
            onChange={(val) => handleChange("first_name", val)}
            error={submited && !formData.first_name.trim()}
            errormsg="Please enter first name"
          />
          <FormInput
            label="Last Name"
            required
            placeholder="Enter last name"
            value={formData.last_name}
            onChange={(val) => handleChange("last_name", val)}
            error={submited && !formData.last_name.trim()}
            errormsg="Please enter last name"
          />
          <FormInput
            label="Email Address"
            icon={Mail}
            type="email"
            required
            placeholder="name@company.com"
            value={formData.email}
            onChange={(val) => handleChange("email", val)}
            error={(submited && !formData.email?.trim())}
            errormsg={"Please enter email address"}
          />
          <FormInput
            label="Mobile Number"
            icon={Phone}
            required
            placeholder="0412 345 678"
            value={formData.mobile}
            onChange={(val) => handleChange("mobile", val)}
            error={submited && (!formData.mobile?.trim() || !isPhoneValid(formData.mobile))}
            errormsg={!formData.mobile?.trim() ? "Please enter mobile number" : PHONE_ERROR_MESSAGE}
          />
          <FormInput
            label="Business Name"
            icon={Building2}
            required
            placeholder="Legal business name"
            value={formData.business_name}
            onChange={(val) => handleChange("business_name", val)}
            error={submited && !formData.business_name?.trim()}
            errormsg="Please enter business name"
          />
          <FormInput
            label="ABN / ACN"
            icon={Receipt}
            placeholder="ABN / ACN"
            value={formData.gst_number}
            onChange={(val) => handleChange("gst_number", val)}
          />
          <FormInput
            label="Order Prefix"
            placeholder="e.g. TRZ-"
            required
            value={formData.order_prefix}
            onChange={(val) => handleChange("order_prefix", val)}
            error={submited && !formData.order_prefix?.trim()}
            errormsg="Please enter order prefix"
          />
          <FormSelect
            label="Xero Contact"
            placeholder={
              !isXeroConnected
                ? "Xero is not connected"
                : isLoadingXeroContacts
                  ? "Loading contacts..."
                  : xeroContactOptions.length === 0
                    ? "No Xero contacts found"
                    : "Select Xero contact"
            }
            options={xeroContactOptions}
            value={formData.xero_contact_id}
            onValueChange={(val) => handleChange("xero_contact_id", val || "")}
            disabled={!isXeroConnected || isLoadingXeroContacts}
          />
          {isEdit && (
            <div className="col-span-12 md:col-span-6">
              <CustomLabel label="Account Activation" />
              <div className="flex items-center gap-2 h-8">
                <Switch
                  checked={formData.account_activation}
                  onCheckedChange={(checked) => handleChange("account_activation", checked)}
                />
                <span className="text-sm text-slate-600 dark:text-zinc-400">
                  {formData.account_activation ? "Activated" : "Deactivated"}
                </span>
              </div>
              <p className="my-0 text-[11px] text-slate-400 dark:text-zinc-500">
                Allow this customer to access and use the Customer Portal.
              </p>
            </div>
          )}
        </div>

        {/* Label Details */}
        <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="flex items-center gap-2 border-b border-slate-50 dark:border-zinc-900 pb-2">
            <Tag className="w-4 h-4 text-emerald-600" />
            <h3 className="my-0 text-sm font-bold text-slate-900 dark:text-zinc-100">Label Details</h3>
          </div>
          <div className="grid grid-cols-12 gap-x-3 sm:gap-x-5 gap-y-4">
            {/* <FormInput
              label="Sender Name (Display on label)"
              icon={User}
              info='Printed on the label as the sender when "Display business name on label" is off.'
              placeholder="Sender name on label"
              value={formData.sender_name}
              onChange={(val) => handleChange("sender_name", val)}
            /> */}
            <div className="col-span-12 md:col-span-6">
              <CustomLabel label="Display business name on label" />
              <div className="flex items-center gap-2 h-8">
                <Switch
                  checked={formData.display_business_name_on_label}
                  onCheckedChange={(checked) => handleChange("display_business_name_on_label", checked)}
                />
                <span className="text-sm text-slate-600 dark:text-zinc-400">
                  {formData.display_business_name_on_label ? "Yes" : "No"}
                </span>
              </div>
              <p className="my-0 text-[11px] text-slate-400 dark:text-zinc-500">
                {formData.display_business_name_on_label
                  ? "The business name will print on the label."
                  : "The sender name will print on the label."}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
          {/* Shipping Address */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 border-b border-slate-50 dark:border-zinc-900 pb-2">
              <Truck className="w-4 h-4 text-emerald-600" />
              <h3 className="my-0 text-sm font-bold text-slate-900 dark:text-zinc-100">Shipping Address</h3>
            </div>
            <div className="grid grid-cols-12 gap-x-3 sm:gap-x-4 gap-y-4">
              <div className="col-span-12">
                <PlaceAutocomplete
                  label="Address Information"
                  onPlaceSelect={(opt) => {
                    handleChange('address_info', opt.formatted_address);
                    handleChange('address', opt.address1);
                    handleChange('unit_number', opt.unit_number);
                    handleChange('street_name', opt.street_name);
                    handleChange('street_number', opt.street_number);
                    handleChange('street_type', opt.street_type);
                    handleChange('suburb', opt.suburb);
                    handleChange('state', opt.state);
                    handleChange('country', opt.country);
                    handleChange('postcode', opt.post_code);
                  }}
                  onChange={(value) => handleChange('address_info', value)}
                  // error={submited && formData.address_info?.trim() === ''}
                  // errormsg='Please enter your address'
                  value={formData.address_info}
                // required
                />
              </div>
              <FormInput
                label="Unit Number"
                isHalf
                placeholder="Unit"
                value={formData.unit_number}
                onChange={(val) => handleChange("unit_number", val)}
              />
              <FormInput
                label="Street"
                isHalf
                placeholder="e.g. 123 Main St"
                value={formData.address}
                onChange={(val) => { handleChange("address", val); handleChange("street_name", val); }}
                required
                error={submited && !formData.address?.trim()}
                errormsg="Please enter street"
              />
              <FormInput
                label="Suburb"
                isCompact
                placeholder="Suburb"
                value={formData.suburb}
                onChange={(val) => handleChange("suburb", val)}
                required
                error={submited && !formData.suburb?.trim()}
                errormsg="Please enter suburb"
              />
              <FormSelect
                label="State"
                placeholder="Select State"
                isCompact
                options={STATE_OPTIONS}
                value={formData.state}
                onValueChange={(val) => handleChange("state", val)}
                required
                error={submited && !formData.state?.trim()}
                errormsg="Please enter state"
              />
              <FormInput
                label="Postcode"
                isCompact
                placeholder="3000"
                value={formData.postcode}
                onChange={(val) => handleChange("postcode", val)}
                required
                error={submited && !formData.postcode?.trim()}
                errormsg="Please enter postcode"
              />
              <FormInput
                label="Country"
                isCompact
                placeholder="Australia"
                value={formData.country}
                onChange={(val) => handleChange("country", val)}
                required
                error={submited && !formData.country?.trim()}
                errormsg="Please enter country"
              />
            </div>
            {shippingLocality.error && (
              <LocalityWarning
                message={shippingLocality.error}
                suggestions={shippingLocality.suggestions}
                onSelect={(suggestion) => {
                  handleChange('suburb', suggestion.suburb);
                  handleChange('state', suggestion.state);
                  handleChange('postcode', suggestion.postcode);
                }}
              />
            )}
          </div>

          {/* Billing address */}
          <div className="">
            <div className="flex items-center justify-between border-b border-slate-50 dark:border-zinc-900 mb-4 pb-2">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-primary" />
                <h3 className="my-0 text-sm font-bold text-slate-900 dark:text-zinc-100">Billing Address</h3>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="same_as_shipping"
                  checked={sameAsShipping}
                  onCheckedChange={(checked) => setSameAsShipping(!!checked)}
                />
                <label
                  htmlFor="same_as_shipping"
                  className="text-xs font-semibold text-slate-700 dark:text-zinc-400 cursor-pointer select-none"
                >
                  Use the above address as your billing address
                </label>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-x-3 sm:gap-x-4 gap-y-4">
              <div className="col-span-12">
                <PlaceAutocomplete
                  label="Address Information"
                  onPlaceSelect={(opt) => {
                    handleChange('billing_address_info', opt.formatted_address);
                    handleChange('billing_address', opt.address1);
                    handleChange('billing_unit_number', opt.unit_number);
                    handleChange('billing_street_number', opt.street_number);
                    handleChange('billing_street_name', opt.street_name);
                    handleChange('billing_street_type', opt.street_type);
                    handleChange('billing_suburb', opt.suburb);
                    handleChange('billing_state', opt.state);
                    handleChange('billing_country', opt.country);
                    handleChange('billing_postcode', opt.post_code);
                  }}
                  onChange={(value) => handleChange('billing_address_info', value)}
                  // error={submited && formData.billing_address_info?.trim() === ''}
                  // errormsg='Please enter your billing address'
                  value={formData.billing_address_info}
                  // required
                  disabled={sameAsShipping}
                />
              </div>

              <FormInput
                label="Unit Number"
                isHalf
                placeholder="e.g. 123"
                value={formData.billing_unit_number}
                onChange={(val) => handleChange("billing_unit_number", val)}
                disabled={sameAsShipping}
              />

              <FormInput
                label="Street"
                isHalf
                placeholder="e.g. 123 Main St"
                value={formData.billing_address}
                onChange={(val) => { handleChange("billing_address", val); handleChange("billing_street_name", val) }}
                required
                error={submited && !formData.billing_address?.trim()}
                errormsg="Please enter street"
                disabled={sameAsShipping}
              />
              <FormInput
                label="Suburb"
                isCompact
                placeholder="Suburb"
                value={formData.billing_suburb}
                onChange={(val) => handleChange("billing_suburb", val)}
                required
                error={submited && !formData.billing_suburb?.trim()}
                errormsg="Please enter suburb"
                disabled={sameAsShipping}
              />
              <FormSelect
                label="State"
                isCompact
                placeholder="Select State"
                options={STATE_OPTIONS}
                value={formData.billing_state}
                onValueChange={(val) => handleChange("billing_state", val)}
                required
                error={submited && !formData.billing_state?.trim()}
                errormsg="Please enter state"
                disabled={sameAsShipping}
              />
              <FormInput
                label="Postcode"
                isCompact
                placeholder="3000"
                value={formData.billing_postcode}
                onChange={(val) => handleChange("billing_postcode", val)}
                required
                error={submited && !formData.billing_postcode?.trim()}
                errormsg="Please enter postcode"
                disabled={sameAsShipping}
              />
              <FormInput
                label="Country"
                isCompact
                placeholder="Australia"
                value={formData.billing_country}
                onChange={(val) => handleChange("billing_country", val)}
                required
                error={submited && !formData.billing_country?.trim()}
                errormsg="Please enter country"
                disabled={sameAsShipping}
              />
            </div>
            {billingLocalityError && (
              <div className="mt-4">
                <LocalityWarning
                  message={billingLocalityError}
                  suggestions={billingLocality.suggestions}
                  onSelect={(suggestion) => {
                    handleChange('billing_suburb', suggestion.suburb);
                    handleChange('billing_state', suggestion.state);
                    handleChange('billing_postcode', suggestion.postcode);
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 pb-4">
          {/* Courier Configuration Header */}
          <div className="border-b border-slate-100 dark:border-zinc-800 pb-3 pt-2">
            <h3 className="my-0 text-sm font-bold text-slate-800 dark:text-zinc-200">Courier Configuration</h3>
          </div>

          <div className="border border-slate-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 overflow-hidden shadow-xs">
            <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-50/50 dark:bg-zinc-900/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-sm font-bold text-slate-800 dark:text-zinc-200">BYO Courier Volume-Based Tiered Fees</span>
                  <span className="block text-[10px] text-slate-500 font-medium">Configure flat weekly volume fees applied to Bring Your Own (BYO) courier accounts</span>
                </div>
              </div>
              <Switch
                checked={formData.byo_courier_invoice_enable}
                onCheckedChange={(checked) => {
                  handleChange("byo_courier_invoice_enable", checked);
                  if (!checked) {
                    setFormData((prev) => ({
                      ...prev,
                      byo_courier_pricing_tiers: prev.byo_courier_pricing_tiers.map((tier: any) => ({
                        ...tier,
                        price_per_label: 0,
                      })),
                    }));
                  }
                }}
              />
            </div>
            {formData.byo_courier_invoice_enable && (
              <div className="border-t border-slate-100 dark:border-zinc-800 p-3 sm:p-4 bg-white dark:bg-zinc-950 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {formData.byo_courier_pricing_tiers.map((tier, index) => {
                    const label = tier.max_labels !== null
                      ? `${tier.min_labels}-${tier.max_labels} Labels`
                      : `More Than ${tier.min_labels - 1} Labels`;
                    return (
                      <div key={index} className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400 capitalize">{label}</label>
                        <FormInput
                          isCompact
                          icon={DollarSign}
                          type="number"
                          step="0.01"
                          value={tier.price_per_label?.toString() || "0"}
                          onChange={(val) => handlePricingTierChange(index, Number(val) || 0)}
                          error={submited && (tier.price_per_label === undefined || tier.price_per_label === null || tier.price_per_label.toString().trim() === "")}
                          errormsg="Required"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {(() => {
              const couriersList = [
                {
                  id: "direct_freight",
                  name: "Direct Freight Express",
                  activeKey: "direct_freight_active" as const,
                  minMarginKey: "direct_freight_min_margin" as const,
                  manualOrderKey: "manual_order_direct_freight" as const,
                  logo: directFreightLogo,
                  displayName: "Direct Freight Express",
                  courierKey: "DirectFreight"
                },
                {
                  id: "AusPost",
                  name: "Auspost Tranzit Group",
                  activeKey: "auspost_active" as const,
                  minMarginKey: "auspost_min_margin" as const,
                  manualOrderKey: "manual_order_auspost" as const,
                  logo: auspostLogo,
                  displayName: "Auspost Tranzit Group",
                  courierKey: "AusPost"
                },
                {
                  id: "couriersplease",
                  name: "Courier Please",
                  activeKey: "couriersplease_active" as const,
                  minMarginKey: "couriersplease_min_margin" as const,
                  manualOrderKey: "manual_order_couriersplease" as const,
                  logo: courierspleaseLogo,
                  displayName: "Courier Please",
                  courierKey: "CouriersPlease"
                },
                {
                  id: "aramex",
                  name: "Aramex Tranzit Group",
                  activeKey: "aramex_active" as const,
                  minMarginKey: "aramex_min_margin" as const,
                  manualOrderKey: "manual_order_aramex" as const,
                  logo: aramexLogo,
                  displayName: "Aramex Tranzit Group",
                  courierKey: "Aramex"
                },

                {
                  id: "fedex",
                  name: "Fedex Tranzit Group",
                  activeKey: "fedex_active" as const,
                  minMarginKey: "fedex_min_margin" as const,
                  manualOrderKey: "manual_order_fedex" as const,
                  logo: fedexLogo,
                  displayName: "Fedex Tranzit Group",
                  courierKey: "Fedex"
                },
                {
                  id: "tnt",
                  name: "TNT Tranzit Group",
                  activeKey: "tnt_active" as const,
                  minMarginKey: "tnt_min_margin" as const,
                  manualOrderKey: "manual_order_tnt" as const,
                  logo: tntLogo,
                  displayName: "TNT Tranzit Group",
                  courierKey: "TNT"
                },
                // {
                //   id: "teg",
                //   name: "TEG Tranzit Group",
                //   activeKey: "teg_active" as const,
                //   minMarginKey: "teg_min_margin" as const,
                //   manualOrderKey: "manual_order_teg" as const,
                //   logo: tegLogo,
                //   displayName: "TEG Tranzit Group",
                //   courierKey: "TEG"
                // },
                {
                  id: "pallet",
                  name: "Pallet Tranzit Group",
                  activeKey: "pallet_active" as const,
                  minMarginKey: "pallet_min_margin" as const,
                  manualOrderKey: "manual_order_pallet" as const,
                  logo: Favicon,
                  displayName: "Pallet Tranzit Group",
                  courierKey: "Pallet"
                },
              ];

              return couriersList.map((courier) => {
                const isActive = formData[courier.activeKey] === 1;

                return (
                  <div
                    key={courier.id}
                    className={cn(
                      "rounded-xl border transition-all duration-200 overflow-hidden",
                      isActive
                        ? "border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/40 shadow-xs"
                        : "border-slate-100 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/10 opacity-70"
                    )}
                  >
                    {/* Header */}
                    <div
                      className="px-3 sm:px-4 py-2.5 flex flex-wrap items-center gap-x-3 gap-y-2.5 select-none"
                    >
                      <div className="order-1 flex flex-1 items-center gap-3 min-w-0">
                        <div className="flex items-center justify-center w-14 h-8 bg-slate-50 dark:bg-zinc-900 rounded-md p-1 shrink-0">
                          <img src={courier.logo} className="max-h-full max-w-full object-contain" alt={courier.name} />
                        </div>
                        <span className="text-sm font-bold text-slate-800 dark:text-zinc-200 truncate">{courier.displayName}</span>
                      </div>

                      {/* Settings drop to their own full-width row on mobile, stay inline from sm up */}
                      {isActive && (
                        <div className="order-3 flex w-full flex-col gap-2 sm:order-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3.5">
                          {/* Manual Order */}
                          <div className="flex items-center justify-between gap-2 sm:justify-start" onClick={(e) => e.stopPropagation()}>
                            <span className="text-xs font-semibold text-slate-600 dark:text-zinc-400 whitespace-nowrap">
                              Manual Order
                            </span>
                            <Switch
                              checked={!!formData[courier.manualOrderKey]}
                              onCheckedChange={(checked) => handleChange(courier.manualOrderKey, checked)}
                            />
                          </div>

                          <span className="hidden h-6 w-px bg-slate-200 dark:bg-zinc-800 sm:block" />

                          {/* Min Markup Charge Input */}
                          <div className="flex items-center justify-between gap-2 sm:justify-start" onClick={(e) => e.stopPropagation()}>
                            <span className="text-xs font-semibold text-slate-600 dark:text-zinc-400 whitespace-nowrap">
                              Min Markup Charge:
                            </span>
                            <div className="w-26 shrink-0">
                              <FormInput
                                type="number"
                                step="0.01"
                                icon={Percent}
                                value={formData[courier.minMarginKey]?.toString() || "0"}
                                onChange={(val) => handleChange(courier.minMarginKey, Number(val) || 0)}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="order-2 shrink-0 sm:order-3">
                        {/* Toggle Switch */}
                        <Switch
                          checked={isActive}
                          onCheckedChange={(checked) => {
                            const newActive = checked ? 1 : 0;
                            handleChange(courier.activeKey, newActive);
                            if (!checked) {
                              setFormData((prev) => {
                                const resetCharges = (chargesArr: any[]) => {
                                  const arr = Array.isArray(chargesArr) ? [...chargesArr] : [];
                                  const index = arr.findIndex((item: any) => item.courier === courier.courierKey);
                                  if (index !== -1) {
                                    const resetObj: any = { courier: courier.courierKey };
                                    WEIGHT_TIERS.forEach((tier) => {
                                      resetObj[tier.key] = 0;
                                    });
                                    arr[index] = resetObj;
                                  }
                                  return arr;
                                };
                                return {
                                  ...prev,
                                  markup_charges: resetCharges(prev.markup_charges),
                                  pickup_charges: resetCharges(prev.pickup_charges),
                                  [courier.minMarginKey]: 0,
                                  [courier.manualOrderKey]: false
                                };
                              });
                            }
                          }}
                        />
                      </div>
                    </div>

                    {/* Content (Expanded only when active) */}
                    {isActive && (
                      <div className="border-t border-slate-100 dark:border-zinc-800 p-3 sm:p-4 bg-white dark:bg-zinc-950 animate-in fade-in slide-in-from-top-2 duration-200">
                        {renderChargeTable(courier.courierKey)}
                      </div>
                    )}
                  </div>
                );
              });
            })()}
          </div>

          {/* Account Settings */}
          <div className="p-3 sm:p-4 rounded-xl border border-primary/20 dark:border-primary/50 bg-primary/5 dark:bg-primary/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-bold">Enable Wallet Top-up</span>
                <p className="my-0 text-[10px] text-primary font-medium">Allow customer to add funds to balance</p>
              </div>
            </div>
            <Switch
              checked={formData.topup_enable}
              onCheckedChange={(checked) => handleChange("topup_enable", checked)}
            />
          </div>
        </div>
      </div>
    </CustomModel>
  )
}

