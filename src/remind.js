// Reminder/revisit scheduling for bookmarks
// Lets you mark a bookmark to revisit after N days

const { loadBookmarks, saveBookmarks } = require('./storage');

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function setReminder(url, days) {
  const bookmarks = loadBookmarks();
  const bm = bookmarks.find(b => b.url === url);
  if (!bm) throw new Error(`Bookmark not found: ${url}`);

  const remindAt = new Date(Date.now() + days * MS_PER_DAY).toISOString();
  bm.remindAt = remindAt;
  saveBookmarks(bookmarks);
  return { ...bm };
}

function clearReminder(url) {
  const bookmarks = loadBookmarks();
  const bm = bookmarks.find(b => b.url === url);
  if (!bm) throw new Error(`Bookmark not found: ${url}`);

  delete bm.remindAt;
  saveBookmarks(bookmarks);
  return { ...bm };
}

function getDueReminders(asOf = new Date()) {
  const bookmarks = loadBookmarks();
  const now = asOf instanceof Date ? asOf : new Date(asOf);
  return bookmarks.filter(b => b.remindAt && new Date(b.remindAt) <= now);
}

function listReminders() {
  const bookmarks = loadBookmarks();
  return bookmarks
    .filter(b => b.remindAt)
    .sort((a, b) => new Date(a.remindAt) - new Date(b.remindAt));
}

module.exports = { setReminder, clearReminder, getDueReminders, listReminders };
