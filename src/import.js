import { randomUUID } from 'crypto';

/**
 * Parse a JSON export file back into bookmarks array
 */
export function importJSON(content) {
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error('Invalid JSON content');
  }
  if (!Array.isArray(parsed)) throw new Error('Expected a JSON array of bookmarks');
  return parsed.map(normalizeBookmark);
}

/**
 * Parse a Netscape HTML bookmark file
 */
export function importHTML(content) {
  const bookmarks = [];
  const anchorRegex = /<A\s+([^>]+)>([^<]*)<\/A>/gi;
  let match;

  while ((match = anchorRegex.exec(content)) !== null) {
    const attrs = match[1];
    const title = match[2].trim();

    const hrefMatch = attrs.match(/HREF="([^"]+)"/i);
    const tagsMatch = attrs.match(/TAGS="([^"]*)"/i);

    if (!hrefMatch) continue;

    const url = hrefMatch[1];
    const tags = tagsMatch && tagsMatch[1]
      ? tagsMatch[1].split(',').map(t => t.trim()).filter(Boolean)
      : [];

    bookmarks.push(normalizeBookmark({ url, title, tags }));
  }

  return bookmarks;
}

function normalizeBookmark(raw) {
  return {
    id: raw.id || randomUUID(),
    url: raw.url || '',
    title: raw.title || raw.url || '',
    description: raw.description || '',
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    createdAt: raw.createdAt || new Date().toISOString(),
  };
}

/**
 * Merge imported bookmarks into existing ones, deduplicating by URL
 */
export function mergeBookmarks(existing, incoming) {
  const urlMap = new Map(existing.map(b => [b.url, b]));
  let added = 0;

  for (const bm of incoming) {
    if (!urlMap.has(bm.url)) {
      urlMap.set(bm.url, bm);
      added++;
    }
  }

  return { bookmarks: Array.from(urlMap.values()), added };
}

export const IMPORT_FORMATS = ['json', 'html'];

export function importBookmarks(content, format) {
  switch (format) {
    case 'json': return importJSON(content);
    case 'html': return importHTML(content);
    default: throw new Error(`Unknown import format: ${format}. Use one of: ${IMPORT_FORMATS.join(', ')}`);
  }
}
