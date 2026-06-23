function handleSubmitRewardData(data) {
  const sheet = getMembersSheet();
  const rows = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === data.id) {
      if (data.bonusPoints !== undefined) {
        sheet.getRange(i + 1, 11).setValue(data.bonusPoints);
      }

      if (data.penaltyPoints !== undefined) {
        sheet.getRange(i + 1, 12).setValue(data.penaltyPoints);
      }

      if (data.eos_reward !== undefined) {
        sheet.getRange(i + 1, 13).setValue(data.eos_reward);
      }

      return output({ status: "Reward data set" });
    }
  }

  return output({ error: "member not found" });
}

function handleCancelRewardData(data) {
  const sheet = getMembersSheet();
  const rows = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === data.id) {
      sheet.getRange(i + 1, 13).setValue("");
      return output({ status: "Reward data reset" });
    }
  }

  return output({ error: "member not found" });
}
