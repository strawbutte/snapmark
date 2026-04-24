const { loadBookmarks, saveBookmarks } = require('./storage');
const { v4: uuidv4 } = require('uuid');

function addBookmark(url, { title = '', tags = [], storeDir } = {}) {
  if (!url || typeof url !== 'string') {
    throw new Error('A valid URL is required.');
  }
  const bookmarks = loadBookmarks(storeDir);
  const existing = bookmarks.find((b) => b.url === url);
  if (existing) {
    throw new Error(`Bookmark already exists: ${url}`);
  }
  const bookmark = {
    id: uuidv4(),
    url,
    title: title || url,
    tags: Array.isArray(tags) ? tags : [],
    createdAt: new Date().toISOString(),
  };
  bookmarks.push(bookmark);
  saveBookmarks(bookmarks, storeDir);
  return bookmark;
}

function removeBookmark(id, { storeDir } = {}) {
  const bookmarks = loadBookmarks(storeDir);
  const index = bookmarks.findIndex((b) => b.id === id);
  if (index === -1) {
    throw new Error(`Bookmark not found: ${id}`);
  }
  const [removed] = bookmarks.splice(index, 1);
  saveBookmarks(bookmarks, storeDir);
  return removed;
}

function listBookmarks({ tags = [], storeDir } = {}) {
  const bookmarks = loadBookmarks(storeDir);
  if (!tags.length) return bookmarks;
  return bookmarks.filter((b) =>
    tags.every((tag) => b.tags.includes(tag))
  );
}

function searchBookmarks(query, { storeDir } = {}) {
  if (!query) return [];
  const lower = query.toLowerCase();
  const bookmarks = loadBookmarks(storeDir);
  return bookmarks.filter(
    (b) =>
      b.url.toLowerCase().includes(lower) ||
      b.title.toLowerCase().includes(lower) ||
      b.tags.some((t) => t.toLowerCase().includes(lower))
  );
}

module.exports = { addBookmark, removeBookmark, listBookmarks, searchBookmarks };
