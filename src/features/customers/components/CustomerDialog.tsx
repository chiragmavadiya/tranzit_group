import { useState, useEffect } from "react"
import {
  User,
  Truck,
  Building2,
  Phone,
  Mail,
  Receipt,
  Wallet,
  Loader2,
  DollarSign,
  Percent
} from "lucide-react"
import Favicon from '@/assets/favicon.png';
import { CustomModel } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { FormInput, FormSelect } from "@/features/orders/components/OrderFormUI"
import { STATES, WEIGHT_TIERS } from "../constants"
import { useCreateCustomer, useCustomerEditDetails, useUpdateCustomer } from "../hooks/useCustomers"
import { showToast } from "@/components/ui/custom-toast"
import { PlaceAutocomplete } from "@/components/common/AutoComplateAddress"
import { Checkbox } from "@/components/ui/checkbox"
import { cleanSpaces, isPhoneValid, cn } from "@/lib/utils";

interface CustomerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customerId?: string | number // If provided, we are in Edit mode
}

const STATE_OPTIONS = STATES.map(s => ({ label: s, value: s }));

const buildInitialCharges = () => {
  const couriers = ["AusPost", "DirectFreight", "CouriersPlease", "Pallet"]; //MyPostBusiness
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
  // mypostbusiness_active: 0,
  pallet_active: 0,
  topup_enable: false,
  order_prefix: "",
  markup_charges: buildInitialCharges(),
  pickup_charges: buildInitialCharges()
};

export default function CustomerDialog({ open, onOpenChange, customerId }: CustomerDialogProps) {
  const isEdit = !!customerId
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)
  const [submited, setSubmited] = useState(false)

  const { mutate: createCustomer, isPending: isCreating } = useCreateCustomer();
  const { mutate: updateCustomer, isPending: isUpdating } = useUpdateCustomer();
  const { data: editData, isLoading: isLoadingDetails } = useCustomerEditDetails(customerId || "");

  const [sameAsShipping, setSameAsShipping] = useState(false);

  const handleChargeChange = (
    type: 'markup' | 'pickup',
    courierName: string,
    key: string,
    value: number
  ) => {
    const fieldName = type === 'markup' ? 'markup_charges' : 'pickup_charges';
    setFormData((prev) => {
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
            <tr className="border-b border-slate-150 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 text-slate-500 dark:text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
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

      filteredData.markup_charges = mergedMarkupCharges;
      filteredData.pickup_charges = mergedPickupCharges;
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
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    const requiredFields: (keyof typeof formData)[] = [
      "first_name",
      "last_name",
      "email",
      "mobile",
      "business_name",
      "order_prefix",
      "billing_address_info",
      "billing_address",
      "billing_street_name",
      "billing_street_number",
      "billing_street_type",
      "billing_suburb",
      "billing_state",
      "billing_postcode",
      "billing_country",
      "address_info",
      "address",
      "street_name",
      "street_number",
      "street_type",
      "suburb",
      "state",
      "postcode",
      "country",
    ];

    if (formData.mobile && !isPhoneValid(formData.mobile)) {
      showToast("Please enter a valid phone number", "error");
      return false;
    }

    return requiredFields.every(
      (field) => formData[field]?.toString().trim() !== ""
    );
  };

  const handleSubmit = () => {
    setSubmited(true)
    if (!validateForm()) {
      return;
    }

    const payload = {
      ...formData,
      mobile: cleanSpaces(formData.mobile)
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
            error={submited && !formData.mobile?.trim()}
            errormsg="Please enter mobile number"
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
            isFullWidth
            required
            value={formData.order_prefix}
            onChange={(val) => handleChange("order_prefix", val)}
            error={submited && !formData.order_prefix?.trim()}
            errormsg="Please enter order prefix"
          />
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
                  error={submited && formData.address_info?.trim() === ''}
                  errormsg='Please enter your address'
                  value={formData.address_info}
                  required
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
                  error={submited && formData.billing_address_info?.trim() === ''}
                  errormsg='Please enter your billing address'
                  value={formData.billing_address_info}
                  required
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
          </div>
        </div>

        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 pb-4">
          {/* Courier Configuration Header */}
          <div className="border-b border-slate-100 dark:border-zinc-800 pb-3 pt-2">
            <h3 className="my-0 text-sm font-bold text-slate-800 dark:text-zinc-200">Courier Configuration</h3>
          </div>

          <div className="space-y-3">
            {(() => {
              const couriersList = [
                {
                  id: "direct_freight",
                  name: "Direct Freight Express",
                  activeKey: "direct_freight_active" as const,
                  logo: "https://api.tranzit.digisite.net/assets/img/couriers/direct-freight.png",
                  displayName: "Direct Freight Express",
                  courierKey: "DirectFreight"
                },
                {
                  id: "AusPost",
                  name: "Auspost Tranzit Group",
                  activeKey: "auspost_active" as const,
                  logo: "https://api.tranzit.digisite.net/assets/img/couriers/logo-auspost.png",
                  displayName: "Auspost Tranzit Group",
                  courierKey: "AusPost"
                },
                {
                  id: "couriersplease",
                  name: "Courier Please",
                  activeKey: "couriersplease_active" as const,
                  logo: "https://api.tranzit.digisite.net/assets/img/couriers/couriersplease.png",
                  displayName: "Courier Please",
                  courierKey: "CouriersPlease"
                },
                // {
                //   id: "mypostbusiness",
                //   name: "MyPost Business",
                //   activeKey: "mypostbusiness_active" as const,
                //   logo: "https://api.tranzit.digisite.net/assets/img/couriers/aus_post_logo_small.png",
                //   displayName: "MyPost Business",
                //   courierKey: "MyPostBusiness"
                // },
                {
                  // id: "pallet",
                  name: "Pallet Tranzit Group",
                  activeKey: "pallet_active" as const,
                  logo: Favicon,
                  displayName: "Pallet Tranzit Group",
                  courierKey: "Pallet"
                }
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
                      className="px-3 sm:px-4 py-2.5 flex items-center justify-between select-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-14 h-8 bg-slate-50 dark:bg-zinc-900 rounded-md p-1">
                          <img src={courier.logo} className="max-h-full max-w-full object-contain" alt={courier.name} />
                        </div>
                        <span className="text-sm font-bold text-slate-800 dark:text-zinc-200">{courier.displayName}</span>
                      </div>

                      <div className="flex items-center gap-3.5">
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
                                  pickup_charges: resetCharges(prev.pickup_charges)
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

