import { describe, it, expect } from 'vitest';
import { bulkTag, bulkUntag, bulkDelete, bulkExport } from './bulk.js';

function makeBookmarks() {
  return [
    { url: 'https://a.com', title: 'A', tags: ['news'] },
    { url: 'https://b.com', title: 'B', tags: ['dev'] },
    { url: 'https://c.com', title: 'C', tags: [] },
  ];
}

describe('bulkTag', () => {
  it('adds a tag to targeted bookmarks', () => {
    const bms = makeBookmarks();
    const result = bulkTag(bms, ['https://a.com', 'https://c.com'], 'starred');
    expect(result[0].tags).toContain('starred');
    expect(result[1].tags).not.toContain('starred');
    expect(result[2].tags).toContain('starred');
  });

  it('does not duplicate an existing tag', () => {
    const bms = makeBookmarks();
    const result = bulkTag(bms, ['https://a.com'], 'news');
    expect(result[0].tags.filter(t => t === 'news').length).toBe(1);
  });

  it('does not mutate the original array', () => {
    const bms = makeBookmarks();
    bulkTag(bms, ['https://a.com'], 'new-tag');
    expect(bms[0].tags).not.toContain('new-tag');
  });
});

describe('bulkUntag', () => {
  it('removes a tag from targeted bookmarks', () => {
    const bms = makeBookmarks();
    const result = bulkUntag(bms, ['https://a.com'], 'news');
    expect(result[0].tags).not.toContain('news');
    expect(result[1].tags).toContain('dev');
  });

  it('is a no-op when tag does not exist', () => {
    const bms = makeBookmarks();
    const result = bulkUntag(bms, ['https://b.com'], 'missing');
    expect(result[1].tags).toEqual(['dev']);
  });
});

describe('bulkDelete', () => {
  it('removes targeted bookmarks', () => {
    const bms = makeBookmarks();
    const { remaining, removed } = bulkDelete(bms, ['https://a.com', 'https://c.com']);
    expect(remaining).toHaveLength(1);
    expect(remaining[0].url).toBe('https://b.com');
    expect(removed).toBe(2);
  });

  it('returns removed=0 when no urls match', () => {
    const bms = makeBookmarks();
    const { remaining, removed } = bulkDelete(bms, ['https://z.com']);
    expect(remaining).toHaveLength(3);
    expect(removed).toBe(0);
  });
});

describe('bulkExport', () => {
  it('returns only the targeted bookmarks', () => {
    const bms = makeBookmarks();
    const result = bulkExport(bms, ['https://b.com']);
    expect(result).toHaveLength(1);
    expect(result[0].url).toBe('https://b.com');
  });

  it('returns empty array when no urls match', () => {
    const bms = makeBookmarks();
    expect(bulkExport(bms, ['https://nope.com'])).toEqual([]);
  });
});
