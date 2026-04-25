const { setReminder, clearReminder, getDueReminders, listReminders } = require('./remind');
const { loadBookmarks, saveBookmarks } = require('./storage');

jest.mock('./storage');

const BASE = [
  { url: 'https://example.com', title: 'Example', tags: [] },
  { url: 'https://foo.dev', title: 'Foo', tags: [] },
];

beforeEach(() => {
  loadBookmarks.mockReturnValue(BASE.map(b => ({ ...b })));
  saveBookmarks.mockClear();
});

test('setReminder attaches remindAt to matching bookmark', () => {
  const result = setReminder('https://example.com', 3);
  expect(result.remindAt).toBeDefined();
  const saved = saveBookmarks.mock.calls[0][0];
  const bm = saved.find(b => b.url === 'https://example.com');
  expect(bm.remindAt).toBe(result.remindAt);
});

test('setReminder throws if bookmark not found', () => {
  expect(() => setReminder('https://nope.com', 1)).toThrow('Bookmark not found');
});

test('clearReminder removes remindAt field', () => {
  loadBookmarks.mockReturnValue([
    { url: 'https://example.com', title: 'Example', tags: [], remindAt: '2099-01-01T00:00:00.000Z' },
  ]);
  const result = clearReminder('https://example.com');
  expect(result.remindAt).toBeUndefined();
});

test('getDueReminders returns bookmarks past due date', () => {
  const past = new Date(Date.now() - 1000).toISOString();
  const future = new Date(Date.now() + 99999999).toISOString();
  loadBookmarks.mockReturnValue([
    { url: 'https://a.com', title: 'A', remindAt: past },
    { url: 'https://b.com', title: 'B', remindAt: future },
    { url: 'https://c.com', title: 'C' },
  ]);
  const due = getDueReminders();
  expect(due).toHaveLength(1);
  expect(due[0].url).toBe('https://a.com');
});

test('listReminders returns only bookmarks with remindAt, sorted', () => {
  loadBookmarks.mockReturnValue([
    { url: 'https://b.com', remindAt: '2030-06-01T00:00:00.000Z' },
    { url: 'https://a.com', remindAt: '2025-01-01T00:00:00.000Z' },
    { url: 'https://c.com' },
  ]);
  const list = listReminders();
  expect(list).toHaveLength(2);
  expect(list[0].url).toBe('https://a.com');
  expect(list[1].url).toBe('https://b.com');
});
