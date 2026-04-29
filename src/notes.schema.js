// notes.schema.js — validation helpers for bookmark notes

const MAX_NOTE_LENGTH = 1000;

/**
 * Validate a note string.
 * @param {string} note
 * @returns {{ valid: boolean, error?: string }}
 */
function validateNote(note) {
  if (typeof note !== 'string') return { valid: false, error: 'Note must be a string.' };
  if (note.trim().length === 0) return { valid: false, error: 'Note cannot be empty.' };
  if (note.length > MAX_NOTE_LENGTH) {
    return { valid: false, error: `Note exceeds max length of ${MAX_NOTE_LENGTH} characters.` };
  }
  return { valid: true };
}

/**
 * Validate the note fields on a single bookmark object.
 * @param {object} bookmark
 * @returns {{ valid: boolean, error?: string }}
 */
function validateBookmarkNote(bookmark) {
  if (!bookmark || typeof bookmark !== 'object') return { valid: false, error: 'Invalid bookmark.' };
  if (bookmark.note === undefined) return { valid: true }; // note is optional
  return validateNote(bookmark.note);
}

/**
 * Strip invalid or oversized notes from a list of bookmarks.
 * @param {Array} bookmarks
 * @returns {Array}
 */
function stripInvalidNotes(bookmarks) {
  return bookmarks.map(b => {
    if (b.note === undefined) return b;
    const { valid } = validateNote(b.note);
    if (!valid) {
      const { note, noteUpdatedAt, ...rest } = b;
      return rest;
    }
    return b;
  });
}

/**
 * Truncate a note string to the maximum allowed length.
 * Useful when importing notes from external sources that may exceed the limit.
 * @param {string} note
 * @returns {string}
 */
function truncateNote(note) {
  if (typeof note !== 'string') return '';
  return note.slice(0, MAX_NOTE_LENGTH);
}

module.exports = { MAX_NOTE_LENGTH, validateNote, validateBookmarkNote, stripInvalidNotes, truncateNote };
