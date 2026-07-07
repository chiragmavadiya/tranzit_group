import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Loader2, Info, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormInput, FormSelect } from '@/features/orders/components/OrderFormUI';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CustomModel } from '@/components/ui/dialog';
import { showToast } from '@/components/ui/custom-toast';
import { PlaceAutocomplete } from '@/components/common/AutoComplateAddress';
import { useAppSelector } from '@/hooks/store.hooks';
import SubscriptionPlanModal from '../components/SubscriptionPlanModal';
import { STATES } from '@/constants';
import { useGetProfile, useUpdateProfile, useChangePassword } from '@/features/profile/hooks/useProfile';
import { cleanSpaces, isPhoneValid } from '@/lib/utils';
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
  const { summary } = useAppSelector((state) => state.wallet);
  const { is_sub_user, team_access } = useAppSelector((state) => state.auth)
  const canReadWrite = useMemo(() => !is_sub_user || team_access?.permissions?.settings_account_detail === 'full', [is_sub_user, team_access]);

  // Fetch profile details
  const { data: profileResponse } = useGetProfile();
  const profile = profileResponse?.data;

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
  // const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const [editingAddressId, setEditingAddressId] = useState<string | null>(null);



  const handleInputChange = (value: any, name: string) => {
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
      showToast("Please enter a valid phone number", 'error');
      return;
    }

    const payload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      mobile: cleanSpaces(formData.phone),
      personal_email: formData.email,
      business_name: formData.companyName,
      gst_number: formData.abn,
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full items-start">

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
        className="col-span-12 lg:col-span-8 flex"
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
                errormsg={!formData.phone ? "Please enter phone number" : "Please enter valid phone number"}
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
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Balance Card */}
      <motion.div
        custom={1}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="col-span-12 lg:col-span-4 flex h-fit"
      >
        <Card className="w-full border-gray-200 shadow-xs">
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
      </motion.div>
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
                  <div className="text-[13px] text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
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



            </div>
          </CardContent>
        </Card>
      </motion.div>




      {/* Address Information Card */}


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
