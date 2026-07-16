import { useMemo, useState } from 'react';
import { useRules, useDeleteRule, useCreateRule, useUpdateRule } from '../hooks/useRules';
// import type { Condition, RuleAction } from '../types/rules.types';
// import RuleList from '../components/RuleList';
// import RuleForm from '../components/RuleForm';
import { CustomModel } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from '@/components/ui/accordion';
import { Loader2, Settings, HelpCircle, Layers } from 'lucide-react';
import { useAppSelector } from '@/hooks/store.hooks';
import RuleList from '../components/RuleList';
import RuleForm from '../components/RuleForm';
import type { RuleFormType, ShippingRule } from '../types/rules.types';

export default function RulesPage() {
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  // const [editingRule, setEditingRule] = useState<any | null>(null);
  const [prefilledData, setPrefilledData] = useState<ShippingRule | null>(null);

  // Deletion confirm modal state
  const [ruleToDelete, setRuleToDelete] = useState<string | null>(null);
  const { is_sub_user, team_access } = useAppSelector((state) => state.auth)
  const canReadWrite = useMemo(() => !is_sub_user || team_access?.permissions?.settings_rule_management === 'full', [is_sub_user, team_access]);


  // Manual execution loading states
  // const [isRunningRules, setIsRunningRules] = useState(false);
  // const [isRunningCheapestNotSet, setIsRunningCheapestNotSet] = useState(false);
  // const [isRunningCheapestAll, setIsRunningCheapestAll] = useState(false);

  // Queries & Mutations
  const { data: rulesData, isLoading } = useRules();
  // useRuleOptions();
  const createRuleMutation = useCreateRule();
  const updateRuleMutation = useUpdateRule();
  const deleteRuleMutation = useDeleteRule();

  const handleCreateRule = (data: any) => {
    if (data.id) {
      // updateRuleMutation.mutate(data, {
      //   onSuccess: () => {
      //     setView('list');
      //     setPrefilledData(null);
      //   }
      // });
    } else {
      createRuleMutation.mutate(data, {
        onSuccess: () => {
          setView('list');
          setPrefilledData(null);
        }
      });
    };
  };

  const handleUpdateRule = (data: RuleFormType) => {
    if (!prefilledData) return;

    updateRuleMutation.mutate({
      id: prefilledData.id,
      data: data
    }, {
      onSuccess: () => {
        setView('list');
        setPrefilledData(null);
      }
    });
  };

  const handleConfirmDelete = () => {
    if (ruleToDelete) {
      deleteRuleMutation.mutate(ruleToDelete, {
        onSuccess: () => {
          setRuleToDelete(null);
        }
      });
    }
  };

  // Quick setup helper to auto-configure and open form
  // const handleQuickSetupClick = (type: 'service' | 'cheapest') => {
  //   // setEditingRule(null);
  //   if (type === 'service') {
  //     // setPrefilledData({
  //     //   conditions: [
  //     //     {
  //     //       id: 'cond-' + Date.now(),
  //     //       attribute: 'all_orders',
  //     //       operator: '',
  //     //       value: ''
  //     //     }
  //     //   ],
  //     //   actions: [
  //     //     {
  //     //       id: 'act-' + Date.now(),
  //     //       type: 'set_courier_product',
  //     //       config: { courier: 'auspost', product_code: '' }
  //     //     }
  //     //   ]
  //     // });
  //   } else {
  //     setPrefilledData({
  //       conditions: [
  //         {
  //           id: 'cond-' + Date.now(),
  //           attribute: 'all_orders',
  //           operator: '',
  //           value: ''
  //         }
  //       ],
  //       actions: [
  //         {
  //           id: 'act-' + Date.now(),
  //           type: 'select_cheapest_carrier_service',
  //           config: {}
  //         }
  //       ]
  //     });
  //   }
  //   setView('create');
  // };

  // Manual Trigger Simulation
  // const handleRunRulesNow = () => {
  //   setIsRunningRules(true);
  //   setTimeout(() => {
  //     setIsRunningRules(false);
  //     alert('Shipping rules successfully applied to all unshipped orders.');
  //   }, 1200);
  // };

  // const handleRunCheapestNotSet = () => {
  //   setIsRunningCheapestNotSet(true);
  //   setTimeout(() => {
  //     setIsRunningCheapestNotSet(false);
  //     alert('Cheapest carrier rule run for orders where not set.');
  //   }, 1000);
  // };

  // const handleRunCheapestAll = () => {
  //   setIsRunningCheapestAll(true);
  //   setTimeout(() => {
  //     setIsRunningCheapestAll(false);
  //     alert('Cheapest carrier rule applied to all unshipped orders.');
  //   }, 1000);
  // };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full py-12">
        <Loader2 className="animate-spin text-primary h-10 w-10" />
      </div>
    );
  }

  const isFormOpen = view === 'create' || view === 'edit';

  return (
    <div className="flex flex-1 flex-col gap-6 h-full p-0 animate-in fade-in duration-500 bg-slate-50/30 dark:bg-zinc-950/20">

      {/* Page Header & Breadcrumbs */}
      <div className="flex flex-col pb-4 border-b border-gray-200 dark:border-zinc-800">
        <div className="flex items-center gap-2.5 mt-0.5">
          <Settings className="w-5 h-5 text-gray-700 dark:text-zinc-300" />
          <h1 className=" text-xl font-extrabold text-gray-950 dark:text-zinc-100 my-0">
            Rules
          </h1>
        </div>
        <p className="mt-0 text-sm text-gray-500 dark:text-zinc-400 my-0 pl-7.5">
          Configure shipping rules and automation.
        </p>
      </div>

      {/* Two Column Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Instructions and manual tools */}
        <div className="lg:col-span-4 space-y-4">

          {/* Rules Overview Info Card */}
          <Card className="border border-gray-200 dark:border-zinc-800 shadow-xs overflow-hidden bg-white dark:bg-zinc-900">
            <CardContent className="p-5 space-y-4">
              <h2 className="text-base font-bold text-gray-950 dark:text-zinc-100 my-0 mb-1">
                Rules
              </h2>
              <p className="text-[14px] text-gray-600 dark:text-zinc-300 leading-relaxed my-0">
                Automate your shipping workflow by creating custom rules that apply actions based on order details, destinations, products, or customer requirements. Rules are processed automatically when orders are imported into Tranzit Group.
              </p>

              {/* Quick Setup */}
              {/* {canReadWrite && (
                <div className="space-y-2 pt-4">
                  <span className="text-xs font-bold text-gray-800 dark:text-zinc-200 block uppercase tracking-wide">
                    Quick setup
                  </span>
                  <ul className="text-sm text-primary dark:text-blue-400 space-y-1.5 list-none pl-0">
                    <li
                      onClick={() => handleQuickSetupClick('service')}
                      className="cursor-pointer hover:underline hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                    >
                      1. Assign a service to all orders
                    </li>
                    <li
                      onClick={() => handleQuickSetupClick('cheapest')}
                      className="cursor-pointer hover:underline hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                    >
                      2. Assign a cheapest carrier service to all orders
                    </li>
                  </ul>
                </div>
              )} */}
              {/* YouTube Video Preview */}
              {/* <div className="pt-2 hidden">
                <iframe
                  className="w-full aspect-video rounded-lg border border-slate-200 dark:border-zinc-800"
                  src="https://www.youtube.com/embed/MpV5FDCaLE4"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div> */}
            </CardContent>
          </Card>

          {/* Accordions Section */}
          {canReadWrite && (
            <Accordion className="w-full space-y-2">
              <AccordionItem value="how-to" className="border border-gray-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-900 px-4">
                <AccordionTrigger className="my-0 text-[15px] font-bold text-gray-800 dark:text-zinc-200 py-3 hover:no-underline flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-gray-500" />
                  How to create a rule
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-500 dark:text-zinc-400 space-y-1.5 leading-normal pb-3">
                  <p>1. Click the <strong className="text-gray-700 dark:text-zinc-200">Add new</strong> button or select a preset shortcut from the <strong className="text-gray-700 dark:text-zinc-200">Quick setup</strong> links.</p>
                  <p>2. The rule's condition is preconfigured to apply to <strong className="text-gray-700 dark:text-zinc-200">All Orders</strong>.</p>
                  <p>3. Select the automated action: either <strong className="text-gray-700 dark:text-zinc-200">Set Courier And Product Code</strong> or <strong className="text-gray-700 dark:text-zinc-200">Select Cheapest Carrier/Service</strong>.</p>
                  <p>4. Save the rule. It will run automatically on newly imported orders.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="running-order" className="border border-gray-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-900 px-4">
                <AccordionTrigger className="text-[15px] font-bold text-gray-800 dark:text-zinc-200 py-3 hover:no-underline flex items-center gap-2">
                  <Layers className="w-4 h-4 text-gray-500" />
                  Running order
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-500 dark:text-zinc-400 leading-normal pb-3">
                  Rules apply to orders upon import and execute sequentially from top to bottom. If multiple rules match, each matching rule will execute in order.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
          {/* Run Rules Manual Triggers */}
          {/* <Card className="border gap-0 border-gray-200 dark:border-zinc-800 shadow-xs overflow-hidden bg-white dark:bg-zinc-900">
            <CardHeader className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800">
              <CardTitle className="text-[15px] font-bold text-gray-800 dark:text-zinc-200 uppercase tracking-wide my-0">
                Run rules
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <span className="text-sm font-bold text-gray-800 dark:text-zinc-200 block">
                  Run rules on unshipped orders
                </span>
                <p className="text-[12px] text-gray-500 dark:text-zinc-400 leading-normal my-0">
                  Run rules on all new/unshipped imported orders without needing to remove and re-import. This excludes manually created orders and orders with manual edits (e.g. address changes).
                </p>
                <Button
                  variant="default"
                  // onClick={handleRunRulesNow}
                  // disabled={isRunningRules}
                  className="mt-2"
                // className="h-8 text-[11px] font-bold text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-250 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 rounded-md cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Run rules now
                </Button>
              </div>

              <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-zinc-800">
                <span className="text-sm font-bold text-gray-800 dark:text-zinc-200 block">
                  Run cheapest carrier rule on unshipped orders
                </span>
                <p className="text-[12px] text-gray-500 dark:text-zinc-400 leading-normal my-0">
                  Run cheapest carrier rule on some or all of your new/unshipped orders.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Button
                    variant="default"
                    // onClick={handleRunCheapestNotSet}
                    className="mt-2"
                  // className="h-8 text-[10px] font-bold text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-250 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 rounded-md cursor-pointer flex items-center gap-1.5"
                  >
                    Run cheapest carrier where not set
                  </Button>
                  <Button
                    variant="default"
                    // onClick={handleRunCheapestAll}
                    className="mt-2"
                  // className="h-8 text-[10px] font-bold text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-250 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 rounded-md cursor-pointer flex items-center gap-1.5"
                  >
                    Run cheapest carrier on all unshipped orders
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>

        {/* Right Column: Rules list & Inline builder */}
        <div className="lg:col-span-8 space-y-6">
          <RuleList
            rules={rulesData?.data || []}
            onCreateClick={() => {
              // setEditingRule(null);
              setPrefilledData(null);
              setView('create');
            }}
            onEdit={(rule) => {
              // setEditingRule(rule);
              setPrefilledData(rule);
              setView('edit');
            }}
            onDelete={(id) => setRuleToDelete(id)}
            isFormOpen={isFormOpen}
            canReadWrite={canReadWrite}
          />

          {/* Inline builder loaded beneath list */}
          {view === 'create' && (
            <RuleForm
              prefilledData={prefilledData}
              onSave={handleCreateRule}
              isSaving={createRuleMutation.isPending}
              onCancel={() => {
                setView('list');
                setPrefilledData(null);
              }}

            />
          )}

          {view === 'edit' && (
            <RuleForm
              prefilledData={prefilledData}
              onSave={handleUpdateRule}
              onCancel={() => {
                setView('list');
                setPrefilledData(null);
              }}
              isSaving={updateRuleMutation.isPending}
            />
          )}
        </div>
      </div>

      {/* Delete Rule Confirmation Modal */}
      <CustomModel
        open={!!ruleToDelete}
        onOpenChange={(open) => !open && setRuleToDelete(null)}
        title="Delete Shipping Rule?"
        description="Are you sure you want to delete this shipping rule? This action cannot be undone and will stop this automation from running on future orders."
        onSubmit={handleConfirmDelete}
        submitText="Delete Rule"
        contentClass="sm:max-w-md"
        isLoading={deleteRuleMutation.isPending}
      >
        <div className="py-2 text-sm text-gray-500 dark:text-zinc-400">
          Orders will no longer be modified or automated by this rule once deleted.
        </div>
      </CustomModel>
    </div>
  );
}
