export type AppTab =
  | "members"
  | "AllianceDuel"
  | "Rankings"
  | "Groups"
  | "Pickles";

export type TabConfig = {
  key: AppTab;
  label: string;
  icon?: string;
};
