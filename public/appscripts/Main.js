function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

function output(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return output({
        error: "missing_post_data",
        received: e || null
      });
    }

    const data = JSON.parse(e.postData.contents);

    const handler = ROUTES[data.action];
    if (!handler) {
      return output({ error: "unknown action" });
    }

    return handler(data);

  } catch (err) {
    return output({
      error: "doPost_failed",
      details: err.toString()
    });
  }
}

const ROUTES = {
  // Member actions
  addMember: handleAddMember,
  updateStatus: handleUpdateStatus,
  getMembers: handleGetMembers,
  renameMember: handleRenameMember,

  // Alliance Duel
  allianceDuelSubmit: handleAllianceDuelSubmit,
  getAllAllianceDuelWeeks: handleGetAllAllianceDuelWeeks,
};