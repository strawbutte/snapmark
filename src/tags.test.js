const { addTag, removeTag, listTags, filterByTag } = require('./tags');

function makeBookmarks() {
  return [
    { url: 'https://example.com', title: 'Example', tags: ['news'] },
    { url: 'https://github.com', title: 'GitHub', tags: ['dev', 'tools'] },
    { url: 'https://nodejs.org', title: 'Node.js', tags: [] },
  ];
}

describe('addTag', () => {
  test('adds a new tag to a bookmark', () => {
    const bms = makeBookmarks();
    addTag(bms, 'https://nodejs.org', 'dev');
    expect(bms[2].tags).toContain('dev');
  });

  test('normalizes tag to lowercase', () => {
    const bms = makeBookmarks();
    addTag(bms, 'https://nodejs.org', 'DEV');
    expect(bms[2].tags).toContain('dev');
  });

  test('does not add duplicate tags', () => {
    const bms = makeBookmarks();
    addTag(bms, 'https://example.com', 'news');
    expect(bms[0].tags.filter(t => t === 'news').length).toBe(1);
  });

  test('throws if bookmark not found', () => {
    const bms = makeBookmarks();
    expect(() => addTag(bms, 'https://notfound.com', 'tag')).toThrow('Bookmark not found');
  });

  test('throws on empty tag', () => {
    const bms = makeBookmarks();
    expect(() => addTag(bms, 'https://example.com', '  ')).toThrow('Tag cannot be empty');
  });
});

describe('removeTag', () => {
  test('removes an existing tag', () => {
    const bms = makeBookmarks();
    removeTag(bms, 'https://github.com', 'tools');
    expect(bms[1].tags).not.toContain('tools');
  });

  test('does nothing if tag does not exist', () => {
    const bms = makeBookmarks();
    removeTag(bms, 'https://github.com', 'nonexistent');
    expect(bms[1].tags).toEqual(['dev', 'tools']);
  });

  test('throws if bookmark not found', () => {
    const bms = makeBookmarks();
    expect(() => removeTag(bms, 'https://notfound.com', 'dev')).toThrow('Bookmark not found');
  });
});

describe('listTags', () => {
  test('returns sorted unique tags', () => {
    const bms = makeBookmarks();
    expect(listTags(bms)).toEqual(['dev', 'news', 'tools']);
  });

  test('returns empty array when no tags exist', () => {
    expect(listTags([{ url: 'https://x.com', title: 'X' }])).toEqual([]);
  });
});

describe('filterByTag', () => {
  test('returns bookmarks matching the tag', () => {
    const bms = makeBookmarks();
    const result = filterByTag(bms, 'dev');
    expect(result.map(b => b.url)).toEqual(['https://github.com']);
  });

  test('returns empty array if no matches', () => {
    const bms = makeBookmarks();
    expect(filterByTag(bms, 'nope')).toEqual([]);
  });

  test('is case-insensitive', () => {
    const bms = makeBookmarks();
    expect(filterByTag(bms, 'NEWS').length).toBe(1);
  });
});
