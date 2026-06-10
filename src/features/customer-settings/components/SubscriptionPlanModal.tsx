import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useSelectPlan } from '@/features/auth/hooks/useAuth';
import { showToast } from '@/components/ui/custom-toast';

interface SubscriptionPlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Plan features checkmark SVG icon
const CheckIcon = () => (
  <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

const plansList = [
  {
    slug: "starter",
    name: "Starter",
    price: "$19.9",
    duration: "/mo",
    description: "Best for small businesses starting out",
    features: [
      "Up to 300 Shipments",
      "EIZ Community Forum",
      "Ticket Support",
      "2 Users Included",
      "Self Onboarding",
    ],
    buttonText: "Switch to Starter",

  },
  {
    slug: "silver",
    name: "Silver",
    price: "$159.0",
    duration: "/mo",
    description: "Best for growing businesses scaling operations.",
    features: [
      "Up to 2,000 Shipments",
      "Forum & Email Support",
      "3 Users Included",
      "Priority Phone Support",
      "Setup Call",
    ],
    buttonText: "Switch to Silver",
    isPopular: true,
    selected: true,
  },
  {
    slug: "gold",
    name: "Gold",
    price: "$299.0",
    duration: "/mo",
    description: "Best for high-volume businesses needing advanced support",
    features: [
      "Up to 2,000 Shipments",
      "Forum & Email Support",
      "3 Users Included",
      "Priority Phone Support",
      "Setup Call",
    ],
    buttonText: "Switch to Gold",
    isPopular: true,
  },
];

export default function SubscriptionPlanModal({ open, onOpenChange }: SubscriptionPlanModalProps) {
  const cardWidth = 280;
  const gap = 12;
  const padding = 64;
  const plansCount = plansList?.length || 0;
  const computedWidth = plansCount > 0
    ? plansCount * cardWidth + (plansCount - 1) * gap + padding
    : 400;

  const { mutateAsync: selectPlan } = useSelectPlan();

  const handleSelectPlan = (plan: string) => {
    selectPlan({ plan }, {
      onSuccess: () => {
        showToast("Welcome to Tranzit Group! Your subscription plan has been activated successfully.", 'success');
        onOpenChange(false);
      },
      onError: (error: any) => {
        showToast(error?.message, 'error');
      }
    });
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange} disablePointerDismissal={true}>
      <DialogContent
        className="w-full sm:max-w-none p-0 overflow-hidden bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-xl gap-0"
        style={{ maxWidth: `min(${computedWidth}px, calc(100vw - 2rem))` }}
        showCloseButton={false}
      >

        {/* Header Section */}
        <DialogHeader className="px-6 py-3 border-b border-gray-150 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col gap-1">
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-zinc-100 my-0">
            Choose your Tranzit Group plan
          </DialogTitle>
          <DialogDescription className="text-[13px] text-slate-500 dark:text-zinc-400 my-0">
            Select the plan that best matches your monthly shipment volume. You can change your plan later.
          </DialogDescription>
        </DialogHeader>

        {/* Content Area */}
        <div className="px-8 py-8 bg-slate-50/50 dark:bg-zinc-900/30 flex gap-3 overflow-x-auto no-scrollbar w-full">

          {plansList.map((plan) => (
            <div className={`bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 flex flex-col justify-between shadow-sm relative hover:shadow-md transition-shadow duration-300 w-[280px] shrink-0 ${plan.selected ? 'border-2 border-blue-600! dark:border-blue-500!' : ''}`}>
              {plan.isPopular && (
                <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden pointer-events-none">
                  <div className="absolute top-4 -right-6 w-24 bg-blue-600 text-white text-[9px] font-black text-center py-1 rotate-45 uppercase tracking-wider select-none shadow-sm">
                    Popular
                  </div>
                </div>
              )}
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <div className='flex justify-between mr-3 items-center'>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100 flex-1">{plan.name}</h3>
                      {plan.selected && (
                        <span className="bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 h-fit rounded-md shadow-sm">
                          Subscribed
                        </span>
                      )}
                    </div>
                    <p className='text-[13px] text-slate-500 dark:text-zinc-400 my-0'>{plan.description}</p>
                    <div className="mt-2 flex items-baseline">
                      <span className="text-3xl font-extrabold text-slate-900 dark:text-zinc-100">{plan.price}</span>
                      <span className="ml-1 text-slate-400 dark:text-zinc-500 text-sm font-medium">{plan.duration}</span>
                    </div>
                  </div>

                  {/* Subscribed Badge */}

                </div>

                {/* Features */}
                <ul className="mt-6 space-y-2">
                  {plan.features.map((feature) => (
                    <li className="flex gap-2 text-[13px] text-slate-600 dark:text-zinc-300 font-medium">
                      <CheckIcon />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <Button
                  variant="outline"
                  disabled={plan.selected}
                  className="w-full border-slate-900 dark:border-zinc-700 text-slate-950 dark:text-zinc-100 hover:bg-slate-50 dark:hover:bg-zinc-900 font-semibold text-[13px] h-8 rounded-lg transition-all"
                  onClick={() => handleSelectPlan(plan.slug)}
                >
                  {plan.selected ? "Current Plan" : plan.buttonText}
                </Button>
              </div>
            </div>
          ))}

          {/* Starter Plan Card */}
          {/* <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 flex flex-col justify-between shadow-sm relative hover:shadow-md transition-shadow duration-300">
            <div>
              <div className="flex flex-col">
                <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100">Starter</h3>
                <p className='text-[13px] text-slate-500 dark:text-zinc-400 my-0'>Best for small businesses starting out</p>
                <div className="mt-2 flex items-baseline">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-zinc-100">$19.9</span>
                  <span className="ml-1 text-slate-400 dark:text-zinc-500 text-sm font-medium">/mo</span>
                </div>
              </div>

              <ul className="mt-6 space-y-4">
                <li className="flex gap-2 text-[13px] text-slate-600 dark:text-zinc-300 font-medium">
                  <CheckIcon />
                  <span>Up to 300 Shipments</span>
                </li>
                <li className="flex gap-2 text-[13px] text-slate-600 dark:text-zinc-300 font-medium">
                  <CheckIcon />
                  <span>EIZ Community Forum</span>
                </li>
                <li className="flex gap-2 text-[13px] text-slate-600 dark:text-zinc-300 font-medium">
                  <CheckIcon />
                  <span>Ticket Support</span>
                </li>
                <li className="flex gap-2 text-[13px] text-slate-600 dark:text-zinc-300 font-medium">
                  <CheckIcon />
                  <span>2 Users Included</span>
                </li>
                <li className="flex gap-2 text-[13px] text-slate-600 dark:text-zinc-300 font-medium">
                  <CheckIcon />
                  <span>Self Onboarding</span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <Button
                variant="outline"
                className="w-full border-slate-900 dark:border-zinc-700 text-slate-950 dark:text-zinc-100 hover:bg-slate-50 dark:hover:bg-zinc-900 font-semibold text-[13px] h-10 rounded-lg transition-all"
              >
                Switch to Starter
              </Button>
            </div>
          </div> */}

          {/* Silver Plan Card (Active / Popular) */}
          {/* <div className="bg-white dark:bg-zinc-950  rounded-xl p-6 flex flex-col justify-between shadow-md relative overflow-hidden">

            <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden pointer-events-none">
              <div className="absolute top-4 -right-6 w-24 bg-blue-600 text-white text-[9px] font-black text-center py-1 rotate-45 uppercase tracking-wider select-none shadow-sm">
                Popular
              </div>
            </div>

            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100">Silver</h3>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-zinc-100">$159.0</span>
                    <span className="ml-1 text-slate-400 dark:text-zinc-500 text-sm font-medium">/mo</span>
                  </div>
                </div>

                <span className="bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm mr-6 mt-1">
                  Subscribed
                </span>
              </div>

              <ul className="mt-6 space-y-4">
                <li className="flex gap-2 text-[13px] text-slate-600 dark:text-zinc-300 font-medium">
                  <CheckIcon />
                  <span>Up to 2,000 Shipments</span>
                </li>
                <li className="flex gap-2 text-[13px] text-slate-600 dark:text-zinc-300 font-medium">
                  <CheckIcon />
                  <span>Forum & Email Support</span>
                </li>
                <li className="flex gap-2 text-[13px] text-slate-600 dark:text-zinc-300 font-medium">
                  <CheckIcon />
                  <span>Ticket Support</span>
                </li>
                <li className="flex gap-2 text-[13px] text-slate-600 dark:text-zinc-300 font-medium">
                  <CheckIcon />
                  <span>3 Users Included</span>
                </li>
                <li className="flex flex-col gap-0.5 text-[13px] text-slate-600 dark:text-zinc-300 font-medium">
                  <div className="flex gap-2">
                    <CheckIcon />
                    <span>Self Onboarding + 1hr Free</span>
                  </div>
                  <span className="text-[11px] text-slate-400 dark:text-zinc-500 ml-7">
                    Purchase extra hours if needed
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <Button
                disabled
                className="w-full bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 hover:bg-slate-100 dark:hover:bg-zinc-800 font-semibold text-[13px] h-10 rounded-lg cursor-not-allowed"
              >
                Current Plan
              </Button>
            </div>
          </div> */}

          {/* Gold Plan Card */}
          {/* <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 flex flex-col justify-between shadow-sm relative hover:shadow-md transition-shadow duration-300">
            <div>
              <div className="flex flex-col">
                <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100">Gold</h3>
                <div className="mt-2 flex items-baseline">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-zinc-100">$210.0</span>
                  <span className="ml-1 text-slate-400 dark:text-zinc-500 text-sm font-medium">/mo</span>
                </div>
              </div>

              <ul className="mt-6 space-y-4">
                <li className="flex gap-2 text-[13px] text-slate-600 dark:text-zinc-300 font-medium">
                  <CheckIcon />
                  <span>Up to 4,000 Shipments</span>
                </li>
                <li className="flex gap-2 text-[13px] text-slate-600 dark:text-zinc-300 font-medium">
                  <CheckIcon />
                  <span>Forum & Email Support</span>
                </li>
                <li className="flex gap-2 text-[13px] text-slate-600 dark:text-zinc-300 font-medium">
                  <CheckIcon />
                  <span>Ticket Support</span>
                </li>
                <li className="flex gap-2 text-[13px] text-slate-600 dark:text-zinc-300 font-medium">
                  <CheckIcon />
                  <span>4 Users Included</span>
                </li>
                <li className="flex flex-col gap-0.5 text-[13px] text-slate-600 dark:text-zinc-300 font-medium">
                  <div className="flex gap-2">
                    <CheckIcon />
                    <span>Self Onboarding + 1hr Free</span>
                  </div>
                  <span className="text-[11px] text-slate-400 dark:text-zinc-500 ml-7">
                    Custom onboarding available
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <Button
                className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-slate-900 dark:hover:bg-slate-100 font-semibold text-[13px] h-10 rounded-lg transition-all"
              >
                Upgrade to Gold
              </Button>
            </div>
          </div> */}

        </div>
      </DialogContent>
    </Dialog>
  );
}
