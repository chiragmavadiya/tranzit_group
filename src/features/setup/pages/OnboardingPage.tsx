import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { logout, setNextStep } from '@/features/auth/authSlice';
// import { setCredentials } from '@/features/auth/authSlice';
import { useOnboarding } from '@/features/auth/hooks/useAuth';
import { FormInput, FormSelect } from '@/features/orders/components/OrderFormUI';
import { useAppDispatch, useAppSelector } from '@/hooks/store.hooks';
import { AlertCircle, Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const STREET_TYPES = [
  { label: "Street", value: "St" },
  { label: "Road", value: "Rd" },
  { label: "Avenue", value: "Ave" },
  { label: "Close", value: "Cl" },
  { label: "Drive", value: "Dr" },
  { label: "Highway", value: "Hwy" },
];

const STATES = [
  { label: "New South Wales", value: "NSW" },
  { label: "Victoria", value: "VIC" },
  { label: "Queensland", value: "QLD" },
  { label: "Western Australia", value: "WA" },
  { label: "South Australia", value: "SA" },
  { label: "Tasmania", value: "TAS" },
  { label: "Northern Territory", value: "NT" },
  { label: "Australian Capital Territory", value: "ACT" },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const onboardingMutation = useOnboarding();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    // Account
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    mobile: "0412345678",
    email: user?.email || "",
    // Business
    business_name: "Test Business",
    gst_number: "123456789",
    order_prefix: "TRZ",
    // Address
    address: "Test",
    unit_number: "Test",
    street_number: "123",
    street_name: "Test",
    street_type: "St",
    suburb: "Test",
    state: "NSW",
    postcode: "2000",
    hasBillingAddress: true, // Changed from use_for_billing to match API logic
    // Billing Address
    billing_address: "Test Billing Address",
    billing_unit_number: "Test",
    billing_street_number: "123",
    billing_street_name: "Test",
    billing_street_type: "St",
    billing_suburb: "Test",
    billing_state: "NSW",
    billing_postcode: "2000",
    // Consents
    agree_privacy: true,
    accept_terms: true,
    product_updates: false,
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    // Basic required fields
    const requiredFields = [
      'first_name', 'last_name', 'mobile',
      'business_name', 'gst_number', 'order_prefix',
      'street_number', 'street_name', 'street_type', 'suburb', 'state', 'postcode'
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) return false;
    }

    // Mobile validation (10 digits)
    if (!/^\d{10}$/.test(formData.mobile.replace(/\s/g, ''))) return false;

    // Postcode validation (4 digits)
    if (!/^\d{4}$/.test(formData.postcode)) return false;

    // Billing fields validation if enabled
    if (formData.hasBillingAddress) {
      const billingRequired = [
        'billing_street_number', 'billing_street_name', 'billing_street_type',
        'billing_suburb', 'billing_state', 'billing_postcode'
      ];
      for (const field of billingRequired) {
        if (!formData[field as keyof typeof formData] || formData[field as keyof typeof formData] === "") return false;
      }
      if (!/^\d{4}$/.test(formData.billing_postcode)) return false;
    }

    if (!formData.agree_privacy || !formData.accept_terms) return false;

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!validateForm()) {
      if (!formData.agree_privacy || !formData.accept_terms) {
        toast.error("Please accept the Privacy Policy and Terms & Conditions");
      } else {
        toast.error("Please fill in all required fields correctly");
      }
      return;
    }

    onboardingMutation.mutate(formData, {
      onSuccess: (response) => {
        if (response.status) {
          dispatch(setNextStep(''));
          toast.success("Onboarding completed successfully!");
          navigate('/dashboard');
        } else {
          toast.error(response.message || "Failed to complete onboarding");
        }
      },
      onError: (error: any) => {
        toast.error(error.message || "An error occurred while saving your details");
      }
    });
  };

  return (
    <div className="flex flex-col flex-1 p-6 space-y-4 overflow-y-auto max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      {/* Banner */}
      <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 p-3 rounded-md flex items-center gap-3">
        <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
        <span className="text-xs text-red-600 dark:text-red-400 font-medium">
          To access the portal, please complete the onboarding form.
        </span>
      </div>

      <div className="space-y-1">
        <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-100">Onboard</h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400">Quick setup — takes about 2 mins.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pb-10">
        {/* Account Section */}
        <div className="space-y-4">
          <h2 className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest border-b border-slate-100 dark:border-zinc-800 pb-2">Account</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <FormInput
                label="First Name"
                required
                value={formData.first_name}
                onChange={(val) => handleChange('first_name', val)}
                placeholder="Your legal first name"
                error={isSubmitted && !formData.first_name}
                errormsg="First name is required"
              />
              <FormInput
                label="Mobile Number"
                required
                value={formData.mobile}
                onChange={(val) => handleChange('mobile', val)}
                placeholder="e.g. 0412 345 678"
                error={isSubmitted && !/^\d{10}$/.test(formData.mobile.replace(/\s/g, ''))}
                errormsg="Valid 10-digit mobile number required"
              />
            </div>
            <div className="space-y-4">
              <FormInput
                label="Last Name"
                required
                value={formData.last_name}
                onChange={(val) => handleChange('last_name', val)}
                error={isSubmitted && !formData.last_name}
                errormsg="Last name is required"
              />
              <FormInput
                label="Login Email Address"
                value={formData.email}
                onChange={(val) => handleChange('email', val)}
                disabled
                errormsg="Used to sign in."
              />
            </div>
          </div>
        </div>

        {/* Business Section */}
        <div className="space-y-4">
          <h2 className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest border-b border-slate-100 dark:border-zinc-800 pb-2">Business</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormInput
              label="Business Name"
              required
              value={formData.business_name}
              onChange={(val) => handleChange('business_name', val)}
              placeholder="e.g. Digisite Pty Ltd"
              error={isSubmitted && !formData.business_name}
              errormsg="Business name is required"
            />
            <FormInput
              label="GST Number"
              required
              value={formData.gst_number}
              onChange={(val) => handleChange('gst_number', val)}
              placeholder="ABN / GST"
              error={isSubmitted && !formData.gst_number}
              errormsg="GST number is required"
            />
            <FormInput
              label="Order Prefix"
              required
              value={formData.order_prefix}
              onChange={(val) => handleChange('order_prefix', val)}
              placeholder="e.g. TRZ"
              error={isSubmitted && !formData.order_prefix}
              errormsg="Order prefix is required"
            />
          </div>
        </div>

        {/* Address Section */}
        <div className="space-y-4">
          <h2 className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest border-b border-slate-100 dark:border-zinc-800 pb-2">Primary Address</h2>
          <div className="space-y-6">
            <div className="relative group">
              <Label className="text-[11px] font-extrabold text-slate-700 dark:text-zinc-400 uppercase tracking-wider ml-0.5 mb-1 block">Search Address</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Start typing your address..."
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="pl-10 h-8 text-sm border-slate-200 dark:border-zinc-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormInput
                label="Unit Number"
                value={formData.unit_number}
                onChange={(val) => handleChange('unit_number', val)}
                placeholder="Unit Number"
              />
              <FormInput
                label="Street Number"
                required
                value={formData.street_number}
                onChange={(val) => handleChange('street_number', val)}
                placeholder="Street Number"
                error={isSubmitted && !formData.street_number}
                errormsg="Required"
              />
              <FormInput
                label="Street Name"
                required
                value={formData.street_name}
                onChange={(val) => handleChange('street_name', val)}
                placeholder="Street Name"
                error={isSubmitted && !formData.street_name}
                errormsg="Required"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormSelect
                label="Street Type"
                required
                value={formData.street_type}
                onValueChange={(val) => handleChange('street_type', val)}
                options={STREET_TYPES}
                placeholder="Select Type"
                error={isSubmitted && !formData.street_type}
                errormsg="Required"
              />
              <FormInput
                label="Suburb"
                required
                value={formData.suburb}
                onChange={(val) => handleChange('suburb', val)}
                placeholder="Suburb"
                error={!formData.suburb}
                errormsg="Required"
              />
              <FormSelect
                label="State"
                required
                value={formData.state}
                onValueChange={(val) => handleChange('state', val)}
                options={STATES}
                placeholder="Select State"
                error={isSubmitted && !formData.state}
                errormsg="Required"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormInput
                label="Post Code"
                required
                value={formData.postcode}
                onChange={(val) => handleChange('postcode', val)}
                placeholder="Post Code"
                error={isSubmitted && !/^\d{4}$/.test(formData.postcode)}
                errormsg="Valid 4-digit postcode required"
              />
            </div>

            <div className="flex items-center gap-3 bg-slate-50 dark:bg-zinc-900/50 p-4 rounded-md">
              <Checkbox
                id="hasBillingAddress"
                checked={formData.hasBillingAddress}
                onCheckedChange={(checked) => handleChange('hasBillingAddress', !!checked)}
              />
              <label htmlFor="hasBillingAddress" className="text-[13px] font-medium text-slate-700 dark:text-zinc-300 cursor-pointer">
                I have a different address for billing
              </label>
            </div>
          </div>
        </div>

        {/* Billing Address Section */}
        {formData.hasBillingAddress && (
          <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
            <h2 className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest border-b border-slate-100 dark:border-zinc-800 pb-2">Billing Address</h2>
            <div className="space-y-6">
              <div className="relative group">
                <Label className="text-[11px] font-extrabold text-slate-700 dark:text-zinc-400 uppercase tracking-wider ml-0.5 mb-1 block">Search Billing Address</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Start typing billing address..."
                    value={formData.billing_address}
                    onChange={(e) => handleChange('billing_address', e.target.value)}
                    className="pl-10 h-8 text-sm border-slate-200 dark:border-zinc-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormInput
                  label="Unit Number"
                  value={formData.billing_unit_number}
                  onChange={(val) => handleChange('billing_unit_number', val)}
                />
                <FormInput
                  label="Street Number"
                  required
                  value={formData.billing_street_number}
                  onChange={(val) => handleChange('billing_street_number', val)}
                  error={isSubmitted && formData.hasBillingAddress && !formData.billing_street_number}
                  errormsg="Required"
                />
                <FormInput
                  label="Street Name"
                  required
                  value={formData.billing_street_name}
                  onChange={(val) => handleChange('billing_street_name', val)}
                  error={isSubmitted && formData.hasBillingAddress && !formData.billing_street_name}
                  errormsg="Required"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormSelect
                  label="Street Type"
                  required
                  value={formData.billing_street_type}
                  onValueChange={(val) => handleChange('billing_street_type', val)}
                  options={STREET_TYPES}
                  error={isSubmitted && formData.hasBillingAddress && !formData.billing_street_type}
                  errormsg="Required"
                />
                <FormInput
                  label="Suburb"
                  required
                  value={formData.billing_suburb}
                  onChange={(val) => handleChange('billing_suburb', val)}
                  error={isSubmitted && formData.hasBillingAddress && !formData.billing_suburb}
                  errormsg="Required"
                />
                <FormSelect
                  label="State"
                  required
                  value={formData.billing_state}
                  onValueChange={(val) => handleChange('billing_state', val)}
                  options={STATES}
                  error={isSubmitted && formData.hasBillingAddress && !formData.billing_state}
                  errormsg="Required"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormInput
                  label="Post Code"
                  required
                  value={formData.billing_postcode}
                  onChange={(val) => handleChange('billing_postcode', val)}
                  error={isSubmitted && formData.hasBillingAddress && !/^\d{4}$/.test(formData.billing_postcode)}
                  errormsg="Valid 4-digit postcode required"
                />
              </div>
            </div>
          </div>
        )}

        {/* Consents Section */}
        <div className="space-y-4">
          <h2 className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest border-b border-slate-100 dark:border-zinc-800 pb-2">Consents</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Checkbox
                id="agree_privacy"
                checked={formData.agree_privacy}
                onCheckedChange={(checked) => handleChange('agree_privacy', !!checked)}
              />
              <label htmlFor="agree_privacy" className="text-[13px] text-slate-600 dark:text-zinc-400">
                I agree to the <span className="font-bold text-slate-900 dark:text-zinc-200 underline cursor-pointer">Privacy Policy.</span>
              </label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="accept_terms"
                checked={formData.accept_terms}
                onCheckedChange={(checked) => handleChange('accept_terms', !!checked)}
              />
              <label htmlFor="accept_terms" className="text-[13px] text-slate-600 dark:text-zinc-400">
                I accept the <span className="font-bold text-slate-900 dark:text-zinc-200 underline cursor-pointer">Terms & Conditions.</span>
              </label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="product_updates"
                checked={formData.product_updates}
                onCheckedChange={(checked) => handleChange('product_updates', !!checked)}
              />
              <label htmlFor="product_updates" className="text-[13px] text-slate-600 dark:text-zinc-400">
                Send me product updates and news (optional).
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-zinc-800">
          <p className="text-[11px] text-slate-400 italic">You can edit these later in Profile.</p>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-8 text-xs font-bold uppercase tracking-wider rounded-md"
              onClick={() => {
                dispatch(logout());
                navigate('/signin');
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={onboardingMutation.isPending}
              className="h-8 px-6 bg-[#001D3D] hover:bg-[#001D3D]/90 text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-lg"
            >
              {onboardingMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

// Label component is now imported from @/components/ui/label
