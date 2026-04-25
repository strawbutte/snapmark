const {
  isValidISODate,
  validateBookmarkArchive,
  stripInvalidArchiveFields,
  normalizeArchiveFields
} = require('./archive.schema');

test('isValidISODate accepts valid ISO string', () => {
  expect(isValidISODate('2024-06-01T12:00:00.000Z')).toBe(true);
});

test('isValidISODate rejects invalid string', () => {
  expect(isValidISODate('not-a-date')).toBe(false);
  expect(isValidISODate(12345)).toBe(false);
});

test('validateBookmarkArchive returns no errors for valid archived bookmark', () => {
  const bm = { archived: true, archivedAt: '2024-01-01T00:00:00.000Z' };
  expect(validateBookmarkArchive(bm)).toHaveLength(0);
});

test('validateBookmarkArchive errors when archived is not boolean', () => {
  const errors = validateBookmarkArchive({ archived: 'yes' });
  expect(errors.length).toBeGreaterThan(0);
});

test('validateBookmarkArchive errors when archivedAt set but archived false', () => {
  const errors = validateBookmarkArchive({ archived: false, archivedAt: '2024-01-01T00:00:00.000Z' });
  expect(errors.length).toBeGreaterThan(0);
});

test('stripInvalidArchiveFields removes bad archived field', () => {
  const result = stripInvalidArchiveFields({ url: 'x', archived: 'yes', archivedAt: 'bad' });
  expect(result.archived).toBeUndefined();
  expect(result.archivedAt).toBeUndefined();
});

test('stripInvalidArchiveFields removes archivedAt when archived is false', () => {
  const result = stripInvalidArchiveFields({ url: 'x', archived: false, archivedAt: '2024-01-01T00:00:00.000Z' });
  expect(result.archivedAt).toBeUndefined();
});

test('normalizeArchiveFields processes array of bookmarks', () => {
  const bms = [
    { url: 'a', archived: true, archivedAt: '2024-01-01T00:00:00.000Z' },
    { url: 'b', archived: 'bad', archivedAt: 'nope' }
  ];
  const result = normalizeArchiveFields(bms);
  expect(result[0].archived).toBe(true);
  expect(result[1].archived).toBeUndefined();
});
