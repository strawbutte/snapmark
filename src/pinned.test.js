const { pinBookmark, unpinBookmark, listPinned, isPinned } = require('./pinned');

function makeBookmarks() {
  return [
    { url: 'https://example.com', title: 'Example' },
    { url: 'https://github.com', title: 'GitHub' },
    { url: 'https://news.ycombinator.com', title: 'HN', pinned: true, pinnedAt: '2024-01-01T00:00:00.000Z' },
  ];
}

describe('pinBookmark', () => {
  it('sets pinned and pinnedAt on a bookmark', () => {
    const bms = makeBookmarks();
    const result = pinBookmark(bms, 'https://example.com');
    const target = result.find(b => b.url === 'https://example.com');
    expect(target.pinned).toBe(true);
    expect(typeof target.pinnedAt).toBe('string');
  });

  it('does not mutate other bookmarks', () => {
    const bms = makeBookmarks();
    const result = pinBookmark(bms, 'https://example.com');
    const other = result.find(b => b.url === 'https://github.com');
    expect(other.pinned).toBeUndefined();
  });

  it('throws if bookmark not found', () => {
    const bms = makeBookmarks();
    expect(() => pinBookmark(bms, 'https://nothere.com')).toThrow('Bookmark not found');
  });
});

describe('unpinBookmark', () => {
  it('removes pinned and pinnedAt fields', () => {
    const bms = makeBookmarks();
    const result = unpinBookmark(bms, 'https://news.ycombinator.com');
    const target = result.find(b => b.url === 'https://news.ycombinator.com');
    expect(target.pinned).toBeUndefined();
    expect(target.pinnedAt).toBeUndefined();
  });

  it('throws if bookmark not found', () => {
    const bms = makeBookmarks();
    expect(() => unpinBookmark(bms, 'https://nothere.com')).toThrow('Bookmark not found');
  });
});

describe('listPinned', () => {
  it('returns only pinned bookmarks', () => {
    const bms = makeBookmarks();
    const result = listPinned(bms);
    expect(result.length).toBe(1);
    expect(result[0].url).toBe('https://news.ycombinator.com');
  });

  it('sorts by pinnedAt descending', () => {
    const bms = [
      { url: 'https://a.com', pinned: true, pinnedAt: '2024-01-01T00:00:00.000Z' },
      { url: 'https://b.com', pinned: true, pinnedAt: '2024-06-01T00:00:00.000Z' },
    ];
    const result = listPinned(bms);
    expect(result[0].url).toBe('https://b.com');
  });

  it('returns empty array when no pinned bookmarks', () => {
    const bms = [{ url: 'https://example.com', title: 'Example' }];
    expect(listPinned(bms)).toEqual([]);
  });
});

describe('isPinned', () => {
  it('returns true for pinned bookmark', () => {
    expect(isPinned({ url: 'https://x.com', pinned: true })).toBe(true);
  });

  it('returns false for unpinned bookmark', () => {
    expect(isPinned({ url: 'https://x.com' })).toBe(false);
  });
});
