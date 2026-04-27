// shortcuts.js — named shortcut aliases for bookmarks

/**
 * Get all shortcuts map from bookmarks metadata.
 * @param {Array} bookmarks
 * @returns {Object} map of alias -> url
 */
export function getShortcuts(bookmarks) {
  const map = {};
  for (const bm of bookmarks) {
    if (bm.shortcut) {
      map[bm.shortcut] = bm.url;
    }
  }
  return map;
}

/**
 * Set a shortcut alias on a bookmark by URL.
 * @param {Array} bookmarks
 * @param {string} url
 * @param {string} alias
 * @returns {Array} updated bookmarks
 */
export function setShortcut(bookmarks, url, alias) {
  if (!isValidAlias(alias)) throw new Error(`Invalid alias: "${alias}". Use only lowercase letters, digits, and hyphens.`);
  const conflict = bookmarks.find(b => b.shortcut === alias && b.url !== url);
  if (conflict) throw new Error(`Alias "${alias}" is already used by ${conflict.url}`);
  return bookmarks.map(b => b.url === url ? { ...b, shortcut: alias } : b);
}

/**
 * Clear the shortcut alias from a bookmark by URL.
 * @param {Array} bookmarks
 * @param {string} url
 * @returns {Array} updated bookmarks
 */
export function clearShortcut(bookmarks, url) {
  return bookmarks.map(b => b.url === url ? { ...b, shortcut: undefined } : b);
}

/**
 * Resolve a shortcut alias to a URL.
 * @param {Array} bookmarks
 * @param {string} alias
 * @returns {string|null}
 */
export function resolveShortcut(bookmarks, alias) {
  const bm = bookmarks.find(b => b.shortcut === alias);
  return bm ? bm.url : null;
}

/**
 * Validate an alias string.
 * @param {string} alias
 * @returns {boolean}
 */
export function isValidAlias(alias) {
  return typeof alias === 'string' && /^[a-z0-9-]{1,32}$/.test(alias);
}
