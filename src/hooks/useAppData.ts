import { useEffect, useRef, useState, useCallback } from "react";
import type { Member } from "../types/member";
import type { Week } from "../types/week";
import type { StateRulerResponse } from "../types/stateRuler";
import type { PointRule } from "../types/derived/eos";
import type { AdjustmentLog } from "../types/log";
import { buildTop10Index } from "../data/cache/top10Index";
import { buildMemberIndex } from "../data/cache/memberIndex";
import { getMembers } from "../services/member";
import { getLogs } from "../services/log";
import { getAllAllianceDuelWeeks } from "../services/alliance-duel";
import { getAllStateRulers } from "../services/state-ruler";
import { getPointRules } from "../services/point-rules";
import { SettingsResponse } from "../types/settings";
import { getSettings } from "../services/settings";

export function useAppData() {
  const [members, setMembers] = useState<Member[]>([]);
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [stateRulerData, setStateRulerData] = useState<StateRulerResponse>();
  const [pointRules, setPointRules] = useState<PointRule[]>([]);
  const [logs, setLogs] = useState<AdjustmentLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [allianceSettings, setAllianceSettings] = useState<SettingsResponse>();

  const didFetch = useRef(false);

  const loadMembers = useCallback(async () => {
    const data = await getMembers();
    setMembers(data);
    buildMemberIndex(data);
  }, []);

  const loadWeeks = useCallback(async () => {
    const data = await getAllAllianceDuelWeeks();
    setWeeks(data.weeks);
    buildTop10Index(data.weeks);
  }, []);

  // const loadStateRulerData = useCallback(async () => {
  //   const data = await getAllStateRulers();
  //   setStateRulerData(data.data);
  // }, []);

  // const loadPoints = useCallback(async () => {
  //   const data = await getPointRules();
  //   setPointRules(data);
  // }, []);

  // const loadLogs = useCallback(async () => {
  //   const data = await getLogs();
  //   setLogs(data);
  // }, []);

  const loadSettings = useCallback(async () => {
    const data = await getSettings();
    setAllianceSettings(data);
  }, []);

  const loadAll = useCallback(async () => {
    try {
      setLoading(true);

      const [
        memberData,
        weekData,
        // stateRulerData,
        // pointRules,
        // logData,
        settings,
      ] = await Promise.all([
        getMembers(),
        getAllAllianceDuelWeeks(),
        // getAllStateRulers(),
        // getPointRules(),
        // getLogs(),
        getSettings(),
      ]);

      setMembers(memberData);
      buildMemberIndex(memberData);

      // setWeeks(weekData.weeks);
      // buildTop10Index(weekData.weeks);

      // setStateRulerData(stateRulerData.data);
      // setPointRules(pointRules);
      // setLogs(logData);
      setAllianceSettings(settings);
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
    allianceSettings,

    pointRules,
    logs,

    loadMembers,
    loadWeeks,
    // loadPoints,
    // loadLogs,
    loadSettings,
    loadAll,

    setMembers,
    setWeeks,

    stateRulerData,
    // loadStateRulerData,
  };
}
