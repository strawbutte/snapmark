import { describe, it, expect } from 'vitest';
import { getShortcuts, setShortcut, clearShortcut, resolveShortcut, isValidAlias } from './shortcuts.js';

const makeBookmarks = () => [
  { url: 'https://github.com', title: 'GitHub', shortcut: 'gh' },
  { url: 'https://news.ycombinator.com', title: 'HN' },
  { url: 'https://example.com', title: 'Example', shortcut: 'ex' },
];

describe('isValidAlias', () => {
  it('accepts lowercase alphanumeric and hyphens', () => {
    expect(isValidAlias('gh')).toBe(true);
    expect(isValidAlias('my-site')).toBe(true);
    expect(isValidAlias('abc123')).toBe(true);
  });
  it('rejects uppercase, spaces, special chars', () => {
    expect(isValidAlias('GH')).toBe(false);
    expect(isValidAlias('my site')).toBe(false);
    expect(isValidAlias('')).toBe(false);
    expect(isValidAlias('a'.repeat(33))).toBe(false);
  });
});

describe('getShortcuts', () => {
  it('returns a map of alias to url', () => {
    const map = getShortcuts(makeBookmarks());
    expect(map).toEqual({ gh: 'https://github.com', ex: 'https://example.com' });
  });
});

describe('setShortcut', () => {
  it('sets an alias on a bookmark', () => {
    const bms = setShortcut(makeBookmarks(), 'https://news.ycombinator.com', 'hn');
    expect(bms.find(b => b.url === 'https://news.ycombinator.com').shortcut).toBe('hn');
  });
  it('throws on invalid alias', () => {
    expect(() => setShortcut(makeBookmarks(), 'https://news.ycombinator.com', 'HN!')).toThrow();
  });
  it('throws on conflicting alias', () => {
    expect(() => setShortcut(makeBookmarks(), 'https://news.ycombinator.com', 'gh')).toThrow(/already used/);
  });
  it('allows overwriting own alias', () => {
    const bms = setShortcut(makeBookmarks(), 'https://github.com', 'gh');
    expect(bms.find(b => b.url === 'https://github.com').shortcut).toBe('gh');
  });
});

describe('clearShortcut', () => {
  it('removes the alias from a bookmark', () => {
    const bms = clearShortcut(makeBookmarks(), 'https://github.com');
    expect(bms.find(b => b.url === 'https://github.com').shortcut).toBeUndefined();
  });
});

describe('resolveShortcut', () => {
  it('returns the url for a known alias', () => {
    expect(resolveShortcut(makeBookmarks(), 'gh')).toBe('https://github.com');
  });
  it('returns null for unknown alias', () => {
    expect(resolveShortcut(makeBookmarks(), 'nope')).toBeNull();
  });
});
