import type { TabConfig } from "../types/app";

export const APP_TABS = [
  {
    key: "members",
    label: "Manage Members",
    allowedRoles: ["admin","viewer"],
  },
  {
    key: "alliance-duel",
    label: "Alliance Duel",
    allowedRoles: ["admin","viewer"],
  },
  {
    key: "state-ruler",
    label: "State Ruler",
    allowedRoles: ["admin","viewer"],
  },
  {
    key: "rankings",
    label: "Rankings",
    allowedRoles: ["admin","viewer"],
  },
  {
    key: "groups",
    label: "Groups",
    allowedRoles: ["admin","viewer"],
  },
  {
    key: "settings",
    label: "Settings",
    allowedRoles: ["admin"],
  },
] as TabConfig[];
