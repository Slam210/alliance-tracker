function isAllianceWeekSheet(name) {
  return /^W\d+$/.test(name);
}

function parseCounterCell(v) {
  if (v === "" || v === null || v === undefined) return 0;
  const n = Number(v);
  return isNaN(n) ? 0 : n;
}

function parseCell(v) {
  if (v === "" || v === null) return null; // truly empty
  return Number(v); // preserves 0
}

function handleGetAllAllianceDuelWeeks() {
  const ss = SpreadsheetApp.openById("1-0yA_3WlbIoaqrXP3Rf4tfkPLos7yyVWreB3FyO59hc");
  const sheets = ss.getSheets();

  const result = [];

  sheets.forEach((sheet) => {
    const name = sheet.getName();

    if (!isAllianceWeekSheet(name)) return;

    const rows = sheet.getDataRange().getValues();

    const members = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];

      members.push({
        id: row[0],
        name: row[1],
        counters: {
          daily_top: parseCounterCell(row[2]),
          daily_bottom: parseCounterCell(row[3]),
          weekly_top: parseCounterCell(row[4]),
          weekly_bottom: parseCounterCell(row[5]),
        },
        values: {
          Mon: parseCell(row[6]),
          Tue: parseCell(row[7]),
          Wed: parseCell(row[8]),
          Thu: parseCell(row[9]),
          Fri: parseCell(row[10]),
          Sat: parseCell(row[11]),
          Weekly: parseCell(row[12]),
        },
        exception: row[13]
      });
    }

    result.push({
      week: name,
      members
    });
  });

  // sort W1, W2, W3 properly
  result.sort((a, b) => {
    const aNum = parseInt(a.week.substring(1));
    const bNum = parseInt(b.week.substring(1));
    return aNum - bNum;
  });

  return output({ weeks: result });
}