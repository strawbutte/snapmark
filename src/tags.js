/**
 * Tag management for bookmarks
 */

/**
 * Add a tag to a bookmark by URL
 * @param {Array} bookmarks
 * @param {string} url
 * @param {string} tag
 * @returns {Array} updated bookmarks
 */
function addTag(bookmarks, url, tag) {
  const bookmark = bookmarks.find(b => b.url === url);
  if (!bookmark) {
    throw new Error(`Bookmark not found: ${url}`);
  }
  if (!bookmark.tags) {
    bookmark.tags = [];
  }
  const normalized = tag.trim().toLowerCase();
  if (!normalized) {
    throw new Error('Tag cannot be empty');
  }
  if (!bookmark.tags.includes(normalized)) {
    bookmark.tags.push(normalized);
  }
  return bookmarks;
}

/**
 * Remove a tag from a bookmark by URL
 * @param {Array} bookmarks
 * @param {string} url
 * @param {string} tag
 * @returns {Array} updated bookmarks
 */
function removeTag(bookmarks, url, tag) {
  const bookmark = bookmarks.find(b => b.url === url);
  if (!bookmark) {
    throw new Error(`Bookmark not found: ${url}`);
  }
  const normalized = tag.trim().toLowerCase();
  bookmark.tags = (bookmark.tags || []).filter(t => t !== normalized);
  return bookmarks;
}

/**
 * List all unique tags across all bookmarks
 * @param {Array} bookmarks
 * @returns {string[]} sorted unique tags
 */
function listTags(bookmarks) {
  const tagSet = new Set();
  for (const bookmark of bookmarks) {
    if (Array.isArray(bookmark.tags)) {
      bookmark.tags.forEach(t => tagSet.add(t));
    }
  }
  return Array.from(tagSet).sort();
}

/**
 * Filter bookmarks by tag
 * @param {Array} bookmarks
 * @param {string} tag
 * @returns {Array} matching bookmarks
 */
function filterByTag(bookmarks, tag) {
  const normalized = tag.trim().toLowerCase();
  return bookmarks.filter(
    b => Array.isArray(b.tags) && b.tags.includes(normalized)
  );
}

module.exports = { addTag, removeTag, listTags, filterByTag };
