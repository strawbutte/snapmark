/**
 * Schema helpers for broken-link check metadata stored on bookmarks.
 */

/**
 * Validate a broken-link check record.
 * @param {*} check
 * @returns {boolean}
 */
function validateLinkCheck(check) {
  if (!check || typeof check !== 'object') return false;
  if (typeof check.checkedAt !== 'string') return false;
  if (typeof check.ok !== 'boolean') return false;
  if (check.status !== null && typeof check.status !== 'number') return false;
  return true;
}

/**
 * Attach a link check result to a bookmark.
 * @param {object} bookmark
 * @param {{ok: boolean, status: number|null, error: string|null}} result
 * @returns {object}
 */
function applyLinkCheck(bookmark, result) {
  return {
    ...bookmark,
    linkCheck: {
      checkedAt: new Date().toISOString(),
      ok: result.ok,
      status: result.status,
      error: result.error || null,
    },
  };
}

/**
 * Strip invalid or missing linkCheck fields from a bookmark.
 * @param {object} bookmark
 * @returns {object}
 */
function stripInvalidLinkCheck(bookmark) {
  if (!bookmark.linkCheck) return bookmark;
  if (!validateLinkCheck(bookmark.linkCheck)) {
    const { linkCheck, ...rest } = bookmark;
    return rest;
  }
  return bookmark;
}

/**
 * Get bookmarks that were last checked and found broken.
 * @param {object[]} bookmarks
 * @returns {object[]}
 */
function getBrokenBookmarks(bookmarks) {
  return bookmarks.filter(
    (bm) => bm.linkCheck && validateLinkCheck(bm.linkCheck) && !bm.linkCheck.ok
  );
}

module.exports = { validateLinkCheck, applyLinkCheck, stripInvalidLinkCheck, getBrokenBookmarks };
