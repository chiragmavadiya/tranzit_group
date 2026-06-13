import type { ShippingRule } from '../types/rules.types';

const STORAGE_KEY = 'shipping_automation_rules';

const MOCK_RULES: ShippingRule[] = [];

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
