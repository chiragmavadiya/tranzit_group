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

export interface ShippingRule {
  id: string;
  name: string;
  description: string;
  status: RuleStatus;
  priority: number;
  stopProcessing: boolean;
  conditions: Condition[];
  actions: RuleAction[];
  versionHistory: RuleVersion[];
  createdAt: string;
  updatedAt: string;
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
