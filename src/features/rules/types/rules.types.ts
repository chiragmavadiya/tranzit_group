export type ConditionType = 'all_orders' | 'criteria';

export type RuleActionTypeKey =
  | 'set_courier_product_code'
  | 'set_cheapest_carrier_service'
  | 'set_package'
  | 'set_signature_required'
  | 'set_authority_to_leave'
  | 'set_safe_drop'
  | 'set_dangerous_goods'
  | 'set_delivery_instructions';

export interface RuleCondition {
  field: string;
  operator: string;
  value: any;
}

export interface RuleMyItemSummary {
  id: number;
  item_code?: string;
  item_name?: string;
  missing: boolean;
}

export interface ShippingRule {
  id: number;
  name: string | null;
  condition_type: ConditionType;
  condition_label: string;
  conditions: RuleCondition[];
  action_type: RuleActionTypeKey;
  action_label: string;
  action_payload: Record<string, any> | null;
  my_item: RuleMyItemSummary | null;
  global_courier_id: number | null;
  carrier_code: string | null;
  carrier_name: string | null;
  product_code: string | null;
  product_name: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ListRuleResponse {
  status: boolean;
  message: string;
  data: ShippingRule[];
}

/** Payload sent to POST / PUT rule-management */
export interface RuleFormType {
  id?: number;
  name: string | null;
  condition_type: ConditionType;
  conditions: RuleCondition[];
  action_type: RuleActionTypeKey | '';
  action_payload: Record<string, any> | null;
  global_courier_id: number | null;
  product_code: string | null;
  product_name: string | null;
  sort_order?: number;
  is_active: boolean;
}

export interface RuleOperatorOption {
  key: string;
  label: string;
}

export interface RuleConditionField {
  key: string;
  label: string;
  type: 'numeric' | 'string' | 'postcode' | 'enum' | 'boolean';
  scope: 'order' | 'item';
  value_hint: string;
  operators: RuleOperatorOption[];
}

export interface RuleSourceOption {
  id: number;
  label: string;
}

export interface RuleActionTypeOption {
  key: RuleActionTypeKey;
  label: string;
  payload_schema: Record<string, string> | null;
}

export interface RuleMyItem {
  id: number;
  item_code: string;
  item_name: string;
  item_weight: number;
  item_length: number;
  item_width: number;
  item_height: number;
  is_default: boolean;
}

export interface RuleCarrierOption {
  id: number;
  code: string;
  name: string;
  account_id: number;
  account_label: string;
}

export interface RuleProductOption {
  carrier_id: number;
  carrier_code: string;
  carrier_name: string;
  product_code: string;
  product_name: string;
}

export interface RuleOptionsResponse {
  status: boolean;
  message: string;
  data: {
    condition_types: { key: ConditionType; label: string }[];
    condition_fields: RuleConditionField[];
    sources: RuleSourceOption[];
    action_types: RuleActionTypeOption[];
    my_items: RuleMyItem[];
    carriers: RuleCarrierOption[];
    products: RuleProductOption[];
  };
}

export type RuleRunState = 'idle' | 'queued' | 'running' | 'done' | 'failed';

export interface RuleRunStatus {
  state: RuleRunState;
  processed?: number;
  updated?: number;
  errors?: number;
  eligible?: number;
  started_at?: string | null;
  finished_at?: string | null;
}

export interface RuleRunStatusResponse {
  status: boolean;
  message: string;
  data: RuleRunStatus;
}
