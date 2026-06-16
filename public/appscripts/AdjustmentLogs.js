function getAdjustmentLogSheet() {
  const ss = SpreadsheetApp.openById("YOUR_GOOGLE_SHEET_ID");
  const sheet = ss.getSheetByName("Adjustment Logs");

  if (!sheet) throw new Error("Sheet not found");
  return sheet;
}

function handleGetAdjustmentLogSheet() {
  const sheet = getAdjustmentLogSheet();

  const rows = sheet.getDataRange().getValues();

  if (rows.length <= 1) {
    return output({ status: "success", logs: [] });
  }

  const logs = rows.slice(1).map((row) => ({
    logID: row[0],
    memberID: row[1],
    name: row[2],
    nickname: row[3],
    issuedAt: row[4],
    adjustmentType: row[5],
    count: Number(row[6]),
    points: Number(row[7]),
    reason: row[8],
  }));

  return output({ status: "success", logs });
}

function handleAddLog(data) {
  const sheet = getAdjustmentLogSheet();
  sheet.appendRow([
    generateId(),
    data.memberID,
    data.name,
    data.nickname || "",
    Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "MM/dd/yyyy"),
    data.adjustmentType,
    data.count,
    data.points,
    data.reason,
  ]);

  return output({ status: "Added log" });
}

function handleDeleteLog(data) {
  const sheet = getAdjustmentLogSheet();
  const rows = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === data.logID) {
      sheet.deleteRow(i + 1);

      return output({
        status: "deleted",
      });
    }
  }

  return output({
    error: "log not found",
  });
}
