const { getHistory, recordVisit, clearHistory, visitCount, lastVisited } = require('./history');

function makeBookmarks() {
  return [
    { url: 'https://example.com', title: 'Example', history: ['2024-01-01T00:00:00.000Z', '2024-03-01T00:00:00.000Z'] },
    { url: 'https://github.com', title: 'GitHub', history: [] },
    { url: 'https://news.ycombinator.com', title: 'HN', history: ['2024-06-01T00:00:00.000Z'] },
  ];
}

describe('getHistory', () => {
  it('returns only bookmarks with visits, sorted by most recent', () => {
    const bms = makeBookmarks();
    const result = getHistory(bms);
    expect(result.length).toBe(2);
    expect(result[0].url).toBe('https://news.ycombinator.com');
    expect(result[1].url).toBe('https://example.com');
  });

  it('returns empty array when no history exists', () => {
    const bms = [{ url: 'https://a.com', title: 'A', history: [] }];
    expect(getHistory(bms)).toEqual([]);
  });
});

describe('recordVisit', () => {
  it('appends a timestamp to history', () => {
    const bms = makeBookmarks();
    const before = bms[1].history.length;
    recordVisit(bms, 'https://github.com');
    expect(bms[1].history.length).toBe(before + 1);
  });

  it('initializes history if missing', () => {
    const bms = [{ url: 'https://x.com', title: 'X' }];
    recordVisit(bms, 'https://x.com');
    expect(Array.isArray(bms[0].history)).toBe(true);
    expect(bms[0].history.length).toBe(1);
  });

  it('throws if bookmark not found', () => {
    expect(() => recordVisit(makeBookmarks(), 'https://nothere.com')).toThrow();
  });

  it('trims history to MAX_HISTORY (50)', () => {
    const bm = { url: 'https://trim.com', title: 'Trim', history: Array(50).fill('2024-01-01T00:00:00.000Z') };
    recordVisit([bm], 'https://trim.com');
    expect(bm.history.length).toBe(50);
  });
});

describe('clearHistory', () => {
  it('empties the history array', () => {
    const bms = makeBookmarks();
    clearHistory(bms, 'https://example.com');
    expect(bms[0].history).toEqual([]);
  });

  it('throws if bookmark not found', () => {
    expect(() => clearHistory(makeBookmarks(), 'https://nope.com')).toThrow();
  });
});

describe('visitCount', () => {
  it('returns number of visits', () => {
    expect(visitCount({ history: ['a', 'b', 'c'] })).toBe(3);
  });

  it('returns 0 if no history', () => {
    expect(visitCount({ history: [] })).toBe(0);
    expect(visitCount({})).toBe(0);
  });
});

describe('lastVisited', () => {
  it('returns the last timestamp', () => {
    expect(lastVisited({ history: ['2024-01-01T00:00:00.000Z', '2024-06-01T00:00:00.000Z'] })).toBe('2024-06-01T00:00:00.000Z');
  });

  it('returns null if no history', () => {
    expect(lastVisited({ history: [] })).toBeNull();
    expect(lastVisited({})).toBeNull();
  });
});
