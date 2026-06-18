import { api } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type { RuleOptionsResponse, ListRuleResponse, RuleFormType } from '../types/rules.types';

export const rulesService = {
  /**
   * Get metadata options (couriers, products, attributes, action types)
   */
  getOptions: async (): Promise<RuleOptionsResponse> => {
    const response = await api.get<RuleOptionsResponse>(API_ENDPOINTS.RULES.OPTIONS);
    return response.data;
  },

  /**
   * Fetch list of shipping rules
   */
  getList: async (): Promise<ListRuleResponse> => {
    const response = await api.get<ListRuleResponse>(API_ENDPOINTS.RULES.BASE);
    return response.data;
  },

  /**
   * Fetch single rule detail
   */
  // getDetails: async (id: number | string): Promise<ShippingRule> => {
  //   const response = await api.get<{ data: BackendRule }>(API_ENDPOINTS.RULES.DETAILS(id));
  //   return response.data;
  // },

  /**
   * Create a new rule
   */
  create: async (data: any) => {
    const response = await api.post(API_ENDPOINTS.RULES.BASE, data);
    return response.data;
  },

  /**
   * Update an existing rule
   */
  update: async (
    id: number | string,
    data: RuleFormType,
  ): Promise<ListRuleResponse> => {
    const response = await api.put(API_ENDPOINTS.RULES.DETAILS(id), data);
    return response.data;
  },

  /**
   * Delete a rule
   */
  delete: async (id: number | string): Promise<void> => {
    await api.delete(API_ENDPOINTS.RULES.DETAILS(id));
  }
};
