const { sortBookmarks, getSortFields, SORT_FIELDS } = require('./custom-sort');

function makeBookmarks() {
  return [
    { url: 'https://beta.example.com/page', title: 'Zebra', createdAt: '2024-01-01T00:00:00Z', history: ['a', 'b', 'c'] },
    { url: 'https://alpha.io/home', title: 'Apple', createdAt: '2024-03-15T00:00:00Z', history: ['x'] },
    { url: 'https://gamma.net/', title: 'Mango', createdAt: '2024-02-10T00:00:00Z', history: [] },
  ];
}

describe('sortBookmarks', () => {
  test('sorts by title asc', () => {
    const result = sortBookmarks(makeBookmarks(), 'title', 'asc');
    expect(result.map(b => b.title)).toEqual(['Apple', 'Mango', 'Zebra']);
  });

  test('sorts by title desc', () => {
    const result = sortBookmarks(makeBookmarks(), 'title', 'desc');
    expect(result.map(b => b.title)).toEqual(['Zebra', 'Mango', 'Apple']);
  });

  test('sorts by createdAt desc (newest first)', () => {
    const result = sortBookmarks(makeBookmarks(), 'createdAt', 'desc');
    expect(result[0].title).toBe('Apple');
    expect(result[2].title).toBe('Zebra');
  });

  test('sorts by createdAt asc (oldest first)', () => {
    const result = sortBookmarks(makeBookmarks(), 'createdAt', 'asc');
    expect(result[0].title).toBe('Zebra');
  });

  test('sorts by visitCount desc', () => {
    const result = sortBookmarks(makeBookmarks(), 'visitCount', 'desc');
    expect(result[0].title).toBe('Zebra');
    expect(result[2].title).toBe('Mango');
  });

  test('sorts by domain asc', () => {
    const result = sortBookmarks(makeBookmarks(), 'domain', 'asc');
    expect(result[0].url).toContain('alpha.io');
  });

  test('does not mutate original array', () => {
    const bms = makeBookmarks();
    sortBookmarks(bms, 'title', 'asc');
    expect(bms[0].title).toBe('Zebra');
  });

  test('throws on invalid field', () => {
    expect(() => sortBookmarks(makeBookmarks(), 'banana', 'asc')).toThrow('Invalid sort field');
  });

  test('throws on invalid direction', () => {
    expect(() => sortBookmarks(makeBookmarks(), 'title', 'sideways')).toThrow('Invalid sort direction');
  });

  test('getSortFields returns all valid fields', () => {
    expect(getSortFields()).toEqual(SORT_FIELDS);
  });
});
