/**
 * Validates and strips archive-related fields on bookmarks.
 */

function isValidISODate(val) {
  if (typeof val !== 'string') return false;
  const d = new Date(val);
  return !isNaN(d.getTime());
}

function validateBookmarkArchive(bookmark) {
  const errors = [];
  if ('archived' in bookmark && typeof bookmark.archived !== 'boolean') {
    errors.push('archived must be a boolean');
  }
  if ('archivedAt' in bookmark) {
    if (!bookmark.archived) {
      errors.push('archivedAt should not be set when archived is false');
    } else if (!isValidISODate(bookmark.archivedAt)) {
      errors.push('archivedAt must be a valid ISO date string');
    }
  }
  return errors;
}

function stripInvalidArchiveFields(bookmark) {
  const b = { ...bookmark };
  if (typeof b.archived !== 'boolean') {
    delete b.archived;
    delete b.archivedAt;
    return b;
  }
  if (!b.archived) {
    delete b.archivedAt;
  } else if (b.archivedAt && !isValidISODate(b.archivedAt)) {
    delete b.archivedAt;
  }
  return b;
}

function normalizeArchiveFields(bookmarks) {
  return bookmarks.map(stripInvalidArchiveFields);
}

module.exports = {
  isValidISODate,
  validateBookmarkArchive,
  stripInvalidArchiveFields,
  normalizeArchiveFields
};
