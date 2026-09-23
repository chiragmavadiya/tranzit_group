import { api } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type {
  RuleOptionsResponse,
  ListRuleResponse,
  RuleFormType,
  RuleRunStatusResponse,
} from '../types/rules.types';

export const rulesService = {
  /**
   * Get metadata options (condition fields, action types, carriers, products, my items)
   */
  getOptions: async (): Promise<RuleOptionsResponse> => {
    const response = await api.get<RuleOptionsResponse>(API_ENDPOINTS.RULES.OPTIONS);
    return response.data;
  },

  /**
   * Fetch list of shipping rules (ordered by sort_order)
   */
  getList: async (): Promise<ListRuleResponse> => {
    const response = await api.get<ListRuleResponse>(API_ENDPOINTS.RULES.BASE);
    return response.data;
  },

  /**
   * Create a new rule
   */
  create: async (data: RuleFormType) => {
    const response = await api.post(API_ENDPOINTS.RULES.BASE, data);
    return response.data;
  },

  /**
   * Update an existing rule
   */
  update: async (
    id: number | string,
    data: RuleFormType,
  ) => {
    const response = await api.put(API_ENDPOINTS.RULES.DETAILS(id), data);
    return response.data;
  },

  /**
   * Delete a rule
   */
  delete: async (id: number | string): Promise<void> => {
    await api.delete(API_ENDPOINTS.RULES.DETAILS(id));
  },

  /**
   * Persist a new running order for the rules
   */
  reorder: async (rules: { id: number; sort_order: number }[]): Promise<ListRuleResponse> => {
    const response = await api.put<ListRuleResponse>(API_ENDPOINTS.RULES.REORDER, { rules });
    return response.data;
  },

  /**
   * Queue a manual "run rules now" job over eligible unshipped orders
   */
  run: async () => {
    const response = await api.post(API_ENDPOINTS.RULES.RUN);
    return response.data;
  },

  /**
   * Poll the status of the queued/running rule run
   */
  runStatus: async (): Promise<RuleRunStatusResponse> => {
    const response = await api.get<RuleRunStatusResponse>(API_ENDPOINTS.RULES.RUN_STATUS);
    return response.data;
  },
};
