const { favoriteBookmark, unfavoriteBookmark, listFavorites, isFavorite } = require('./favorites');

function makeBookmarks() {
  return [
    { url: 'https://example.com', title: 'Example' },
    { url: 'https://news.ycombinator.com', title: 'HN', favorite: true, favoritedAt: '2024-01-01T00:00:00.000Z' },
    { url: 'https://github.com', title: 'GitHub' },
  ];
}

describe('favoriteBookmark', () => {
  it('marks a bookmark as favorite', () => {
    const bms = makeBookmarks();
    const result = favoriteBookmark(bms, 'https://example.com');
    expect(result.find(b => b.url === 'https://example.com').favorite).toBe(true);
    expect(result.find(b => b.url === 'https://example.com').favoritedAt).toBeDefined();
  });

  it('does not mutate original array', () => {
    const bms = makeBookmarks();
    favoriteBookmark(bms, 'https://example.com');
    expect(bms[0].favorite).toBeUndefined();
  });

  it('throws if bookmark not found', () => {
    expect(() => favoriteBookmark(makeBookmarks(), 'https://nothere.com')).toThrow('Bookmark not found');
  });
});

describe('unfavoriteBookmark', () => {
  it('removes favorite status', () => {
    const bms = makeBookmarks();
    const result = unfavoriteBookmark(bms, 'https://news.ycombinator.com');
    const bm = result.find(b => b.url === 'https://news.ycombinator.com');
    expect(bm.favorite).toBeUndefined();
    expect(bm.favoritedAt).toBeUndefined();
  });

  it('throws if bookmark not found', () => {
    expect(() => unfavoriteBookmark(makeBookmarks(), 'https://missing.com')).toThrow('Bookmark not found');
  });
});

describe('listFavorites', () => {
  it('returns only favorited bookmarks', () => {
    const result = listFavorites(makeBookmarks());
    expect(result).toHaveLength(1);
    expect(result[0].url).toBe('https://news.ycombinator.com');
  });

  it('returns empty array when no favorites', () => {
    const bms = [{ url: 'https://a.com', title: 'A' }];
    expect(listFavorites(bms)).toEqual([]);
  });
});

describe('isFavorite', () => {
  it('returns true for favorited bookmark', () => {
    expect(isFavorite(makeBookmarks(), 'https://news.ycombinator.com')).toBe(true);
  });

  it('returns false for non-favorited bookmark', () => {
    expect(isFavorite(makeBookmarks(), 'https://example.com')).toBe(false);
  });

  it('returns false for missing bookmark', () => {
    expect(isFavorite(makeBookmarks(), 'https://nope.com')).toBe(false);
  });
});
