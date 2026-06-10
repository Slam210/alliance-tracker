function getMembersSheet() {
  const ss = SpreadsheetApp.openById("1-0yA_3WlbIoaqrXP3Rf4tfkPLos7yyVWreB3FyO59hc");
  const sheet = ss.getSheetByName("Members");

  if (!sheet) throw new Error("Sheet not found");
  return sheet;
}

function handleAddMember(data) {
  const sheet = getMembersSheet();

  sheet.appendRow([
    generateId(),
    data.name,
    data.nickname || "",
    "Active",
    Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "MM/dd/yyyy"),
    data.reason || "",
    data.timezone || "",
    data.displayName || ""
  ]);

  return output({ status: "added" });
}

function handleUpdateStatus(data) {
  const sheet = getMembersSheet();
  const rows = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === data.id) {
      sheet.getRange(i + 1, 4).setValue(data.status);
      return output({ status: "updated" });
    }
  }

  return output({ error: "member not found" });
}

function handleGetMembers() {
  const sheet = getMembersSheet();
  const rows = sheet.getDataRange().getValues();

  const members = rows.slice(1).map((row) => ({
    id: row[0],
    name: row[1],
    nickname: row[2],
    status: row[3],
    joinDate: row[4],
    reason: row[5],
    timezone: row[6],
    displayName: row[7]
  }));

  return output({ status: "success", members });
}

function handleRenameMember(data) {
  const sheet = getMembersSheet();
  const rows = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === data.id) {
      if (data.name !== undefined) {
        sheet.getRange(i + 1, 2).setValue(data.name);
      }

      if (data.nickname !== undefined) {
        sheet.getRange(i + 1, 3).setValue(data.nickname);
      }

      if (data.timezone !== undefined) {
        sheet.getRange(i + 1, 7).setValue(data.timezone);
      }

      if (data.displayName !== undefined) {
        sheet.getRange(i + 1, 8).setValue(data.displayName);
      }

      return output({ status: "renamed" });
    }
  }

  return output({ error: "member not found" });
}