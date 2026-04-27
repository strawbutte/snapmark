const { getReadingList, addToReadingList, removeFromReadingList, markAsRead, isInReadingList } = require('./reading-list');

function makeBookmarks() {
  return [
    { url: 'https://example.com', title: 'Example', tags: [] },
    { url: 'https://foo.dev', title: 'Foo', tags: [], readLater: true, readLaterAddedAt: '2024-01-01T00:00:00.000Z' },
    { url: 'https://bar.io', title: 'Bar', tags: [] }
  ];
}

test('getReadingList returns only readLater bookmarks', () => {
  const bms = makeBookmarks();
  const list = getReadingList(bms);
  expect(list).toHaveLength(1);
  expect(list[0].url).toBe('https://foo.dev');
});

test('addToReadingList marks a bookmark as readLater', () => {
  const bms = makeBookmarks();
  const updated = addToReadingList(bms, 'https://example.com');
  expect(updated.find(b => b.url === 'https://example.com').readLater).toBe(true);
  expect(updated.find(b => b.url === 'https://example.com').readLaterAddedAt).toBeDefined();
});

test('addToReadingList is idempotent', () => {
  const bms = makeBookmarks();
  const updated = addToReadingList(bms, 'https://foo.dev');
  expect(updated).toEqual(bms);
});

test('addToReadingList throws for unknown url', () => {
  const bms = makeBookmarks();
  expect(() => addToReadingList(bms, 'https://nope.com')).toThrow();
});

test('removeFromReadingList removes readLater flag', () => {
  const bms = makeBookmarks();
  const updated = removeFromReadingList(bms, 'https://foo.dev');
  const bm = updated.find(b => b.url === 'https://foo.dev');
  expect(bm.readLater).toBeUndefined();
  expect(bm.readLaterAddedAt).toBeUndefined();
});

test('removeFromReadingList is idempotent', () => {
  const bms = makeBookmarks();
  const updated = removeFromReadingList(bms, 'https://example.com');
  expect(updated).toEqual(bms);
});

test('markAsRead removes readLater and sets readAt', () => {
  const bms = makeBookmarks();
  const updated = markAsRead(bms, 'https://foo.dev');
  const bm = updated.find(b => b.url === 'https://foo.dev');
  expect(bm.readLater).toBeUndefined();
  expect(bm.readAt).toBeDefined();
});

test('isInReadingList returns true for queued bookmark', () => {
  const bms = makeBookmarks();
  expect(isInReadingList(bms, 'https://foo.dev')).toBe(true);
  expect(isInReadingList(bms, 'https://example.com')).toBe(false);
});

test('isInReadingList returns false for unknown url', () => {
  const bms = makeBookmarks();
  expect(isInReadingList(bms, 'https://ghost.com')).toBe(false);
});
