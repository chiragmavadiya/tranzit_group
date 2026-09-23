import type { RuleActionTypeKey, RuleMyItem, ShippingRule } from '../types/rules.types';

export type RulePackageDefaults = {
  weight: number;
  length: number;
  width: number;
  height: number;
} | null;

export type RuleFlagDefaults = {
  /** Checkbox "does not contain Dangerous goods" should be checked. */
  dangerousGoodsAccepted: boolean | null;
  signatureRequired: boolean | null;
  authorityToLeave: boolean | null;
  safeDrop: boolean | null;
  deliveryInstructions: string | null;
  labelNotes: string | null;
  package: RulePackageDefaults;
};

const BOOLEAN_ACTIONS: RuleActionTypeKey[] = [
  'set_signature_required',
  'set_authority_to_leave',
  'set_safe_drop',
  'set_dangerous_goods',
];

export type RuleOrderContext = Record<string, string | number | (string | number)[] | undefined>;

/** Destination Post Code takes lists and ranges, e.g. "2000, 2100-2199". */
function postcodeMatches(actual: string, expected: string): boolean {
  const value = Number(actual);
  return expected.split(',').some((token) => {
    const part = token.trim();
    if (!part) {
      return false;
    }
    const [from, to] = part.split('-').map((edge) => Number(edge.trim()));
    if (part.includes('-') && !Number.isNaN(from) && !Number.isNaN(to)) {
      return !Number.isNaN(value) && value >= from && value <= to;
    }
    return part.toLowerCase() === actual;
  });
}

function compareOne(field: string, operator: string, actual: unknown, expected: unknown): boolean {
  if (actual === undefined || actual === null || actual === '') {
    return false;
  }

  const left = String(actual).trim().toLowerCase();
  const right = String(expected ?? '').trim().toLowerCase();
  if (right === '') {
    return false;
  }

  const leftNumber = Number(actual);
  const rightNumber = Number(expected);
  const bothNumeric = !Number.isNaN(leftNumber) && !Number.isNaN(rightNumber);
  const isPostcode = field === 'receiver_postcode';

  switch (operator) {
    case 'equals':
      if (isPostcode) return postcodeMatches(left, right);
      return bothNumeric ? leftNumber === rightNumber : left === right;
    case 'not_equals':
      if (isPostcode) return !postcodeMatches(left, right);
      return bothNumeric ? leftNumber !== rightNumber : left !== right;
    case 'greater_than':
      return bothNumeric && leftNumber > rightNumber;
    case 'less_than':
      return bothNumeric && leftNumber < rightNumber;
    case 'contains':
      return left.includes(right);
    case 'not_contains':
      return !left.includes(right);
    case 'starts_with':
      return left.startsWith(right);
    default:
      return false;
  }
}

/** All conditions must hold (the builder is AND-only). Unknown field or operator never matches. */
export function matchesRuleConditions(rule: ShippingRule, context: RuleOrderContext): boolean {
  if (rule.condition_type === 'all_orders') {
    return true;
  }
  if (!rule.conditions?.length) {
    return false;
  }

  return rule.conditions.every((condition) => {
    if (!Object.prototype.hasOwnProperty.call(context, condition.field)) {
      return false;
    }
    const operator = String(condition.operator ?? '').toLowerCase();
    const actual = context[condition.field];
    if (Array.isArray(actual)) {
      return actual.some((entry) => compareOne(condition.field, operator, entry, condition.value));
    }
    return compareOne(condition.field, operator, actual, condition.value);
  });
}

/**
 * Courier / cheapest are intentionally omitted — get-quote marks `rule_applied`
 * and CarrierCard auto-selects that service.
 */
export function ruleFlagDefaultsFromActiveRules(
  rules: ShippingRule[],
  myItems: RuleMyItem[] = [],
  context?: RuleOrderContext,
): RuleFlagDefaults {
  const defaults: RuleFlagDefaults = {
    dangerousGoodsAccepted: null,
    signatureRequired: null,
    authorityToLeave: null,
    safeDrop: null,
    deliveryInstructions: null,
    labelNotes: null,
    package: null,
  };

  const winners = new Map<RuleActionTypeKey, ShippingRule>();
  for (const rule of [...rules].sort((a, b) => a.sort_order - b.sort_order || a.id - b.id)) {
    if (!rule.is_active) {
      continue;
    }
    if (rule.condition_type !== 'all_orders' && !(context && matchesRuleConditions(rule, context))) {
      continue;
    }
    if (!winners.has(rule.action_type)) {
      winners.set(rule.action_type, rule);
    }
  }

  for (const action of BOOLEAN_ACTIONS) {
    const rule = winners.get(action);
    if (!rule) {
      continue;
    }
    const value = Boolean(rule.action_payload?.value);
    if (action === 'set_dangerous_goods') {
      // Action label is "does NOT contain" — Yes on the rule → check the box.
      defaults.dangerousGoodsAccepted = value;
    } else if (action === 'set_signature_required') {
      defaults.signatureRequired = value;
    } else if (action === 'set_authority_to_leave') {
      defaults.authorityToLeave = value;
    } else if (action === 'set_safe_drop') {
      defaults.safeDrop = value;
    }
  }

  const instructions = winners.get('set_delivery_instructions');
  if (instructions) {
    const delivery = String(instructions.action_payload?.delivery_instructions ?? '').trim();
    const notes = String(instructions.action_payload?.label_notes ?? '').trim();
    if (delivery) {
      defaults.deliveryInstructions = delivery;
    }
    if (notes) {
      defaults.labelNotes = notes;
    }
  }

  const packageRule = winners.get('set_package');
  if (packageRule) {
    defaults.package = resolvePackageDimensions(packageRule, myItems);
  }

  // Carriers reject signature together with ATL/safe drop.
  if (
    (defaults.authorityToLeave || defaults.safeDrop) &&
    defaults.signatureRequired === null
  ) {
    defaults.signatureRequired = false;
  }

  return defaults;
}

function resolvePackageDimensions(
  rule: ShippingRule,
  myItems: RuleMyItem[],
): RulePackageDefaults {
  const payload = rule.action_payload ?? {};
  if (payload.mode === 'my_item') {
    const id = Number(payload.my_item_id ?? rule.my_item?.id ?? 0);
    const item = myItems.find((row) => row.id === id);
    if (!item) {
      return null;
    }
    return {
      weight: Number(item.item_weight) || 0,
      length: Number(item.item_length) || 0,
      width: Number(item.item_width) || 0,
      height: Number(item.item_height) || 0,
    };
  }

  const dims = {
    weight: Number(payload.weight) || 0,
    length: Number(payload.length) || 0,
    width: Number(payload.width) || 0,
    height: Number(payload.height) || 0,
  };
  if (dims.weight <= 0 || dims.length <= 0 || dims.width <= 0 || dims.height <= 0) {
    return null;
  }
  return dims;
}

/** Keys that Rule Management owns — CarrierCard must not wipe these with courier defaults. */
export const RULE_OWNED_OPTION_KEYS = [
  'signature_required',
  'authority_to_leave',
  'safe_drop',
] as const;

/**
 * Merge courier advanced_settings defaults with already-applied rule flags.
 * Rule-owned keys already present on `prev` win.
 */
export function mergeCourierSettingsWithRuleFlags(
  courierDefaults: Record<string, unknown>,
  prev: Record<string, unknown> | null | undefined,
): Record<string, unknown> {
  const merged = { ...courierDefaults };
  if (!prev) {
    return merged;
  }
  for (const key of RULE_OWNED_OPTION_KEYS) {
    if (Object.prototype.hasOwnProperty.call(prev, key)) {
      merged[key] = prev[key];
    }
  }
  return merged;
}
