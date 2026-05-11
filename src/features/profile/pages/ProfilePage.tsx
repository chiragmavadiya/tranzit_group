import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/features/orders/components/OrderFormUI';
import { User, Building, Phone, Mail, Lock, Save } from 'lucide-react';
import { ChangePasswordDialog } from '../components/ChangePasswordDialog';
import type { ProfileData } from '../types';

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData>({
    businessName: 'Tranzit Group',
    firstName: 'Super',
    lastName: 'Admin',
    mobileNumber: '0423692006',
    loginEmail: 'admin@gmail.com',
    personalEmail: 'admin.personal@gmail.com',
    personalMobile: '0423692006'
  });
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = () => {
    setSubmitted(true);
    // Simulate API call

    console.log('Saving profile data:', profileData, submitted);
  };

  const handleChangePassword = (data: any) => {
    console.log('Changing password:', data);
  };

  return (
    <div className="p-page-padding space-y-4 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="my-0 text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">My Profile</h1>
          <p className="my-0 text-sm text-slate-500 dark:text-zinc-400 mt-1">Manage your account settings and preferences.</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setIsPasswordDialogOpen(true)}
          className="gap-2 border-slate-200 dark:border-zinc-800 h-9 font-bold text-[13px]"
        >
          <Lock className="w-4 h-4" />
          Change Password
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8 space-y-4">
          {/* Business Details */}
          <Card className="shadow-sm gap-0 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <CardHeader className="pb-4 border-b border-gray-200 dark:border-zinc-900">
              <CardTitle className="inline-flex items-center gap-2 text-[15px] font-semibold text-slate-800 dark:text-zinc-100">
                <Building className="w-4 h-4 text-blue-500" />
                Business Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <FormInput
                label="Registered Business Name"
                placeholder="Enter your registered business name"
                value={profileData.businessName}
                onChange={(val) => handleInputChange('businessName', val)}
                isFullWidth
                icon={Building}
              />
            </CardContent>
          </Card>

          {/* Personal & Contact Details */}
          <Card className="shadow-sm gap-0 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <CardHeader className="pb-4 border-b border-gray-200 dark:border-zinc-900">
              <CardTitle className="inline-flex items-center gap-2 text-[15px] font-semibold text-slate-800 dark:text-zinc-100">
                <User className="w-4 h-4 text-blue-500" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-12 gap-5">
              <FormInput
                label="First Name"
                placeholder="First Name"
                value={profileData.firstName}
                onChange={(val) => handleInputChange('firstName', val)}
                isHalf
                icon={User}
              />
              <FormInput
                label="Last Name"
                placeholder="Last Name"
                value={profileData.lastName}
                onChange={(val) => handleInputChange('lastName', val)}
                isHalf
                icon={User}
              />
              <FormInput
                label="Login Email Address"
                placeholder="admin@example.com"
                value={profileData.loginEmail}
                onChange={(val) => handleInputChange('loginEmail', val)}
                isHalf
                icon={Mail}
                disabled
              />
              <FormInput
                label="Work Mobile Number"
                placeholder="0400 000 000"
                value={profileData.mobileNumber}
                onChange={(val) => handleInputChange('mobileNumber', val)}
                isHalf
                icon={Phone}
              />
            </CardContent>
          </Card>

          {/* Private Contact Details */}
          <Card className="shadow-sm gap-0 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <CardHeader className="pb-4 border-b border-gray-200 dark:border-zinc-900">
              <CardTitle className="inline-flex items-center gap-2 text-[15px] font-semibold text-slate-800 dark:text-zinc-100">
                <Mail className="w-4 h-4 text-blue-500" />
                Private Contact Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-12 gap-5">
              <FormInput
                label="Personal Email Address"
                placeholder="personal@example.com"
                value={profileData.personalEmail}
                onChange={(val) => handleInputChange('personalEmail', val)}
                isHalf
                icon={Mail}
              />
              <FormInput
                label="Personal Mobile Number"
                placeholder="0400 000 000"
                value={profileData.personalMobile}
                onChange={(val) => handleInputChange('personalMobile', val)}
                isHalf
                icon={Phone}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSaveChanges}
              className="bg-[#0060FE] hover:bg-blue-700 text-white gap-2 px-8 h-10 text-[13px] font-bold transition-all shadow-md active:scale-[0.98]"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Sidebar info */}
        <div className="col-span-12 lg:col-span-4">
          <Card className="bg-blue-50/50 py-0 dark:bg-blue-900/10 border-blue-100/50 dark:border-blue-800/30 sticky top-page-padding">
            <CardContent className="p-6">
              <h3 className="my-0 text-sm font-bold text-blue-900 dark:text-blue-400 mb-2 uppercase tracking-wider">Profile Information</h3>
              <p className="my-0 text-[13px] text-blue-800/70 dark:text-blue-300/70 leading-relaxed">
                Your profile information is used for communications and billing. Please ensure your contact details are kept up to date.
              </p>
              <div className="mt-4 pt-6 border-t border-blue-100 dark:border-blue-800/50 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center shadow-sm border border-blue-100/50 dark:border-blue-800/30">
                    <Building className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-[11px] my-0 font-bold text-blue-900/50 dark:text-blue-400/50 uppercase">Organization</p>
                    <p className="text-[13px] my-0 font-bold text-blue-900 dark:text-blue-100">{profileData.businessName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center shadow-sm border border-blue-100/50 dark:border-blue-800/30">
                    <Mail className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-[11px] my-0 font-bold text-blue-900/50 dark:text-blue-400/50 uppercase">Login ID</p>
                    <p className="text-[13px] my-0 font-bold text-blue-900 dark:text-blue-100">{profileData.loginEmail}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ChangePasswordDialog
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
        onSubmit={handleChangePassword}
      />
    </div>
  );
}
