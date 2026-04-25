// stats.js — bookmark statistics and insights

/**
 * Count bookmarks per domain
 * @param {Array} bookmarks
 * @returns {Object} domain -> count
 */
function countByDomain(bookmarks) {
  const counts = {};
  for (const bm of bookmarks) {
    try {
      const url = new URL(bm.url);
      const domain = url.hostname.replace(/^www\./, '');
      counts[domain] = (counts[domain] || 0) + 1;
    } catch {
      counts['(invalid)'] = (counts['(invalid)'] || 0) + 1;
    }
  }
  return counts;
}

/**
 * Count bookmarks per tag
 * @param {Array} bookmarks
 * @returns {Object} tag -> count
 */
function countByTag(bookmarks) {
  const counts = {};
  for (const bm of bookmarks) {
    const tags = Array.isArray(bm.tags) ? bm.tags : [];
    for (const tag of tags) {
      counts[tag] = (counts[tag] || 0) + 1;
    }
  }
  return counts;
}

/**
 * Get bookmarks added in the last N days
 * @param {Array} bookmarks
 * @param {number} days
 * @returns {Array}
 */
function recentBookmarks(bookmarks, days = 7) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return bookmarks.filter(bm => {
    if (!bm.createdAt) return false;
    return new Date(bm.createdAt).getTime() >= cutoff;
  });
}

/**
 * Summarize bookmark collection
 * @param {Array} bookmarks
 * @returns {Object}
 */
function getSummary(bookmarks) {
  const domainCounts = countByDomain(bookmarks);
  const tagCounts = countByTag(bookmarks);
  const topDomains = Object.entries(domainCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const withNotes = bookmarks.filter(bm => bm.note && bm.note.trim().length > 0).length;
  const withTags = bookmarks.filter(bm => Array.isArray(bm.tags) && bm.tags.length > 0).length;

  return {
    total: bookmarks.length,
    withTags,
    withNotes,
    uniqueDomains: Object.keys(domainCounts).length,
    uniqueTags: Object.keys(tagCounts).length,
    topDomains,
    topTags,
    recentCount: recentBookmarks(bookmarks, 7).length
  };
}

module.exports = { countByDomain, countByTag, recentBookmarks, getSummary };
