import type { DayKey } from "../../../types/week";
import { EVENT_MAP } from "./eventMap";

export type EventDay = keyof typeof EVENT_MAP;

export const DAYS: DayKey[] = [...Object.keys(EVENT_MAP), "Weekly"] as DayKey[];
