const { validateNote, validateBookmarkNote, stripInvalidNotes, MAX_NOTE_LENGTH } = require('./notes.schema');

describe('validateNote', () => {
  test('valid note passes', () => {
    expect(validateNote('This is a useful link')).toEqual({ valid: true });
  });

  test('empty string fails', () => {
    const r = validateNote('   ');
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/empty/);
  });

  test('non-string fails', () => {
    expect(validateNote(42).valid).toBe(false);
  });

  test('note over max length fails', () => {
    const longNote = 'x'.repeat(MAX_NOTE_LENGTH + 1);
    const r = validateNote(longNote);
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/max length/);
  });

  test('note exactly at max length passes', () => {
    expect(validateNote('x'.repeat(MAX_NOTE_LENGTH)).valid).toBe(true);
  });
});

describe('validateBookmarkNote', () => {
  test('bookmark without note is valid', () => {
    expect(validateBookmarkNote({ url: 'https://a.com' }).valid).toBe(true);
  });

  test('bookmark with valid note passes', () => {
    expect(validateBookmarkNote({ url: 'https://a.com', note: 'hi' }).valid).toBe(true);
  });

  test('bookmark with invalid note fails', () => {
    expect(validateBookmarkNote({ url: 'https://a.com', note: '' }).valid).toBe(false);
  });

  test('non-object fails', () => {
    expect(validateBookmarkNote(null).valid).toBe(false);
  });
});

describe('stripInvalidNotes', () => {
  test('removes oversized notes', () => {
    const bms = [{ url: 'https://a.com', note: 'x'.repeat(MAX_NOTE_LENGTH + 1) }];
    const result = stripInvalidNotes(bms);
    expect(result[0].note).toBeUndefined();
  });

  test('keeps valid notes', () => {
    const bms = [{ url: 'https://a.com', note: 'valid note' }];
    expect(stripInvalidNotes(bms)[0].note).toBe('valid note');
  });

  test('leaves bookmarks without notes untouched', () => {
    const bms = [{ url: 'https://a.com', title: 'A' }];
    expect(stripInvalidNotes(bms)[0]).toEqual({ url: 'https://a.com', title: 'A' });
  });
});
