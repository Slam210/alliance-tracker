export type InfractionPayload = {
  added: Infraction[];
  updated: Infraction[];
  deleted: string[];
};

export type Infraction = {
  id: string;
  allianceID: string | null;

  infraction: string | null;
  points: number | null;

  notes: string | null;
};
