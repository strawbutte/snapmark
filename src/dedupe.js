/**
 * Deduplication utilities for bookmarks.
 * Detects and removes duplicate bookmarks based on URL similarity.
 */

/**
 * Normalize a URL for comparison (strip trailing slash, lowercase, remove www.)
 * @param {string} url
 * @returns {string}
 */
function normalizeUrl(url) {
  try {
    const parsed = new URL(url.trim().toLowerCase());
    parsed.hostname = parsed.hostname.replace(/^www\./, '');
    parsed.pathname = parsed.pathname.replace(/\/+$/, '') || '/';
    return parsed.toString();
  } catch {
    return url.trim().toLowerCase();
  }
}

/**
 * Find groups of duplicate bookmarks by normalized URL.
 * @param {Array} bookmarks
 * @returns {Array<Array>} groups of duplicates (each group has 2+ items)
 */
function findDuplicates(bookmarks) {
  const seen = new Map();

  for (const bm of bookmarks) {
    const key = normalizeUrl(bm.url);
    if (!seen.has(key)) {
      seen.set(key, []);
    }
    seen.get(key).push(bm);
  }

  return Array.from(seen.values()).filter(group => group.length > 1);
}

/**
 * Remove duplicate bookmarks, keeping the one with the most tags
 * (or the earliest createdAt on tie).
 * @param {Array} bookmarks
 * @returns {{ bookmarks: Array, removed: Array }}
 */
function dedupeBookmarks(bookmarks) {
  const seen = new Map();
  const removed = [];

  for (const bm of bookmarks) {
    const key = normalizeUrl(bm.url);
    if (!seen.has(key)) {
      seen.set(key, bm);
    } else {
      const existing = seen.get(key);
      const existingTags = (existing.tags || []).length;
      const newTags = (bm.tags || []).length;

      if (
        newTags > existingTags ||
        (newTags === existingTags && bm.createdAt < existing.createdAt)
      ) {
        removed.push(existing);
        seen.set(key, bm);
      } else {
        removed.push(bm);
      }
    }
  }

  return {
    bookmarks: Array.from(seen.values()),
    removed,
  };
}

module.exports = { normalizeUrl, findDuplicates, dedupeBookmarks };
