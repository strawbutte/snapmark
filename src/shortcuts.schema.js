// shortcuts.schema.js — validation helpers for shortcut fields

import { isValidAlias } from './shortcuts.js';

/**
 * Validate that a bookmark's shortcut field is valid (if present).
 * @param {Object} bookmark
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateBookmarkShortcut(bookmark) {
  if (bookmark.shortcut === undefined || bookmark.shortcut === null) {
    return { valid: true };
  }
  if (!isValidAlias(bookmark.shortcut)) {
    return { valid: false, error: `Invalid shortcut alias: "${bookmark.shortcut}"` };
  }
  return { valid: true };
}

/**
 * Strip invalid shortcut fields from all bookmarks.
 * @param {Array} bookmarks
 * @returns {Array}
 */
export function stripInvalidShortcuts(bookmarks) {
  return bookmarks.map(b => {
    const { valid } = validateBookmarkShortcut(b);
    if (!valid) {
      const { shortcut: _, ...rest } = b;
      return rest;
    }
    return b;
  });
}

/**
 * Check for duplicate shortcuts across bookmarks.
 * @param {Array} bookmarks
 * @returns {string[]} list of duplicate alias names
 */
export function findDuplicateShortcuts(bookmarks) {
  const seen = {};
  const dupes = [];
  for (const bm of bookmarks) {
    if (bm.shortcut) {
      if (seen[bm.shortcut]) dupes.push(bm.shortcut);
      else seen[bm.shortcut] = true;
    }
  }
  return dupes;
}
