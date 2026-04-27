// history.js — track recently visited/opened bookmarks

const MAX_HISTORY = 50;

function getHistory(bookmarks) {
  return bookmarks
    .filter(b => b.history && b.history.length > 0)
    .sort((a, b) => {
      const aLast = a.history[a.history.length - 1];
      const bLast = b.history[b.history.length - 1];
      return new Date(bLast) - new Date(aLast);
    });
}

function recordVisit(bookmarks, url) {
  const bm = bookmarks.find(b => b.url === url);
  if (!bm) throw new Error(`Bookmark not found: ${url}`);

  if (!Array.isArray(bm.history)) bm.history = [];

  bm.history.push(new Date().toISOString());

  if (bm.history.length > MAX_HISTORY) {
    bm.history = bm.history.slice(bm.history.length - MAX_HISTORY);
  }

  return bookmarks;
}

function clearHistory(bookmarks, url) {
  const bm = bookmarks.find(b => b.url === url);
  if (!bm) throw new Error(`Bookmark not found: ${url}`);
  bm.history = [];
  return bookmarks;
}

function visitCount(bookmark) {
  if (!Array.isArray(bookmark.history)) return 0;
  return bookmark.history.length;
}

function lastVisited(bookmark) {
  if (!Array.isArray(bookmark.history) || bookmark.history.length === 0) return null;
  return bookmark.history[bookmark.history.length - 1];
}

module.exports = { getHistory, recordVisit, clearHistory, visitCount, lastVisited };
