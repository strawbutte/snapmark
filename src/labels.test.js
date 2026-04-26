const { VALID_LABELS, isValidLabel, setLabel, clearLabel, getLabel, filterByLabel, listLabels } = require('./labels');

function makeBookmarks() {
  return [
    { url: 'https://example.com', title: 'Example' },
    { url: 'https://github.com', title: 'GitHub', label: 'blue' },
    { url: 'https://news.ycombinator.com', title: 'HN', label: 'orange' },
  ];
}

describe('isValidLabel', () => {
  test('returns true for valid labels', () => {
    for (const l of VALID_LABELS) expect(isValidLabel(l)).toBe(true);
  });
  test('returns false for invalid label', () => {
    expect(isValidLabel('pink')).toBe(false);
    expect(isValidLabel('')).toBe(false);
  });
});

describe('setLabel', () => {
  test('sets a valid label on a bookmark', () => {
    const bms = makeBookmarks();
    setLabel(bms, 'https://example.com', 'red');
    expect(bms[0].label).toBe('red');
  });
  test('throws on invalid label', () => {
    const bms = makeBookmarks();
    expect(() => setLabel(bms, 'https://example.com', 'pink')).toThrow('Invalid label');
  });
  test('throws if bookmark not found', () => {
    const bms = makeBookmarks();
    expect(() => setLabel(bms, 'https://notfound.com', 'red')).toThrow('Bookmark not found');
  });
});

describe('clearLabel', () => {
  test('removes label from bookmark', () => {
    const bms = makeBookmarks();
    clearLabel(bms, 'https://github.com');
    expect(bms[1].label).toBeUndefined();
  });
  test('throws if bookmark not found', () => {
    const bms = makeBookmarks();
    expect(() => clearLabel(bms, 'https://notfound.com')).toThrow('Bookmark not found');
  });
});

describe('getLabel', () => {
  test('returns label for labeled bookmark', () => {
    const bms = makeBookmarks();
    expect(getLabel(bms, 'https://github.com')).toBe('blue');
  });
  test('returns null for unlabeled bookmark', () => {
    const bms = makeBookmarks();
    expect(getLabel(bms, 'https://example.com')).toBeNull();
  });
});

describe('filterByLabel', () => {
  test('returns bookmarks with matching label', () => {
    const bms = makeBookmarks();
    const result = filterByLabel(bms, 'blue');
    expect(result).toHaveLength(1);
    expect(result[0].url).toBe('https://github.com');
  });
  test('returns empty array if no matches', () => {
    const bms = makeBookmarks();
    expect(filterByLabel(bms, 'green')).toHaveLength(0);
  });
  test('throws on invalid label', () => {
    const bms = makeBookmarks();
    expect(() => filterByLabel(bms, 'neon')).toThrow('Invalid label');
  });
});

describe('listLabels', () => {
  test('returns counts per label', () => {
    const bms = makeBookmarks();
    const counts = listLabels(bms);
    expect(counts).toEqual({ blue: 1, orange: 1 });
  });
  test('returns empty object if no labels', () => {
    expect(listLabels([{ url: 'https://a.com', title: 'A' }])).toEqual({});
  });
});
