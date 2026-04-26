// labels.js — assign color labels to bookmarks

const VALID_LABELS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'grey'];

function isValidLabel(label) {
  return VALID_LABELS.includes(label);
}

function setLabel(bookmarks, url, label) {
  if (!isValidLabel(label)) {
    throw new Error(`Invalid label '${label}'. Must be one of: ${VALID_LABELS.join(', ')}`);
  }
  const bm = bookmarks.find(b => b.url === url);
  if (!bm) throw new Error(`Bookmark not found: ${url}`);
  bm.label = label;
  return bookmarks;
}

function clearLabel(bookmarks, url) {
  const bm = bookmarks.find(b => b.url === url);
  if (!bm) throw new Error(`Bookmark not found: ${url}`);
  delete bm.label;
  return bookmarks;
}

function getLabel(bookmarks, url) {
  const bm = bookmarks.find(b => b.url === url);
  if (!bm) throw new Error(`Bookmark not found: ${url}`);
  return bm.label || null;
}

function filterByLabel(bookmarks, label) {
  if (!isValidLabel(label)) {
    throw new Error(`Invalid label '${label}'. Must be one of: ${VALID_LABELS.join(', ')}`);
  }
  return bookmarks.filter(b => b.label === label);
}

function listLabels(bookmarks) {
  const counts = {};
  for (const bm of bookmarks) {
    if (bm.label) {
      counts[bm.label] = (counts[bm.label] || 0) + 1;
    }
  }
  return counts;
}

module.exports = { VALID_LABELS, isValidLabel, setLabel, clearLabel, getLabel, filterByLabel, listLabels };
