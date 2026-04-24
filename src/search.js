const { loadBookmarks } = require('./storage');

/**
 * Score a bookmark against a query string.
 * Returns a numeric score; higher = better match.
 */
function scoreBookmark(bookmark, query) {
  const q = query.toLowerCase();
  let score = 0;

  if (bookmark.title && bookmark.title.toLowerCase().includes(q)) {
    score += 10;
    if (bookmark.title.toLowerCase().startsWith(q)) score += 5;
  }

  if (bookmark.url && bookmark.url.toLowerCase().includes(q)) {
    score += 6;
  }

  if (bookmark.description && bookmark.description.toLowerCase().includes(q)) {
    score += 4;
  }

  if (Array.isArray(bookmark.tags)) {
    for (const tag of bookmark.tags) {
      if (tag.toLowerCase() === q) {
        score += 8;
      } else if (tag.toLowerCase().includes(q)) {
        score += 3;
      }
    }
  }

  return score;
}

/**
 * Search bookmarks by a query string, returning ranked results.
 * @param {string} query
 * @param {object} options
 * @param {number} [options.limit] - max results to return
 * @param {string} [options.storePath] - override store path
 * @returns {Array} ranked bookmarks with _score attached
 */
async function rankSearch(query, options = {}) {
  if (!query || !query.trim()) {
    throw new Error('Search query must not be empty');
  }

  const bookmarks = await loadBookmarks(options.storePath);

  const scored = bookmarks
    .map((b) => ({ ...b, _score: scoreBookmark(b, query.trim()) }))
    .filter((b) => b._score > 0)
    .sort((a, b) => b._score - a._score);

  if (options.limit && options.limit > 0) {
    return scored.slice(0, options.limit);
  }

  return scored;
}

/**
 * Search bookmarks by multiple terms (AND logic — all terms must match).
 */
async function multiTermSearch(terms, options = {}) {
  if (!Array.isArray(terms) || terms.length === 0) {
    throw new Error('terms must be a non-empty array');
  }

  const bookmarks = await loadBookmarks(options.storePath);

  return bookmarks.filter((b) =>
    terms.every((term) => scoreBookmark(b, term) > 0)
  );
}

module.exports = { scoreBookmark, rankSearch, multiTermSearch };
