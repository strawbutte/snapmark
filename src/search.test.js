const { scoreBookmark, rankSearch, multiTermSearch } = require('./search');

jest.mock('./storage');
const { loadBookmarks } = require('./storage');

const sampleBookmarks = [
  {
    id: '1',
    title: 'GitHub',
    url: 'https://github.com',
    description: 'Code hosting platform',
    tags: ['dev', 'git'],
  },
  {
    id: '2',
    title: 'MDN Web Docs',
    url: 'https://developer.mozilla.org',
    description: 'JavaScript and web documentation',
    tags: ['dev', 'docs', 'javascript'],
  },
  {
    id: '3',
    title: 'Hacker News',
    url: 'https://news.ycombinator.com',
    description: 'Tech news aggregator',
    tags: ['news', 'tech'],
  },
];

beforeEach(() => {
  loadBookmarks.mockResolvedValue([...sampleBookmarks]);
});

describe('scoreBookmark', () => {
  test('returns 0 for no match', () => {
    expect(scoreBookmark(sampleBookmarks[0], 'zzznomatch')).toBe(0);
  });

  test('scores title match higher than description match', () => {
    const titleScore = scoreBookmark(sampleBookmarks[0], 'github');
    const descScore = scoreBookmark(sampleBookmarks[0], 'hosting');
    expect(titleScore).toBeGreaterThan(descScore);
  });

  test('gives bonus for title starting with query', () => {
    const startScore = scoreBookmark(sampleBookmarks[1], 'mdn');
    const midScore = scoreBookmark(sampleBookmarks[1], 'web');
    expect(startScore).toBeGreaterThan(midScore);
  });

  test('scores exact tag match', () => {
    const score = scoreBookmark(sampleBookmarks[0], 'git');
    expect(score).toBeGreaterThan(0);
  });
});

describe('rankSearch', () => {
  test('returns ranked results for a query', async () => {
    const results = await rankSearch('dev');
    expect(results.length).toBeGreaterThan(0);
    results.forEach((r) => expect(r._score).toBeGreaterThan(0));
  });

  test('results are sorted by score descending', async () => {
    const results = await rankSearch('javascript');
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1]._score).toBeGreaterThanOrEqual(results[i]._score);
    }
  });

  test('respects limit option', async () => {
    const results = await rankSearch('dev', { limit: 1 });
    expect(results.length).toBe(1);
  });

  test('throws on empty query', async () => {
    await expect(rankSearch('')).rejects.toThrow('Search query must not be empty');
  });

  test('returns empty array when nothing matches', async () => {
    const results = await rankSearch('zzznomatch');
    expect(results).toEqual([]);
  });
});

describe('multiTermSearch', () => {
  test('returns bookmarks matching all terms', async () => {
    const results = await multiTermSearch(['dev', 'javascript']);
    expect(results.some((b) => b.id === '2')).toBe(true);
    expect(results.some((b) => b.id === '3')).toBe(false);
  });

  test('throws when terms array is empty', async () => {
    await expect(multiTermSearch([])).rejects.toThrow('non-empty array');
  });
});
