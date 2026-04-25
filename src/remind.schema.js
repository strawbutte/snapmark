// Validation helpers for reminder-related fields
// Used by remind.js and any future persistence layers

const MAX_REMIND_DAYS = 3650; // ~10 years

function isValidISODate(str) {
  if (typeof str !== 'string') return false;
  const d = new Date(str);
  return !isNaN(d.getTime()) && str === d.toISOString();
}

function validateReminderDays(days) {
  const n = Number(days);
  if (!Number.isInteger(n)) return 'days must be an integer';
  if (n <= 0) return 'days must be greater than 0';
  if (n > MAX_REMIND_DAYS) return `days must not exceed ${MAX_REMIND_DAYS}`;
  return null;
}

function validateBookmarkReminder(bm) {
  if (!bm.remindAt) return null; // optional field, absence is fine
  if (!isValidISODate(bm.remindAt)) {
    return `invalid remindAt value: "${bm.remindAt}" (expected ISO 8601 string)`;
  }
  return null;
}

function stripInvalidReminders(bookmarks) {
  return bookmarks.map(bm => {
    if (bm.remindAt && !isValidISODate(bm.remindAt)) {
      const { remindAt, ...rest } = bm;
      return rest;
    }
    return bm;
  });
}

module.exports = {
  isValidISODate,
  validateReminderDays,
  validateBookmarkReminder,
  stripInvalidReminders,
  MAX_REMIND_DAYS,
};
