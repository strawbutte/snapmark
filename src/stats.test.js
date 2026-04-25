const { countByDomain, countByTag, recentBookmarks, getSummary } = require('./stats');

function makeBookmarks() {
  const now = new Date().toISOString();
  const old = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  return [
    { url: 'https://github.com/foo', tags: ['dev', 'git'], note: 'cool repo', createdAt: now },
    { url: 'https://github.com/bar', tags: ['dev'], note: '', createdAt: now },
    { url: 'https://www.npmjs.com/pkg', tags: ['dev', 'node'], note: null, createdAt: old },
    { url: 'https://news.ycombinator.com', tags: [], note: 'daily read', createdAt: old },
    { url: 'not-a-url', tags: ['misc'], note: '', createdAt: now }
  ];
}

describe('countByDomain', () => {
  test('counts bookmarks per domain', () => {
    const bms = makeBookmarks();
    const counts = countByDomain(bms);
    expect(counts['github.com']).toBe(2);
    expect(counts['npmjs.com']).toBe(1);
    expect(counts['news.ycombinator.com']).toBe(1);
  });

  test('strips www prefix', () => {
    const bms = [{ url: 'https://www.example.com/page' }];
    const counts = countByDomain(bms);
    expect(counts['example.com']).toBe(1);
    expect(counts['www.example.com']).toBeUndefined();
  });

  test('handles invalid urls', () => {
    const bms = [{ url: 'not-a-url' }];
    const counts = countByDomain(bms);
    expect(counts['(invalid)']).toBe(1);
  });
});

describe('countByTag', () => {
  test('counts bookmarks per tag', () => {
    const bms = makeBookmarks();
    const counts = countByTag(bms);
    expect(counts['dev']).toBe(3);
    expect(counts['git']).toBe(1);
    expect(counts['node']).toBe(1);
  });

  test('handles missing tags gracefully', () => {
    const bms = [{ url: 'https://example.com' }];
    const counts = countByTag(bms);
    expect(Object.keys(counts).length).toBe(0);
  });
});

describe('recentBookmarks', () => {
  test('returns only recent bookmarks', () => {
    const bms = makeBookmarks();
    const recent = recentBookmarks(bms, 7);
    expect(recent.length).toBe(3);
  });

  test('returns empty if none are recent', () => {
    const bms = makeBookmarks().map(b => ({ ...b, createdAt: '2000-01-01T00:00:00.000Z' }));
    expect(recentBookmarks(bms, 7).length).toBe(0);
  });

  test('skips bookmarks without createdAt', () => {
    const bms = [{ url: 'https://example.com' }];
    expect(recentBookmarks(bms, 7).length).toBe(0);
  });
});

describe('getSummary', () => {
  test('returns correct summary shape', () => {
    const bms = makeBookmarks();
    const summary = getSummary(bms);
    expect(summary.total).toBe(5);
    expect(summary.withNotes).toBe(2);
    expect(summary.withTags).toBe(4);
    expect(summary.uniqueDomains).toBe(4);
    expect(summary.topDomains.length).toBeGreaterThan(0);
    expect(summary.topTags.length).toBeGreaterThan(0);
    expect(typeof summary.recentCount).toBe('number');
  });
});
