// notes.js — add/edit/remove inline notes on bookmarks

/**
 * Set a note on a bookmark by URL.
 * @param {Array} bookmarks
 * @param {string} url
 * @param {string} note
 * @returns {Array} updated bookmarks
 */
function setNote(bookmarks, url, note) {
  const idx = bookmarks.findIndex(b => b.url === url);
  if (idx === -1) throw new Error(`Bookmark not found: ${url}`);
  const updated = { ...bookmarks[idx], note: note.trim(), noteUpdatedAt: new Date().toISOString() };
  return [...bookmarks.slice(0, idx), updated, ...bookmarks.slice(idx + 1)];
}

/**
 * Clear the note from a bookmark.
 * @param {Array} bookmarks
 * @param {string} url
 * @returns {Array} updated bookmarks
 */
function clearNote(bookmarks, url) {
  const idx = bookmarks.findIndex(b => b.url === url);
  if (idx === -1) throw new Error(`Bookmark not found: ${url}`);
  const { note, noteUpdatedAt, ...rest } = bookmarks[idx];
  return [...bookmarks.slice(0, idx), rest, ...bookmarks.slice(idx + 1)];
}

/**
 * Get the note for a bookmark.
 * @param {Array} bookmarks
 * @param {string} url
 * @returns {string|null}
 */
function getNote(bookmarks, url) {
  const bm = bookmarks.find(b => b.url === url);
  if (!bm) throw new Error(`Bookmark not found: ${url}`);
  return bm.note || null;
}

/**
 * List all bookmarks that have notes.
 * @param {Array} bookmarks
 * @returns {Array}
 */
function listNotedBookmarks(bookmarks) {
  return bookmarks.filter(b => b.note && b.note.trim().length > 0);
}

module.exports = { setNote, clearNote, getNote, listNotedBookmarks };
