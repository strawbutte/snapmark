import { loadBookmarks } from './storage.js';

/**
 * Export bookmarks to JSON format
 */
export function exportJSON(bookmarks) {
  return JSON.stringify(bookmarks, null, 2);
}

/**
 * Export bookmarks to Markdown format
 */
export function exportMarkdown(bookmarks) {
  if (bookmarks.length === 0) return '# Bookmarks\n\n_No bookmarks found._\n';

  const lines = ['# Bookmarks', ''];

  const byTag = {};
  const untagged = [];

  for (const bm of bookmarks) {
    if (!bm.tags || bm.tags.length === 0) {
      untagged.push(bm);
    } else {
      for (const tag of bm.tags) {
        if (!byTag[tag]) byTag[tag] = [];
        byTag[tag].push(bm);
      }
    }
  }

  for (const tag of Object.keys(byTag).sort()) {
    lines.push(`## ${tag}`, '');
    for (const bm of byTag[tag]) {
      const desc = bm.description ? ` — ${bm.description}` : '';
      lines.push(`- [${bm.title || bm.url}](${bm.url})${desc}`);
    }
    lines.push('');
  }

  if (untagged.length > 0) {
    lines.push('## Untagged', '');
    for (const bm of untagged) {
      const desc = bm.description ? ` — ${bm.description}` : '';
      lines.push(`- [${bm.title || bm.url}](${bm.url})${desc}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Export bookmarks to Netscape HTML bookmark format (browser-importable)
 */
export function exportHTML(bookmarks) {
  const items = bookmarks.map((bm) => {
    const tags = bm.tags ? bm.tags.join(',') : '';
    return `    <DT><A HREF="${bm.url}" TAGS="${tags}">${bm.title || bm.url}</A>`;
  });

  return [
    '<!DOCTYPE NETSCAPE-Bookmark-file-1>',
    '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">',
    '<TITLE>Bookmarks</TITLE>',
    '<H1>Bookmarks</H1>',
    '<DL><p>',
    ...items,
    '</DL><p>',
  ].join('\n');
}

export const FORMATS = ['json', 'markdown', 'html'];

export function exportBookmarks(bookmarks, format) {
  switch (format) {
    case 'json': return exportJSON(bookmarks);
    case 'markdown': return exportMarkdown(bookmarks);
    case 'html': return exportHTML(bookmarks);
    default: throw new Error(`Unknown export format: ${format}. Use one of: ${FORMATS.join(', ')}`);
  }
}
