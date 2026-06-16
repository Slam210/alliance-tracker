export type AppTab =
  | "members"
  | "AllianceDuel"
  | "StateRuler"
  | "Rankings"
  | "Groups"
  | "Pickles";

export type TabConfig = {
  key: AppTab;
  label: string;
  icon?: string;
};
