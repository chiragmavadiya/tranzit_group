import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { logout, setNextStep } from '@/features/auth/authSlice';
import { useOnboarding, useLogout, useEmailVerify } from '@/features/auth/hooks/useAuth';
import { FormInput, FormSelect } from '@/features/orders/components/OrderFormUI';
import { useAppDispatch, useAppSelector } from '@/hooks/store.hooks';
import { AlertCircle, LogOut, Loader2, User, Building2, MapPin, CreditCard, ChevronDown } from 'lucide-react';
import { useEffect, useState, useEffectEvent } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import brandLogo from '@/assets/Tranzit_Logo.svg';
import { showToast } from '@/components/ui/custom-toast';
import { PlaceAutocomplete } from '@/components/common/AutoComplateAddress';
import { STATES, PRIVACY_POLICY_URL, TERMS_CONDITIONS_URL } from '@/constants';

const SectionHeader = ({ title, icon: Icon, children }: { title: string, icon: any, children?: React.ReactNode }) => (
  <div className="flex items-center justify-between pb-3 border-b border-slate-50 dark:border-zinc-800/50 mb-6">
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 uppercase tracking-widest my-0">{title}</h3>
    </div>
    {children}
  </div>
);

export default function OnboardingPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { customerId, token } = useParams();
  const [searchParams] = useSearchParams();

  const expires = searchParams.get('expires');
  const signature = searchParams.get('signature');

  const onboardingMutation = useOnboarding();
  const emailVerifyMutation = useEmailVerify();

  const logoutMutation = useLogout();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    // Account
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    mobile: "",
    email: user?.email || "",
    // Business
    business_name: "",
    gst_number: "",
    // Address
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
    hasBillingAddress: true,
    // Billing Address
    billing_address_info: "",
    billing_address: "",
    billing_unit_number: "",
    billing_street_number: "",
    billing_street_name: "",
    billing_street_type: "",
    billing_suburb: "",
    billing_state: "",
    billing_postcode: "",
    billing_country: "Australia",
    // Consents
    agree_privacy: false,
    accept_terms: false,
    product_updates: false,
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        localStorage.clear();
        dispatch(logout());
        navigate('/login');
      }
    });
  };

  const validateForm = () => {
    const requiredFields = [
      'first_name', 'last_name', 'mobile',
      'business_name', 'gst_number',
      'street_number', 'street_name', 'street_type', 'suburb', 'state', 'postcode'
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) return false;
    }

    if (!/^\d{10}$/.test(formData.mobile.replace(/\s/g, ''))) {
      showToast("Invalid mobile number", "error");
      return false;
    };
    if (!/^\d{4}$/.test(formData.postcode)) return false;

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

    // if (!formData.agree_privacy || !formData.accept_terms) return false;

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("HANDLE SUBMIT")
    e.preventDefault();
    setIsSubmitted(true);
    if (!validateForm()) {
      showToast("Please fill in all required fields correctly", "error");
      return
    }
    if (!formData.agree_privacy || !formData.accept_terms) {
      showToast("Please accept the Privacy Policy and Terms & Conditions", "error");
      return
    }
    const payload = { ...formData };
    if (!formData.hasBillingAddress) {
      payload.billing_address = formData.address;
      payload.billing_unit_number = formData.unit_number;
      payload.billing_street_number = formData.street_number;
      payload.billing_street_name = formData.street_name;
      payload.billing_street_type = formData.street_type;
      payload.billing_suburb = formData.suburb;
      payload.billing_state = formData.state;
      payload.billing_postcode = formData.postcode;
      // setFormData(payload);
    }

    onboardingMutation.mutate(payload, {
      onSuccess: (response) => {
        if (response.status) {
          dispatch(setNextStep(''));
          showToast("Onboarding completed successfully", "success");
          console.log("Redirect to order page")
          navigate('/orders');
        } else {
          showToast(response.message || "Failed to complete onboarding", "error");
        }
      },
      onError: (error: any) => {
        showToast(error.message || "An error occurred while saving your details", "error");
      }
    });
  };

  const verifyEmailApiCall = useEffectEvent(() => {
    if (customerId && token && expires && signature) {
      emailVerifyMutation.mutate({ customerId, token, expires, signature }, {
        onSuccess: (response) => {
          if (response.status) {
            showToast("Email verified successfully", "success");
            localStorage.setItem("auth_userID", JSON.stringify(response.user.id));
            localStorage.setItem("user_role", "customer");
            localStorage.setItem("auth_token", response.token);
            setFormData((prev) => {
              return {
                ...prev,
                email: response.user.email,
                first_name: response.user.first_name,
                last_name: response.user.last_name,
              }
            })
          } else {
            showToast(response.message || "Failed to verify email", "error");
          }
        },
        onError: (error: any) => {
          showToast(error.message || "An error occurred while verifying email", "error");
        }
      });
    }
  })
  useEffect(() => {
    if (user) {
      setFormData((prev) => {
        return {
          ...prev,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
        }
      })
    }
  }, [user])
  useEffect(() => {
    verifyEmailApiCall()
  }, [])


  return (
    <div className="h-screen bg-[#F8FAFC] dark:bg-zinc-950 flex flex-col overflow-hidden">
      <header className="h-16 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between px-8 sticky top-0 z-30 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-5">
          <img src={brandLogo} alt="Logo" className="h-9 w-auto" />
          <div className="h-7 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />
          <h2 className="text-xs font-black text-slate-800 dark:text-zinc-200 uppercase tracking-[0.15em] hidden sm:block my-0">Account Setup</h2>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant="ghost"
                className="h-10 px-2 sm:px-4 flex items-center gap-2 sm:gap-3 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all group rounded-xl"
              >
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-xs font-bold text-slate-900 dark:text-zinc-100">{formData.email}</span>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-500 font-medium">Customer Account</span>
                </div>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 transition-transform group-hover:scale-105 overflow-hidden">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 shadow-2xl z-50">
              <div className="p-3 mb-2 bg-slate-50 dark:bg-zinc-950/50 rounded-xl flex items-center gap-3 border border-slate-100 dark:border-zinc-800/50">
                <div className="h-10 w-10 rounded-full bg-primary uppercase flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20 flex-shrink-0">
                  {formData?.first_name?.[0]}{formData?.last_name?.[0]}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-slate-900 dark:text-zinc-100 truncate">{formData?.first_name} {formData?.last_name}</span>
                  <span className="text-xs text-slate-500 dark:text-zinc-500 truncate">{formData?.email}</span>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-slate-100 dark:bg-zinc-800" />
              <DropdownMenuItem
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="mt-1 flex items-center gap-3 p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl cursor-pointer font-bold group transition-colors focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-900/10"
              >
                <div className="h-8 w-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center transition-colors group-hover:bg-red-200 dark:group-hover:bg-red-900/50 group-focus:bg-red-200">
                  {logoutMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" strokeWidth={2.5} />}
                </div>
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-full sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl 2xl:max-w-400 mx-auto w-full p-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
            {/* Banner */}
            <div className="bg-primary/5 border border-primary/20 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-base text-slate-900 dark:text-zinc-100 font-bold">Complete your business profile</span>
                <span className="text-sm text-slate-500 dark:text-zinc-400">
                  Provide your details to unlock full access to our shipping platform and competitive rates.
                </span>
              </div>
            </div>

            {/* Row 1: Personal and Business Identity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Personal Information */}
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-lg shadow-slate-200/40 dark:shadow-none space-y-4">
                <SectionHeader title="Personal Information" icon={User} />

                <div className="grid grid-cols-12 gap-5">
                  <FormInput
                    isHalf
                    label="First Name"
                    placeholder="John"
                    value={formData.first_name}
                    onChange={(val) => handleChange('first_name', val)}
                    required
                    error={isSubmitted && formData.first_name?.trim() === ''}
                    errormsg="Please enter your first name"
                  />
                  <FormInput
                    isHalf
                    label="Last Name"
                    placeholder="Doe"
                    value={formData.last_name}
                    onChange={(val) => handleChange('last_name', val)}
                    required
                    error={isSubmitted && formData.last_name?.trim() === ''}
                    errormsg="Please enter your last name"
                  />
                </div>
                <div className="grid grid-cols-12 gap-5">
                  <div className="col-span-12 md:col-span-6">
                    <FormInput
                      label="Email Address"
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(val) => handleChange('email', val)}
                      required
                      disabled
                    />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <FormInput
                      label="Mobile Number"
                      placeholder="0412 345 678"
                      value={formData.mobile}
                      onChange={(val) => handleChange('mobile', val)}
                      required
                      error={isSubmitted && (formData.mobile?.trim() === '' || !/^\d{10}$/.test(formData.mobile.replace(/\s/g, '')))}
                      errormsg="Please enter a valid 10-digit mobile number"
                    />
                  </div>
                </div>
              </div>

              {/* Business Details */}
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-lg shadow-slate-200/40 dark:shadow-none space-y-4">
                <SectionHeader title="Business Details" icon={Building2} />
                <div className="grid grid-cols-12 gap-5">

                  <FormInput
                    label="Business Name"
                    placeholder="e.g. Digisite Pty Ltd"
                    value={formData.business_name}
                    onChange={(val) => handleChange('business_name', val)}
                    required
                    isHalf
                    error={isSubmitted && formData.business_name?.trim() === ''}
                    errormsg="Please enter your business name"
                  />
                  <FormInput
                    label="GST Number"
                    placeholder="ABN / GST"
                    value={formData.gst_number}
                    onChange={(val) => handleChange('gst_number', val)}
                    required
                    isHalf
                    error={isSubmitted && formData.gst_number?.trim() === ''}
                    errormsg="Please enter your GST number"
                  />
                </div>
                <div className="pt-2">
                  <p className="text-xs text-slate-400 dark:text-zinc-500">
                    These details will be used for your invoices and shipping documents.
                  </p>
                </div>
              </div>
            </div>

            {/* Row 2: Business Address and Billing Address Side-by-Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              {/* Business Address Card */}
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-lg shadow-slate-200/40 dark:shadow-none space-y-4">
                <SectionHeader title="Business Address" icon={MapPin}>
                  <div className="flex items-center space-x-2.5 px-3 py-1.5 bg-slate-50 dark:bg-zinc-950/30 rounded-lg border border-slate-100 dark:border-zinc-800/50 cursor-pointer hover:bg-slate-100/50 transition-colors">
                    <Checkbox
                      id="billing_same"
                      checked={!formData.hasBillingAddress}
                      onCheckedChange={(val) => handleChange('hasBillingAddress', !val)}
                    />
                    <Label htmlFor="billing_same" className="text-[11px] font-bold text-slate-600 dark:text-zinc-400 cursor-pointer tracking-wider">
                      Same for Billing
                    </Label>
                  </div>
                </SectionHeader>

                <div className="space-y-4">
                  <div>
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
                      error={isSubmitted && formData.address_info?.trim() === ''}
                      errormsg='Please enter your address'
                      value={formData.address_info}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-12  gap-5">
                    <FormInput
                      isHalf
                      label="Unit Number"
                      placeholder="Optional"
                      value={formData.unit_number}
                      onChange={(val) => handleChange('unit_number', val)}
                    />
                    <FormInput
                      isHalf
                      label="Street"
                      placeholder="e.g. 123"
                      value={formData.address}
                      onChange={(val) => handleChange('address', val)}
                      required
                      error={isSubmitted && formData.address?.trim() === ''}
                      errormsg="Please enter your street"
                    />
                  </div>
                  <div className="grid grid-cols-12 gap-5">
                    <div className="col-span-12 md:col-span-3">
                      <FormInput
                        isFullWidth
                        label="Suburb"
                        placeholder="Sydney"
                        value={formData.suburb}
                        onChange={(val) => handleChange('suburb', val)}
                        required
                        error={isSubmitted && formData.suburb?.trim() === ''}
                        errormsg="Please enter your suburb"
                      />
                    </div>
                    <div className="col-span-12 md:col-span-3">
                      <FormSelect
                        label="State"
                        options={STATES}
                        value={formData.state}
                        onValueChange={(val) => handleChange('state', val)}
                        required
                        error={isSubmitted && formData.state?.trim() === ''}
                        errormsg="Please select your state"
                      />
                    </div>
                    <div className="col-span-12 md:col-span-3">
                      <FormInput
                        isFullWidth
                        label="Postcode"
                        placeholder="2000"
                        value={formData.postcode}
                        onChange={(val) => handleChange('postcode', val)}
                        required
                        error={isSubmitted && formData.postcode?.trim() === ''}
                        errormsg="Please enter your postcode"
                      />
                    </div>
                    <div className="col-span-12 md:col-span-3">
                      <FormInput
                        isFullWidth
                        label="Country"
                        placeholder="Australia"
                        value={formData.country}
                        onChange={(val) => handleChange('country', val)}
                        required
                        error={isSubmitted && formData.country?.trim() === ''}
                        errormsg="Please enter your country"
                      />
                    </div>
                  </div>


                </div>
              </div>

              {/* Billing Address Card (Conditional) */}
              {formData.hasBillingAddress ? (
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-lg shadow-slate-200/40 dark:shadow-none space-y-4 animate-in slide-in-from-right-4 duration-500">
                  <SectionHeader title="Billing Address Details" icon={CreditCard} />

                  <div className="space-y-4">
                    <div>
                      <PlaceAutocomplete
                        label="Address Information"
                        onPlaceSelect={(opt) => {
                          handleChange('billing_address_info', opt.formatted_address);
                          handleChange('billing_address', opt.address1);
                          handleChange('billing_unit_number', opt.unit_number);
                          handleChange('billing_street_name', opt.street_name);
                          handleChange('billing_street_number', opt.street_number);
                          handleChange('billing_street_type', opt.street_type);
                          handleChange('billing_suburb', opt.suburb);
                          handleChange('billing_state', opt.state);
                          handleChange('billing_country', opt.country);
                          handleChange('billing_postcode', opt.post_code);
                        }}
                        onChange={(value) => handleChange('billing_address_info', value)}
                        error={isSubmitted && formData.billing_address_info?.trim() === ''}
                        errormsg='Please enter your billing address'
                        value={formData.billing_address_info}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-12 gap-5">
                      <FormInput
                        isHalf
                        label="Billing Unit Number"
                        placeholder="Optional"
                        value={formData.billing_unit_number}
                        onChange={(val) => handleChange('billing_unit_number', val)}
                      />
                      <FormInput
                        isHalf
                        label="Billing Street"
                        placeholder="Enter Street"
                        value={formData.billing_address}
                        onChange={(val) => handleChange('billing_address', val)}
                        required
                        error={isSubmitted && formData.billing_address?.trim() === ''}
                        errormsg="Please enter your street"
                      />
                    </div>

                    <div className="grid grid-cols-12 gap-5">
                      <div className="col-span-12 md:col-span-3">
                        <FormInput
                          isFullWidth
                          label="Suburb"
                          placeholder="Sydney"
                          value={formData.billing_suburb}
                          onChange={(val) => handleChange('billing_suburb', val)}
                          required
                          error={isSubmitted && formData.billing_suburb?.trim() === ''}
                          errormsg="Please enter your suburb"
                        />
                      </div>
                      <div className="col-span-12 md:col-span-3">
                        <FormSelect
                          label="State"
                          options={STATES}
                          value={formData.billing_state}
                          onValueChange={(val) => handleChange('state', val)}
                          required
                          error={isSubmitted && formData.billing_state?.trim() === ''}
                          errormsg="Please select your state"
                        />
                      </div>
                      <div className="col-span-12 md:col-span-3">
                        <FormInput
                          isFullWidth
                          label="Postcode"
                          placeholder="2000"
                          value={formData.billing_postcode}
                          onChange={(val) => handleChange('billing_postcode', val)}
                          required
                          error={isSubmitted && formData.billing_postcode?.trim() === ''}
                          errormsg="Please enter your postcode"
                        />
                      </div>
                      <div className="col-span-12 md:col-span-3">
                        <FormInput
                          isFullWidth
                          label="Country"
                          placeholder="Australia"
                          value={formData.billing_country}
                          onChange={(val) => handleChange('billing_country', val)}
                          required
                          error={isSubmitted && formData.billing_country?.trim() === ''}
                          errormsg="Please enter your country"
                        />
                      </div>

                    </div>
                  </div>
                </div>
              ) : (
                /* Improved Placeholder when billing is same */
                // <div className="bg-slate-50/50 dark:bg-zinc-950/30 p-8 rounded-3xl border border-dashed border-slate-200 dark:border-zinc-800 flex flex-col items-center justify-center text-center space-y-4 h-full min-h-[400px]">
                //   <div className="h-16 w-16 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center shadow-sm">
                //     <CreditCard className="w-8 h-8 text-slate-300 dark:text-zinc-700" />
                //   </div>
                //   <div className="max-w-[280px]">
                //     <p className="text-sm font-bold text-slate-600 dark:text-zinc-400">Billing Synchronized</p>
                //     <p className="text-xs text-slate-400 dark:text-zinc-500 mt-2 leading-relaxed">
                //       Your billing details are currently set to match your business address. Uncheck the box to provide a separate billing location.
                //     </p>
                //   </div>
                // </div>
                <></>
              )}
            </div>

            {/* Row 3: Terms & Conditions (Non-sticky part) */}
            <div className="pt-2 space-y-2">
              {/* <SectionHeader title="Terms & Activation" icon={ShieldCheck} /> */}
              <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed font-medium max-w-3xl">
                Final step: Review and accept the platform policies to activate your shipping account. By clicking the button, you confirm that all provided business and address information is correct.
              </p>

              <div className="grid grid-cols-1 gap-3 pt-2">
                <div className="flex items-start space-x-3 p-1">
                  <Checkbox
                    id="agree_privacy"
                    checked={formData.agree_privacy}
                    onCheckedChange={(val) => handleChange('agree_privacy', val)}
                    className="mt-[3px]"
                  />
                  <div className="space-y-1">
                    <Label htmlFor="agree_privacy" className="text-sm text-slate-900 dark:text-zinc-200 font-bold cursor-pointer">
                      <a
                        href={PRIVACY_POLICY_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline hover:text-primary transition-colors inline-flex items-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Privacy Policy
                      </a>
                    </Label>
                    <p className="text-xs text-slate-500 mb-0">I agree to the processing of my personal data.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-1">
                  <Checkbox
                    id="accept_terms"
                    checked={formData.accept_terms}
                    onCheckedChange={(val) => handleChange('accept_terms', val)}
                    className="mt-[3px]"
                  />
                  <div className="space-y-1">
                    <Label htmlFor="accept_terms" className="text-sm text-slate-900 dark:text-zinc-200 font-bold cursor-pointer">
                      <a
                        href={TERMS_CONDITIONS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline hover:text-primary transition-colors inline-flex items-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Terms & Conditions
                      </a>
                    </Label>
                    <p className="text-xs text-slate-500 mb-0">I accept the Tranzit Group platform terms.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Sticky Bottom Bar */}
        <div className="sticky bottom-0 left-0 right-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-t border-slate-200 dark:border-zinc-800 px-8 py-4 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
          <div className="max-w-full sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl 2xl:max-w-360 mx-auto flex items-center justify-between gap-6 w-full">
            <div className="hidden lg:flex items-center gap-3 text-slate-600 dark:text-slate-400">
              <span className="text-xs font-bold tracking-wide">You can edit these later in Profile</span>
            </div>

            <div className="flex items-center gap-4 w-full lg:w-auto">
              <Button
                disabled={onboardingMutation.isPending}
                className="px-6"
                onClick={handleSubmit}
              // className="flex-1 lg:flex-none  bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest rounded-md shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] border-none"
              >
                {onboardingMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
