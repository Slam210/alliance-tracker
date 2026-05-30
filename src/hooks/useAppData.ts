import { useEffect, useRef, useState, useCallback } from "react";
import type { Member } from "../types/member";
import type { Week } from "../types/week";
import { getMembers, getAllAllianceDuelWeeks } from "../services/api";

export function useAppData() {
  const [members, setMembers] = useState<Member[]>([]);
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [loading, setLoading] = useState(true);

  const didFetch = useRef(false);

  const loadMembers = useCallback(async () => {
    const data = await getMembers();
    setMembers(data);
  }, []);

  const loadWeeks = useCallback(async () => {
    const data = await getAllAllianceDuelWeeks();
    setWeeks(data.weeks);
  }, []);

  const loadPoints = useCallback(async () => {
    const data = await getAllAllianceDuelWeeks();
    setWeeks(data.weeks);
  }, []);

  const loadAll = useCallback(async () => {
    try {
      setLoading(true);

      const [memberData, weekData] = await Promise.all([
        getMembers(),
        getAllAllianceDuelWeeks(),
      ]);

      setMembers(memberData);
      setWeeks(weekData.weeks);
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
  };
}
