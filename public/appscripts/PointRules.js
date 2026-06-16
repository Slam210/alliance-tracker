function getPointRulesSheet() {
  const ss = SpreadsheetApp.openById("YOUR_GOOGLE_SHEET_ID");
  const sheet = ss.getSheetByName("Point Rules");

  if (!sheet) throw new Error("Sheet not found");
  return sheet;
}

function handleGetPoints() {
  const sheet = getPointRulesSheet();

  const rows = sheet.getDataRange().getValues();

  if (rows.length <= 1) {
    return output({ status: "success", points: [] });
  }

  const points = rows.slice(1).map((row) => ({
    system: row[0],
    type: row[1],
    minRank: row[2] === "" ? null : Number(row[2]),
    maxRank: row[3] === "" ? null : Number(row[3]),
    requiresRequirement: row[4] === "" ? null : Boolean(row[4]),
    points: Number(row[5]),
  }));

  return output({ status: "success", points });
}
