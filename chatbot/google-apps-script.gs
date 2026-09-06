const SHEET_NAME = "Leads";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || "{}");
    const required = ["submissionId", "name", "phone", "email", "service"];
    if (required.some((field) => !String(data[field] || "").trim())) {
      return jsonResponse({ ok: false, error: "Missing required fields" });
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) return jsonResponse({ ok: false, error: `Missing sheet: ${SHEET_NAME}` });

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        const existing = sheet
          .getRange(2, 2, lastRow - 1, 1)
          .createTextFinder(String(data.submissionId))
          .matchEntireCell(true)
          .findNext();
        if (existing) return jsonResponse({ ok: true, duplicate: true });
      }

      sheet.appendRow([
        data.submittedAt || new Date().toISOString(),
        data.submissionId,
        data.name,
        data.phone,
        data.email,
        data.service,
        data.source || "AeroTherm Engineering Website Chatbot",
        data.page || "",
      ]);
    } finally {
      lock.releaseLock();
    }

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error) });
  }
}

function jsonResponse(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
