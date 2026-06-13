const ALLIANCE_DUEL_START_DATE = new Date("2026-04-20");

function getWeekSheetName(date) {
  const start = new Date(ALLIANCE_DUEL_START_DATE);
  start.setHours(0, 0, 0, 0);

  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  const day = d.getDay();

  // Move Sunday to previous day for week grouping
  const adjustedDate = new Date(d);

  if (day === 0) {
    adjustedDate.setDate(adjustedDate.getDate() - 1);
  }

  const diffDays = Math.floor((adjustedDate - start) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    throw new Error("Date is before Alliance Duel start");
  }

  const week = Math.floor(diffDays / 7) + 1;

  return `W${week}`;
}

function getTypeColumn(entryType) {
  const map = {
    daily_top: 3,
    daily_bottom: 4,
    weekly_top: 5,
    weekly_bottom: 6,
  };

  const key = String(entryType).toLowerCase();
  return map[key] ?? null;
}

function getColumn(date) {
  const day = date.getDay();

  const map = {
    0: 13,
    1: 7,
    2: 8,
    3: 9,
    4: 10,
    5: 11,
    6: 12,
  };

  return map[day];
}

function getOrCreateWeekSheet(name) {
  const ss = SpreadsheetApp.openById(
    "1-0yA_3WlbIoaqrXP3Rf4tfkPLos7yyVWreB3FyO59hc",
  );
  let sheet = ss.getSheetByName(name);

  if (!sheet) {
    sheet = ss.insertSheet(name);

    sheet.appendRow([
      "id",
      "name",
      "daily_top",
      "daily_bottom",
      "weekly_top",
      "weekly_bottom",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Weekly",
      "Exception",
    ]);
  }

  return sheet;
}

function upsertDuelRow(sheet, id, name, typeCol, dayCol, points, exception) {
  const data = sheet.getDataRange().getValues();

  let rowIndex = data.findIndex((row) => row[0] === id);

  if (rowIndex === -1) {
    const newRow = [id, name, 0, 0, 0, 0, "", "", "", "", "", "", "", false];

    sheet.appendRow(newRow);
    rowIndex = sheet.getLastRow() - 1;
  }

  const sheetRow = rowIndex + 1;

  sheet.getRange(sheetRow, 2).setValue(name);

  // increment counter ONLY if valid type
  if (typeCol !== null) {
    const current = sheet.getRange(sheetRow, typeCol).getValue() || 0;
    sheet.getRange(sheetRow, typeCol).setValue(current + 1);
  }

  // ALWAYS write score correctly to day column
  sheet.getRange(sheetRow, dayCol).setValue(points);

  // Update Exception value
  sheet.getRange(sheetRow, 14).setValue(exception);
}

function handleAllianceDuelSubmit(data) {
  const { id, name, entryType, date, points, exception } = data;
  const d = new Date(date);
  const dayCol = getColumn(d);
  const sheetName = getWeekSheetName(d);
  const sheet = getOrCreateWeekSheet(sheetName);
  const typeCol = getTypeColumn(entryType);
  upsertDuelRow(sheet, id, name, typeCol, dayCol, points, exception);
  return output({ status: "duel_updated" });
}
