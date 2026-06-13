import type { Condition, RuleAction } from '../types/rules.types';
import { ATTRIBUTES, ACTION_TYPES } from '../constants/rules.constants';

export const getOperatorLabel = (operator: string): string => {
  switch (operator) {
    case 'is':
      return 'is';
    case 'is_not':
      return 'is not';
    default:
      return operator;
  }
};

export const generateRuleSentence = (conditions: Condition[], actions: RuleAction[]): string => {
  if (conditions.length === 0 && actions.length === 0) {
    return 'Add conditions and actions to see the live rule preview.';
  }

  let conditionsText = '';
  if (conditions.length > 0) {
    const condPhrases = conditions.map((cond) => {
      if (cond.attribute === 'all_orders') {
        return 'all orders';
      }
      const attr = ATTRIBUTES.find(a => a.key === cond.attribute);
      const attrLabel = attr ? attr.label : cond.attribute;
      const opLabel = getOperatorLabel(cond.operator);
      const valText = cond.value !== undefined && cond.value !== null ? `"${cond.value}"` : '___';
      return `${attrLabel.toLowerCase()} ${opLabel} ${valText}`.trim().replace(/\s+/g, ' ');
    });

    conditionsText = `When ${condPhrases.join(' and ')}`;
  } else {
    conditionsText = 'For all orders';
  }

  let actionsText = '';
  if (actions.length > 0) {
    const actPhrases = actions.map(act => {
      const actType = ACTION_TYPES.find(a => a.key === act.type);
      const actLabel = actType ? actType.label : act.type;

      if (!actType) return actLabel;

      const config = act.config || {};
      switch (act.type) {
        case 'select_cheapest_carrier_service':
          return 'select cheapest carrier/service';
        case 'set_courier_product':
          return `set courier to ${config.courier || '___'} with product ${config.product_code || '___'}`;
        default:
          return actLabel;
      }
    });

    actionsText = `automatically ${actPhrases.join(' and ')}`;
  } else {
    actionsText = 'take no actions';
  }

  const rawSentence = `${conditionsText}, ${actionsText}.`;
  return rawSentence.charAt(0).toUpperCase() + rawSentence.slice(1);
};
