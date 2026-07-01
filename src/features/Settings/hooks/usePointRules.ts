import { useEffect, useMemo, useState } from "react";
import type { PointRule } from "../../../types/derived/eos";
import { RANK_REQUIRED_TYPES } from "../utils/tabs/PointRules/pointRuleConstants";
import { updatePointRules } from "../../../services/point-rules";

export type PointRuleUpdatePayload = {
  added: PointRule[];
  updated: PointRule[];
  deleted: string[];
  allianceId: string;
};

export const createEmptyRule = (): PointRule => ({
  id: crypto.randomUUID(),
  system: null,
  type: null,
  minRank: null,
  maxRank: null,
  requiresRequirement: null,
  points: 0,
});

export function usePointRules(initialRules: PointRule[], allianceId: string, loadPoints: () => void) {
  const [rules, setRules] = useState<PointRule[]>(() =>
    initialRules.map((r) => ({ ...r }))
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRules(initialRules.map((r) => ({ ...r })));
  }, [initialRules]);

  const hasResetChanges = useMemo(
    () => JSON.stringify(rules) !== JSON.stringify(initialRules),
    [rules, initialRules]
  );

  const normalize = (rules: PointRule[]) =>
    rules.map(({ system, type, ...rest }) => ({
      ...rest,
      system: system ?? "",
      type: type ?? "",
    }));

  const hasUpdateChanges = useMemo(() => {
    return (
      JSON.stringify(normalize(rules)) !==
      JSON.stringify(normalize(initialRules))
    );
  }, [rules, initialRules]);

  const isRuleValid = (rule: PointRule) => {
    if (!rule.system || !rule.type) return false;

    const requiresRank = RANK_REQUIRED_TYPES.has(rule.type);

    if (requiresRank) {
      return rule.minRank !== null;
    }

    return true;
  };

  const canUpdate = useMemo(() => {
    return hasUpdateChanges && rules.every(isRuleValid);
  }, [hasUpdateChanges, rules]);

  const updateRule = <K extends keyof PointRule>(
    index: number,
    key: K,
    value: PointRule[K]
  ) => {
    setRules((prev) =>
      prev.map((rule, i) =>
        i === index ? { ...rule, [key]: value } : rule
      )
    );
  };

  const updateRules = (
    index: number,
    updates: Partial<PointRule>
  ) => {
    setRules((prev) =>
      prev.map((rule, i) =>
        i === index ? { ...rule, ...updates } : rule
      )
    );
  };

  const addRule = () => {
    setRules((prev) => [
      createEmptyRule(),
      ...prev,
    ]);
  };

  const deleteRule = (index: number) => {
    setRules((prev) => prev.filter((_, i) => i !== index));
  };

  const resetRules = () => {
    setRules(initialRules.map((rule) => ({ ...rule })));
  };

  const buildPointRulePayload = (
    initial: PointRule[],
    current: PointRule[]
  ): PointRuleUpdatePayload => {
    const initialById = new Map<string, PointRule>();
    const currentById = new Map<string, PointRule>();

    for (const r of initial) {
      if (r.id) initialById.set(r.id, r);
    }

    for (const r of current) {
      if (r.id) currentById.set(r.id, r);
    }

    const added: PointRule[] = [];
    const updated: PointRule[] = [];
    const deleted: string[] = [];

    // added + updated
    for (const rule of current) {
      if (!rule.id || !initialById.has(rule.id)) {
        added.push(rule);
        continue;
      }

      const original = initialById.get(rule.id)!;

      if (JSON.stringify(original) !== JSON.stringify(rule)) {
        updated.push(rule);
      }
    }

    // deleted
    for (const rule of initial) {
      if (rule.id && !currentById.has(rule.id)) {
        deleted.push(rule.id);
      }
    }

    return {
      added,
      updated,
      deleted,
      allianceId,
    };
  };

  const saveRules = async () => {
    const payload = buildPointRulePayload(initialRules, rules);
    await updatePointRules(payload);
    loadPoints();
  };

  return {
    rules,
    setRules,
    hasResetChanges,
    canUpdate,
    updateRule,
    updateRules,
    addRule,
    deleteRule,
    resetRules,
    saveRules,
  };
}
