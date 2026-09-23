import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Loader2, Info, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
<<<<<<< HEAD
import { CustomLabel, FormInput, FormSelect } from '@/features/orders/components/OrderFormUI';
import { Switch } from '@/components/ui/switch';
=======
import { FormInput, FormSelect } from '@/features/orders/components/OrderFormUI';
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CustomModel } from '@/components/ui/dialog';
import { showToast } from '@/components/ui/custom-toast';
import { PlaceAutocomplete } from '@/components/common/AutoComplateAddress';
import { useAppSelector } from '@/hooks/store.hooks';
import SubscriptionPlanModal from '../components/SubscriptionPlanModal';
<<<<<<< HEAD
import TrackingPageBrandingCard from '../components/TrackingPageBrandingCard';
import { STATES, SENDER_NAME_MAX_LENGTH } from '@/constants';
import { useGetProfile, useUpdateProfile, useChangePassword } from '@/features/profile/hooks/useProfile';
import { cn } from '@/lib/utils';
import { cleanSpaces, isPhoneValid, PHONE_ERROR_MESSAGE } from '@/lib/phone';
import { useValidateLocality } from '@/hooks/useValidateLocality';
import { LocalityWarning } from '@/components/common/LocalityWarning';
=======
import { STATES } from '@/constants';
import { useGetProfile, useUpdateProfile, useChangePassword } from '@/features/profile/hooks/useProfile';
import { cleanSpaces, isPhoneValid } from '@/lib/utils';
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
// import { Checkbox } from '@/components/ui/checkbox';
// import { Label } from '@/components/ui/label';
// import { CreateAddressDialog } from '@/features/address-book/components/CreateAddressDialog';
// import { STATES } from '@/constants';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: 'easeOut' as const,
    },
  }),
};

export default function AccountSettingsPage() {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  // const { user } = useAppSelector((state) => state.auth);
  // const { summary } = useAppSelector((state) => state.wallet);
  const { is_sub_user, team_access } = useAppSelector((state) => state.auth)
  const canReadWrite = useMemo(() => !is_sub_user || team_access?.permissions?.settings_account_detail === 'full', [is_sub_user, team_access]);

  // Fetch profile details
  const { data: profileResponse } = useGetProfile();
  const profile = profileResponse?.data;
<<<<<<< HEAD
  // Non-BYO customers are not on the label tier pricing, so rate and tier progress are hidden.
  const showLabelTierInfo = profile?.weekly_label_usage?.BYO_enable;
=======
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c

  // Mutations
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();

  // Initial Form values matching user's request
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    abn: '',
<<<<<<< HEAD
    senderName: '',
    displayBusinessNameOnLabel: false,
=======
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c

    // Shipping Address
    shipping_address_info: '',
    shipping_address: '',
    shipping_unit_number: '',
    shipping_street_number: '',
    shipping_street_name: '',
    shipping_street_type: '',
    shipping_suburb: '',
    shipping_state: '',
    shipping_postcode: '',

    // Billing Address
    billing_address_info: '',
    billing_address: '',
    billing_unit_number: '',
    billing_street_number: '',
    billing_street_name: '',
    billing_street_type: '',
    billing_suburb: '',
    billing_state: '',
    billing_postcode: '',
  });
  const [submit, setSubmit] = useState(false);
  const [backupData, setBackupData] = useState({ ...formData });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [disabledAddress, setDisabledAddress] = useState(false);
<<<<<<< HEAD

  const billingLocality = useValidateLocality(formData.billing_suburb, formData.billing_state, formData.billing_postcode, formData.billing_address);
  // Pickup is read-only here (changed via support), so it only warns — it never blocks the save
=======
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
  // const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const [editingAddressId, setEditingAddressId] = useState<string | null>(null);



  const handleInputChange = (value: any, name: string) => {
<<<<<<< HEAD
    if (name === 'senderName' && typeof value === 'string' && value.length > SENDER_NAME_MAX_LENGTH) {
      showToast(`Sender name cannot be longer than ${SENDER_NAME_MAX_LENGTH} characters`, 'error');
      return;
    }
=======
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (value: string, name: string) => {
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (passwordErrors[name as keyof typeof passwordErrors]) {
      setPasswordErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const onSave = () => {
    setSubmit(true)
    const { firstName, lastName, phone, email, billing_address, billing_suburb, billing_state, billing_postcode } = formData;

    if (!(firstName && lastName && email && phone && billing_address && billing_suburb && billing_state && billing_postcode)) {
      showToast("Please fill all the required fields", "error");
      return;
    }

    if (phone && !isPhoneValid(phone)) {
<<<<<<< HEAD
      showToast(PHONE_ERROR_MESSAGE, 'error');
      return;
    }

    if (billingLocality.error) {
      showToast(billingLocality.error, 'error');
      return;
    }

    if (billingLocality.isPending) {
      showToast("Validating address, please wait", 'error');
=======
      showToast("Please enter a valid phone number", 'error');
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
      return;
    }

    const payload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      mobile: cleanSpaces(formData.phone),
      personal_email: formData.email,
      business_name: formData.companyName,
      gst_number: formData.abn,
<<<<<<< HEAD
      sender_name: formData.senderName,
      display_business_name_on_label: formData.displayBusinessNameOnLabel,
=======
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
      address_detail: {
        default: {
          address_info: formData.shipping_address_info,
          address: formData.shipping_address,
          unit_number: formData.shipping_unit_number,
          street_number: formData.shipping_street_number,
          street_name: formData.shipping_street_name,
          street_type: formData.shipping_street_type,
          suburb: formData.shipping_suburb,
          state: formData.shipping_state,
          postcode: formData.shipping_postcode,
        },
        billing: {
          address_info: formData.billing_address_info,
          address: formData.billing_address,
          unit_number: formData.billing_unit_number,
          street_number: formData.billing_street_number,
          street_name: formData.billing_street_name,
          street_type: formData.billing_street_type,
          suburb: formData.billing_suburb,
          state: formData.billing_state,
          postcode: formData.billing_postcode,
        }
      }
    }

    // return
    updateProfileMutation.mutate(payload, {
      onSuccess: () => {
        setIsEditingProfile(false);
      }
    });
  };

  const onCancel = () => {
    setFormData({ ...backupData });
    setIsEditingProfile(false);
  };

  const onPasswordSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const errors = {
      currentPassword: !passwordData.currentPassword ? 'Current password is required' : '',
      newPassword: !passwordData.newPassword ? 'New password is required' : '',
      confirmPassword: !passwordData.confirmPassword ? 'Please confirm your new password' : '',
    };

    if (errors.currentPassword || errors.newPassword || errors.confirmPassword) {
      setPasswordErrors(errors);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("New passwords do not match", "error");
      return;
    }

    changePasswordMutation.mutate({
      current_password: passwordData.currentPassword,
      new_password: passwordData.newPassword,
      new_password_confirmation: passwordData.confirmPassword,
    }, {
      onSuccess: (res) => {
        if (res.status) {
          setIsPasswordOpen(false);
          setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
        }
      }
    });
  };

  const handleEditClick = () => {
    setBackupData({ ...formData });
    setIsEditingProfile(true);
  };

  useEffect(() => {
    const shAddr = profile?.address_detail?.default;
    const billAddr = profile?.address_detail?.billing;

    const data = {
      firstName: profile?.first_name || '',
      lastName: profile?.last_name || '',
      email: profile?.email || profile?.personal_email || '',
      phone: profile?.mobile || profile?.personal_mobile || '',
      companyName: profile?.business_name || '',
      abn: profile?.gst_number || '',
<<<<<<< HEAD
      senderName: profile?.sender_name || '',
      displayBusinessNameOnLabel: !!profile?.display_business_name_on_label,
=======
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c

      // Shipping Address
      shipping_address_info: shAddr?.address_info || shAddr?.address || '',
      shipping_address: shAddr?.address || '',
      shipping_unit_number: shAddr?.unit_number || '',
      shipping_street_number: shAddr?.street_number || '',
      shipping_street_name: shAddr?.street_name || '',
      shipping_street_type: shAddr?.street_type || '',
      shipping_suburb: shAddr?.suburb || '',
      shipping_state: shAddr?.state || '',
      shipping_postcode: shAddr?.postcode || '',

      // Billing Address
      billing_address_info: billAddr?.address_info || billAddr?.address || '',
      billing_address: billAddr?.address || '',
      billing_unit_number: billAddr?.unit_number || '',
      billing_street_number: billAddr?.street_number || '',
      billing_street_name: billAddr?.street_name || '',
      billing_street_type: billAddr?.street_type || '',
      billing_suburb: billAddr?.suburb || '',
      billing_state: billAddr?.state || '',
      billing_postcode: billAddr?.postcode || '',
    };
    setFormData(data);
    setBackupData(data);
  }, [profile]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full items-stretch">

      <div className="col-span-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-zinc-200 my-0">Account Settings</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 my-0">Manage your company profile, contact information, addresses, team access, and account preferences</p>
        </div>

        {canReadWrite && (
          <div className="flex items-center gap-2">
            {isEditingProfile ? (
              <>
                <Button variant="outline" size="lg" onClick={onCancel} disabled={updateProfileMutation.isPending} className="h-8 px-4 text-[13px] font-medium rounded-sm">
                  Cancel
                </Button>
                <Button size="lg" onClick={() => onSave()} disabled={updateProfileMutation.isPending} className="h-8 px-4 text-[13px] font-medium text-white rounded-sm">
                  {updateProfileMutation.isPending && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="lg" onClick={handleEditClick} className="h-8 px-4 text-[13px] font-medium shadow-sm shrink-0 rounded-sm">
                  <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                  Edit Profile
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsPasswordOpen(true)} className="h-8 px-4 text-[13px] font-medium shadow-sm shrink-0 rounded-sm">
                  Change Password
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Personal Information & Balance */}
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="col-span-12 xl:col-span-8 flex"
      >
        <Card className="flex flex-col w-full hover:shadow-md transition-shadow duration-300 border-gray-200 shadow-xs rounded-md">
          <CardHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-zinc-800 bg-slate-50/30 dark:bg-zinc-950 space-y-0 rounded-t-md">
            <CardTitle className="text-base font-medium text-gray-800 dark:text-zinc-200">Personal Information</CardTitle>
          </CardHeader>

          <CardContent className="p-6 flex-1">
            <div className="grid grid-cols-12 gap-x-4 gap-y-3.5">
              {/* Row 1: First name , last name */}
              <FormInput
                label="First Name"
                required
                disabled={!isEditingProfile}
                isHalf
                value={formData.firstName}
                onChange={(val) => handleInputChange(val, 'firstName')}
                error={submit && !formData.firstName}
                errormsg="Please enter first name"
              />
              <FormInput
                label="Last Name"
                required
                disabled={!isEditingProfile}
                isHalf
                value={formData.lastName}
                onChange={(val) => handleInputChange(val, 'lastName')}
                error={submit && !formData.lastName}
                errormsg="Please enter last name"
              />

              {/* Row 2: email, phone */}
              <FormInput
                label="Email Address"
                type="email"
                required
                disabled
                isHalf
                value={formData.email}
                onChange={(val) => handleInputChange(val, 'email')}
                error={submit && !formData.email}
                errormsg="Please enter email address"
              />
              <FormInput
                label="Phone"
                disabled={!isEditingProfile}
                isHalf
                value={formData.phone}
                onChange={(val) => handleInputChange(val, 'phone')}
                error={submit && (!formData.phone || !isPhoneValid(formData.phone))}
<<<<<<< HEAD
                errormsg={!formData.phone ? "Please enter phone number" : PHONE_ERROR_MESSAGE}
=======
                errormsg={!formData.phone ? "Please enter phone number" : "Please enter valid phone number"}
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
              />

              {/* Row 3: company name , ABN */}
              <FormInput
                label="Company Name"
                disabled={!isEditingProfile}
                isHalf
                value={formData.companyName}
                onChange={(val) => handleInputChange(val, 'companyName')}
              />
              <FormInput
                label="ABN"
                disabled={!isEditingProfile}
                isHalf
                value={formData.abn}
                onChange={(val) => handleInputChange(val, 'abn')}
              />
<<<<<<< HEAD

              {/* Row 4: label sender details */}
              {/* <FormInput
                label="Sender Name (Display on label)"
                info='Printed on the label as the sender when "Display business name on label" is off.'
                disabled={!isEditingProfile}
                isHalf
                value={formData.senderName}
                onChange={(val) => handleInputChange(val, 'senderName')}
              /> */}
              <div className="col-span-12 md:col-span-6">
                <CustomLabel label="Display business name on label" />
                <div className="flex items-center gap-2 h-8">
                  <Switch
                    checked={formData.displayBusinessNameOnLabel}
                    disabled={!isEditingProfile}
                    onCheckedChange={(checked) => handleInputChange(checked, 'displayBusinessNameOnLabel')}
                  />
                  <span className="text-sm text-slate-600 dark:text-zinc-400">
                    {formData.displayBusinessNameOnLabel ? 'Yes' : 'No'}
                  </span>
                </div>
                <p className="my-0 text-[11px] text-slate-400 dark:text-zinc-500">
                  {formData.displayBusinessNameOnLabel
                    ? 'The business name will print on the label.'
                    : 'The sender name will print on the label.'}
                </p>
              </div>
=======
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Balance & Weekly Label Usage Container */}
      <div className="col-span-12 xl:col-span-4 flex">
        {/* Balance Card */}
        {/* <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="w-full flex h-fit"
        >
          <Card className="w-full border-gray-200 shadow-xs gap-0">
            <CardHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-zinc-800 bg-slate-50/30 dark:bg-zinc-950 space-y-0 rounded-t-md">
              <CardTitle className="text-base font-medium text-gray-800 dark:text-zinc-200">Balance</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-slate-500">Current Balance:</span>
                <span className="text-[13px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400 px-2 py-0.5 rounded-sm">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(summary?.wallet_balance || 0))}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div> */}

        {/* Weekly Label Usage Card */}
        {profile?.weekly_label_usage && (
          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="w-full flex"
          >
            <Card className="w-full border-gray-200 shadow-xs rounded-md gap-0 flex flex-col h-full hover:shadow-md transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-zinc-800 bg-slate-50/30 dark:bg-zinc-950 space-y-0 rounded-t-md">
                <CardTitle className="text-base font-medium text-gray-800 dark:text-zinc-200">Weekly Label Usage</CardTitle>
                <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">
                  {profile.weekly_label_usage.week_start} - {profile.weekly_label_usage.week_end}
                </span>
              </CardHeader>
<<<<<<< HEAD
              <CardContent className={cn(
                "p-6 space-y-2 flex-1 flex flex-col",
                // Without the rate and tier rows there is nothing to space apart, so the
                // remaining metrics sit centred instead of leaving a gap down the middle.
                showLabelTierInfo ? "justify-between" : "justify-center gap-2"
              )}>
=======
              <CardContent className="p-6 space-y-2 flex-1 flex flex-col justify-between">
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
                {/* Metrics Row */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide mb-1">
                      Labels Printed
                    </p>
                    <h3 className="my-0 text-xl font-black text-slate-800 dark:text-zinc-100 tracking-tight leading-none">
                      {profile.weekly_label_usage.total_labels_printed}
                    </h3>
                  </div>
<<<<<<< HEAD
                  {showLabelTierInfo && (
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide mb-1">
                        Current Rate
                      </p>
                      <div className="flex items-center gap-1.5 justify-end">
                        <span className="text-[10px] font-bold text-primary-600 bg-primary/5 dark:bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                          Tier {profile.weekly_label_usage.current_tier.label}
                        </span>
                        <span className="text-sm font-black text-slate-800 dark:text-zinc-200">
                          ${Number(profile.weekly_label_usage.current_tier.rate).toFixed(2)}/label
                        </span>
                      </div>
                    </div>
                  )}
=======
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide mb-1">
                      Current Rate
                    </p>
                    <div className="flex items-center gap-1.5 justify-end">
                      <span className="text-[10px] font-bold text-primary-600 bg-primary/5 dark:bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                        Tier {profile.weekly_label_usage.current_tier.label}
                      </span>
                      <span className="text-sm font-black text-slate-800 dark:text-zinc-200">
                        ${Number(profile.weekly_label_usage.current_tier.rate).toFixed(2)}/label
                      </span>
                    </div>
                  </div>
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
                </div>

                {/* Print Breakdown */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-zinc-800/80">
                  <div className="p-3 rounded-xl bg-slate-50/50 dark:bg-zinc-900/30 border border-slate-100/50 dark:border-zinc-800/50">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">
                      BYO Labels
                    </span>
                    <p className="my-0 text-base font-black text-slate-700 dark:text-zinc-300 mt-0.5 leading-none">
                      {profile.weekly_label_usage.byo_labels_printed}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50/50 dark:bg-zinc-900/30 border border-slate-100/50 dark:border-zinc-800/50">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">
                      Tranzit Labels
                    </span>
                    <p className="my-0  text-base font-black text-slate-700 dark:text-zinc-300 mt-0.5 leading-none">
                      {profile.weekly_label_usage.tr_labels_printed}
                    </p>
                  </div>
                </div>

                {/* Next Tier Progress */}
<<<<<<< HEAD
                {showLabelTierInfo && (profile.weekly_label_usage.next_tier ? (
=======
                {profile.weekly_label_usage.next_tier ? (
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-zinc-800/80">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-500">Progress to Next Tier</span>
                      <span className="font-bold text-slate-700 dark:text-zinc-300">
                        {profile.weekly_label_usage.labels_needed_for_next_tier} more for ${Number(profile.weekly_label_usage.next_tier.rate).toFixed(2)} rate
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round(
                              (Number(profile.weekly_label_usage.total_labels_printed) /
                                (Number(profile.weekly_label_usage.current_tier.max) || 1)) *
                              100
                            )
                          )}%`,
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold">
                      <span>Tier {profile.weekly_label_usage.current_tier.label}</span>
                      <span>Tier {profile.weekly_label_usage.next_tier.label}</span>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/80 text-center py-2 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100/50 dark:border-emerald-900/30">
                    <p className="text-xs font-black text-emerald-700 dark:text-emerald-400 m-0 uppercase tracking-wide">
                      🎉 You are on the best rate tier!
                    </p>
                  </div>
<<<<<<< HEAD
                ))}
=======
                )}
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
      <motion.div
        custom={3}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="col-span-12"
      >
        <Card className="w-full hover:shadow-md transition-shadow duration-300 border-gray-200 shadow-xs rounded-md">
          <CardHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-zinc-800 bg-slate-50/30 dark:bg-zinc-950 space-y-0 rounded-t-md">
            <CardTitle className="text-base font-medium text-gray-800 dark:text-zinc-200">Address Information</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Billing Address Column */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="text-base font-semibold text-gray-700 dark:text-zinc-300">
                    Billing Address
                  </h4>
                  {/* <div className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox
                      id="same_as_shipping"
                      checked={sameAsShipping}
                      disabled={!isEditingProfile}
                      onCheckedChange={(val) => setSameAsShipping(!!val)}
                    />
                    <Label htmlFor="same_as_shipping" className="text-[13px] font-medium text-gray-600 dark:text-zinc-400 cursor-pointer">
                      Same as pickup address
                    </Label>
                  </div> */}
                </div>
                <div className="grid grid-cols-12 gap-x-4 gap-y-3.5">
                  <div className="col-span-12">
                    <PlaceAutocomplete
                      label="Search Address"
                      className="w-full col-span-12"
                      inputClassName="w-full col-span-12"
                      isFullWidth
                      disabled={!isEditingProfile}
                      value={formData.billing_address_info}
                      onChange={(val) => { handleInputChange(val, 'billing_address_info'); setDisabledAddress(false) }}
                      onPlaceSelect={(opt) => {
                        setFormData(prev => ({
                          ...prev,
                          billing_address_info: opt.formatted_address,
                          billing_address: opt.address1,
                          billing_unit_number: opt.unit_number || '',
                          billing_street_number: opt.street_number || '',
                          billing_street_name: opt.street_name || '',
                          billing_street_type: opt.street_type || '',
                          billing_suburb: opt.suburb,
                          billing_state: opt.state,
                          billing_postcode: opt.post_code,
                        }));
                        setDisabledAddress(true)
                      }}
                    />
                  </div>

                  <div className="col-span-12 sm:col-span-4">
                    <FormInput
                      label="Unit Number"
                      placeholder='Unit Number'
                      disabled={!isEditingProfile}
                      value={formData.billing_unit_number}
                      onChange={(val) => handleInputChange(val, 'billing_unit_number')}
                    />
                  </div>
                  <div className="col-span-12 sm:col-span-8">
                    <FormInput
                      label="Street"
                      placeholder='Street Address'
                      required
                      disabled={!isEditingProfile || disabledAddress}
                      value={formData.billing_address}
                      onChange={(val) => { handleInputChange(val, 'billing_address'); handleInputChange(val, 'billing_street_name'); }}
                      error={submit && !formData.billing_address}
                      errormsg="Please enter street address"
                    />
                  </div>

                  <div className="col-span-12 sm:col-span-4">
                    <FormInput
                      label="Suburb"
                      placeholder='Suburb'
                      required
                      disabled={!isEditingProfile || disabledAddress}
                      value={formData.billing_suburb}
                      onChange={(val) => handleInputChange(val, 'billing_suburb')}
                      error={submit && !formData.billing_suburb}
                      errormsg="Please enter suburb"
                    />
                  </div>
                  <div className="col-span-12 sm:col-span-4">
                    <FormSelect
                      label="State"
                      placeholder='Select State'
                      required
                      options={STATES}
                      disabled={!isEditingProfile || disabledAddress}
                      value={formData.billing_state}
                      onValueChange={(val) => handleInputChange(val, 'billing_state')}
                      error={submit && !formData.billing_state}
                      errormsg="Please select state"
                      allowClear={false}
                    />
                  </div>
                  <div className="col-span-12 sm:col-span-4">
                    <FormInput
                      label="Postcode"
                      placeholder='Postcode'
                      required
                      disabled={!isEditingProfile || disabledAddress}
                      value={formData.billing_postcode}
                      onChange={(val) => handleInputChange(val, 'billing_postcode')}
                      error={submit && !formData.billing_postcode}
                      errormsg="Please enter postcode"
                    />
                  </div>
                </div>
<<<<<<< HEAD
                {billingLocality.error && (
                  <LocalityWarning
                    message={billingLocality.error}
                    suggestions={billingLocality.suggestions}
                    onSelect={(suggestion) => {
                      handleInputChange(suggestion.suburb, 'billing_suburb');
                      handleInputChange(suggestion.state, 'billing_state');
                      handleInputChange(suggestion.postcode, 'billing_postcode');
                    }}
                  />
                )}
=======
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
              </div>

              {/* Pickup Address Column */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="text-base font-semibold text-gray-700 dark:text-zinc-300">
                    Pickup Address
                  </h4>
                </div>

                <div className="bg-blue-50/40 dark:bg-blue-950/10 border border-blue-100/80 dark:border-blue-900/30 rounded-lg p-3.5 flex items-start gap-3 shadow-2xs">
                  <div className="p-1 rounded-md bg-blue-100/80 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
                    <Info className="w-4 h-4" />
                  </div>
                  <div className="text-[13px] text-slate-600 dark:text-zinc-400 leading-relaxed font-medium flex flex-wrap gap-2 items-center">
                    To change the Pickup address, please email us at{' '}
                    <a
                      href="mailto:info@tranzitgroup.com.au"
                      className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-all"
                    >
                      <Mail className="w-3.5 h-3.5 inline" />
                      info@tranzitgroup.com.au
                    </a>
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-x-4 gap-y-3.5">
                  <div className="col-span-12">
                    <PlaceAutocomplete
                      label="Search Address"
                      className="w-full col-span-12"
                      inputClassName="w-full col-span-12"
                      isFullWidth
                      disabled
                      value={formData.shipping_address_info}
                      onChange={(val) => handleInputChange(val, 'shipping_address_info')}
                      onPlaceSelect={(opt) => {
                        setFormData(prev => ({
                          ...prev,
                          shipping_address_info: opt.formatted_address,
                          shipping_address: opt.address1,
                          shipping_unit_number: opt.unit_number || '',
                          shipping_street_number: opt.street_number || '',
                          shipping_street_name: opt.street_name || '',
                          shipping_street_type: opt.street_type || '',
                          shipping_suburb: opt.suburb,
                          shipping_state: opt.state,
                          shipping_postcode: opt.post_code,
                        }));
                      }}
                    />
                  </div>

                  <div className="col-span-12 sm:col-span-4">
                    <FormInput
                      label="Unit Number"
                      placeholder='Unit Number'
                      disabled
                      value={formData.shipping_unit_number}
                      onChange={(val) => handleInputChange(val, 'shipping_unit_number')}
                    />
                  </div>
                  <div className="col-span-12 sm:col-span-8">
                    <FormInput
                      label="Street"
                      placeholder='Street Address'
                      required
                      disabled
                      value={formData.shipping_address}
                      onChange={(val) => handleInputChange(val, 'shipping_address')}
                    />
                  </div>

                  <div className="col-span-12 sm:col-span-4">
                    <FormInput
                      label="Suburb"
                      placeholder='Suburb'
                      required
                      disabled
                      value={formData.shipping_suburb}
                      onChange={(val) => handleInputChange(val, 'shipping_suburb')}
                    />
                  </div>
                  <div className="col-span-12 sm:col-span-4">
                    <FormSelect
                      label="State"
                      placeholder='Select State'
                      required
                      options={STATES}
                      disabled
                      value={formData.shipping_state}
                      onValueChange={(val) => handleInputChange(val, 'shipping_state')}
                    />
                  </div>
                  <div className="col-span-12 sm:col-span-4">
                    <FormInput
                      label="Postcode"
                      placeholder='Postcode'
                      required
                      disabled
                      value={formData.shipping_postcode}
                      onChange={(val) => handleInputChange(val, 'shipping_postcode')}
                    />
                  </div>
                </div>
              </div>
<<<<<<< HEAD
=======



>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
            </div>
          </CardContent>
        </Card>
      </motion.div>




      {/* Address Information Card */}

<<<<<<< HEAD
      {/* Tracking Page Branding Card */}
      <motion.div
        custom={4}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="col-span-12"
      >
        <TrackingPageBrandingCard canEdit={canReadWrite} />
      </motion.div>
=======
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c

      {/* Change Password Modal */}
      <CustomModel
        open={isPasswordOpen}
        onOpenChange={(open) => {
          setIsPasswordOpen(open);
          if (!open) {
            setPasswordData({
              currentPassword: '',
              newPassword: '',
              confirmPassword: '',
            });
            setPasswordErrors({
              currentPassword: '',
              newPassword: '',
              confirmPassword: '',
            });
          }
        }}
        title="Change Password"
        description="Update your account password. Make sure to choose a strong password."
        onSubmit={onPasswordSubmit}
        submitText="Update Password"
        contentClass="sm:max-w-md"
        isLoading={changePasswordMutation.isPending}
      >
        <div className="py-2 space-y-4">
          <div className="grid grid-cols-12 gap-y-3.5">
            <FormInput
              label="Current Password"
              type="password"
              required
              isFullWidth
              placeholder='Enter current password'
              value={passwordData.currentPassword}
              onChange={(val) => handlePasswordChange(val, 'currentPassword')}
              error={!!passwordErrors.currentPassword}
              errormsg={passwordErrors.currentPassword}
            />
            <FormInput
              label="New Password"
              type="password"
              required
              isFullWidth
              placeholder='Enter new password'
              value={passwordData.newPassword}
              onChange={(val) => handlePasswordChange(val, 'newPassword')}
              error={!!passwordErrors.newPassword}
              errormsg={passwordErrors.newPassword}
            />
            <FormInput
              label="Confirm New Password"
              type="password"
              required
              isFullWidth
              placeholder='Re-enter new password'
              value={passwordData.confirmPassword}
              onChange={(val) => handlePasswordChange(val, 'confirmPassword')}
              error={!!passwordErrors.confirmPassword}
              errormsg={passwordErrors.confirmPassword}
            />
          </div>
        </div>
      </CustomModel>
      {isPlanModalOpen && (
        <SubscriptionPlanModal
          open={isPlanModalOpen}
          onOpenChange={setIsPlanModalOpen}
          closeable
        />
      )}
      {/* 
      {isDialogOpen && (

        <CreateAddressDialog
          key={isDialogOpen ? (editingAddressId || 'new') : 'closed'}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={() => { }}
          editingAddressId={editingAddressId}
          isLoading={false}
        />
      )} */}
    </div>
  );
}
