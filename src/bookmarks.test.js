const fs = require('fs');
const path = require('path');
const os = require('os');
const { addBookmark, removeBookmark, listBookmarks, searchBookmarks } = require('./bookmarks');

let tmpDir;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'snapmark-bm-test-'));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test('addBookmark adds a bookmark and returns it', () => {
  const bm = addBookmark('https://github.com', { title: 'GitHub', tags: ['dev'], storeDir: tmpDir });
  expect(bm.url).toBe('https://github.com');
  expect(bm.title).toBe('GitHub');
  expect(bm.id).toBeDefined();
});

test('addBookmark throws on duplicate URL', () => {
  addBookmark('https://github.com', { storeDir: tmpDir });
  expect(() => addBookmark('https://github.com', { storeDir: tmpDir })).toThrow('Bookmark already exists');
});

test('addBookmark throws when URL is missing', () => {
  expect(() => addBookmark('', { storeDir: tmpDir })).toThrow('A valid URL is required');
});

test('removeBookmark removes by id', () => {
  const bm = addBookmark('https://example.com', { storeDir: tmpDir });
  const removed = removeBookmark(bm.id, { storeDir: tmpDir });
  expect(removed.id).toBe(bm.id);
  expect(listBookmarks({ storeDir: tmpDir })).toHaveLength(0);
});

test('removeBookmark throws on unknown id', () => {
  expect(() => removeBookmark('nonexistent', { storeDir: tmpDir })).toThrow('Bookmark not found');
});

test('listBookmarks filters by tags', () => {
  addBookmark('https://a.com', { tags: ['news'], storeDir: tmpDir });
  addBookmark('https://b.com', { tags: ['dev'], storeDir: tmpDir });
  const results = listBookmarks({ tags: ['dev'], storeDir: tmpDir });
  expect(results).toHaveLength(1);
  expect(results[0].url).toBe('https://b.com');
});

test('searchBookmarks finds by partial URL or title', () => {
  addBookmark('https://news.ycombinator.com', { title: 'Hacker News', storeDir: tmpDir });
  addBookmark('https://github.com', { title: 'GitHub', storeDir: tmpDir });
  expect(searchBookmarks('hacker', { storeDir: tmpDir })).toHaveLength(1);
  expect(searchBookmarks('github', { storeDir: tmpDir })).toHaveLength(1);
  expect(searchBookmarks('xyz', { storeDir: tmpDir })).toHaveLength(0);
});
