// reading-list.js — manage a "read later" queue for bookmarks

function getReadingList(bookmarks) {
  return bookmarks.filter(b => b.readLater === true);
}

function addToReadingList(bookmarks, url) {
  const idx = bookmarks.findIndex(b => b.url === url);
  if (idx === -1) throw new Error(`Bookmark not found: ${url}`);
  if (bookmarks[idx].readLater) return bookmarks;
  const updated = [...bookmarks];
  updated[idx] = { ...updated[idx], readLater: true, readLaterAddedAt: new Date().toISOString() };
  return updated;
}

function removeFromReadingList(bookmarks, url) {
  const idx = bookmarks.findIndex(b => b.url === url);
  if (idx === -1) throw new Error(`Bookmark not found: ${url}`);
  if (!bookmarks[idx].readLater) return bookmarks;
  const updated = [...bookmarks];
  const { readLater, readLaterAddedAt, ...rest } = updated[idx];
  updated[idx] = rest;
  return updated;
}

function markAsRead(bookmarks, url) {
  const idx = bookmarks.findIndex(b => b.url === url);
  if (idx === -1) throw new Error(`Bookmark not found: ${url}`);
  const updated = [...bookmarks];
  updated[idx] = {
    ...updated[idx],
    readLater: false,
    readAt: new Date().toISOString()
  };
  const { readLater, readLaterAddedAt, ...rest } = updated[idx];
  updated[idx] = { ...rest, readAt: updated[idx].readAt };
  return updated;
}

function isInReadingList(bookmarks, url) {
  const bm = bookmarks.find(b => b.url === url);
  return bm ? bm.readLater === true : false;
}

module.exports = { getReadingList, addToReadingList, removeFromReadingList, markAsRead, isInReadingList };
