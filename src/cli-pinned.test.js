'use strict';

const { pinBookmark, unpinBookmark, listPinned, isPinned } = require('./pinned');

function makeBookmarks() {
  return [
    { url: 'https://example.com', title: 'Example', pinned: false },
    { url: 'https://github.com', title: 'GitHub', pinned: true },
    { url: 'https://nodejs.org', title: 'Node.js', pinned: false },
  ];
}

describe('pinBookmark', () => {
  test('pins an existing bookmark', () => {
    const bms = makeBookmarks();
    const result = pinBookmark(bms, 'https://example.com');
    const target = result.find(b => b.url === 'https://example.com');
    expect(target.pinned).toBe(true);
  });

  test('returns null for unknown url', () => {
    const bms = makeBookmarks();
    expect(pinBookmark(bms, 'https://notfound.io')).toBeNull();
  });

  test('does not mutate original array', () => {
    const bms = makeBookmarks();
    pinBookmark(bms, 'https://example.com');
    expect(bms[0].pinned).toBe(false);
  });
});

describe('unpinBookmark', () => {
  test('unpins a pinned bookmark', () => {
    const bms = makeBookmarks();
    const result = unpinBookmark(bms, 'https://github.com');
    const target = result.find(b => b.url === 'https://github.com');
    expect(target.pinned).toBe(false);
  });

  test('returns null for unknown url', () => {
    const bms = makeBookmarks();
    expect(unpinBookmark(bms, 'https://notfound.io')).toBeNull();
  });
});

describe('listPinned', () => {
  test('returns only pinned bookmarks', () => {
    const bms = makeBookmarks();
    const result = listPinned(bms);
    expect(result).toHaveLength(1);
    expect(result[0].url).toBe('https://github.com');
  });

  test('returns empty array when none pinned', () => {
    const bms = makeBookmarks().map(b => ({ ...b, pinned: false }));
    expect(listPinned(bms)).toEqual([]);
  });
});

describe('isPinned', () => {
  test('returns true for pinned bookmark', () => {
    expect(isPinned(makeBookmarks(), 'https://github.com')).toBe(true);
  });

  test('returns false for unpinned bookmark', () => {
    expect(isPinned(makeBookmarks(), 'https://example.com')).toBe(false);
  });

  test('returns false for unknown url', () => {
    expect(isPinned(makeBookmarks(), 'https://unknown.io')).toBe(false);
  });
});
