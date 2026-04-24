import { describe, it, expect } from 'vitest';
import { exportJSON, exportMarkdown, exportHTML, exportBookmarks } from './export.js';

const makeBookmarks = (overrides = []) => [
  { id: '1', url: 'https://example.com', title: 'Example', tags: ['web'], description: 'A site' },
  { id: '2', url: 'https://github.com', title: 'GitHub', tags: ['dev', 'web'], description: '' },
  { id: '3', url: 'https://notes.io', title: 'Notes', tags: [], description: 'My notes' },
  ...overrides,
];

describe('exportJSON', () => {
  it('returns valid JSON', () => {
    const bms = makeBookmarks();
    const result = exportJSON(bms);
    expect(() => JSON.parse(result)).not.toThrow();
    expect(JSON.parse(result)).toHaveLength(3);
  });

  it('pretty prints with 2 spaces', () => {
    const result = exportJSON([{ id: '1', url: 'https://a.com' }]);
    expect(result).toContain('\n  ');
  });
});

describe('exportMarkdown', () => {
  it('includes a heading', () => {
    expect(exportMarkdown(makeBookmarks())).toContain('# Bookmarks');
  });

  it('groups bookmarks by tag', () => {
    const result = exportMarkdown(makeBookmarks());
    expect(result).toContain('## web');
    expect(result).toContain('## dev');
  });

  it('puts untagged items in Untagged section', () => {
    const result = exportMarkdown(makeBookmarks());
    expect(result).toContain('## Untagged');
    expect(result).toContain('Notes');
  });

  it('handles empty list gracefully', () => {
    expect(exportMarkdown([])).toContain('_No bookmarks found._');
  });

  it('includes description when present', () => {
    const result = exportMarkdown(makeBookmarks());
    expect(result).toContain('A site');
  });
});

describe('exportHTML', () => {
  it('produces Netscape bookmark format', () => {
    const result = exportHTML(makeBookmarks());
    expect(result).toContain('NETSCAPE-Bookmark-file-1');
    expect(result).toContain('<DL>');
  });

  it('includes all bookmark URLs', () => {
    const result = exportHTML(makeBookmarks());
    expect(result).toContain('https://example.com');
    expect(result).toContain('https://github.com');
  });

  it('includes tags attribute', () => {
    const result = exportHTML(makeBookmarks());
    expect(result).toContain('TAGS="web"');
  });
});

describe('exportBookmarks', () => {
  it('dispatches to correct formatter', () => {
    const bms = makeBookmarks();
    expect(exportBookmarks(bms, 'json')).toBe(exportJSON(bms));
    expect(exportBookmarks(bms, 'markdown')).toBe(exportMarkdown(bms));
    expect(exportBookmarks(bms, 'html')).toBe(exportHTML(bms));
  });

  it('throws on unknown format', () => {
    expect(() => exportBookmarks([], 'csv')).toThrow('Unknown export format');
  });
});
