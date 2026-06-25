import { useState } from "react";
import { AllianceInfo } from "../../../types/settings";

export function useAllianceForm(alliance: AllianceInfo) {
  const [allianceId] = useState(alliance.alliance_id);

  const [name, setName] = useState(alliance.name ?? "");

  const [tag, setTag] = useState(alliance.tag ?? "");

  const [server, setServer] = useState<number | "">(alliance.server ?? "");

  // Blank by default so passwords only change when entered
  const [viewerPassword, setViewerPassword] = useState("");

  const [adminPassword, setAdminPassword] = useState("");

  const resetPasswords = () => {
    setViewerPassword("");
    setAdminPassword("");
  };

  return {
    allianceId,

    name,
    setName,

    tag,
    setTag,

    server,
    setServer,

    viewerPassword,
    setViewerPassword,

    adminPassword,
    setAdminPassword,

    resetPasswords,
  };
}
