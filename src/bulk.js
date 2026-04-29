/**
 * Bulk operations on bookmark arrays.
 * All functions are pure — they return new arrays without mutating input.
 */

/**
 * Add a tag to all bookmarks whose URL is in the targets list.
 * @param {object[]} bookmarks
 * @param {string[]} urls
 * @param {string} tag
 * @returns {object[]}
 */
export function bulkTag(bookmarks, urls, tag) {
  const set = new Set(urls);
  return bookmarks.map(b => {
    if (!set.has(b.url)) return b;
    const tags = Array.isArray(b.tags) ? b.tags : [];
    if (tags.includes(tag)) return b;
    return { ...b, tags: [...tags, tag] };
  });
}

/**
 * Remove a tag from all bookmarks whose URL is in the targets list.
 * @param {object[]} bookmarks
 * @param {string[]} urls
 * @param {string} tag
 * @returns {object[]}
 */
export function bulkUntag(bookmarks, urls, tag) {
  const set = new Set(urls);
  return bookmarks.map(b => {
    if (!set.has(b.url)) return b;
    const tags = Array.isArray(b.tags) ? b.tags : [];
    return { ...b, tags: tags.filter(t => t !== tag) };
  });
}

/**
 * Delete all bookmarks whose URL is in the targets list.
 * @param {object[]} bookmarks
 * @param {string[]} urls
 * @returns {{ remaining: object[], removed: number }}
 */
export function bulkDelete(bookmarks, urls) {
  const set = new Set(urls);
  const remaining = bookmarks.filter(b => !set.has(b.url));
  return { remaining, removed: bookmarks.length - remaining.length };
}

/**
 * Return only the bookmarks whose URL is in the targets list.
 * @param {object[]} bookmarks
 * @param {string[]} urls
 * @returns {object[]}
 */
export function bulkExport(bookmarks, urls) {
  const set = new Set(urls);
  return bookmarks.filter(b => set.has(b.url));
}
