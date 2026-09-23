import type { RuleAttribute, RuleActionType } from '../types/rules.types';

export const ATTRIBUTES: RuleAttribute[] = [
  { key: 'all_orders', label: 'All Orders', category: 'ORDER', type: null }
];

export const OPERATORS: Record<string, { label: string; value: string }[]> = {
  text: [
    { label: 'Is', value: 'is' },
    { label: 'Is Not', value: 'is_not' },
  ],
  number: [
    { label: 'Equals', value: 'equals' },
  ],
  date: [
    { label: 'Before', value: 'before' },
  ],
  boolean: [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ]
};

export const ACTION_TYPES: RuleActionType[] = [
  {
    key: 'set_courier_product',
    label: 'Set Courier And Product Code',
    category: 'Courier',
    fields: [
      {
        name: 'courier',
        label: 'Carrier',
        type: 'select',
        options: [],
        placeholder: 'Select carrier'
      },
      {
        name: 'product_code',
        label: 'Product Code',
        type: 'select',
        options: [],
        placeholder: 'Select product code'
      }
    ]
  },
  {
    key: 'select_cheapest_carrier_service',
    label: 'Select Cheapest Carrier/Service',
    category: 'Courier',
    fields: []
  }
];
