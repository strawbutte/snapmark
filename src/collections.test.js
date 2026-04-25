const {
  getCollections,
  addToCollection,
  removeFromCollection,
  listCollections,
  getBookmarksInCollection,
} = require('./collections');

function makeBookmarks() {
  return [
    { url: 'https://example.com', title: 'Example', collection: 'work' },
    { url: 'https://news.ycombinator.com', title: 'HN', collection: 'reading' },
    { url: 'https://github.com', title: 'GitHub', collection: 'work' },
    { url: 'https://wikipedia.org', title: 'Wikipedia' },
  ];
}

test('getCollections groups bookmarks by collection', () => {
  const bms = makeBookmarks();
  const cols = getCollections(bms);
  expect(Object.keys(cols).sort()).toEqual(['reading', 'work']);
  expect(cols['work']).toHaveLength(2);
  expect(cols['reading']).toHaveLength(1);
});

test('addToCollection sets collection on existing bookmark', () => {
  const bms = makeBookmarks();
  addToCollection(bms, 'https://wikipedia.org', 'research');
  const bm = bms.find(b => b.url === 'https://wikipedia.org');
  expect(bm.collection).toBe('research');
});

test('addToCollection throws if bookmark not found', () => {
  const bms = makeBookmarks();
  expect(() => addToCollection(bms, 'https://nothere.com', 'x')).toThrow('Bookmark not found');
});

test('removeFromCollection deletes collection field', () => {
  const bms = makeBookmarks();
  removeFromCollection(bms, 'https://example.com');
  const bm = bms.find(b => b.url === 'https://example.com');
  expect(bm.collection).toBeUndefined();
});

test('removeFromCollection throws if bookmark not found', () => {
  const bms = makeBookmarks();
  expect(() => removeFromCollection(bms, 'https://nothere.com')).toThrow('Bookmark not found');
});

test('listCollections returns sorted unique names', () => {
  const bms = makeBookmarks();
  expect(listCollections(bms)).toEqual(['reading', 'work']);
});

test('listCollections returns empty array when none set', () => {
  expect(listCollections([{ url: 'https://a.com' }])).toEqual([]);
});

test('getBookmarksInCollection filters correctly', () => {
  const bms = makeBookmarks();
  const work = getBookmarksInCollection(bms, 'work');
  expect(work).toHaveLength(2);
  expect(work.every(b => b.collection === 'work')).toBe(true);
});
