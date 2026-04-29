const { checkUrl, checkBrokenLinks, getBrokenResults } = require('./broken-links');

jest.mock('node-fetch');
const fetch = require('node-fetch');

function makeBookmarks() {
  return [
    { id: '1', url: 'https://example.com', title: 'Example' },
    { id: '2', url: 'https://broken.example', title: 'Broken' },
    { id: '3', url: 'https://notfound.example', title: 'Not Found' },
  ];
}

describe('checkUrl', () => {
  it('returns ok:true for 200 response', async () => {
    fetch.mockResolvedValueOnce({ ok: true, status: 200 });
    const result = await checkUrl('https://example.com');
    expect(result).toEqual({ url: 'https://example.com', ok: true, status: 200, error: null });
  });

  it('returns ok:false for 404 response', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 404 });
    const result = await checkUrl('https://notfound.example');
    expect(result.ok).toBe(false);
    expect(result.status).toBe(404);
  });

  it('returns ok:false on network error', async () => {
    fetch.mockRejectedValueOnce(new Error('ECONNREFUSED'));
    const result = await checkUrl('https://broken.example');
    expect(result.ok).toBe(false);
    expect(result.error).toBe('ECONNREFUSED');
    expect(result.status).toBeNull();
  });
});

describe('checkBrokenLinks', () => {
  it('returns results for all bookmarks', async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, status: 200 })
      .mockResolvedValueOnce({ ok: false, status: 503 })
      .mockRejectedValueOnce(new Error('timeout'));
    const bms = makeBookmarks();
    const results = await checkBrokenLinks(bms);
    expect(results).toHaveLength(3);
    expect(results[0].result.ok).toBe(true);
    expect(results[1].result.ok).toBe(false);
    expect(results[2].result.ok).toBe(false);
  });
});

describe('getBrokenResults', () => {
  it('filters to only broken entries', () => {
    const results = [
      { bookmark: { id: '1' }, result: { ok: true } },
      { bookmark: { id: '2' }, result: { ok: false } },
    ];
    const broken = getBrokenResults(results);
    expect(broken).toHaveLength(1);
    expect(broken[0].bookmark.id).toBe('2');
  });

  it('returns empty array when all ok', () => {
    const results = [{ bookmark: { id: '1' }, result: { ok: true } }];
    expect(getBrokenResults(results)).toEqual([]);
  });
});
