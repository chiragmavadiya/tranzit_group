import { useState, useEffect } from 'react';
import { Loader2, Info, Search, Edit2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FormInput, FormSelect, FormTextarea } from '@/features/orders/components/OrderFormUI';
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

const CARRIER_NAMES: Record<string, string> = {
  auspost: "Australia Post",
  aramex: "Aramex",
  mypostbusiness: "MyPost Business",
  directfreight: "Direct Freight",
  couriersplease: "CouriersPlease"
};

const GUIDE_TIPS: Record<string, {
  portalName: string;
  portalUrl: string;
  supportUrl: string;
  credentialsList: string;
  customGuide?: React.ReactNode;
}> = {
  auspost: {
    portalName: "Australia Post Developer Centre",
    portalUrl: "https://developers.auspost.com.au/",
    supportUrl: "https://auspost.com.au/help-and-support",
    credentialsList: "API Key, API Password, and Account Number",
    customGuide: (
      <div className="space-y-4 text-left font-normal">
        <ol className="list-decimal pl-4 space-y-2 text-[13px] text-slate-600 dark:text-zinc-400">
          <li>
            Sign in to the{" "}
            <a
              href="https://developers.auspost.com.au/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold"
            >
              Australia Post Developer Centre
            </a>.
          </li>
          <li>Register for access to the Shipping and Tracking APIs.</li>
          <li>Create a production API key and API password.</li>
          <li>Confirm that the API key is linked to your eParcel charge account.</li>
          <li>Enter the details in Tranzit and select <strong>Save & test connection</strong>.</li>
          <li>Review and enable your available Australia Post services.</li>
        </ol>

        <p className="text-[12px] text-slate-400 dark:text-zinc-500 leading-normal italic mt-2">
          Australia Post asks customers to have their billing account numbers and integration details ready when registering for API access.
        </p>

        <div className="pt-4 border-t border-slate-100 dark:border-zinc-800/80 mt-4">
          <a
            href="https://developers.auspost.com.au/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-semibold text-[13px]"
          >
            How to obtain Australia Post eParcel API credentials
          </a>
        </div>
      </div>
    )
  },
  aramex: {
    portalName: "Aramex Connect portal",
    portalUrl: "https://identity.aramexconnect.com.au/Account/Login",
    supportUrl: "https://www.aramex.com.au/contact-us/",
    credentialsList: "Client ID and Client Secret",
    customGuide: (
      <div className="space-y-4 text-left font-normal">
        <ol className="list-decimal pl-4 space-y-2 text-[13px] text-slate-600 dark:text-zinc-400">
          <li>
            Sign in to your{" "}
            <a
              href="https://identity.aramexconnect.com.au/Account/Login"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold"
            >
              Aramex Australia account
            </a>.
          </li>
          <li>Open Administration.</li>
          <li>Select API Keys.</li>
          <li>Choose Create Key.</li>
          <li>Enter a description for the key and save it.</li>
          <li>Copy the Client ID and Client Secret.</li>
          <li>Return to Tranzit and enter the credentials.</li>
          <li>Select <strong>Save & Test Connection</strong>.</li>
        </ol>

        <p className="text-[12px] text-amber-600 dark:text-amber-500 leading-normal mt-2 bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100/50 dark:border-amber-900/30 rounded-lg p-2.5">
          <strong>Security warning:</strong> Store your Client Secret securely. Aramex may only display it when the API key is created.
        </p>

        <div className="pt-4 border-t border-slate-100 dark:border-zinc-800/80 mt-4">
          <a
            href="https://identity.aramexconnect.com.au/Account/Login"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-semibold text-[13px]"
          >
            How to generate Aramex API credentials
          </a>
        </div>
      </div>
    )
  },
  mypostbusiness: {
    portalName: "MyPost Business Portal",
    portalUrl: "https://mypostbusiness.auspost.com.au/",
    supportUrl: "https://auspost.com.au/help-and-support",
    credentialsList: "Merchant Token",
    customGuide: (
      <div className="space-y-4 text-left font-normal">
        <ol className="list-decimal pl-4 space-y-2 text-[13px] text-slate-600 dark:text-zinc-400">
          <li>Select <strong>Connect with Australia Post</strong>.</li>
          <li>
            Sign in to your MyPost Business account on the{" "}
            <a
              href="https://mypostbusiness.auspost.com.au/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold"
            >
              Australia Post website
            </a>.
          </li>
          <li>Review the permissions requested by Tranzit.</li>
          <li>Approve the connection.</li>
          <li>Return to Tranzit.</li>
          <li>Confirm your sending address and shipping preferences.</li>
        </ol>

        <div className="pt-4 border-t border-slate-100 dark:border-zinc-800/80 mt-4 space-y-1">
          <p className="text-[13px] font-bold text-slate-800 dark:text-zinc-200">
            Don’t have a MyPost Business account?
          </p>
          <p className="text-[13px] text-slate-500 dark:text-zinc-400 leading-normal">
            Create one with{" "}
            <a
              href="https://mypostbusiness.auspost.com.au/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold"
            >
              Australia Post
            </a>, then return here to connect it.
          </p>
          <p className="text-[12px] text-slate-400 dark:text-zinc-550 leading-normal mt-1 italic">
            MyPost Business is free to join and its discounts are based on eligible shipping spend.
          </p>
        </div>
      </div>
    )
  },
  directfreight: {
    portalName: "Direct Freight Portal",
    portalUrl: "https://www.directfreight.com.au/",
    supportUrl: "https://www.directfreight.com.au/Contact.aspx",
    credentialsList: "Token, Account number, Site ID, and Consignment Token",
    customGuide: (
      <div className="space-y-4 text-left font-normal">
        <ol className="list-decimal pl-4 space-y-2 text-[13px] text-slate-600 dark:text-zinc-400">
          <li>
            Contact{" "}
            <a
              href="https://www.directfreight.com.au/Contact.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold"
            >
              Direct Freight
            </a>{" "}
            to request API access.
          </li>
          <li>Obtain your API credentials.</li>
          <li>Enter your account details into Tranzit.</li>
          <li>Select <strong>Save & Test Connection</strong>.</li>
          <li>Review your available freight services.</li>
          <li>Configure your default delivery preferences.</li>
        </ol>
      </div>
    )
  },
  couriersplease: {
    portalName: "CouriersPlease portal",
    portalUrl: "https://www.couriersplease.com.au/",
    supportUrl: "https://www.couriersplease.com.au/contact-us",
    credentialsList: "account number and API password"
  }
};

interface CarrierConfigTipProps {
  selectedCarrier: string;
}

function CarrierConfigTip({ selectedCarrier }: CarrierConfigTipProps) {
  const tip = GUIDE_TIPS[selectedCarrier];
  if (!tip) return null;

  const displayName = CARRIER_NAMES[selectedCarrier] || selectedCarrier;

  return (
    <div className="w-full bg-slate-50 dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-800/80 rounded-xl p-6 md:p-8 shadow-xs text-left relative overflow-hidden transition-all duration-300 hover:shadow-sm">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className='flex items-center mb-5 gap-3'>
        <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-lg text-primary dark:text-primary-foreground shrink-0">
          <Info className="w-5 h-5 text-primary" />
        </div>
        <div>
          <span className="text-sm font-bold text-slate-900 dark:text-zinc-50 block uppercase tracking-wide">
            Before you connect
          </span>
          <span className="text-xs text-slate-500 dark:text-zinc-400 block mt-0.5 leading-normal font-normal">
            {selectedCarrier === 'auspost' && "You will need an active Australia Post eParcel contract account and approved Shipping and Tracking API credentials."}
            {selectedCarrier === 'mypostbusiness' && "Make sure you have an active MyPost Business account and access to the email address registered with Australia Post."}
            {selectedCarrier === 'aramex' && "You will need an active Aramex Australia account and API credentials generated from your Aramex account portal."}
            {selectedCarrier === 'directfreight' && "To connect your Direct Freight account, ensure that API access has been enabled by Direct Freight."}
            {selectedCarrier !== 'auspost' && selectedCarrier !== 'mypostbusiness' && selectedCarrier !== 'aramex' && selectedCarrier !== 'directfreight' && `Make sure you have an active ${displayName} account with API access enabled.`}
          </span>
        </div>
      </div>

      <div className="text-[13px] text-slate-600 dark:text-zinc-400 space-y-4 leading-relaxed font-normal">
        {tip.customGuide ? tip.customGuide : (
          <div className="space-y-4 text-left">
            <ol className="list-decimal pl-4 space-y-2 text-[13px] text-slate-600 dark:text-zinc-400 font-normal">
              <li>
                Sign in to your{" "}
                <a
                  href={tip.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-semibold"
                >
                  {tip.portalName}
                </a>{" "}
                or contact your account manager.
              </li>
              <li>Confirm that API access is enabled for your account.</li>
              <li>Obtain the {tip.credentialsList} required for integration.</li>
              <li>Enter the credentials and select <strong>Save & test connection</strong>.</li>
              <li>Review and enable your available shipping services.</li>
            </ol>

            <div className="pt-4 border-t border-slate-100 dark:border-zinc-800/80 mt-4 space-y-1.5">
              <p className="text-[13px] font-bold text-slate-800 dark:text-zinc-200">
                Need help finding your credentials?
              </p>
              <p className="text-[13px] text-slate-500 dark:text-zinc-400 leading-normal">
                View the{" "}
                <a
                  href={tip.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-semibold"
                >
                  {displayName} setup guide
                </a>{" "}
                or contact{" "}
                <a
                  href={tip.supportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-semibold"
                >
                  {displayName} support
                </a>
                .
              </p>
            </div>
          </div>
        )}
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
  canReadWrite: boolean;
}

export default function CarrierConfigForm({
  selectedCarrier,
  initialValues = {},
  onSubmit,
  isLoading = false,
  isConnected,
  canReadWrite = true
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
    setFormData((prev: any) => {
      const mutuallyExclusive: Record<string, string> = {
        authority_to_leave: 'signature_required',
        signature_required: 'authority_to_leave',
      };
      const opposite = mutuallyExclusive[key];
      const settings = prev.advanced_settings?.settings ?? [];
      const hasOpposite = opposite && settings.some((s: any) => s.key === opposite);

      return {
        ...prev,
        advanced_settings: {
          ...prev.advanced_settings,
          settings: settings.map((s: any) => {
            if (s.key === key) return { ...s, value };
            if (value && hasOpposite && s.key === opposite) return { ...s, value: false };
            return s;
          }),
        },
      };
    });
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
      auspost: ['api_key', 'api_password', 'account_number',],
      aramex: ['client_id', 'client_secret'],
      mypostbusiness: ['merchant_token'],
      directfreight: ['token', 'account', 'site_id', 'base_url', 'consignment_token'],
      couriersplease: ['username', 'password']
    };

    const fieldLabelMap: Record<string, string> = {
      api_key: 'API Key',
      api_password: 'API Secret',
      account_number: 'Account number',
      client_id: 'Client ID',
      client_secret: 'Client Secret',
      merchant_token: 'Merchant token',
      token: 'Token',
      account: 'Account number',
      site_id: 'Site ID',
      consignment_token: 'Consignment Token',
      username: 'Account number',
      password: 'API Secret'
    };

    const fieldsToValidate = requiredFields[selectedCarrier] || [];
    fieldsToValidate.forEach(field => {
      if (!formData[field] || (typeof formData[field] === 'string' && !formData[field].trim())) {
        const label = fieldLabelMap[field] || field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
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
    isHalf: false,
    isFullWidth: true,
    disabled: !canReadWrite
  });

  const getCredentialsFields = () => {
    switch (selectedCarrier) {
      case 'auspost':
        return (
          <>
            <div className="col-span-12 space-y-1">
              <FormInput label="eParcel account number" {...commonProps("account_number")} placeholder="For example: 0008494170" info="Enter the Australia Post charge account number linked to your eParcel contract." />
            </div>
            <div className="col-span-12 space-y-1">
              <FormInput label="API key" {...commonProps("api_key")} placeholder="Enter your API Key" info="Enter the API key created in the Australia Post Developer Centre for your Shipping and Tracking integration." />
            </div>
            <div className="col-span-12 space-y-1">
              <FormInput label="API Secret" {...commonProps("api_password")} type="password" placeholder="Enter your API Secret" info="Enter the API Secret created when your Australia Post API key was generated. This may also be referred to as the API secret." />
            </div>
            <div className="col-span-12 space-y-1">
              <FormInput label="Account label" {...commonProps("account_label")} required={false} placeholder="Enter your Account label" info="Enter a label for this account (optional)." />
            </div>
          </>
        );
      case 'aramex':
        return (
          <>
            <div className="col-span-12 space-y-1">
              <FormInput label="Client ID" {...commonProps("client_id")} placeholder="Enter your Client ID" info="Enter your Aramex Client ID." />
            </div>
            <div className="col-span-12 space-y-1">
              <FormInput label="Client Secret" {...commonProps("client_secret")} type="password" placeholder="Enter your Client Secret" info="Enter your Aramex Client Secret." />
            </div>
          </>
        );
      case 'mypostbusiness':
        return (
          <>
            <div className="col-span-12 space-y-1">
              <FormInput label="Merchant token" {...commonProps("merchant_token")} placeholder="Enter your Merchant Token" info="Enter your MyPost Business Merchant token." />
            </div>
            <div className="col-span-12 space-y-1">
              <FormInput label="Account label" {...commonProps("account_label")} required={false} placeholder="Enter your Account label" info="Enter a label for this account (optional)." />
            </div>
          </>
        );
      case 'directfreight':
        return (
          <>
            <div className="col-span-12 space-y-1">
              <FormInput label="Token" {...commonProps("token")} placeholder="Enter your Token" info="Enter your Direct Freight Token." />
            </div>
            <div className="col-span-12 space-y-1">
              <FormInput label="Account number" {...commonProps("account")} placeholder="Enter your Account number" info="Enter your Direct Freight Account number." />
            </div>
            <div className="col-span-12 space-y-1">
              <FormInput label="Site ID" {...commonProps("site_id")} placeholder="Enter your Site ID" info="Enter your Direct Freight Site ID." />
            </div>
            <div className="col-span-12 space-y-1">
              <FormInput label="Consignment Token" {...commonProps("consignment_token")} placeholder="Enter your Consignment Token" info="Enter your Direct Freight Consignment Token." />
            </div>
            <div className="col-span-12 space-y-1">
              <FormInput label="Account label" {...commonProps("account_label")} required={false} placeholder="Enter your Account label" info="Enter a label for this account (optional)." />
            </div>
          </>
        );
      case 'couriersplease':
        return (
          <>
            <div className="col-span-12 space-y-1">
              <FormInput label="Account number" {...commonProps("username")} placeholder="Enter your Account number" info="Enter your CouriersPlease account number provided by CouriersPlease" />
            </div>
            <div className="col-span-12 space-y-1">
              <FormInput label="API Secret" {...commonProps("password")} type="password" placeholder="Enter your API Secret" info="Enter the API Secret provided or enabled for your CouriersPlease account. This may be different from the Secret you use to sign in to the CouriersPlease portal." />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const tip = selectedCarrier ? GUIDE_TIPS[selectedCarrier] : null;

  return (
    <form id="carrier-config-form" onSubmit={handleSubmit} className="space-y-6 mt-4">
      <div className="grid grid-cols-12 gap-x-6 gap-y-3 items-start">
        {/* Left Column: Form Credentials Fields */}
        {tip && (
          <>
            <div className={cn(
              "col-span-12 flex flex-col justify-between text-left transition-all duration-300",
              tip ? "lg:col-span-7" : "lg:col-span-12",
              "bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-xl shadow-xs p-4 md:p-6"
            )}>
              {/* Header inside the form card */}
              <div className="mb-6">
                <h3 className="text-base font-bold text-slate-900 dark:text-zinc-50 my-0 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  {selectedCarrier === 'auspost'
                    ? 'Australia Post eParcel API credentials'
                    : `${(CARRIER_NAMES[selectedCarrier] || selectedCarrier)} account credentials`}
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 my-0 leading-normal">
                  {selectedCarrier === 'auspost' ? (
                    <>
                      Enter the API credentials associated with your Australia Post eParcel account. Your API key must be authorised to transact against the account number entered below.
                      <span className="block mt-1.5 text-[11px] text-slate-400 dark:text-zinc-500">
                        Australia Post Shipping and Tracking APIs use an API key and API Secret for authentication, together with the customer’s charge account number.
                      </span>
                    </>
                  ) : (
                    `Enter the credentials associated with your ${(CARRIER_NAMES[selectedCarrier] || selectedCarrier)} account. These details are used securely to connect Tranzit with ${(CARRIER_NAMES[selectedCarrier] || selectedCarrier)}.`
                  )}
                </p>
              </div>

              <div className="flex-1 grid grid-cols-12 gap-x-4 gap-y-4">
                {getCredentialsFields()}
              </div>
              {canReadWrite && (
                <div className='mt-4 flex justify-end'>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-8 text-sm px-5 font-semibold"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    {isConnected ? 'Save Changes' : 'Save & Test Connection'}
                  </Button>
                </div>
              )}
            </div>

            {/* Right Column: Config Tip */}
            {tip && (
              <div className="col-span-12 lg:col-span-5 h-full">
                <CarrierConfigTip selectedCarrier={selectedCarrier} />
              </div>
            )}

            {/* Divider */}
            <div className="col-span-12 border-b border-slate-100 dark:border-zinc-800/80 my-2" />
          </>
        )}
        {/* Advanced Settings Column (left) */}
        {formData.advanced_settings?.settings && formData.advanced_settings.settings.length > 0 && (
          <div className="col-span-12 lg:col-span-4 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-xl shadow-xs p-4 md:p-6 space-y-4 text-left transition-all duration-300 hover:shadow-sm">
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-zinc-50 uppercase tracking-wide my-0">Advanced Settings</h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1.5 my-0 leading-relaxed">Configure additional preferences for label printing and delivery defaults.</p>
            </div>

            <div className="space-y-4 w-full">
              {formData.advanced_settings.settings.map((setting: any) => {
                if (setting.type === 'checkbox') {
                  return (
                    <div
                      key={setting.key}
                      className="flex items-center gap-3 py-1 px-1"
                    >
                      <Checkbox
                        id={`setting-${setting.key}`}
                        checked={setting.value}
                        onCheckedChange={(checked) => handleAdvancedSettingChange(setting.key, !!checked)}
                        disabled={!isConnected || !canReadWrite}
                      />
                      <label
                        htmlFor={`setting-${setting.key}`}
                        className={`text-sm font-medium text-slate-700 dark:text-zinc-300 ${!isConnected || !canReadWrite ? 'cursor-not-allowed' : 'cursor-pointer'
                          } select-none`}
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
                    <div key={setting.key} className="space-y-1">
                      <FormSelect
                        label={setting.label}
                        options={options}
                        value={setting.value || ''}
                        onValueChange={(val) => handleAdvancedSettingChange(setting.key, val)}
                        placeholder="Select format..."
                        isHalf={false}
                        isFullWidth
                        allowClear={false}
                        selectClassName='w-full'
                        disabled={!isConnected || !canReadWrite}
                      />
                    </div>
                  );
                } else if (setting.type === 'textarea') {
                  return (
                    <div key={setting.key} className="space-y-1">
                      <FormTextarea
                        label="Delivery Instruction"
                        value={setting.value || ''}
                        onChange={(val) => handleAdvancedSettingChange(setting.key, val)}
                        placeholder="e.g. Leave in a safe place at the front door if not home."
                        rows={3}
                        isFullWidth
                        disabled={!isConnected || !canReadWrite}
                      />
                    </div>
                  );
                }
                return null;
              })}
            </div>

            {isConnected && canReadWrite && (
              <div className='flex justify-end'>
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
            <div className={cn(
              "col-span-12 text-left transition-all duration-300",
              (formData.advanced_settings?.settings && formData.advanced_settings.settings.length > 0) ? "lg:col-span-8" : "lg:col-span-12",
              "bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-xl shadow-xs p-4 md:p-6 space-y-4"
            )}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-zinc-50 uppercase tracking-wide my-0">
                    Available {(CARRIER_NAMES[selectedCarrier] || selectedCarrier)} services
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1.5 my-0 leading-relaxed">
                    These are the shipping services available for your {(CARRIER_NAMES[selectedCarrier] || selectedCarrier)} account. Enable the services you want customers and team members to use when requesting quotes or creating consignments.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
                  <div className="w-full sm:w-60">
                    <FormInput
                      placeholder="Search services..."
                      value={productSearchTerm}
                      onChange={(val) => setProductSearchTerm(val)}
                      icon={Search}
                      isHalf={false}
                      isFullWidth={true}
                      className="mb-0"
                    />
                  </div>
                  {isConnected && canReadWrite && (
                    <Button
                      type="button"
                      variant="outline"
                      className="h-8 text-sm px-4 font-semibold shrink-0"
                      onClick={() => {
                        setIsAddingNewProduct(true);
                        setNewProductForm({ product_name: '', product_code: '', enabled: false, manual: true });
                      }}
                    >
                      Add Service
                    </Button>
                  )}
                </div>
              </div>
              <div className="border border-slate-150 dark:border-zinc-800 rounded-lg overflow-hidden">
                <div className="overflow-y-auto no-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-150 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 text-[11px] font-bold text-slate-550 dark:text-zinc-450 uppercase tracking-wide">
                        <th className="py-3 px-4">Service</th>
                        <th className="py-3 px-4 w-28">Product code</th>
                        <th className="py-3 px-4 w-24 text-center">Enabled</th>
                        <th className="py-3 px-4 w-28 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                      {isAddingNewProduct && (
                        <tr className="bg-slate-50/30 dark:bg-zinc-900/20 border-b border-slate-150 dark:border-zinc-800">
                          <td className="py-2.5 px-4">
                            <input
                              type="text"
                              value={newProductForm.product_name}
                              onChange={(e) => setNewProductForm(prev => ({ ...prev, product_name: e.target.value }))}
                              placeholder="Service Name"
                              className="h-8 w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded px-2.5 text-sm text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                              disabled={addProductMut.isPending}
                              autoFocus
                            />
                          </td>
                          <td className="py-2.5 px-4">
                            <input
                              type="text"
                              value={newProductForm.product_code}
                              onChange={(e) => setNewProductForm(prev => ({ ...prev, product_code: e.target.value }))}
                              placeholder="Product code"
                              className="h-8 w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded px-2.5 text-sm font-mono uppercase text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
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
                                className="bg-slate-50/30 dark:bg-zinc-900/20 border-b border-slate-150 dark:border-zinc-800"
                              >
                                <td className="py-2.5 px-4">
                                  <input
                                    type="text"
                                    value={editingProductForm.product_name}
                                    onChange={(e) => setEditingProductForm(prev => ({ ...prev, product_name: e.target.value }))}
                                    placeholder={selectedCarrier === 'couriersplease' ? "Service Name" : "Product Name"}
                                    className="h-8 w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded px-2.5 text-sm text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                    disabled={updateManualProductMut.isPending}
                                    autoFocus
                                  />
                                </td>
                                <td className="py-2.5 px-4">
                                  <input
                                    type="text"
                                    value={editingProductForm.product_code}
                                    onChange={(e) => setEditingProductForm(prev => ({ ...prev, product_code: e.target.value }))}
                                    placeholder={selectedCarrier === 'couriersplease' ? "Product code" : "Code"}
                                    className="h-8 w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded px-2.5 text-sm font-mono uppercase text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
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
                              className="hover:bg-slate-50/20 dark:hover:bg-zinc-800/10 transition-colors text-sm text-slate-700 dark:text-zinc-355"
                            >
                              <td className="py-2 px-4 font-medium text-slate-900 dark:text-zinc-100">
                                {product.product_name}
                              </td>
                              <td className="py-2 px-4 font-mono text-[13px] text-slate-600 dark:text-zinc-400">
                                {product.product_code}
                              </td>
                              <td className="py-2 px-4 text-center">
                                <div className="flex items-center justify-center">
                                  <Checkbox
                                    checked={product.enabled}
                                    onCheckedChange={(checked) => handleProductToggle(product.product_code, !!checked)}
                                    disabled={(isManual && (updateManualProductMut.isPending || deleteManualProductMut.isPending)) || !isConnected || !canReadWrite}
                                  />
                                </div>
                              </td>
                              <td className="py-2 px-4 text-right">
                                {isManual && canReadWrite ? (
                                  <div className="flex items-center justify-end gap-1">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 w-7 p-0 text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-zinc-800"
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
                                      className="h-7 w-7 p-0 text-red-500 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20"
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

      {
        deleteConfirmOpen && (
          <ConformationModal
            open={deleteConfirmOpen}
            onOpenChange={setDeleteConfirmOpen}
            title="Delete Service"
            description={
              productToDelete ? (
                <span>
                  Are you sure you want to delete the service <strong>{productToDelete.name}</strong> ({productToDelete.code})? This action cannot be undone.
                </span>
              ) : undefined
            }
            confirmText="Delete"
            cancelText="Cancel"
            confirmVariant="destructive"
            loading={deleteManualProductMut.isPending}
            onConfirm={handleDeleteConfirm}
          />
        )
      }
    </form>
  );
}
