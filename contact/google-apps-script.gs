const SHEET_NAME = "Contact Leads";
const TIME_ZONE = "Asia/Karachi";

function doGet() {
  return jsonResponse({ ok: true, message: "AeroTherm contact-form webhook is active" });
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ ok: false, error: "Request body is missing" });
    }

    const data = JSON.parse(e.postData.contents);
    const required = ["submissionId", "fullName", "company", "email", "phone", "service", "details"];
    const missing = required.filter((field) => !String(data[field] || "").trim());
    if (missing.length) return jsonResponse({ ok: false, error: "Missing required fields: " + missing.join(", ") });

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) return jsonResponse({ ok: false, error: 'Missing sheet tab named "' + SHEET_NAME + '"' });

    const cache = CacheService.getScriptCache();
    const cacheKey = "contact-" + String(data.submissionId);

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      if (cache.get(cacheKey)) return jsonResponse({ ok: true, duplicate: true });
      sheet.appendRow([
        Utilities.formatDate(new Date(), TIME_ZONE, "dd MMM yyyy, hh:mm a"),
        String(data.fullName).trim(),
        String(data.company).trim(),
        String(data.email).trim().toLowerCase(),
        String(data.phone).trim(),
        String(data.service).trim(),
        String(data.details).trim(),
        data.source || "AeroTherm Engineering Contact Form",
      ]);
      cache.put(cacheKey, "1", 21600);
    } finally {
      lock.releaseLock();
    }

    return jsonResponse({ ok: true, message: "Contact submission added" });
  } catch (error) {
    return jsonResponse({ ok: false, error: error instanceof Error ? error.message : String(error) });
  }
}

function jsonResponse(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
