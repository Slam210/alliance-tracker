export type AppTab = "members" | "AllianceDuel" | "Rankings" | "Pickles";

export type TabConfig = {
  key: AppTab;
  label: string;
  icon?: string;
};
