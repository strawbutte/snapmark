// collections.js — group bookmarks into named collections

const { loadBookmarks, saveBookmarks } = require('./storage');

function getCollections(bookmarks) {
  const map = {};
  for (const bm of bookmarks) {
    const col = bm.collection || null;
    if (col) {
      if (!map[col]) map[col] = [];
      map[col].push(bm);
    }
  }
  return map;
}

function addToCollection(bookmarks, url, collectionName) {
  const bm = bookmarks.find(b => b.url === url);
  if (!bm) throw new Error(`Bookmark not found: ${url}`);
  bm.collection = collectionName.trim();
  return bookmarks;
}

function removeFromCollection(bookmarks, url) {
  const bm = bookmarks.find(b => b.url === url);
  if (!bm) throw new Error(`Bookmark not found: ${url}`);
  delete bm.collection;
  return bookmarks;
}

function listCollections(bookmarks) {
  const names = new Set();
  for (const bm of bookmarks) {
    if (bm.collection) names.add(bm.collection);
  }
  return Array.from(names).sort();
}

function getBookmarksInCollection(bookmarks, collectionName) {
  return bookmarks.filter(b => b.collection === collectionName);
}

module.exports = {
  getCollections,
  addToCollection,
  removeFromCollection,
  listCollections,
  getBookmarksInCollection,
};
