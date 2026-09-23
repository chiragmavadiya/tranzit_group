import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  matchesRuleConditions,
  mergeCourierSettingsWithRuleFlags,
  ruleFlagDefaultsFromActiveRules,
} from './ruleDefaults.ts';
import type { ShippingRule } from '../types/rules.types';

const baseRule = (overrides: Partial<ShippingRule>): ShippingRule => ({
  id: 1,
  name: 'Test',
  condition_type: 'all_orders',
  condition_label: 'All Orders',
  conditions: [],
  action_type: 'set_dangerous_goods',
  action_label: 'Set Consignment Does Not Contain Dangerous Goods',
  action_payload: { value: true },
  my_item: null,
  global_courier_id: null,
  carrier_code: null,
  carrier_name: null,
  product_code: null,
  product_name: null,
  sort_order: 0,
  is_active: true,
  created_at: '',
  updated_at: '',
  ...overrides,
});

describe('ruleFlagDefaultsFromActiveRules', () => {
  it('pre-checks dangerous goods when All Orders DG rule is Yes', () => {
    const defaults = ruleFlagDefaultsFromActiveRules([
      baseRule({ action_type: 'set_dangerous_goods', action_payload: { value: true } }),
    ]);
    assert.equal(defaults.dangerousGoodsAccepted, true);
  });

  it('does not pre-check DG when rule value is No', () => {
    const defaults = ruleFlagDefaultsFromActiveRules([
      baseRule({ action_type: 'set_dangerous_goods', action_payload: { value: false } }),
    ]);
    assert.equal(defaults.dangerousGoodsAccepted, false);
  });

  it('ignores inactive and criteria rules for create-form defaults', () => {
    const defaults = ruleFlagDefaultsFromActiveRules([
      baseRule({ id: 1, is_active: false, action_payload: { value: true } }),
      baseRule({
        id: 2,
        condition_type: 'criteria',
        conditions: [{ field: 'order_weight', operator: 'greater_than', value: '1' }],
        action_payload: { value: true },
      }),
    ]);
    assert.equal(defaults.dangerousGoodsAccepted, null);
  });

  it('applies signature / ATL / instructions winners by sort order', () => {
    const defaults = ruleFlagDefaultsFromActiveRules([
      baseRule({
        id: 1,
        sort_order: 0,
        action_type: 'set_authority_to_leave',
        action_payload: { value: true },
      }),
      baseRule({
        id: 2,
        sort_order: 1,
        action_type: 'set_signature_required',
        action_payload: { value: true },
      }),
      baseRule({
        id: 3,
        sort_order: 2,
        action_type: 'set_delivery_instructions',
        action_payload: { delivery_instructions: 'Leave at door', label_notes: 'FRAGILE' },
      }),
    ]);

    assert.equal(defaults.authorityToLeave, true);
    // Explicit signature rule wins over ATL's implied signature-off.
    assert.equal(defaults.signatureRequired, true);
    assert.equal(defaults.deliveryInstructions, 'Leave at door');
    assert.equal(defaults.labelNotes, 'FRAGILE');
  });

  it('forces signature off when ATL is on and no signature rule matched', () => {
    const defaults = ruleFlagDefaultsFromActiveRules([
      baseRule({
        action_type: 'set_authority_to_leave',
        action_payload: { value: true },
      }),
    ]);
    assert.equal(defaults.authorityToLeave, true);
    assert.equal(defaults.signatureRequired, false);
  });

  it('prefills custom package dimensions', () => {
    const defaults = ruleFlagDefaultsFromActiveRules([
      baseRule({
        action_type: 'set_package',
        action_payload: { mode: 'custom', weight: 2.5, length: 30, width: 20, height: 10 },
      }),
    ]);
    assert.deepEqual(defaults.package, { weight: 2.5, length: 30, width: 20, height: 10 });
  });

  it('resolves package from My Item catalogue', () => {
    const defaults = ruleFlagDefaultsFromActiveRules(
      [
        baseRule({
          action_type: 'set_package',
          action_payload: { mode: 'my_item', my_item_id: 9 },
        }),
      ],
      [{
        id: 9,
        item_code: 'BOX',
        item_name: 'Standard',
        item_weight: 1.2,
        item_length: 40,
        item_width: 30,
        item_height: 20,
        is_default: false,
      }],
    );
    assert.deepEqual(defaults.package, { weight: 1.2, length: 40, width: 30, height: 20 });
  });

  it('does not invent package dims for courier-only rules', () => {
    const defaults = ruleFlagDefaultsFromActiveRules([
      baseRule({
        action_type: 'set_cheapest_carrier_service',
        action_payload: null,
      }),
    ]);
    assert.equal(defaults.package, null);
    assert.equal(defaults.dangerousGoodsAccepted, null);
  });
});

describe('matchesRuleConditions', () => {
  const criteria = (conditions: { field: string; operator: string; value: any }[]) =>
    baseRule({ condition_type: 'criteria', conditions });

  it('matches destination state and applies the rule on the create form', () => {
    const rule = baseRule({
      condition_type: 'criteria',
      conditions: [{ field: 'receiver_state', operator: 'equals', value: 'WA' }],
      action_type: 'set_delivery_instructions',
      action_payload: { delivery_instructions: 'Leave near garden', label_notes: 'leave at door' },
    });

    assert.equal(matchesRuleConditions(rule, { receiver_state: 'wa' }), true);
    assert.equal(matchesRuleConditions(rule, { receiver_state: 'VIC' }), false);

    assert.equal(
      ruleFlagDefaultsFromActiveRules([rule], [], { receiver_state: 'WA' }).deliveryInstructions,
      'Leave near garden',
    );
    assert.equal(
      ruleFlagDefaultsFromActiveRules([rule], [], { receiver_state: 'VIC' }).deliveryInstructions,
      null,
    );
  });

  it('requires every condition to hold', () => {
    const rule = criteria([
      { field: 'receiver_state', operator: 'equals', value: 'WA' },
      { field: 'order_weight', operator: 'greater_than', value: '5' },
    ]);
    assert.equal(matchesRuleConditions(rule, { receiver_state: 'WA', order_weight: 6 }), true);
    assert.equal(matchesRuleConditions(rule, { receiver_state: 'WA', order_weight: 5 }), false);
  });

  it('reads postcode lists and ranges', () => {
    const rule = criteria([{ field: 'receiver_postcode', operator: 'equals', value: '2000, 2100-2199' }]);
    assert.equal(matchesRuleConditions(rule, { receiver_postcode: '2000' }), true);
    assert.equal(matchesRuleConditions(rule, { receiver_postcode: '2150' }), true);
    assert.equal(matchesRuleConditions(rule, { receiver_postcode: '2200' }), false);
  });

  it('matches an item-scope condition when any item qualifies', () => {
    const rule = criteria([{ field: 'item_quantity', operator: 'greater_than', value: '2' }]);
    assert.equal(matchesRuleConditions(rule, { item_quantity: [1, 4] }), true);
    assert.equal(matchesRuleConditions(rule, { item_quantity: [1, 2] }), false);
  });

  it('never matches an unknown field, an unknown operator or a blank value', () => {
    assert.equal(
      matchesRuleConditions(criteria([{ field: 'item_sku', operator: 'equals', value: 'TSHIRT' }]), {}),
      false,
    );
    assert.equal(
      matchesRuleConditions(criteria([{ field: 'receiver_state', operator: 'ends_with', value: 'WA' }]), { receiver_state: 'WA' }),
      false,
    );
    assert.equal(
      matchesRuleConditions(criteria([{ field: 'receiver_state', operator: 'equals', value: 'WA' }]), { receiver_state: '' }),
      false,
    );
    assert.equal(matchesRuleConditions(criteria([]), { receiver_state: 'WA' }), false);
  });

  it('lets a lower sort_order criteria rule beat an All Orders rule', () => {
    const defaults = ruleFlagDefaultsFromActiveRules(
      [
        baseRule({
          id: 1,
          sort_order: 1,
          action_type: 'set_delivery_instructions',
          action_payload: { delivery_instructions: 'Standard' },
        }),
        baseRule({
          id: 2,
          sort_order: 0,
          condition_type: 'criteria',
          conditions: [{ field: 'receiver_state', operator: 'equals', value: 'WA' }],
          action_type: 'set_delivery_instructions',
          action_payload: { delivery_instructions: 'WA only' },
        }),
      ],
      [],
      { receiver_state: 'WA' },
    );
    assert.equal(defaults.deliveryInstructions, 'WA only');
  });
});

describe('mergeCourierSettingsWithRuleFlags', () => {
  it('keeps rule ATL/signature over courier defaults', () => {
    const merged = mergeCourierSettingsWithRuleFlags(
      { authority_to_leave: false, signature_required: true, priority: true },
      { authority_to_leave: true, signature_required: false },
    );
    assert.equal(merged.authority_to_leave, true);
    assert.equal(merged.signature_required, false);
    assert.equal(merged.priority, true);
  });
});
