// pinned.js — manage pinned (starred) bookmarks

/**
 * Pin a bookmark by URL, marking it as high priority
 * @param {Array} bookmarks
 * @param {string} url
 * @returns {Array} updated bookmarks
 */
function pinBookmark(bookmarks, url) {
  const found = bookmarks.find(b => b.url === url);
  if (!found) throw new Error(`Bookmark not found: ${url}`);
  return bookmarks.map(b =>
    b.url === url ? { ...b, pinned: true, pinnedAt: new Date().toISOString() } : b
  );
}

/**
 * Unpin a bookmark by URL
 * @param {Array} bookmarks
 * @param {string} url
 * @returns {Array} updated bookmarks
 */
function unpinBookmark(bookmarks, url) {
  const found = bookmarks.find(b => b.url === url);
  if (!found) throw new Error(`Bookmark not found: ${url}`);
  return bookmarks.map(b => {
    if (b.url !== url) return b;
    const updated = { ...b };
    delete updated.pinned;
    delete updated.pinnedAt;
    return updated;
  });
}

/**
 * List all pinned bookmarks, sorted by pinnedAt descending
 * @param {Array} bookmarks
 * @returns {Array}
 */
function listPinned(bookmarks) {
  return bookmarks
    .filter(b => b.pinned === true)
    .sort((a, b) => new Date(b.pinnedAt) - new Date(a.pinnedAt));
}

/**
 * Check if a bookmark is pinned
 * @param {object} bookmark
 * @returns {boolean}
 */
function isPinned(bookmark) {
  return bookmark.pinned === true;
}

module.exports = { pinBookmark, unpinBookmark, listPinned, isPinned };
