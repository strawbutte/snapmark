const { scoreBookmark } = require('./search');

function makeBookmark(overrides = {}) {
  return {
    url: 'https://example.com/page',
    title: 'Example Page',
    tags: ['web', 'example'],
    notes: 'a useful reference page',
    ...overrides,
  };
}

test('returns 0 for empty query', () => {
  const bm = makeBookmark();
  expect(scoreBookmark(bm, '')).toBe(0);
});

test('scores higher when query matches title', () => {
  const bm = makeBookmark({ title: 'JavaScript Tips' });
  const score = scoreBookmark(bm, 'javascript');
  expect(score).toBeGreaterThan(0);
});

test('scores higher for title match than url match', () => {
  const titleMatch = makeBookmark({ title: 'node guide', url: 'https://example.com' });
  const urlMatch = makeBookmark({ title: 'something else', url: 'https://nodejs.org/guide' });
  const scoreTitle = scoreBookmark(titleMatch, 'node');
  const scoreUrl = scoreBookmark(urlMatch, 'node');
  expect(scoreTitle).toBeGreaterThan(scoreUrl);
});

test('scores when query matches a tag', () => {
  const bm = makeBookmark({ tags: ['devops', 'linux'] });
  const score = scoreBookmark(bm, 'devops');
  expect(score).toBeGreaterThan(0);
});

test('scores when query matches notes', () => {
  const bm = makeBookmark({ notes: 'great tutorial on async await' });
  const score = scoreBookmark(bm, 'async');
  expect(score).toBeGreaterThan(0);
});

test('returns 0 when nothing matches', () => {
  const bm = makeBookmark({
    title: 'Cooking Recipes',
    url: 'https://recipes.com',
    tags: ['food'],
    notes: 'pasta and pizza',
  });
  expect(scoreBookmark(bm, 'javascript')).toBe(0);
});

test('is case-insensitive', () => {
  const bm = makeBookmark({ title: 'React Hooks Guide' });
  expect(scoreBookmark(bm, 'REACT')).toBeGreaterThan(0);
  expect(scoreBookmark(bm, 'react')).toBeGreaterThan(0);
});

test('handles bookmark with missing optional fields', () => {
  const bm = { url: 'https://minimal.com' };
  expect(() => scoreBookmark(bm, 'minimal')).not.toThrow();
});

test('multi-word query matches partial terms', () => {
  const bm = makeBookmark({ title: 'Getting started with Docker', tags: ['containers'] });
  const score = scoreBookmark(bm, 'docker containers');
  expect(score).toBeGreaterThan(scoreBookmark(bm, 'docker'));
});
