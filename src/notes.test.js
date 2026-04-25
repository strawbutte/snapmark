const { setNote, clearNote, getNote, listNotedBookmarks } = require('./notes');

function makeBookmarks() {
  return [
    { url: 'https://example.com', title: 'Example' },
    { url: 'https://nodejs.org', title: 'Node.js', note: 'Great runtime docs' },
    { url: 'https://github.com', title: 'GitHub' },
  ];
}

describe('setNote', () => {
  test('adds a note to a bookmark', () => {
    const bms = makeBookmarks();
    const result = setNote(bms, 'https://example.com', 'Check this later');
    expect(result.find(b => b.url === 'https://example.com').note).toBe('Check this later');
  });

  test('updates an existing note', () => {
    const bms = makeBookmarks();
    const result = setNote(bms, 'https://nodejs.org', 'Updated note');
    expect(result.find(b => b.url === 'https://nodejs.org').note).toBe('Updated note');
  });

  test('sets noteUpdatedAt timestamp', () => {
    const bms = makeBookmarks();
    const result = setNote(bms, 'https://github.com', 'Code hosting');
    expect(result.find(b => b.url === 'https://github.com').noteUpdatedAt).toBeDefined();
  });

  test('throws if bookmark not found', () => {
    expect(() => setNote(makeBookmarks(), 'https://notexist.com', 'hi')).toThrow('Bookmark not found');
  });
});

describe('clearNote', () => {
  test('removes a note from a bookmark', () => {
    const bms = makeBookmarks();
    const result = clearNote(bms, 'https://nodejs.org');
    expect(result.find(b => b.url === 'https://nodejs.org').note).toBeUndefined();
  });

  test('throws if bookmark not found', () => {
    expect(() => clearNote(makeBookmarks(), 'https://notexist.com')).toThrow('Bookmark not found');
  });
});

describe('getNote', () => {
  test('returns note if present', () => {
    expect(getNote(makeBookmarks(), 'https://nodejs.org')).toBe('Great runtime docs');
  });

  test('returns null if no note', () => {
    expect(getNote(makeBookmarks(), 'https://example.com')).toBeNull();
  });

  test('throws if bookmark not found', () => {
    expect(() => getNote(makeBookmarks(), 'https://notexist.com')).toThrow('Bookmark not found');
  });
});

describe('listNotedBookmarks', () => {
  test('returns only bookmarks with notes', () => {
    const result = listNotedBookmarks(makeBookmarks());
    expect(result).toHaveLength(1);
    expect(result[0].url).toBe('https://nodejs.org');
  });

  test('returns empty array if none have notes', () => {
    const bms = [{ url: 'https://a.com', title: 'A' }];
    expect(listNotedBookmarks(bms)).toHaveLength(0);
  });
});
