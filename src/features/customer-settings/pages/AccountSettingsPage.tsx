import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Edit2, Trash2, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormInput, FormSelect } from '@/features/orders/components/OrderFormUI';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CustomModel } from '@/components/ui/dialog';
import { showToast } from '@/components/ui/custom-toast';
import { PlaceAutocomplete } from '@/components/common/AutoComplateAddress';
import { useAppSelector } from '@/hooks/store.hooks';
import SubscriptionPlanModal from '../components/SubscriptionPlanModal';
import { CreateAddressDialog } from '@/features/address-book/components/CreateAddressDialog';
import { STATES } from '@/constants';

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
  const { user } = useAppSelector((state) => state.auth);
  const { summary } = useAppSelector((state) => state.wallet);
  // Initial Form values matching user's request
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    abn: '',
    address: '',
    // streetNumber: '',
    street: '',
    // streetType: '',
    suburb: '',
    state: '',
    postcode: '3810',
  });
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);



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
    setIsEditingProfile(false);
    // showToast("Profile updated successfully!", "success");
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

    // showToast("Password updated successfully!", "success");
    setIsPasswordOpen(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handleEditClick = () => {
    setBackupData({ ...formData });
    setIsEditingProfile(true);
  };

  useEffect(() => {
    if (user) {
      const data = {
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        phone: user.personal_mobile || '',
        companyName: user.business_name || '',
        abn: '',
        address: user.addresses[0]?.address || '',
        // streetNumber: user.addresses[0]?.street_number || '',
        // streetName: user.addresses[0]?.street_name || '',
        // streetType: user.addresses[0]?.street_type || '',
        street: user.addresses[0]?.street || '',
        suburb: user.addresses[0]?.suburb || '',
        state: user.addresses[0]?.state || '',
        postcode: user.addresses[0]?.postcode || '',
      }
      setFormData(data);
      setBackupData(data)
    }
  }, [user]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full items-start">

      <div className="col-span-12 ml-auto">
        <Button variant="outline" size="sm" onClick={() => setIsPasswordOpen(true)} className="h-8 px-3 text-[12px] font-medium text-gray-700 shadow-sm shrink-0 rounded-sm">
          Change Password
        </Button>
      </div>

      {/* Left Column: Company Information Form */}
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="lg:col-span-6 flex"
      >
        <Card className="flex flex-col w-full hover:shadow-md transition-shadow duration-300 border-gray-200/60 shadow-xs rounded-md">
          <CardHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-zinc-800 bg-slate-50/30 dark:bg-zinc-950 space-y-0 rounded-t-md">
            <CardTitle className="text-[15px] font-medium text-gray-800 dark:text-zinc-200">Company Information</CardTitle>
            {isEditingProfile ? (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={onCancel} className="h-8 px-3 text-[12px] font-medium rounded-sm">
                  Cancel
                </Button>
                <Button size="sm" onClick={onSave} className="h-8 px-3 text-[12px] font-medium text-white rounded-sm">
                  Save
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleEditClick} className="pt-[2px] h-8 px-3 text-[12px] font-medium text-gray-700 shadow-sm shrink-0 rounded-sm">
                  <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                  Edit
                </Button>
              </div>
            )}
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
              />
              <FormInput
                label="Last Name"
                required
                disabled={!isEditingProfile}
                isHalf
                value={formData.lastName}
                onChange={(val) => handleInputChange(val, 'lastName')}
              />

              {/* Row 2: email, phone */}
              <FormInput
                label="Email Address"
                type="email"
                required
                disabled={!isEditingProfile}
                isHalf
                value={formData.email}
                onChange={(val) => handleInputChange(val, 'email')}
              />
              <FormInput
                label="Phone"
                disabled={!isEditingProfile}
                isHalf
                value={formData.phone}
                onChange={(val) => handleInputChange(val, 'phone')}
              />

              {/* Row 3: company name , ABN */}
              <FormInput
                label="Company Name"
                required
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

              {/* Row 4: address Line */}
              <div className="col-span-12">
                <PlaceAutocomplete
                  label="Address"
                  className="w-full col-span-12"
                  inputClassName="w-full col-span-12"
                  isFullWidth
                  disabled={!isEditingProfile}
                  value={formData.address}
                  onChange={(val) => handleInputChange(val, 'address')}
                  onPlaceSelect={(opt) => {
                    setFormData(prev => ({
                      ...prev,
                      address: opt.formatted_address || opt.address1,
                      // streetNumber: opt.street_number || '',
                      // streetName: opt.street_name || '',
                      // streetType: opt.street_type || '',
                      street: opt.street || '',
                      suburb: opt.suburb,
                      state: opt.state,
                      postcode: opt.post_code,
                    }));
                  }}
                />
              </div>

              {/* Row 5: streetNumber, streetName, streetType */}
              <div className="col-span-3">
                <FormInput
                  label="Street Number"
                  required
                  disabled={!isEditingProfile}
                  value={formData.street}
                  onChange={(val) => handleInputChange(val, 'street')}
                />
              </div>

              {/* Row 6: suburb, state, postcode */}
              <div className="col-span-4">
                <FormInput
                  label="Suburb"
                  required
                  disabled={!isEditingProfile}
                  value={formData.suburb}
                  onChange={(val) => handleInputChange(val, 'suburb')}
                />
              </div>
              <div className="col-span-4">
                <FormSelect
                  label="State"
                  required
                  options={STATES}
                  disabled={!isEditingProfile}
                  value={formData.state}
                  onValueChange={(val) => handleInputChange(val, 'state')}
                />
              </div>
              <div className="col-span-4">
                <FormInput
                  label="Postcode"
                  required
                  disabled={!isEditingProfile}
                  value={formData.postcode}
                  onChange={(val) => handleInputChange(val, 'postcode')}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Right Column: Balance, Plan Information, Sender Address */}
      <div className="lg:col-span-6 flex flex-col gap-4">

        {/* Balance Card */}
        <motion.div custom={1} initial="hidden" animate="visible" variants={cardVariants} className="flex h-fit">
          <Card className="w-full border-gray-200/60 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-zinc-800 bg-slate-50/30 dark:bg-zinc-950 space-y-0 rounded-t-md">
              <CardTitle className="text-[15px] font-medium text-gray-800 dark:text-zinc-200">Balance</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-slate-500">Current Balance:</span>
                <span className="text-[13px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400 px-2 py-0.5 rounded-sm">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(summary?.wallet_balance || 0))}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Plan Information Card */}
        <motion.div custom={2} initial="hidden" animate="visible" variants={cardVariants} className="flex">
          <Card className="w-full border-gray-200/60 ">
            <CardHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-zinc-800 bg-slate-50/30 dark:bg-zinc-950 space-y-0 rounded-t-md">
              <CardTitle className="text-[15px] font-medium text-gray-800 dark:text-zinc-200">Plan Information</CardTitle>
              <Button
                size="sm"
                className="h-8 px-4 text-[13px] font-medium text-white shadow-sm shrink-0 rounded-sm"
                onClick={() => setIsPlanModalOpen(true)}
              >
                Upgrade Plan
              </Button>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-3">
              <div className="text-[13px] font-medium text-slate-800 dark:text-zinc-200">
                <span className="text-slate-500 dark:text-zinc-400">Current Plan: </span>
                <span className="font-bold text-slate-900 dark:text-zinc-100">Silver</span>
              </div>
              <div className="flex items-center gap-6 text-[13px] font-semibold text-indigo-900/80 dark:text-indigo-300">
                <span>Channels: <span className="font-medium text-slate-500">0/99</span></span>
                <span>Couriers: <span className="font-medium text-slate-500">3/99</span></span>
                <span>Shipments: <span className="font-medium text-slate-500">4/2000</span></span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sender Address Card */}
        <motion.div custom={3} initial="hidden" animate="visible" variants={cardVariants} className="flex">
          <Card className="flex flex-col w-full transition-shadow duration-300 border-gray-200/60">
            <CardHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-zinc-800 bg-slate-50/30 dark:bg-zinc-950 space-y-0 rounded-t-md">
              <CardTitle className="text-[15px] font-medium text-gray-800 dark:text-zinc-200">Sender Address</CardTitle>
              <Button
                size="sm"
                onClick={() => {
                  setEditingAddressId('');
                  setIsDialogOpen(true);
                }}
                className="h-8 px-4 text-[13px] font-medium text-white shadow-sm shrink-0 rounded-sm">
                Add Address
              </Button>
            </CardHeader>

            <CardContent className="p-0 flex-1">
              <div className='space-y-4 p-4 pt-0'>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-gray-50/50 dark:hover:bg-zinc-900/50 transition-colors gap-4 sm:gap-0">
                  {/* Left: User/Name */}
                  <div className="flex items-center gap-2 min-w-[120px]">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 px-2 py-0.5 rounded-sm">Test</span>
                  </div>

                  {/* Middle: Address & Default Badge */}
                  <div className="flex items-center gap-2 flex-1 justify-center text-center">
                    <Map className="w-4 h-4 text-[#5D6B98] shrink-0" />
                    <span className="text-[13px] font-medium text-[#5D6B98] uppercase tracking-wide">
                      {formData.suburb}, {formData.state}, {formData.postcode}, AU
                    </span>
                    <span className="text-[10px] font-medium bg-orange-100 text-orange-600 px-2 py-0.5 rounded-sm ml-2 shrink-0">default</span>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-3 min-w-[80px] justify-end">
                    <button className="text-blue-500 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => {
                      setEditingAddressId('');
                      setIsDialogOpen(true);
                    }}>
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <div className="h-4 w-[1px] bg-gray-200 dark:bg-zinc-700"></div>
                    <button className="text-red-500 cursor-pointer hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-gray-50/50 dark:hover:bg-zinc-900/50 transition-colors gap-4 sm:gap-0">
                  {/* Left: User/Name */}
                  <div className="flex items-center gap-2 min-w-[120px]">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 px-2 py-0.5 rounded-sm">Test</span>
                  </div>

                  {/* Middle: Address & Default Badge */}
                  <div className="flex items-center gap-2 flex-1 justify-center text-center">
                    <Map className="w-4 h-4 text-[#5D6B98] shrink-0" />
                    <span className="text-[13px] font-medium text-[#5D6B98] uppercase tracking-wide">
                      {formData.suburb}, {formData.state}, {formData.postcode}, AU
                    </span>
                    <span className="text-[10px] font-medium bg-orange-100 text-orange-600 px-2 py-0.5 rounded-sm ml-2 shrink-0">default</span>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-3 min-w-[80px] justify-end">
                    <button className="text-blue-500 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => {
                      setEditingAddressId('');
                      setIsDialogOpen(true);
                    }}>
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <div className="h-4 w-[1px] bg-gray-200 dark:bg-zinc-700"></div>
                    <button className="text-red-500 cursor-pointer hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>

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
      >
        <div className="py-2 space-y-4">
          <div className="grid grid-cols-12 gap-y-3.5">
            <FormInput
              label="Current Password"
              type="password"
              required
              isFullWidth
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
        />
      )}

      {isDialogOpen && (

        <CreateAddressDialog
          key={isDialogOpen ? (editingAddressId || 'new') : 'closed'}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={() => { }}
          editingAddressId={editingAddressId}
          isLoading={false}
        />
      )}
    </div>
  );
}
