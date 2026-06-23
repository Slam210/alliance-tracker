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
    data.display_name || "",
    data.group_number || null,
    data.group_leader || false,
    data.eos_reward || "",
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
    joined_date: row[4],
    reason: row[5],
    timezone: row[6],
    display_name: row[7],
    group_number: row[8] ?? "",
    group_leader: row[9] === true || row[9] === "true",
    eos_reward: row[12],
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

      if (data.display_name !== undefined) {
        sheet.getRange(i + 1, 8).setValue(data.display_name);
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
      if (member.group_number !== undefined) {
        sheet.getRange(i + 1, 9).setValue(member.group_number);
      }

      if (member.group_leader !== undefined) {
        sheet.getRange(i + 1, 10).setValue(member.group_leader);
      }

      return true;
    }
  }
  return false;
}
