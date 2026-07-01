import { useCallback, useEffect, useMemo, useState } from "react";
import { Infraction } from "../../../types/derived/infractions";
import { updateInfraction } from "../../../services/infraction";

function isRowValid(row: Infraction) {
  return (
    !!row.infraction &&
    row.points !== null &&
    row.points !== undefined &&
    !Number.isNaN(row.points)
  );
}

function hasRowChanged(a: Infraction, b: Infraction) {
  return (
    a.infraction !== b.infraction ||
    a.points !== b.points ||
    a.notes !== b.notes
  );
}

export function useStateRulerInfractions(
  initial: Infraction[],
  loadInfractions: () => void
) {
  const [rows, setRows] = useState<Infraction[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRows(structuredClone(initial));
  }, [initial]);

  const updateRow = useCallback(
    <K extends keyof Infraction>(
      id: string,
      key: K,
      value: Infraction[K]
    ) => {
      setRows((prev) =>
        prev.map((row) =>
          row.id === id ? { ...row, [key]: value } : row
        )
      );
    },
    []
  );

  const addRow = useCallback(() => {
    setRows((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        allianceID: null,
        infraction: null,
        points: null,
        notes: null,
      },
    ]);
  }, []);

  const deleteRow = useCallback((id: string) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
  }, []);

  const resetRows = useCallback(() => {
    setRows(structuredClone(initial));
  }, [initial]);

  const changedRows = useMemo(() => {
    const initialMap = new Map(initial.map((r) => [r.id, r]));

    return rows.filter((row) => {
      const original = initialMap.get(row.id);
      if (!original) return true; // new row
      return hasRowChanged(row, original);
    });
  }, [rows, initial]);

  const deletedRows = useMemo(() => {
    const currentIds = new Set(rows.map((r) => r.id));
    return initial.filter((row) => !currentIds.has(row.id));
  }, [rows, initial]);

  const allValid = useMemo(() => {
    return rows.every(isRowValid);
  }, [rows]);

  const hasChanges = changedRows.length > 0 || deletedRows.length > 0;
  const canUpdate = hasChanges && changedRows.every(isRowValid);

  const update = useCallback(async () => {
    const added = rows.filter(
      (row) => !initial.some((r) => r.id === row.id)
    );

    const updated = rows.filter((row) => {
      const original = initial.find((r) => r.id === row.id);
      if (!original) return false;
      return hasRowChanged(row, original);
    });

    const deleted = initial
      .filter((row) => !rows.some((r) => r.id === row.id))
      .map((row) => row.id);

    const payload = { added, updated, deleted };

    await updateInfraction(payload);
    loadInfractions();
  }, [rows, initial, loadInfractions]);

  return {
    rows,
    addRow,
    deleteRow,
    resetRows,
    update,
    updateRow,

    hasChanges,
    canUpdate,
    allValid,
  };
}
