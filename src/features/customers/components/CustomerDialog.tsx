import { useState, useEffect } from "react"
import {
  User,
  Truck,
  Building2,
  Phone,
  Mail,
  Receipt,
  Wallet,
  Box,
  Loader2
} from "lucide-react"
import { CustomModel } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { FormInput, FormSelect } from "@/features/orders/components/OrderFormUI"
import { STATES } from "../constants"
import { useCreateCustomer, useUpdateCustomer, useCustomerEditDetails } from "../hooks/useCustomers"
import { showToast } from "@/components/ui/custom-toast"
import { AutoComplete } from "@/components/common"
import { LOCATION_OPTIONS } from "@/constants"

interface CustomerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customerId?: string | number // If provided, we are in Edit mode
}

const STATE_OPTIONS = STATES.map(s => ({ label: s, value: s }));
const STREET_TYPES = [
  { label: "Street", value: "St" },
  { label: "Road", value: "Rd" },
  { label: "Avenue", value: "Ave" },
  { label: "Close", value: "Cl" },
  { label: "Drive", value: "Dr" },
  { label: "Highway", value: "Hwy" },
];

const INITIAL_FORM_DATA = {
  first_name: "",
  last_name: "",
  email: "",
  mobile: "",
  business_name: "",
  gst_number: "",
  billing_address: "",
  billing_street_name: "",
  billing_street_number: "",
  billing_street_type: "",
  billing_suburb: "",
  billing_state: "",
  billing_postcode: "",
  address: "",
  street_name: "",
  street_number: "",
  street_type: "",
  suburb: "",
  state: "",
  postcode: "",
  direct_freight_active: 0,
  direct_freight_markup_charge: 0,
  direct_freight_pickup_charge: 0,
  auspost_active: 0,
  auspost_markup_charge: 0,
  auspost_pickup_charge: 0,
  pallet_active: 0,
  pallet_markup_charge: 0,
  pallet_pickup_charge: 0,
  topup_enable: false,
  order_prefix: ""
};

export default function CustomerDialog({ open, onOpenChange, customerId }: CustomerDialogProps) {
  const isEdit = !!customerId
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)
  const [submited, setSubmited] = useState(false)
  // const [errors, setErrors] = useState<Record<string, string>>({})

  const { mutate: createCustomer, isPending: isCreating } = useCreateCustomer();
  const { mutate: updateCustomer, isPending: isUpdating } = useUpdateCustomer();
  const { data: editData, isLoading: isLoadingDetails } = useCustomerEditDetails(customerId || "");

  useEffect(() => {
    if (isEdit && editData?.data) {
      setFormData(editData.data);
    } else if (!isEdit && open) {
      setFormData(INITIAL_FORM_DATA);
      // setErrors({});
      setSubmited(false);
    }
  }, [isEdit, editData, open]);

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
      "billing_address",
      "billing_street_name",
      "billing_street_number",
      "billing_street_type",
      "billing_suburb",
      "billing_state",
      "billing_postcode",
      "address",
      "street_name",
      "street_number",
      "street_type",
      "suburb",
      "state",
      "postcode",
    ];

    return requiredFields.every(
      (field) => formData[field]?.toString().trim() !== ""
    );
  };

  const handleSubmit = () => {
    setSubmited(true)
    if (!validateForm()) {
      return;
    }

    const mutation = isEdit ? updateCustomer : createCustomer;
    const variables = isEdit ? { id: customerId!, data: formData as any } : (formData as any);

    mutation(variables, {
      onSuccess: () => {
        onOpenChange(false)
        showToast(isEdit ? "Customer updated successfully!" : "Customer added successfully!")
      },
      onError: (error: any) => {
        if (error?.response?.data?.errors) {
          const beErrors = error.response.data.errors;
          const formattedErrors: Record<string, string> = {};
          Object.keys(beErrors).forEach(key => {
            showToast(beErrors[key][0], "error");
            formattedErrors[key] = beErrors[key][0];
          });
          console.log(formattedErrors, 'formattedErrors')
          // setErrors(formattedErrors);
          // if (formattedErrors.email || formattedErrors.order_prefix) {
          //   setCurrentStep(0);
          // }
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
      contentClass="min-w-2xl overflow-y-auto no-scrollbar"
      submitText={isEdit ? "Update Customer" : "Add Customer"}
    >
      {/* <DialogContent className="sm:max-w-2xl gap-0 overflow-hidden bg-white dark:bg-zinc-950 border-none shadow-2xl">
        <DialogHeader className="px-6 pt-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
              {isEdit ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">{isEdit ? "Update Customer" : "Add New Customer"}</DialogTitle>
              <p className="text-xs text-muted-foreground mt-1">
                {isEdit ? "Update the customer profile details." : "Fill in the details to onboard a new customer."}
              </p>
            </div>
          </div>
        </DialogHeader> */}

      <div className="px-4 py-2 max-h-[60vh] overflow-y-auto  space-y-8">
        {isLoadingDetails && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-zinc-900/60 backdrop-blur-[1px]">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Loading customer details...</p>
            </div>
          </div>
        )}
        <div className="grid grid-cols-12 gap-x-5 gap-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
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
            label="GST Number"
            icon={Receipt}
            placeholder="ABN / GST"
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

        {/* Billing Address */}
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="">
            <div className="flex items-center gap-2 border-b border-slate-50 dark:border-zinc-900 mb-4">
              <Receipt className="w-4 h-4 text-blue-600" />
              <h3 className="my-0 text-sm font-bold text-slate-900 dark:text-zinc-100">Billing Address</h3>
            </div>
            <div className="grid grid-cols-12 gap-x-4 gap-y-4">
              {/* <FormInput
                label="Full Address"
                placeholder="Start typing address..."
                isFullWidth
                value={formData.billing_address}
                onChange={(val) => handleChange("billing_address", val)}
                required
                error={submited && !formData.billing_address?.trim()}
                errormsg="Please enter billing address"
              /> */}
              <div className="col-span-12">
                <AutoComplete
                  label='Address Information'
                  placeholder="Start typing suburb or postcode..."
                  options={LOCATION_OPTIONS}
                  onSelect={(val) => {
                    const opt = LOCATION_OPTIONS.find(o => o.value === val);

                    if (opt) {
                      handleChange('billing_address', opt.label);
                      handleChange('billing_suburb', opt.suburb);
                      handleChange('billing_state', opt.state);
                      handleChange('billing_street_number', opt.streetNumber);
                      handleChange('billing_street_name', opt.streetName);
                      handleChange('billing_street_type', opt.streetType);
                      handleChange('billing_postcode', opt.postcode);
                      // handleChange('country', opt.country);
                    }
                  }}
                  className="[&>div>input]:h-10 [&>div>input]:text-[13px]"
                  required
                  error={submited && formData.billing_address?.trim() === ''}
                  errormsg="Please enter your address"
                />
              </div>

              <FormInput
                label="Street Name"
                isHalf
                placeholder="Main St"
                value={formData.billing_street_name}
                onChange={(val) => handleChange("billing_street_name", val)}
                required
                error={submited && !formData.billing_street_name?.trim()}
                errormsg="Please enter street name"
              />
              <FormInput
                label="Street Number"
                isCompact
                placeholder="123"
                value={formData.billing_street_number}
                onChange={(val) => handleChange("billing_street_number", val)}
                required
                error={submited && !formData.billing_street_number?.trim()}
                errormsg="Please enter street number"
              />

              <FormSelect
                label="Type"
                isCompact
                options={STREET_TYPES}
                value={formData.billing_street_type}
                onValueChange={(val) => handleChange("billing_street_type", val)}
                required
                error={submited && !formData.billing_street_type?.trim()}
                errormsg="Please enter street type"
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
              />
              <FormSelect
                label="State"
                isCompact
                options={STATE_OPTIONS}
                value={formData.billing_state}
                onValueChange={(val) => handleChange("billing_state", val)}
                required
                error={submited && !formData.billing_state?.trim()}
                errormsg="Please enter state"
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
              />
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 border-b border-slate-50 dark:border-zinc-900 pb-2">
              <Truck className="w-4 h-4 text-emerald-600" />
              <h3 className="my-0 text-sm font-bold text-slate-900 dark:text-zinc-100">Shipping Address</h3>
            </div>
            <div className="grid grid-cols-12 gap-x-4 gap-y-4">
              {/* <FormInput
                label="Full Address"
                placeholder="Start typing address..."
                isFullWidth
                value={formData.address}
                onChange={(val) => handleChange("address", val)}
                required
                error={submited && !formData.address?.trim()}
                errormsg="Please enter shipping address"
              /> */}
              <div className="col-span-12">
                <AutoComplete
                  label='Address Information'
                  placeholder="Start typing suburb or postcode..."
                  options={LOCATION_OPTIONS}
                  onSelect={(val) => {
                    const opt = LOCATION_OPTIONS.find(o => o.value === val);

                    if (opt) {
                      handleChange('address', opt.label);
                      handleChange('suburb', opt.suburb);
                      handleChange('state', opt.state);
                      handleChange('street_number', opt.streetNumber);
                      handleChange('street_name', opt.streetName);
                      handleChange('street_type', opt.streetType);
                      handleChange('postcode', opt.postcode);
                      // handleChange('country', opt.country);
                    }
                  }}
                  className="[&>div>input]:h-10 [&>div>input]:text-[13px]"
                  required
                  error={submited && formData.address?.trim() === ''}
                  errormsg="Please enter shipping address"
                />
              </div>
              <FormInput
                label="Street #"
                isCompact
                placeholder="123"
                value={formData.street_number}
                onChange={(val) => handleChange("street_number", val)}
                required
                error={submited && !formData.street_number?.trim()}
                errormsg="Please enter street number"
              />
              <FormInput
                label="Street Name"
                isHalf
                placeholder="Main St"
                value={formData.street_name}
                onChange={(val) => handleChange("street_name", val)}
                required
                error={submited && !formData.street_name?.trim()}
                errormsg="Please enter street name"
              />
              <FormSelect
                label="Type"
                isCompact
                options={STREET_TYPES}
                value={formData.street_type}
                onValueChange={(val) => handleChange("street_type", val)}
                required
                error={submited && !formData.street_type?.trim()}
                errormsg="Please enter street type"
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
            </div>
          </div>
        </div>

        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 pb-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Direct Freight */}
            <div className="p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Truck className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold">Direct Freight Express</span>
                </div>
                <Switch
                  checked={formData.direct_freight_active === 1}
                  onCheckedChange={(checked) => handleChange("direct_freight_active", checked ? 1 : 0)}
                />
              </div>
              {formData.direct_freight_active === 1 && (
                <div className="grid grid-cols-12 gap-4 animate-in fade-in zoom-in-95 duration-200">
                  <FormInput
                    label="Markup Charge ($)"
                    isHalf
                    type="number"
                    value={formData.direct_freight_markup_charge?.toString()}
                    onChange={(val) => handleChange("direct_freight_markup_charge", parseInt(val) || 0)}
                  />
                  <FormInput
                    label="Pickup Charge ($)"
                    isHalf
                    type="number"
                    value={formData.direct_freight_pickup_charge?.toString()}
                    onChange={(val) => handleChange("direct_freight_pickup_charge", parseInt(val) || 0)}
                  />
                </div>
              )}
            </div>

            {/* AusPost */}
            <div className="p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold">Auspost Tranzit Group</span>
                </div>
                <Switch
                  checked={formData.auspost_active === 1}
                  onCheckedChange={(checked) => handleChange("auspost_active", checked ? 1 : 0)}
                />
              </div>
              {formData.auspost_active === 1 && (
                <div className="grid grid-cols-12 gap-4 animate-in fade-in zoom-in-95 duration-200">
                  <FormInput
                    label="Markup Charge ($)"
                    isHalf
                    type="number"
                    value={formData.auspost_markup_charge?.toString()}
                    onChange={(val) => handleChange("auspost_markup_charge", parseInt(val) || 0)}
                  />
                  <FormInput
                    label="Pickup Charge ($)"
                    isHalf
                    type="number"
                    value={formData.auspost_pickup_charge?.toString()}
                    onChange={(val) => handleChange("auspost_pickup_charge", parseInt(val) || 0)}
                  />
                </div>
              )}
            </div>

            {/* Pallet */}
            <div className="p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <Box className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold">Pallet Tranzit Group</span>
                </div>
                <Switch
                  checked={formData.pallet_active === 1}
                  onCheckedChange={(checked) => handleChange("pallet_active", checked ? 1 : 0)}
                />
              </div>
              {formData.pallet_active === 1 && (
                <div className="grid grid-cols-12 gap-4 animate-in fade-in zoom-in-95 duration-200">
                  <FormInput
                    label="Markup Charge ($)"
                    isHalf
                    type="number"
                    value={formData.pallet_markup_charge?.toString()}
                    onChange={(val) => handleChange("pallet_markup_charge", parseInt(val) || 0)}
                  />
                  <FormInput
                    label="Pickup Charge ($)"
                    isHalf
                    type="number"
                    value={formData.pallet_pickup_charge?.toString()}
                    onChange={(val) => handleChange("pallet_pickup_charge", parseInt(val) || 0)}
                  />
                </div>
              )}
            </div>

            {/* Account Settings */}
            <div className="p-4 rounded-2xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/30 dark:bg-blue-900/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-bold">Enable Wallet Top-up</span>
                  <p className="my-0 text-[10px] text-blue-600 dark:text-blue-400 font-medium">Allow customer to add funds to balance</p>
                </div>
              </div>
              <Switch
                checked={formData.topup_enable}
                onCheckedChange={(checked) => handleChange("topup_enable", checked)}
              />
            </div>
          </div>
        </div>
      </div>
    </CustomModel>
  )
}

