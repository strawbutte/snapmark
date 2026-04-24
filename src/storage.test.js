const fs = require('fs');
const path = require('path');
const os = require('os');
const {
  getStorePath,
  loadBookmarks,
  saveBookmarks,
  BOOKMARKS_FILE,
} = require('./storage');

let tmpDir;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'snapmark-test-'));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test('getStorePath returns correct path', () => {
  expect(getStorePath(tmpDir)).toBe(path.join(tmpDir, BOOKMARKS_FILE));
});

test('loadBookmarks returns empty array when file does not exist', () => {
  expect(loadBookmarks(tmpDir)).toEqual([]);
});

test('saveBookmarks writes bookmarks to disk', () => {
  const data = [{ id: '1', url: 'https://example.com', title: 'Example', tags: [], createdAt: '' }];
  saveBookmarks(data, tmpDir);
  const raw = fs.readFileSync(getStorePath(tmpDir), 'utf-8');
  expect(JSON.parse(raw)).toEqual(data);
});

test('loadBookmarks reads saved bookmarks', () => {
  const data = [{ id: '2', url: 'https://test.com', title: 'Test', tags: ['dev'], createdAt: '' }];
  saveBookmarks(data, tmpDir);
  expect(loadBookmarks(tmpDir)).toEqual(data);
});

test('loadBookmarks throws on malformed JSON', () => {
  const filePath = getStorePath(tmpDir);
  fs.mkdirSync(tmpDir, { recursive: true });
  fs.writeFileSync(filePath, 'not-json', 'utf-8');
  expect(() => loadBookmarks(tmpDir)).toThrow('Failed to parse bookmarks file');
});
