function getMembersSheet() {
  const ss = SpreadsheetApp.openById("YOUR_GOOGLE_SHEET_ID");
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
    data.displayName || "",
    data.groupNumber || null,
    data.groupLeader || false,
    data.eosReward || "",
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
    displayName: row[7],
    groupNumber: row[8] ?? "",
    groupLeader: row[9] === true || row[9] === "true",
    eosReward: row[12],
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

function handleAssignGroup(data) {
  const sheet = getMembersSheet();
  const rows = sheet.getDataRange().getValues();

  let updated = 0;

  for (const member of data.members) {
    const success = assignGroupToMember(sheet, rows, member);
    if (success) updated++;
  }

  return output({
    status: "Group information assigned",
    updated,
  });
}

function assignGroupToMember(sheet, rows, member) {
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === member.id) {
      if (member.groupNumber !== undefined) {
        sheet.getRange(i + 1, 9).setValue(member.groupNumber);
      }

      if (member.groupLeader !== undefined) {
        sheet.getRange(i + 1, 10).setValue(member.groupLeader);
      }

      return true;
    }
  }
  return false;
}
