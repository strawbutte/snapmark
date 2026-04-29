// Custom sort orders for bookmarks

const SORT_FIELDS = ['title', 'url', 'createdAt', 'visitCount', 'domain'];
const SORT_DIRS = ['asc', 'desc'];

function getDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function getVisitCount(bookmark) {
  return (bookmark.history && bookmark.history.length) || 0;
}

function getFieldValue(bookmark, field) {
  switch (field) {
    case 'title': return (bookmark.title || '').toLowerCase();
    case 'url': return (bookmark.url || '').toLowerCase();
    case 'createdAt': return bookmark.createdAt || '';
    case 'visitCount': return getVisitCount(bookmark);
    case 'domain': return getDomain(bookmark.url || '');
    default: return '';
  }
}

function sortBookmarks(bookmarks, field = 'createdAt', direction = 'desc') {
  if (!SORT_FIELDS.includes(field)) {
    throw new Error(`Invalid sort field: ${field}. Valid fields: ${SORT_FIELDS.join(', ')}`);
  }
  if (!SORT_DIRS.includes(direction)) {
    throw new Error(`Invalid sort direction: ${direction}. Use 'asc' or 'desc'`);
  }

  const sorted = [...bookmarks].sort((a, b) => {
    const aVal = getFieldValue(a, field);
    const bVal = getFieldValue(b, field);
    if (aVal < bVal) return -1;
    if (aVal > bVal) return 1;
    return 0;
  });

  return direction === 'desc' ? sorted.reverse() : sorted;
}

function getSortFields() {
  return [...SORT_FIELDS];
}

module.exports = { sortBookmarks, getSortFields, SORT_FIELDS, SORT_DIRS };
