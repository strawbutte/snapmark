const { archiveBookmark, unarchiveBookmark, listArchived, listActive } = require('./archive');
const storage = require('./storage');

jest.mock('./storage');

function makeBookmarks() {
  return [
    { url: 'https://example.com', title: 'Example', tags: [], archived: false },
    { url: 'https://foo.com', title: 'Foo', tags: [], archived: true, archivedAt: '2024-01-01T00:00:00.000Z' },
    { url: 'https://bar.com', title: 'Bar', tags: [] }
  ];
}

beforeEach(() => {
  storage.loadBookmarks.mockResolvedValue(makeBookmarks());
  storage.saveBookmarks.mockResolvedValue();
});

test('archiveBookmark marks bookmark as archived', async () => {
  const bm = await archiveBookmark('https://example.com');
  expect(bm.archived).toBe(true);
  expect(bm.archivedAt).toBeDefined();
  expect(storage.saveBookmarks).toHaveBeenCalled();
});

test('archiveBookmark throws if url not found', async () => {
  await expect(archiveBookmark('https://notfound.com')).rejects.toThrow('Bookmark not found');
});

test('unarchiveBookmark removes archived flag', async () => {
  const bm = await unarchiveBookmark('https://foo.com');
  expect(bm.archived).toBe(false);
  expect(bm.archivedAt).toBeUndefined();
  expect(storage.saveBookmarks).toHaveBeenCalled();
});

test('unarchiveBookmark throws if url not found', async () => {
  await expect(unarchiveBookmark('https://notfound.com')).rejects.toThrow('Bookmark not found');
});

test('listArchived returns only archived bookmarks', async () => {
  const result = await listArchived();
  expect(result).toHaveLength(1);
  expect(result[0].url).toBe('https://foo.com');
});

test('listActive returns only non-archived bookmarks', async () => {
  const result = await listActive();
  expect(result.every(b => !b.archived)).toBe(true);
  expect(result.find(b => b.url === 'https://foo.com')).toBeUndefined();
});
