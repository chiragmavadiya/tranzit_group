import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRules, saveRules } from "../services/rules.service";
import type { ShippingRule } from "../types/rules.types";
import { showToast } from "@/components/ui/custom-toast";

const RULES_QUERY_KEY = ["rules", "list"];

export const useRules = () => {
  return useQuery({
    queryKey: RULES_QUERY_KEY,
    queryFn: () => {
      const rules = getRules();
      return rules.sort((a, b) => a.priority - b.priority);
    },
  });
};

export const useCreateRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newRuleData: Omit<ShippingRule, 'id' | 'createdAt' | 'updatedAt' | 'versionHistory' | 'priority'>) => {
      const rules = getRules();
      const nextPriority = rules.length > 0 ? Math.max(...rules.map(r => r.priority)) + 1 : 1;

      const newRule: ShippingRule = {
        ...newRuleData,
        id: 'rule-' + Date.now(),
        priority: nextPriority,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        versionHistory: [
          {
            id: 'v-' + Date.now(),
            version: 1,
            updatedAt: new Date().toISOString(),
            updatedBy: 'Chirag Sharma',
            changes: 'Rule created.',
            ruleData: JSON.parse(JSON.stringify(newRuleData))
          }
        ]
      };

      rules.push(newRule);
      saveRules(rules);
      return newRule;
    },
    onSuccess: () => {
      showToast("Rule created successfully", "success");
      queryClient.invalidateQueries({ queryKey: RULES_QUERY_KEY });
    },
    onError: (error: any) => {
      showToast(error.message || "Failed to create rule", "error");
    }
  });
};

export const useUpdateRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ShippingRule>; changes?: string }) => {
      const rules = getRules();
      const ruleIndex = rules.findIndex(r => r.id === id);
      if (ruleIndex === -1) throw new Error("Rule not found");

      const existingRule = rules[ruleIndex];
      const updatedRule: ShippingRule = {
        ...existingRule,
        ...data,
        updatedAt: new Date().toISOString(),
      };

      rules[ruleIndex] = updatedRule;
      saveRules(rules);
      return updatedRule;
    },
    onSuccess: () => {
      showToast("Rule updated successfully", "success");
      queryClient.invalidateQueries({ queryKey: RULES_QUERY_KEY });
    },
    onError: (error: any) => {
      showToast(error.message || "Failed to update rule", "error");
    }
  });
};

export const useDeleteRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const rules = getRules();
      const updatedRules = rules.filter(r => r.id !== id);

      const sorted = updatedRules.sort((a, b) => a.priority - b.priority);
      sorted.forEach((rule, index) => {
        rule.priority = index + 1;
      });

      saveRules(sorted);
    },
    onSuccess: () => {
      showToast("Rule deleted successfully", "success");
      queryClient.invalidateQueries({ queryKey: RULES_QUERY_KEY });
    },
    onError: (error: any) => {
      showToast(error.message || "Failed to delete rule", "error");
    }
  });
};
