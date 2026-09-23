import { useMemo, useState } from 'react';
<<<<<<< HEAD
import {
  useRules,
  useDeleteRule,
  useCreateRule,
  useUpdateRule,
  useReorderRules,
  useRunRules,
  useRuleRunStatus,
} from '../hooks/useRules';
import { CustomModel } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
=======
import { useRules, useDeleteRule, useCreateRule, useUpdateRule } from '../hooks/useRules';
// import type { Condition, RuleAction } from '../types/rules.types';
// import RuleList from '../components/RuleList';
// import RuleForm from '../components/RuleForm';
import { CustomModel } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from '@/components/ui/accordion';
<<<<<<< HEAD
import { Loader2, Settings, HelpCircle, Layers, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';
=======
import { Loader2, Settings, HelpCircle, Layers } from 'lucide-react';
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
import { useAppSelector } from '@/hooks/store.hooks';
import RuleList from '../components/RuleList';
import RuleForm from '../components/RuleForm';
import type { RuleFormType, ShippingRule } from '../types/rules.types';

<<<<<<< HEAD
/** Full update payload for a rule as returned by the API (used for the status toggle). */
const ruleToPayload = (rule: ShippingRule): RuleFormType => ({
  name: rule.name,
  condition_type: rule.condition_type,
  conditions: rule.conditions || [],
  action_type: rule.action_type,
  action_payload: rule.action_payload,
  global_courier_id: rule.global_courier_id,
  product_code: rule.product_code,
  product_name: rule.product_name,
  sort_order: rule.sort_order,
  is_active: rule.is_active,
});

export default function RulesPage() {
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [prefilledData, setPrefilledData] = useState<ShippingRule | null>(null);

  // Deletion confirm modal state
  const [ruleToDelete, setRuleToDelete] = useState<number | null>(null);
  const { is_sub_user, team_access } = useAppSelector((state) => state.auth);
  const canReadWrite = useMemo(() => !is_sub_user || team_access?.permissions?.settings_rule_management === 'full', [is_sub_user, team_access]);

  // Queries & Mutations
  const { data: rulesData, isLoading } = useRules();
  const createRuleMutation = useCreateRule();
  const updateRuleMutation = useUpdateRule();
  const deleteRuleMutation = useDeleteRule();
  const reorderMutation = useReorderRules();
  const runRulesMutation = useRunRules();
  const { data: runStatusData } = useRuleRunStatus(canReadWrite);

  const rules = rulesData?.data || [];
  const runStatus = runStatusData?.data;
  const isRunInProgress = runStatus?.state === 'queued' || runStatus?.state === 'running';
  const hasActiveRules = rules.some((rule) => rule.is_active);

  const closeForm = () => {
    setView('list');
    setPrefilledData(null);
  };

  const handleCreateRule = (data: RuleFormType) => {
    // Append new rules at the end of the running order
    const nextSortOrder = rules.reduce((max, rule) => Math.max(max, rule.sort_order), -1) + 1;
    createRuleMutation.mutate({ ...data, sort_order: nextSortOrder }, {
      onSuccess: closeForm,
    });
=======
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
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
  };

  const handleUpdateRule = (data: RuleFormType) => {
    if (!prefilledData) return;

    updateRuleMutation.mutate({
      id: prefilledData.id,
<<<<<<< HEAD
      data,
    }, {
      onSuccess: closeForm,
    });
  };

  const handleToggleActive = (rule: ShippingRule) => {
    updateRuleMutation.mutate({
      id: rule.id,
      data: { ...ruleToPayload(rule), is_active: !rule.is_active },
    });
  };

  const handleMoveRule = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= rules.length) return;

    const reordered = [...rules];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    reorderMutation.mutate(reordered.map((rule, i) => ({ id: rule.id, sort_order: i })));
  };

=======
      data: data
    }, {
      onSuccess: () => {
        setView('list');
        setPrefilledData(null);
      }
    });
  };

>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
  const handleConfirmDelete = () => {
    if (ruleToDelete) {
      deleteRuleMutation.mutate(ruleToDelete, {
        onSuccess: () => {
          setRuleToDelete(null);
        }
      });
    }
  };

<<<<<<< HEAD
=======
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

>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
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
<<<<<<< HEAD
                Automate your shipping workflow by creating custom rules that apply actions based on order details, destinations, products, or customer requirements. Rules run automatically on import. On a new Tranzit Group order they apply package, signature, ATL and instructions without changing the quote you picked. Use Run rules now for existing unshipped orders that are not yet paid.
              </p>
            </CardContent>
          </Card>

          {/* Run rules now */}
          {canReadWrite && (
            <Card className="border gap-0 border-gray-200 dark:border-zinc-800 shadow-xs overflow-hidden bg-white dark:bg-zinc-900">
              <CardHeader className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800">
                <CardTitle className="text-[15px] font-bold text-gray-800 dark:text-zinc-200 my-0">
                  Run rules
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-3">
                <p className="text-[12px] text-gray-500 dark:text-zinc-400 leading-normal my-0">
                  Apply your active rules to existing new/unshipped orders (imports and manual) without re-importing them. Printed and consigned orders are never changed. Orders that are already paid keep their courier and price — only unpaid orders (or paid orders with no courier yet) can be assigned a carrier. A queue worker must be running.
                </p>

                {isRunInProgress && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-zinc-300 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-md px-3 py-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary shrink-0" />
                    <span>
                      {runStatus?.state === 'queued'
                        ? `Queued — ${runStatus?.eligible ?? 0} eligible order(s)`
                        : `Processing ${runStatus?.processed ?? 0} of ${runStatus?.eligible ?? 0} order(s)…`}
                    </span>
                  </div>
                )}

                {runStatus?.state === 'done' && (
                  <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-md px-3 py-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>
                      Last run: {runStatus.processed ?? 0} processed, {runStatus.updated ?? 0} updated
                      {runStatus.errors ? `, ${runStatus.errors} error(s)` : ''}.
                    </span>
                  </div>
                )}

                {runStatus?.state === 'failed' && (
                  <div className="flex items-center gap-2 text-sm text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-md px-3 py-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>The last rule run failed. Please try again.</span>
                  </div>
                )}

                <Button
                  variant="default"
                  onClick={() => runRulesMutation.mutate()}
                  disabled={runRulesMutation.isPending || isRunInProgress || !hasActiveRules}
                  className="mt-1"
                >
                  {runRulesMutation.isPending || isRunInProgress
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    : <RefreshCw className="w-3.5 h-3.5" />}
                  Run rules now
                </Button>
                {!hasActiveRules && (
                  <p className="text-[11px] text-gray-400 dark:text-zinc-500 my-0">
                    Add at least one active rule to enable manual runs.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

=======
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

>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
          {/* Accordions Section */}
          {canReadWrite && (
            <Accordion className="w-full space-y-2">
              <AccordionItem value="how-to" className="border border-gray-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-900 px-4">
                <AccordionTrigger className="my-0 text-[15px] font-bold text-gray-800 dark:text-zinc-200 py-3 hover:no-underline flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-gray-500" />
                  How to create a rule
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-500 dark:text-zinc-400 space-y-1.5 leading-normal pb-3">
<<<<<<< HEAD
                  <p>1. Click the <strong className="text-gray-700 dark:text-zinc-200">Add new</strong> button.</p>
                  <p>2. Choose whether the rule applies to <strong className="text-gray-700 dark:text-zinc-200">All Orders</strong> or only <strong className="text-gray-700 dark:text-zinc-200">Orders Matching Conditions</strong> — combine conditions like destination post code, order weight, order source or item SKU.</p>
                  <p>3. Select the automated action: set a courier and product, pick the cheapest service, set the package, toggle signature / authority to leave / safe drop / dangerous goods, or set delivery instructions.</p>
                  <p>4. Save the rule. It runs automatically on newly imported orders. Use <strong className="text-gray-700 dark:text-zinc-200">Run rules now</strong> for existing unpaid, unshipped orders.</p>
=======
                  <p>1. Click the <strong className="text-gray-700 dark:text-zinc-200">Add new</strong> button or select a preset shortcut from the <strong className="text-gray-700 dark:text-zinc-200">Quick setup</strong> links.</p>
                  <p>2. The rule's condition is preconfigured to apply to <strong className="text-gray-700 dark:text-zinc-200">All Orders</strong>.</p>
                  <p>3. Select the automated action: either <strong className="text-gray-700 dark:text-zinc-200">Set Courier And Product Code</strong> or <strong className="text-gray-700 dark:text-zinc-200">Select Cheapest Carrier/Service</strong>.</p>
                  <p>4. Save the rule. It will run automatically on newly imported orders.</p>
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="running-order" className="border border-gray-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-900 px-4">
                <AccordionTrigger className="text-[15px] font-bold text-gray-800 dark:text-zinc-200 py-3 hover:no-underline flex items-center gap-2">
                  <Layers className="w-4 h-4 text-gray-500" />
                  Running order
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-500 dark:text-zinc-400 leading-normal pb-3">
<<<<<<< HEAD
                  Rules execute from top to bottom — use the arrows in the Order column to change the sequence. If multiple rules set the same thing (e.g. the courier), the first matching rule wins. Inactive rules are skipped.
=======
                  Rules apply to orders upon import and execute sequentially from top to bottom. If multiple rules match, each matching rule will execute in order.
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
<<<<<<< HEAD
=======
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
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
        </div>

        {/* Right Column: Rules list & Inline builder */}
        <div className="lg:col-span-8 space-y-6">
          <RuleList
<<<<<<< HEAD
            rules={rules}
            onCreateClick={() => {
=======
            rules={rulesData?.data || []}
            onCreateClick={() => {
              // setEditingRule(null);
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
              setPrefilledData(null);
              setView('create');
            }}
            onEdit={(rule) => {
<<<<<<< HEAD
=======
              // setEditingRule(rule);
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
              setPrefilledData(rule);
              setView('edit');
            }}
            onDelete={(id) => setRuleToDelete(id)}
<<<<<<< HEAD
            onMove={handleMoveRule}
            onToggleActive={handleToggleActive}
            isFormOpen={isFormOpen}
            canReadWrite={canReadWrite}
            isReordering={reorderMutation.isPending}
=======
            isFormOpen={isFormOpen}
            canReadWrite={canReadWrite}
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
          />

          {/* Inline builder loaded beneath list */}
          {view === 'create' && (
            <RuleForm
<<<<<<< HEAD
              prefilledData={null}
              onSave={handleCreateRule}
              isSaving={createRuleMutation.isPending}
              onCancel={closeForm}
=======
              prefilledData={prefilledData}
              onSave={handleCreateRule}
              isSaving={createRuleMutation.isPending}
              onCancel={() => {
                setView('list');
                setPrefilledData(null);
              }}

>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
            />
          )}

          {view === 'edit' && (
            <RuleForm
              prefilledData={prefilledData}
              onSave={handleUpdateRule}
<<<<<<< HEAD
              onCancel={closeForm}
=======
              onCancel={() => {
                setView('list');
                setPrefilledData(null);
              }}
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
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
