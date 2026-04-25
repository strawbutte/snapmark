// favorites.js — mark bookmarks as favorites and retrieve them

/**
 * Toggle or set a bookmark as a favorite.
 * @param {object[]} bookmarks
 * @param {string} url
 * @returns {object[]}
 */
function favoriteBookmark(bookmarks, url) {
  const idx = bookmarks.findIndex(b => b.url === url);
  if (idx === -1) throw new Error(`Bookmark not found: ${url}`);
  const updated = [...bookmarks];
  updated[idx] = { ...updated[idx], favorite: true, favoritedAt: new Date().toISOString() };
  return updated;
}

/**
 * Remove favorite status from a bookmark.
 * @param {object[]} bookmarks
 * @param {string} url
 * @returns {object[]}
 */
function unfavoriteBookmark(bookmarks, url) {
  const idx = bookmarks.findIndex(b => b.url === url);
  if (idx === -1) throw new Error(`Bookmark not found: ${url}`);
  const updated = [...bookmarks];
  const { favorite, favoritedAt, ...rest } = updated[idx];
  updated[idx] = rest;
  return updated;
}

/**
 * Return all bookmarks marked as favorite.
 * @param {object[]} bookmarks
 * @returns {object[]}
 */
function listFavorites(bookmarks) {
  return bookmarks.filter(b => b.favorite === true);
}

/**
 * Check if a bookmark is a favorite.
 * @param {object[]} bookmarks
 * @param {string} url
 * @returns {boolean}
 */
function isFavorite(bookmarks, url) {
  const bm = bookmarks.find(b => b.url === url);
  return bm ? bm.favorite === true : false;
}

module.exports = { favoriteBookmark, unfavoriteBookmark, listFavorites, isFavorite };
