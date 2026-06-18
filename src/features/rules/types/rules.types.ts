export type RuleStatus = 'active' | 'inactive';

export interface Condition {
  id: string;
  attribute: string;
  operator: string;
  value: any;
}

export interface RuleAction {
  id: string;
  type: string;
  config: Record<string, any>;
}

export interface RuleVersion {
  id: string;
  version: number;
  updatedAt: string;
  updatedBy: string;
  changes: string;
  ruleData: any; // snapshot of rule when saved
}

export interface ListRuleResponse {
  status: boolean;
  message: string;
  data: ShippingRule[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export interface ShippingRule {
  id: number,
  name: any,
  condition_type: string,
  condition_label: string,
  conditions: {
    attribute: string
  },
  action_type: string,
  action_label: string,
  global_courier_id: number,
  carrier_code: string,
  carrier_name: string,
  product_code: string,
  product_name: string,
  sort_order: number,
  is_active: boolean,
  created_at: string,
  updated_at: string
}

export interface RuleFormType {
  condition_type: string,
  action_type: string,
  global_courier_id: number | null,
  product_code: string | null,
  id?: number,

}

export interface RuleAttribute {
  key: string;
  label: string;
  category: 'ORDER' | 'DESTINATION' | 'SHIPPING' | 'PARCEL' | 'INTEGRATION' | 'SPECIAL';
  type: 'text' | 'number' | 'date' | 'boolean' | 'list' | 'select' | 'multi-select' | null;
  options?: { label: string; value: string }[];
}

export interface RuleActionType {
  key: string;
  label: string;
  category: 'Courier' | 'Shipping' | 'Parcel' | 'Order' | 'Routing' | 'Notification' | 'Custom';
  fields: {
    name: string;
    label: string;
    type: 'select' | 'text' | 'number' | 'multi-select';
    options?: { label: string; value: string }[];
    placeholder?: string;
  }[];
}

export interface BackendRule {
  id: number;
  condition_type: string;
  action_type: string;
  global_courier_id: number | null;
  product_code: string | null;
  global_courier?: {
    id: number;
    name: string;
    slug: string;
  } | null;
  created_at?: string;
  updated_at?: string;
}

export interface RuleOptionsResponse {
  status: boolean;
  message: string;
  data: {
    condition_types?: { label: string; value: string }[];
    action_types?: { label: string; value: string }[];
    carriers?: {
      id: number;
      name: string;
      slug: string;
      code: string;
    }[];
    products: {
      product_name: string;
      product_code: string;
    }[];
    couriers?: any[];
  };
}

