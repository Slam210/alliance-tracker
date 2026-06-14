import { useEffect, useRef, useState, useCallback } from "react";
import type { Member } from "../types/member";
import type { Week } from "../types/week";
import {
  getMembers,
  getAllAllianceDuelWeeks,
  getAllStateRulers,
} from "../services/api";
import { setMemberNicknames } from "../stores/memberStore";
import { buildTop10Store } from "../stores/scoreStore";
import type { StateRulerResponse } from "../types/stateRuler";

export function useAppData() {
  const [members, setMembers] = useState<Member[]>([]);
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [stateRulerData, setStateRulerData] =
    useState<StateRulerResponse | null>(null);
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
    const data = await getAllAllianceDuelWeeks();
    setWeeks(data.weeks);
    buildTop10Store(data.weeks);
  }, []);

  const loadAll = useCallback(async () => {
    try {
      setLoading(true);

      const [memberData, weekData, stateRulerData] = await Promise.all([
        getMembers(),
        getAllAllianceDuelWeeks(),
        getAllStateRulers(),
      ]);

      setMembers(memberData);
      setMemberNicknames(memberData);
      setWeeks(weekData.weeks);
      buildTop10Store(weekData.weeks);
      setStateRulerData(stateRulerData.data);
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
