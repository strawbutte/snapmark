const { normalizeUrl, findDuplicates, dedupeBookmarks } = require('./dedupe');

const make = (url, tags = [], createdAt = '2024-01-01T00:00:00.000Z') => ({
  id: url,
  url,
  title: url,
  tags,
  createdAt,
});

describe('normalizeUrl', () => {
  test('strips trailing slash', () => {
    expect(normalizeUrl('https://example.com/')).toBe('https://example.com/');
    expect(normalizeUrl('https://example.com/path/')).toBe('https://example.com/path');
  });

  test('removes www prefix', () => {
    expect(normalizeUrl('https://www.example.com')).toBe('https://example.com/');
  });

  test('lowercases the url', () => {
    expect(normalizeUrl('https://Example.COM')).toBe('https://example.com/');
  });

  test('handles invalid urls gracefully', () => {
    expect(normalizeUrl('not-a-url')).toBe('not-a-url');
  });
});

describe('findDuplicates', () => {
  test('returns empty array when no duplicates', () => {
    const bookmarks = [
      make('https://example.com'),
      make('https://other.com'),
    ];
    expect(findDuplicates(bookmarks)).toEqual([]);
  });

  test('finds duplicates by normalized url', () => {
    const bookmarks = [
      make('https://www.example.com'),
      make('https://example.com'),
      make('https://other.com'),
    ];
    const dupes = findDuplicates(bookmarks);
    expect(dupes).toHaveLength(1);
    expect(dupes[0]).toHaveLength(2);
  });

  test('finds multiple duplicate groups', () => {
    const bookmarks = [
      make('https://a.com'),
      make('https://a.com/'),
      make('https://b.com'),
      make('https://www.b.com'),
    ];
    expect(findDuplicates(bookmarks)).toHaveLength(2);
  });
});

describe('dedupeBookmarks', () => {
  test('keeps bookmark with more tags', () => {
    const bm1 = make('https://example.com', ['a']);
    const bm2 = make('https://www.example.com', ['a', 'b']);
    const { bookmarks, removed } = dedupeBookmarks([bm1, bm2]);
    expect(bookmarks).toHaveLength(1);
    expect(bookmarks[0].tags).toEqual(['a', 'b']);
    expect(removed).toHaveLength(1);
  });

  test('keeps earlier bookmark on tag tie', () => {
    const bm1 = make('https://example.com', ['a'], '2024-01-01T00:00:00.000Z');
    const bm2 = make('https://www.example.com', ['b'], '2024-06-01T00:00:00.000Z');
    const { bookmarks } = dedupeBookmarks([bm1, bm2]);
    expect(bookmarks[0].createdAt).toBe('2024-01-01T00:00:00.000Z');
  });

  test('returns all bookmarks unchanged when no duplicates', () => {
    const bookmarks = [make('https://a.com'), make('https://b.com')];
    const { bookmarks: result, removed } = dedupeBookmarks(bookmarks);
    expect(result).toHaveLength(2);
    expect(removed).toHaveLength(0);
  });
});
