const { loadBookmarks, saveBookmarks } = require('./storage');

/**
 * Mark a bookmark as archived by URL.
 */
async function archiveBookmark(url) {
  const bookmarks = await loadBookmarks();
  const idx = bookmarks.findIndex(b => b.url === url);
  if (idx === -1) throw new Error(`Bookmark not found: ${url}`);
  bookmarks[idx].archived = true;
  bookmarks[idx].archivedAt = new Date().toISOString();
  await saveBookmarks(bookmarks);
  return bookmarks[idx];
}

/**
 * Unarchive a bookmark by URL.
 */
async function unarchiveBookmark(url) {
  const bookmarks = await loadBookmarks();
  const idx = bookmarks.findIndex(b => b.url === url);
  if (idx === -1) throw new Error(`Bookmark not found: ${url}`);
  bookmarks[idx].archived = false;
  delete bookmarks[idx].archivedAt;
  await saveBookmarks(bookmarks);
  return bookmarks[idx];
}

/**
 * Return only archived bookmarks.
 */
async function listArchived() {
  const bookmarks = await loadBookmarks();
  return bookmarks.filter(b => b.archived === true);
}

/**
 * Return only active (non-archived) bookmarks.
 */
async function listActive() {
  const bookmarks = await loadBookmarks();
  return bookmarks.filter(b => !b.archived);
}

module.exports = { archiveBookmark, unarchiveBookmark, listArchived, listActive };
