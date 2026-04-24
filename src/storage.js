const fs = require('fs');
const path = require('path');
const os = require('os');

const DEFAULT_STORE_DIR = path.join(os.homedir(), '.snapmark');
const BOOKMARKS_FILE = 'bookmarks.json';

function getStorePath(storeDir = DEFAULT_STORE_DIR) {
  return path.join(storeDir, BOOKMARKS_FILE);
}

function ensureStoreDir(storeDir = DEFAULT_STORE_DIR) {
  if (!fs.existsSync(storeDir)) {
    fs.mkdirSync(storeDir, { recursive: true });
  }
}

function loadBookmarks(storeDir = DEFAULT_STORE_DIR) {
  const filePath = getStorePath(storeDir);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    throw new Error(`Failed to parse bookmarks file: ${err.message}`);
  }
}

function saveBookmarks(bookmarks, storeDir = DEFAULT_STORE_DIR) {
  ensureStoreDir(storeDir);
  const filePath = getStorePath(storeDir);
  fs.writeFileSync(filePath, JSON.stringify(bookmarks, null, 2), 'utf-8');
}

module.exports = {
  DEFAULT_STORE_DIR,
  BOOKMARKS_FILE,
  getStorePath,
  loadBookmarks,
  saveBookmarks,
};
