const {
  validateLinkCheck,
  applyLinkCheck,
  stripInvalidLinkCheck,
  getBrokenBookmarks,
} = require('./broken-links.schema');

describe('validateLinkCheck', () => {
  it('accepts a valid check object', () => {
    expect(validateLinkCheck({ checkedAt: '2024-01-01T00:00:00.000Z', ok: true, status: 200 })).toBe(true);
  });

  it('accepts null status', () => {
    expect(validateLinkCheck({ checkedAt: '2024-01-01T00:00:00.000Z', ok: false, status: null })).toBe(true);
  });

  it('rejects missing checkedAt', () => {
    expect(validateLinkCheck({ ok: true, status: 200 })).toBe(false);
  });

  it('rejects non-boolean ok', () => {
    expect(validateLinkCheck({ checkedAt: '2024-01-01T00:00:00.000Z', ok: 'yes', status: 200 })).toBe(false);
  });

  it('rejects null input', () => {
    expect(validateLinkCheck(null)).toBe(false);
  });
});

describe('applyLinkCheck', () => {
  it('attaches linkCheck to bookmark', () => {
    const bm = { id: '1', url: 'https://example.com', title: 'Ex' };
    const result = applyLinkCheck(bm, { ok: true, status: 200, error: null });
    expect(result.linkCheck.ok).toBe(true);
    expect(result.linkCheck.status).toBe(200);
    expect(typeof result.linkCheck.checkedAt).toBe('string');
  });

  it('does not mutate original bookmark', () => {
    const bm = { id: '1', url: 'https://example.com' };
    applyLinkCheck(bm, { ok: false, status: null, error: 'timeout' });
    expect(bm.linkCheck).toBeUndefined();
  });
});

describe('stripInvalidLinkCheck', () => {
  it('removes invalid linkCheck', () => {
    const bm = { id: '1', url: 'https://example.com', linkCheck: { bad: true } };
    const result = stripInvalidLinkCheck(bm);
    expect(result.linkCheck).toBeUndefined();
  });

  it('keeps valid linkCheck', () => {
    const bm = { id: '1', url: 'https://example.com', linkCheck: { checkedAt: '2024-01-01T00:00:00.000Z', ok: true, status: 200 } };
    expect(stripInvalidLinkCheck(bm).linkCheck).toBeDefined();
  });
});

describe('getBrokenBookmarks', () => {
  it('returns only broken bookmarks', () => {
    const bms = [
      { id: '1', linkCheck: { checkedAt: '2024-01-01T00:00:00.000Z', ok: true, status: 200 } },
      { id: '2', linkCheck: { checkedAt: '2024-01-01T00:00:00.000Z', ok: false, status: null } },
    ];
    expect(getBrokenBookmarks(bms)).toHaveLength(1);
    expect(getBrokenBookmarks(bms)[0].id).toBe('2');
  });
});
