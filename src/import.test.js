import { describe, it, expect } from 'vitest';
import { importJSON, importHTML, mergeBookmarks, importBookmarks } from './import.js';

const sampleJSON = JSON.stringify([
  { url: 'https://example.com', title: 'Example', tags: ['web'] },
  { url: 'https://github.com', title: 'GitHub', tags: ['dev'] },
]);

const sampleHTML = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<DL><p>
  <DT><A HREF="https://example.com" TAGS="web,tools">Example</A>
  <DT><A HREF="https://github.com" TAGS="dev">GitHub</A>
  <DT><A HREF="https://notags.com">No Tags</A>
</DL><p>`;

describe('importJSON', () => {
  it('parses a valid JSON bookmark array', () => {
    const result = importJSON(sampleJSON);
    expect(result).toHaveLength(2);
    expect(result[0].url).toBe('https://example.com');
  });

  it('assigns an id if missing', () => {
    const result = importJSON(sampleJSON);
    expect(result[0].id).toBeTruthy();
  });

  it('throws on invalid JSON', () => {
    expect(() => importJSON('not json')).toThrow('Invalid JSON');
  });

  it('throws if root is not an array', () => {
    expect(() => importJSON('{"url":"x"}')).toThrow('Expected a JSON array');
  });

  it('preserves existing id', () => {
    const withId = JSON.stringify([{ id: 'abc-123', url: 'https://a.com' }]);
    expect(importJSON(withId)[0].id).toBe('abc-123');
  });
});

describe('importHTML', () => {
  it('parses Netscape HTML bookmarks', () => {
    const result = importHTML(sampleHTML);
    expect(result).toHaveLength(3);
  });

  it('extracts URLs correctly', () => {
    const result = importHTML(sampleHTML);
    expect(result[0].url).toBe('https://example.com');
  });

  it('extracts tags from TAGS attribute', () => {
    const result = importHTML(sampleHTML);
    expect(result[0].tags).toContain('web');
    expect(result[0].tags).toContain('tools');
  });

  it('handles missing TAGS attribute', () => {
    const result = importHTML(sampleHTML);
    expect(result[2].tags).toEqual([]);
  });

  it('extracts title text', () => {
    const result = importHTML(sampleHTML);
    expect(result[1].title).toBe('GitHub');
  });
});

describe('mergeBookmarks', () => {
  const existing = [{ id: '1', url: 'https://example.com', title: 'Example', tags: [] }];
  const incoming = [
    { id: '2', url: 'https://example.com', title: 'Dup', tags: [] },
    { id: '3', url: 'https://new.com', title: 'New', tags: [] },
  ];

  it('deduplicates by URL', () => {
    const { bookmarks } = mergeBookmarks(existing, incoming);
    const urls = bookmarks.map(b => b.url);
    expect(urls.filter(u => u === 'https://example.com')).toHaveLength(1);
  });

  it('reports how many were added', () => {
    const { added } = mergeBookmarks(existing, incoming);
    expect(added).toBe(1);
  });
});

describe('importBookmarks', () => {
  it('dispatches to json importer', () => {
    expect(importBookmarks(sampleJSON, 'json')).toHaveLength(2);
  });

  it('dispatches to html importer', () => {
    expect(importBookmarks(sampleHTML, 'html')).toHaveLength(3);
  });

  it('throws on unsupported format', () => {
    expect(() => importBookmarks('', 'csv')).toThrow('Unknown import format');
  });
});
