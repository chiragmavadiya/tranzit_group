import type { ShippingRule } from '../types/rules.types';

const STORAGE_KEY = 'shipping_automation_rules';

const MOCK_RULES: ShippingRule[] = [
  {
    id: 'rule-1',
    name: 'Australia Express Heavy Items',
    description: 'Send orders to Australia with weight over 5kg via Australia Post Express and require signature.',
    status: 'active',
    priority: 1,
    stopProcessing: true,
    conditions: [
      { id: 'c-1', attribute: 'destination_country_code', operator: 'is', value: 'AU' },
      { id: 'c-2', attribute: 'order_weight', operator: 'gt', value: '5' }
    ],
    actions: [
      { id: 'a-1', type: 'set_courier_product', config: { courier: 'Australia Post', product_code: 'EXP' } },
      { id: 'a-2', type: 'require_signature', config: {} }
    ],
    versionHistory: [
      {
        id: 'v-1',
        version: 1,
        updatedAt: '2026-06-12T10:00:00Z',
        updatedBy: 'Chirag Sharma',
        changes: 'Initial rule creation.',
        ruleData: null
      }
    ],
    createdAt: '2026-06-12T10:00:00Z',
    updatedAt: '2026-06-12T10:00:00Z'
  },
  {
    id: 'rule-2',
    name: 'Shopify Urgent Assign to Melbourne',
    description: 'Assign urgent Shopify orders to Melbourne Warehouse and flag internally.',
    status: 'active',
    priority: 2,
    stopProcessing: false,
    conditions: [
      { id: 'c-3', attribute: 'integration', operator: 'is', value: 'Shopify' },
      { id: 'c-4', attribute: 'tags', operator: 'includes', value: 'Urgent' }
    ],
    actions: [
      { id: 'a-3', type: 'assign_warehouse', config: { warehouse: 'MELB_DEPOT' } },
      { id: 'a-4', type: 'add_internal_note', config: { note: 'URGENT: Shopify Order. Process immediately.' } }
    ],
    versionHistory: [
      {
        id: 'v-2',
        version: 1,
        updatedAt: '2026-06-12T11:15:00Z',
        updatedBy: 'Chirag Sharma',
        changes: 'Initial rule creation.',
        ruleData: null
      }
    ],
    createdAt: '2026-06-12T11:15:00Z',
    updatedAt: '2026-06-12T11:15:00Z'
  },
  {
    id: 'rule-3',
    name: 'High Value Insurance Policy',
    description: 'Ensure orders worth more than $500 are covered by insurance.',
    status: 'inactive',
    priority: 3,
    stopProcessing: false,
    conditions: [
      { id: 'c-5', attribute: 'order_value', operator: 'gt', value: '500' }
    ],
    actions: [
      { id: 'a-5', type: 'enable_insurance', config: {} }
    ],
    versionHistory: [
      {
        id: 'v-3',
        version: 1,
        updatedAt: '2026-06-13T09:00:00Z',
        updatedBy: 'System',
        changes: 'Automated import from templates.',
        ruleData: null
      }
    ],
    createdAt: '2026-06-13T09:00:00Z',
    updatedAt: '2026-06-13T09:00:00Z'
  }
];

export const getRules = (): ShippingRule[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_RULES));
    return MOCK_RULES;
  }
  try {
    return JSON.parse(data);
  } catch {
    return MOCK_RULES;
  }
};

export const saveRules = (rules: ShippingRule[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rules));
};

export const evaluateCondition = (
  attribute: string,
  operator: string,
  conditionValue: any,
  inputData: Record<string, any>
): boolean => {
  const val = inputData[attribute];

  if (val === undefined || val === null) {
    // If it's a special attribute like PO Box/Parcel Locker, check if it's evaluated
    if (attribute === 'po_box_orders') {
      const isPo = String(inputData.destination_suburb || '').toUpperCase().includes('PO BOX') ||
                   String(inputData.destination_building || '').toUpperCase().includes('PO BOX') ||
                   String(inputData.destination_company || '').toUpperCase().includes('PO BOX') ||
                   String(inputData.destination_address || '').toUpperCase().includes('PO BOX');
      return operator === 'yes' ? isPo : !isPo;
    }
    if (attribute === 'parcel_locker_orders') {
      const isLocker = String(inputData.destination_suburb || '').toUpperCase().includes('PARCEL LOCKER') ||
                       String(inputData.destination_building || '').toUpperCase().includes('PARCEL LOCKER') ||
                       String(inputData.destination_address || '').toUpperCase().includes('PARCEL LOCKER');
      return operator === 'yes' ? isLocker : !isLocker;
    }
    return false;
  }

  // Handle Boolean types
  if (operator === 'yes') {
    return val === true || val === 'true' || val === 'Yes' || val === 1 || val === '1';
  }
  if (operator === 'no') {
    return val === false || val === 'false' || val === 'No' || val === 0 || val === '0';
  }

  const strVal = String(val).toLowerCase();
  const condStrVal = String(conditionValue).toLowerCase();

  switch (operator) {
    case 'is':
    case 'equals':
      return strVal === condStrVal;
    case 'is_not':
    case 'not_equals':
      return strVal !== condStrVal;
    case 'contains':
      return strVal.includes(condStrVal);
    case 'does_not_contain':
      return !strVal.includes(condStrVal);
    case 'starts_with':
      return strVal.startsWith(condStrVal);
    case 'does_not_start_with':
      return !strVal.startsWith(condStrVal);
    case 'ends_with':
      return strVal.endsWith(condStrVal);
    case 'does_not_end_with':
      return !strVal.endsWith(condStrVal);
    case 'gt':
      return Number(val) > Number(conditionValue);
    case 'lt':
      return Number(val) < Number(conditionValue);
    case 'gte':
      return Number(val) >= Number(conditionValue);
    case 'lte':
      return Number(val) <= Number(conditionValue);
    case 'before':
      return new Date(val) < new Date(conditionValue);
    case 'after':
      return new Date(val) > new Date(conditionValue);
    case 'between': {
      if (Array.isArray(conditionValue) && conditionValue.length === 2) {
        const d = new Date(val);
        return d >= new Date(conditionValue[0]) && d <= new Date(conditionValue[1]);
      }
      return false;
    }
    case 'last_x_days': {
      const days = Number(conditionValue);
      if (isNaN(days)) return false;
      const d = new Date(val);
      const diffMs = Date.now() - d.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      return diffDays >= 0 && diffDays <= days;
    }
    case 'includes': {
      if (Array.isArray(val)) {
        return val.map(v => String(v).toLowerCase()).includes(condStrVal);
      }
      return strVal.includes(condStrVal);
    }
    case 'excludes': {
      if (Array.isArray(val)) {
        return !val.map(v => String(v).toLowerCase()).includes(condStrVal);
      }
      return !strVal.includes(condStrVal);
    }
    default:
      return false;
  }
};

export const simulateRule = (
  rule: ShippingRule,
  inputData: Record<string, any>
): { matched: boolean; actions: { type: string; config: Record<string, any> }[] } => {
  if (rule.status !== 'active') {
    return { matched: false, actions: [] };
  }

  if (rule.conditions.length === 0) {
    return { matched: false, actions: [] };
  }

  // Match all conditions (AND logic)
  const isMatch = rule.conditions.every(cond => 
    evaluateCondition(cond.attribute, cond.operator, cond.value, inputData)
  );

  return {
    matched: isMatch,
    actions: isMatch ? rule.actions.map(a => ({ type: a.type, config: a.config })) : []
  };
};
