import { useState, useEffect } from 'react';
import { Loader2, Info, Search, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormInput, FormSelect } from '@/features/orders/components/OrderFormUI';
import { Checkbox } from '@/components/ui/checkbox';
import {
  useUpdateAdvancedSettings,
  useToggleProductStatus,
  usePatchProductStatus,
  useAddManualProduct,
  useUpdateManualProduct,
  useDeleteManualProduct
} from '@/features/integrations/hooks/useIntegrations';
import { showToast } from '@/components/ui/custom-toast';
import { ConformationModal } from '@/components/common/ConformationModal';

const CARRIER_TIPS: Record<string, { title: string; description: React.ReactNode }> = {
  auspost: {
    title: "Finding Your API Credentials",
    description: (
      <>
        From <strong>Australia Post Developer Centre (developers.auspost.com.au) → Projects → Create a Project → Request Access to Shipping and Tracking API</strong>. These credentials authorize your system with Australia Post's enterprise servers to pull negotiated contract rates, book pick-ups, and generate standard eParcel labels.
      </>
    )
  },
  aramex: {
    title: "Finding API Keys",
    description: (
      <>
        From <strong>Aramex Connect → Administration → API Keys</strong>. These keys authorize your store with Aramex's servers.
      </>
    )
  },
  mypostbusiness: {
    title: "Finding Your Merchant Token",
    description: (
      <>
        From <strong>MyPost Business Portal → Account Settings → Platform Partners</strong>. Connect your ecommerce platform or register your application to generate your unique Merchant Token. This token securely authorizes your store with Australia Post's servers to calculate live volume-based savings and instantly generate shipping labels.
      </>
    )
  },
  directfreight: {
    title: "Finding API Credentials",
    description: (
      <>
        From <strong>Direct Freight Portal → Developer Centre</strong>. Follow the instructions to generate your authorization keys. These keys securely connect your store with Direct Freight Express's servers to handle live pricing and shipping labels.
      </>
    )
  }
};

// const SETTING_DESCRIPTIONS: Record<string, string> = {
//   authority_to_leave: "Allow courier to leave parcel without signature.",
//   safe_drop: "Enable recipient to request safe drop locations.",
//   email_tracking_notification: "Notify customer of delivery milestones.",
// };

const GUIDE_TIPS: Record<string, { title: string; content: React.ReactNode }> = {
  auspost: {
    title: "API Credentials",
    content: (
      <div className="space-y-4 text-left">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200">API Credentials</h4>
          <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Enter your Auspost API credentials to connect your account securely.
          </p>
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200">Secure Storage</h4>
          <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Your credentials are encrypted and stored securely.
          </p>
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200">Shipment Management</h4>
          <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Create and manage Auspost shipments directly from the portal.
          </p>
        </div>
      </div>
    )
  },
  aramex: {
    title: "Setting up Aramex as a courier",
    content: (
      <div className="space-y-3.5 text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed text-left">
        <p>
          To set up Aramex, you firstly need to create your API Key and secret by logging into Aramex,{' '}
          <a
            href="https://identity.aramexconnect.com.au/Account/Login"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-semibold"
          >
            click here
          </a>.
        </p>
        <p>
          After you have logged in, please navigate to <strong>Administration → API Keys → Create Key</strong>
        </p>
        <p>
          Once you have your Client ID and Secret, save the form. We verify the keys with Aramex and, when their API returns it, show your organisation name on this page.
        </p>
        <p>
          Enter your Client ID and Client Secret
        </p>
        <p>
          <a
            href="https://www.aramex.com.au/tools/integrations/business-api/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-semibold"
          >
            See more detailed instructions on how to get set up.
          </a>
        </p>
      </div>
    )
  },
  directfreight: {
    title: "API Credentials",
    content: (
      <div className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed text-left">
        <p>
          Enter your Direct Freight API credentials to enable shipment creation and tracking directly from the portal.
        </p>
      </div>
    )
  },
  mypostbusiness: {
    title: "API Credentials Guide",
    content: (
      <div className="space-y-2 text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed text-left">
        <p>
          Visit the MyPost Business Portal and log in.
        </p>
        <p>
          Go to Account Settings &gt; Platform Partners.
        </p>
        <p>
          Register your platform or integration to obtain your unique Merchant Token.
        </p>
        <p>
          Copy and paste the Merchant Token into the Connection Details section.
        </p>
      </div>
    )
  }
};

interface CarrierConfigTipProps {
  selectedCarrier: string;
}

function CarrierConfigTip({ selectedCarrier }: CarrierConfigTipProps) {
  const tip = GUIDE_TIPS[selectedCarrier];
  if (!tip) return null;

  return (
    <div className="w-full bg-linear-to-r from-blue-50/70 via-indigo-50/40 to-blue-50/70 dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-blue-950/20 border border-blue-100/50 dark:border-blue-900/30 rounded-sm p-3.5 shadow-sm ">
      <div className='flex items-center mb-4 gap-3'>
        <div className="bg-primary/10 dark:bg-blue-900/50 p-1.5 rounded-md text-primary dark:text-blue-400 shrink-0">
          <Info className="w-4 h-4" />
        </div>
        <span className="text-base font-bold text-slate-800 dark:text-zinc-200 block">{tip.title}</span>
      </div>
      <div className="space-y-0.5">
        {tip.content}
      </div>
    </div>
  );
}

interface CarrierConfigFormProps {
  selectedCarrier: string;
  initialValues?: any;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  isConnected?: boolean;
}

export default function CarrierConfigForm({
  selectedCarrier,
  initialValues = {},
  onSubmit,
  isLoading = false,
  isConnected
}: CarrierConfigFormProps) {
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState('');

  const [isAddingNewProduct, setIsAddingNewProduct] = useState(false);
  const [newProductForm, setNewProductForm] = useState({ product_name: '', product_code: '', enabled: false, manual: true });

  const [editingProductCode, setEditingProductCode] = useState<string | null>(null);
  const [editingProductForm, setEditingProductForm] = useState({ product_name: '', product_code: '', enabled: false });

  const updateSettingsMut = useUpdateAdvancedSettings();
  const toggleProductMut = useToggleProductStatus();
  const patchProductMut = usePatchProductStatus();
  const addProductMut = useAddManualProduct();
  const updateManualProductMut = useUpdateManualProduct();
  const deleteManualProductMut = useDeleteManualProduct();

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{ code: string; name: string } | null>(null);

  const handleUpdateProduct = (originalProductCode: string) => {
    if (!editingProductForm.product_name.trim()) {
      showToast("Product Name is required", "error");
      return;
    }
    if (!editingProductForm.product_code.trim()) {
      showToast("Product Code is required", "error");
      return;
    }

    updateManualProductMut.mutate({
      provider: selectedCarrier,
      productCode: originalProductCode,
      data: {
        product_name: editingProductForm.product_name.trim(),
        product_code: editingProductForm.product_code.trim().toUpperCase(),
        enabled: editingProductForm.enabled
      }
    }, {
      onSuccess: () => {
        setEditingProductCode(null);
        setFormData((prev: any) => ({
          ...prev,
          products: prev.products?.map((p: any) =>
            p.product_code === originalProductCode
              ? {
                ...p,
                product_name: editingProductForm.product_name.trim(),
                product_code: editingProductForm.product_code.trim().toUpperCase(),
                enabled: editingProductForm.enabled,
                status: editingProductForm.enabled ? 'enabled' : 'disabled'
              }
              : p
          ) || []
        }));
      }
    });
  };

  const handleDeleteProduct = (productCode: string, productName: string) => {
    setProductToDelete({ code: productCode, name: productName });
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!productToDelete) return;
    deleteManualProductMut.mutate({
      provider: selectedCarrier,
      productCode: productToDelete.code
    }, {
      onSuccess: () => {
        setFormData((prev: any) => ({
          ...prev,
          products: prev.products?.filter((p: any) => p.product_code !== productToDelete.code) || []
        }));
        setDeleteConfirmOpen(false);
        setProductToDelete(null);
      },
      onError: () => {
        setDeleteConfirmOpen(false);
        setProductToDelete(null);
      }
    });
  };

  const handleCreateProduct = () => {
    if (!newProductForm.product_name.trim()) {
      showToast("Product Name is required", "error");
      return;
    }
    if (!newProductForm.product_code.trim()) {
      showToast("Product Code is required", "error");
      return;
    }

    addProductMut.mutate({
      provider: selectedCarrier,
      data: {
        product_name: newProductForm.product_name.trim(),
        product_code: newProductForm.product_code.trim().toUpperCase(),
        enabled: newProductForm.enabled
      }
    }, {
      onSuccess: () => {
        setIsAddingNewProduct(false);
        setFormData((prev: any) => ({
          ...prev,
          products: [
            {
              product_name: newProductForm.product_name.trim(),
              product_code: newProductForm.product_code.trim().toUpperCase(),
              enabled: newProductForm.enabled,
              status: newProductForm.enabled ? 'enabled' : 'disabled',
              manual: true
            },
            ...(prev.products || [])
          ]
        }));
      }
    });
  };

  useEffect(() => {
    setFormData(initialValues || {});
    setErrors({});
    setSubmitted(false);
  }, [initialValues]);

  const handleProductToggle = (productCode: string, checked: boolean) => {
    setFormData((prev: any) => ({
      ...prev,
      products: prev.products?.map((p: any) =>
        p.product_code === productCode ? { ...p, enabled: checked, status: checked ? 'enabled' : 'disabled' } : p
      ) || []
    }));

    if (selectedCarrier === 'aramex' || selectedCarrier === 'directfreight') {
      patchProductMut.mutate({
        provider: selectedCarrier,
        productCode,
        enabled: checked
      });
    } else {
      toggleProductMut.mutate({
        provider: selectedCarrier,
        productCode,
        enabled: checked
      });
    }
  };

  // const handleSelectAllProducts = () => {
  //   setFormData((prev: any) => ({
  //     ...prev,
  //     products: prev.products?.map((p: any) => ({ ...p, enabled: true, status: 'enabled' })) || []
  //   }));
  // };

  const handleAdvancedSettingChange = (key: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      advanced_settings: {
        ...prev.advanced_settings,
        settings: prev.advanced_settings?.settings?.map((s: any) =>
          s.key === key ? { ...s, value } : s
        ) || []
      }
    }));
  };

  const handleInputChange = (value: any, name: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const requiredFields: Record<string, string[]> = {
      auspost: ['api_key', 'api_password', 'account_number', 'account_label'],
      aramex: ['client_id', 'client_secret', 'account_name', 'account_label'],
      mypostbusiness: ['merchant_token', 'account_label'],
      directfreight: ['token', 'account', 'site_id', 'base_url', 'consignment_token', 'account_label']
    };

    const fieldsToValidate = requiredFields[selectedCarrier] || [];
    fieldsToValidate.forEach(field => {
      if (!formData[field] || (typeof formData[field] === 'string' && !formData[field].trim())) {
        const label = field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        newErrors[field] = `Please enter ${label}`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSubmitted(true);
    if (!validateForm()) {
      return;
    }
    onSubmit(formData);
  };

  const handleAdvancedSettingsSave = () => {
    const settingsPayload: Record<string, any> = {};
    formData.advanced_settings?.settings?.forEach((s: any) => {
      settingsPayload[s.key] = s.value;
    });

    updateSettingsMut.mutate({
      provider: selectedCarrier,
      settings: settingsPayload
    });
  };



  const commonProps = (name: string) => ({
    name,
    value: formData[name] || "",
    onChange: (val: any) => handleInputChange(val, name),
    required: true,
    error: submitted && !!errors[name],
    errormsg: errors[name],
    isHalf: true,
    // isFullWidth: name === 'base_url'
  });

  const getCredentialsFields = () => {
    switch (selectedCarrier) {
      case 'auspost':
        return (
          <>
            <FormInput label="API Key" {...commonProps("api_key")} />
            <FormInput label="API Password" {...commonProps("api_password")} type="password" />
            {/* <FormInput label="Base URL" {...commonProps("base_url")} placeholder="https://digitalapi.auspost.com.au/test/" /> */}
            <FormInput label="Account Number" {...commonProps("account_number")} />
            <FormInput label="Account Label" {...commonProps("account_label")} />
          </>
        );
      case 'aramex':
        return (
          <>
            <FormInput label="Client ID" {...commonProps("client_id")} />
            <FormInput label="Client Secret" {...commonProps("client_secret")} type="password" />
            <FormInput label="Account Name" {...commonProps("account_name")} />
            <FormInput label="Account Label" {...commonProps("account_label")} />
          </>
        );
      case 'mypostbusiness':
        return (
          <>
            <FormInput label="Merchant Token" {...commonProps("merchant_token")} />
            {/* <FormInput label="Base URL" {...commonProps("base_url")} placeholder="https://digitalapi.auspost.com.au/test" /> */}
            <FormInput label="Account Label" {...commonProps("account_label")} />
          </>
        );
      case 'directfreight':
        return (
          <>
            <FormInput label="Token" {...commonProps("token")} />
            <FormInput label="Account" {...commonProps("account")} />
            <FormInput label="Site ID" {...commonProps("site_id")} />
            {/* <FormInput label="Base URL" {...commonProps("base_url")} /> */}
            <FormInput label="Consignment Token" {...commonProps("consignment_token")} />
            <FormInput label="Account Label" {...commonProps("account_label")} />
          </>
        );
      default:
        return (
          <div className="py-10 text-center col-span-12">
            <p className="text-slate-500">Configuration is coming soon.</p>
          </div>
        );
    }
  };

  const tip = selectedCarrier ? CARRIER_TIPS[selectedCarrier] : null;

  return (
    <form id="carrier-config-form" onSubmit={handleSubmit} className="space-y-6 mt-4">
      <div className="grid grid-cols-12 gap-x-6 gap-y-3.5 items-start">
        {/* Left Column: Form Credentials Fields */}
        <div className="col-span-12 md:col-span-7 border flex flex-col h-full p-4 rounded-sm shadow-sm">
          <div className="flex-1 grid grid-cols-12 gap-x-4 ">
            {getCredentialsFields()}
          </div>
          <div className='mt-6 justify-end self-end'>
            <Button
              type="submit"
              disabled={isLoading}
              className="h-8 text-sm px-5 font-semibold"
            >
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : null}
              Save & Connect
            </Button>
          </div>
        </div>

        {/* Right Column: Config Tip */}
        {tip && (
          <div className="col-span-12 md:col-span-5">
            <CarrierConfigTip selectedCarrier={selectedCarrier} />
          </div>
        )}

        {/* Devider */}
        <div className="col-span-12 flex justify-start pb-4 border-b border-gray-200 dark:border-zinc-800" />


        {/* Advanced Settings Column (left) */}
        {formData.advanced_settings?.settings && formData.advanced_settings.settings.length > 0 && (
          <div className="col-span-12 md:col-span-4 mt-4 space-y-4 text-left">
            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-wide">Advanced Settings</h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Configure additional preferences for label printing and delivery defaults.</p>
            </div>
            <div className="grid grid-cols-12 gap-x-4 gap-y-1 w-full">
              {formData.advanced_settings.settings.map((setting: any) => {
                if (setting.type === 'checkbox') {
                  return (
                    <div
                      key={setting.key}
                      className="col-span-12 flex items-center gap-3 py-1 px-1"
                    >
                      <Checkbox
                        id={`setting-${setting.key}`}
                        checked={setting.value}
                        onCheckedChange={(checked) => handleAdvancedSettingChange(setting.key, !!checked)}
                        disabled={!isConnected}
                      />
                      <label
                        htmlFor={`setting-${setting.key}`}
                        className="text-sm font-medium text-slate-700 dark:text-zinc-300 cursor-pointer select-none"
                      >
                        {setting.label}
                      </label>
                    </div>
                  );
                } else if (setting.type === 'dropdown') {
                  const options = (formData.advanced_settings.print_format_options || []).map((opt: string) => ({
                    label: opt,
                    value: opt
                  }));
                  return (
                    <div className="col-span-6" key={setting.key}>
                      <FormSelect
                        label={setting.label + ':'}
                        options={options}
                        value={setting.value || ''}
                        onValueChange={(val) => handleAdvancedSettingChange(setting.key, val)}
                        placeholder="Select format..."
                        isHalf={true}
                        allowClear={false}
                        layout='horizontal'
                        selectClassName='w-50'
                      />
                    </div>
                  );
                }
                return null;
              })}
            </div>

            {isConnected && (
              <div className='flex mt-6'>
                <Button
                  type="button"
                  className='h-8 text-sm rounded-sm px-5 font-semibold'
                  onClick={handleAdvancedSettingsSave}
                  disabled={updateSettingsMut.isPending || !isConnected}
                >
                  {updateSettingsMut.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : null}
                  Save Settings
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Supported Products Column (right) */}
        {formData.products && (() => {
          const filteredProducts = formData.products.filter((product: any) => {
            const term = productSearchTerm.toLowerCase();
            return (
              product.product_name?.toLowerCase().includes(term) ||
              product.product_code?.toLowerCase().includes(term)
            );
          });
          return (
            <div className="col-span-12 md:col-span-8 mt-4 space-y-4 text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-wide">Supported Products</h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">Enable or disable specific shipping products/services for this courier.</p>
                </div>
                <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
                  <div className="w-full md:w-60">
                    <FormInput
                      placeholder="Search products..."
                      value={productSearchTerm}
                      onChange={(val) => setProductSearchTerm(val)}
                      icon={Search}
                      isHalf={false}
                      isFullWidth={true}
                      className="mb-0"
                    />
                  </div>
                  {isConnected && (
                    <Button
                      type="button"
                      variant="outline"
                      className="h-8 text-sm px-4 font-semibold shrink-0"
                      onClick={() => {
                        setIsAddingNewProduct(true);
                        setNewProductForm({ product_name: '', product_code: '', enabled: false, manual: true });
                      }}
                    >
                      Add Product
                    </Button>
                  )}
                </div>
              </div>
              <div className="border border-gray-100 dark:border-zinc-800 rounded-lg overflow-hidden">
                <div className="overflow-y-auto no-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50/40 dark:bg-zinc-900/20 text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                        <th className="py-2.5 px-4">Product Name</th>
                        <th className="py-2.5 px-4 w-24">Code</th>
                        <th className="py-2.5 px-4 w-20 text-center">Status</th>
                        <th className="py-2.5 px-4 w-28 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-zinc-850">
                      {isAddingNewProduct && (
                        <tr className="bg-slate-50/50 dark:bg-zinc-900/40 border-b border-gray-100 dark:border-zinc-800">
                          <td className="py-2.5 px-4">
                            <input
                              type="text"
                              value={newProductForm.product_name}
                              onChange={(e) => setNewProductForm(prev => ({ ...prev, product_name: e.target.value }))}
                              placeholder="Product Name"
                              className="h-8 w-full bg-white dark:bg-zinc-950 border border-gray-250 dark:border-zinc-800 rounded px-2.5 text-sm text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                              disabled={addProductMut.isPending}
                              autoFocus
                            />
                          </td>
                          <td className="py-2.5 px-4">
                            <input
                              type="text"
                              value={newProductForm.product_code}
                              onChange={(e) => setNewProductForm(prev => ({ ...prev, product_code: e.target.value }))}
                              placeholder="Code"
                              className="h-8 w-full bg-white dark:bg-zinc-950 border border-gray-250 dark:border-zinc-800 rounded px-2.5 text-sm font-mono uppercase text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                              disabled={addProductMut.isPending}
                            />
                          </td>
                          <td className="py-2.5 px-4 text-center">
                            <div className="flex items-center justify-center">
                              <Checkbox
                                id="new-product-status-checkbox"
                                checked={newProductForm.enabled}
                                onCheckedChange={(checked) => setNewProductForm(prev => ({ ...prev, enabled: !!checked }))}
                                disabled={addProductMut.isPending}
                              />
                            </div>
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5 shrink-0">
                              <Button
                                type="button"
                                size="sm"
                                className="h-7 text-xs px-2.5 font-bold"
                                onClick={handleCreateProduct}
                                disabled={addProductMut.isPending}
                              >
                                {addProductMut.isPending ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                                Add
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                className="h-7 text-xs px-2.5 text-slate-500 hover:text-slate-700"
                                onClick={() => setIsAddingNewProduct(false)}
                                disabled={addProductMut.isPending}
                              >
                                Cancel
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )}
                      {filteredProducts.length === 0 ? (
                        !isAddingNewProduct && (
                          <tr>
                            <td colSpan={4} className="py-8 text-center text-xs text-slate-400 dark:text-zinc-550">
                              No products match your search.
                            </td>
                          </tr>
                        )
                      ) : (
                        filteredProducts.map((product: any) => {
                          const isEditing = editingProductCode === product.product_code;
                          const isManual = product.manual === true || product.manual === 1;

                          if (isEditing) {
                            return (
                              <tr
                                key={product.product_code}
                                className="bg-slate-50/50 dark:bg-zinc-900/40 border-b border-gray-100 dark:border-zinc-800"
                              >
                                <td className="py-2.5 px-4">
                                  <input
                                    type="text"
                                    value={editingProductForm.product_name}
                                    onChange={(e) => setEditingProductForm(prev => ({ ...prev, product_name: e.target.value }))}
                                    placeholder="Product Name"
                                    className="h-8 w-full bg-white dark:bg-zinc-950 border border-gray-250 dark:border-zinc-800 rounded px-2.5 text-sm text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                    disabled={updateManualProductMut.isPending}
                                    autoFocus
                                  />
                                </td>
                                <td className="py-2.5 px-4">
                                  <input
                                    type="text"
                                    value={editingProductForm.product_code}
                                    onChange={(e) => setEditingProductForm(prev => ({ ...prev, product_code: e.target.value }))}
                                    placeholder="Code"
                                    className="h-8 w-full bg-white dark:bg-zinc-950 border border-gray-250 dark:border-zinc-800 rounded px-2.5 text-sm font-mono uppercase text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                    disabled={updateManualProductMut.isPending}
                                  />
                                </td>
                                <td className="py-2.5 px-4 text-center">
                                  <div className="flex items-center justify-center">
                                    <Checkbox
                                      checked={editingProductForm.enabled}
                                      onCheckedChange={(checked) => setEditingProductForm(prev => ({ ...prev, enabled: !!checked }))}
                                      disabled={updateManualProductMut.isPending || !isConnected}
                                    />
                                  </div>
                                </td>
                                <td className="py-2.5 px-4 text-right">
                                  <div className="flex items-center justify-end gap-1.5 shrink-0">
                                    <Button
                                      type="button"
                                      size="sm"
                                      className="h-7 text-xs px-2.5 font-bold"
                                      onClick={() => handleUpdateProduct(product.product_code)}
                                      disabled={updateManualProductMut.isPending}
                                    >
                                      {updateManualProductMut.isPending ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                                      Save
                                    </Button>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="ghost"
                                      className="h-7 text-xs px-2.5 text-slate-500 hover:text-slate-700"
                                      onClick={() => setEditingProductCode(null)}
                                      disabled={updateManualProductMut.isPending}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            );
                          }

                          return (
                            <tr
                              key={product.product_code}
                              className="hover:bg-gray-50/30 dark:hover:bg-zinc-900/10 transition-colors text-sm text-slate-700 dark:text-zinc-300"
                            >
                              <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-zinc-100">
                                {product.product_name}
                              </td>
                              <td className="py-2.5 px-4 font-mono text-[13px] text-slate-600 dark:text-zinc-550">
                                {product.product_code}
                              </td>
                              <td className="py-2.5 px-4 text-center">
                                <div className="flex items-center justify-center">
                                  <Checkbox
                                    checked={product.enabled}
                                    onCheckedChange={(checked) => handleProductToggle(product.product_code, !!checked)}
                                    disabled={(isManual && (updateManualProductMut.isPending || deleteManualProductMut.isPending)) || !isConnected}
                                  />
                                </div>
                              </td>
                              <td className="py-2.5 px-4 text-right">
                                {isManual ? (
                                  <div className="flex items-center justify-end gap-1">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 w-7 p-0 text-slate-500 hover:text-slate-700"
                                      onClick={() => {
                                        setEditingProductCode(product.product_code);
                                        setEditingProductForm({
                                          product_name: product.product_name,
                                          product_code: product.product_code,
                                          enabled: !!product.enabled
                                        });
                                      }}
                                      disabled={updateManualProductMut.isPending || deleteManualProductMut.isPending}
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                                      onClick={() => handleDeleteProduct(product.product_code, product.product_name)}
                                      disabled={updateManualProductMut.isPending || deleteManualProductMut.isPending}
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="h-7" />
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {deleteConfirmOpen && (
        <ConformationModal
          open={deleteConfirmOpen}
          onOpenChange={setDeleteConfirmOpen}
          title="Delete Product"
          description={
            productToDelete ? (
              <span>
                Are you sure you want to delete the product <strong>{productToDelete.name}</strong> ({productToDelete.code})? This action cannot be undone.
              </span>
            ) : undefined
          }
          confirmText="Delete"
          cancelText="Cancel"
          confirmVariant="destructive"
          loading={deleteManualProductMut.isPending}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </form>
  );
}
