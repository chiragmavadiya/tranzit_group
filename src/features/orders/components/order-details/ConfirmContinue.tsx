import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { DANGEROUS_GOODS_URL, PRIVACY_POLICY_URL, TERMS_CONDITIONS_URL } from '@/constants';

interface ConfirmContinueProps {
  termsAccepted: boolean;
  setTermsAccepted: (checked: boolean) => void;
  ratesAccepted: boolean;
  setRatesAccepted: (checked: boolean) => void;
  dangerousGoodsAccepted: boolean;
  setDangerousGoodsAccepted: (checked: boolean) => void;
}

export const ConfirmContinue: React.FC<ConfirmContinueProps> = ({
  termsAccepted,
  setTermsAccepted,
  ratesAccepted,
  setRatesAccepted,
  dangerousGoodsAccepted,
  setDangerousGoodsAccepted,
}) => {
  return (
    <div className="bg-white dark:bg-zinc-950 rounded-sm border border-gray-200 dark:border-zinc-800 p-5 flex flex-col gap-4 shadow-xs transition-colors duration-300">
      <div className="border-b border-gray-200 dark:border-zinc-800 pb-2">
        <h3 className="my-0 text-sm font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-wider">Review & Confirm</h3>
        <p className="text-xs text-gray-500 dark:text-zinc-400 font-medium my-0">Please check the shipment details before creating the consignment.</p>
      </div>
      <div className="flex flex-col gap-3">
        <label className="flex items-start gap-3 rounded-[12px] transition-colors cursor-pointer">
          <Checkbox
            checked={termsAccepted}
            onCheckedChange={(c) => setTermsAccepted(!!c)}
            className="mt-0.5 rounded-[6px] data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <div className="flex flex-col">
            <span className="text-sm text-gray-900 dark:text-zinc-100">
              I agree to the {' '}
              <a href={TERMS_CONDITIONS_URL} target="_blank" rel="noopener noreferrer" className="font-bold text-primary hover:underline">
                Terms & Conditions
              </a>{' '}
              and{' '}
              <a href={PRIVACY_POLICY_URL} target="_blank" rel="noopener noreferrer" className="font-bold text-primary hover:underline">
                Privacy Policy
              </a>
            </span>
          </div>
        </label>

        <label className="flex items-start gap-3 rounded-[12px] transition-colors cursor-pointer">
          <Checkbox
            checked={ratesAccepted}
            onCheckedChange={(c) => setRatesAccepted(!!c)}
            className="mt-0.5 rounded-[6px] data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900 dark:text-zinc-300">
              I understand the shipping rate, GST, fuel levy and extra charges
            </span>
          </div>
        </label>

        <label className="flex items-start gap-3 rounded-[12px] transition-colors cursor-pointer">
          <Checkbox
            checked={dangerousGoodsAccepted}
            onCheckedChange={(c) => setDangerousGoodsAccepted(!!c)}
            className="mt-0.5 rounded-[6px] data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900 dark:text-zinc-300">
              This consignment does not contain {' '}
              <a href={DANGEROUS_GOODS_URL} target="_blank" rel="noopener noreferrer" className="font-bold text-primary hover:underline">
                dangerous goods
              </a>
            </span>
          </div>
        </label>
      </div>
    </div>
  );
};
