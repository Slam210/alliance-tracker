function toNumberOrNull(value) {
  if (value === null || value === undefined || value === "") return null;

  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function handleGetAllStateRulers() {
  const ss = SpreadsheetApp.openById("1-0yA_3WlbIoaqrXP3Rf4tfkPLos7yyVWreB3FyO59hc");
  const sheets = ss.getSheets();

  const result = {};

  sheets.forEach(sheet => {
    const name = sheet.getName();

    // Match SR weeks
    const isSRWeek = /^SR\d+$/.test(name);

    if (isSRWeek) {
      const data = sheet.getDataRange().getValues();

      // Convert rows into structured objects (skip header row)
      const rows = data.slice(1).map(row => ({
        id: row[SR_COLS.id - 1],
        name: row[SR_COLS.name - 1],

        progressRank: toNumberOrNull(row[SR_COLS.progressRank - 1]),
        progressScore: toNumberOrNull(row[SR_COLS.progressScore - 1]),

        clashRank: toNumberOrNull(row[SR_COLS.clashRank - 1]),
        clashScore: toNumberOrNull(row[SR_COLS.clashScore - 1]),

        lastUpdated: row[SR_COLS.lastUpdated - 1]
      }));

      result[name] = rows;
    }
  });

  return output({ data: result });
}