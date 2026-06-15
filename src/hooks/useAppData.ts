import { useEffect, useRef, useState, useCallback } from "react";
import type { Member } from "../types/member";
import type { Week } from "../types/week";
import type { StateRulerResponse } from "../types/stateRuler";
import {
  getMembers,
  getAllAllianceDuelWeeks,
  getAllStateRulers,
  getPoints,
} from "../services/api";
import { setMemberNicknames } from "../stores/memberStore";
import { buildTop10Store } from "../stores/scoreStore";
import type { PointRule } from "../types/derived/eos";

export function useAppData() {
  const [members, setMembers] = useState<Member[]>([]);
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [stateRulerData, setStateRulerData] = useState<StateRulerResponse>();
  const [pointRules, setPointRules] = useState<PointRule[]>([]);
  const [loading, setLoading] = useState(true);

  const didFetch = useRef(false);

  const loadMembers = useCallback(async () => {
    const data = await getMembers();
    setMembers(data);
    setMemberNicknames(data);
  }, []);

  const loadWeeks = useCallback(async () => {
    const data = await getAllAllianceDuelWeeks();
    setWeeks(data.weeks);
    buildTop10Store(data.weeks);
  }, []);

  const loadStateRulerData = useCallback(async () => {
    const data = await getAllStateRulers();
    setStateRulerData(data.data);
  }, []);

  const loadPoints = useCallback(async () => {
    const data = await getPoints();
    setPointRules(data);
  }, []);

  const loadAll = useCallback(async () => {
    try {
      setLoading(true);

      const [memberData, weekData, stateRulerData, pointRules] =
        await Promise.all([
          getMembers(),
          getAllAllianceDuelWeeks(),
          getAllStateRulers(),
          getPoints(),
        ]);

      setMembers(memberData);
      setMemberNicknames(memberData);

      setWeeks(weekData.weeks);
      buildTop10Store(weekData.weeks);

      setStateRulerData(stateRulerData.data);
      setPointRules(pointRules);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    void loadAll();
  }, [loadAll]);

  return {
    members,
    weeks,
    loading,

    pointRules,

    loadMembers,
    loadWeeks,
    loadPoints,
    reloadAll: loadAll,

    setMembers,
    setWeeks,

    stateRulerData,
    loadStateRulerData,
  };
}
