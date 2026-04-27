import { describe, it, expect } from 'vitest';
import { validateBookmarkShortcut, stripInvalidShortcuts, findDuplicateShortcuts } from './shortcuts.schema.js';

describe('validateBookmarkShortcut', () => {
  it('passes when no shortcut present', () => {
    expect(validateBookmarkShortcut({ url: 'https://example.com' }).valid).toBe(true);
  });
  it('passes for valid alias', () => {
    expect(validateBookmarkShortcut({ url: 'https://example.com', shortcut: 'ex' }).valid).toBe(true);
  });
  it('fails for invalid alias', () => {
    const result = validateBookmarkShortcut({ url: 'https://example.com', shortcut: 'BAD ALIAS!' });
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/Invalid shortcut/);
  });
  it('passes when shortcut is null', () => {
    expect(validateBookmarkShortcut({ url: 'https://example.com', shortcut: null }).valid).toBe(true);
  });
});

describe('stripInvalidShortcuts', () => {
  it('removes invalid shortcut fields', () => {
    const bms = [
      { url: 'https://a.com', shortcut: 'valid' },
      { url: 'https://b.com', shortcut: 'INVALID ALIAS' },
      { url: 'https://c.com' },
    ];
    const result = stripInvalidShortcuts(bms);
    expect(result[0].shortcut).toBe('valid');
    expect(result[1].shortcut).toBeUndefined();
    expect(result[2].shortcut).toBeUndefined();
  });
});

describe('findDuplicateShortcuts', () => {
  it('returns empty array when no dupes', () => {
    const bms = [
      { url: 'https://a.com', shortcut: 'a' },
      { url: 'https://b.com', shortcut: 'b' },
    ];
    expect(findDuplicateShortcuts(bms)).toEqual([]);
  });
  it('returns duplicate alias names', () => {
    const bms = [
      { url: 'https://a.com', shortcut: 'dupe' },
      { url: 'https://b.com', shortcut: 'dupe' },
      { url: 'https://c.com', shortcut: 'unique' },
    ];
    expect(findDuplicateShortcuts(bms)).toContain('dupe');
    expect(findDuplicateShortcuts(bms)).not.toContain('unique');
  });
});
