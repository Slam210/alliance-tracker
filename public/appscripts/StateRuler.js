const SR_COLS = {
  id: 1,
  name: 2,
  progressRank: 3,
  progressScore: 4,
  clashRank: 5,
  clashScore: 6,
  lastUpdated: 7
};

function getOrCreateStateRulerSheet(name) {
  const ss = SpreadsheetApp.openById("1-0yA_3WlbIoaqrXP3Rf4tfkPLos7yyVWreB3FyO59hc");

  let sheet = ss.getSheetByName(name);

  if (!sheet) {
    sheet = ss.insertSheet(name);

    sheet.appendRow([
      "id",
      "name",
      "Progress Rank",
      "Progress Score",
      "Capital Clash Rank",
      "Capital Clash Score",
      "last_updated"
    ]);
  }

  return sheet;
}

function upsertStateRulerRow(sheet, id, name, type, progressRank, progressScore, clashRank, clashScore) {
  const data = sheet.getDataRange().getValues();

  let rowIndex = data.findIndex((row, i) => i > 0 && row[0] === id);

  if (rowIndex === -1) {
    sheet.appendRow([id, "", null, null, null, null, ""]);
    rowIndex = sheet.getLastRow();
  }

  const row = rowIndex;

  sheet.getRange(row, SR_COLS.name).setValue(name);

  if (["progress", "both"].includes(type)) {
    sheet.getRange(row, SR_COLS.progressRank).setValue(progressRank);
    sheet.getRange(row, SR_COLS.progressScore).setValue(progressScore);
  }

  if (["clash", "both"].includes(type)) {
    sheet.getRange(row, SR_COLS.clashRank).setValue(clashRank);
    sheet.getRange(row, SR_COLS.clashScore).setValue(clashScore);
  }

  sheet.getRange(row, SR_COLS.lastUpdated).setValue(new Date());
}

function handleSubmitStateRuler(data) {
  const {
    id,
    name,
    type,
    sheetName,
    progressRank,
    progressScore,
    clashRank,
    clashScore
  } = data;

  if (!sheetName) {
    return output({ status: "missing_sheet_name" });
  }

  const sheet = getOrCreateStateRulerSheet(sheetName);

  upsertStateRulerRow(
    sheet,
    id,
    name,
    type,
    progressRank,
    progressScore,
    clashRank,
    clashScore
  );

  return output({ status: "state_ruler_updated", sheet: sheetName });
}