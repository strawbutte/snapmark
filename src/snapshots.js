// snapshots.js — save and restore named snapshots of your bookmark collection

const { loadBookmarks, saveBookmarks } = require('./storage');
const path = require('path');
const fs = require('fs');
const os = require('os');

function getSnapshotDir() {
  return path.join(os.homedir(), '.snapmark', 'snapshots');
}

function ensureSnapshotDir() {
  const dir = getSnapshotDir();
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function getSnapshotPath(name) {
  return path.join(getSnapshotDir(), `${name}.json`);
}

function isValidSnapshotName(name) {
  return typeof name === 'string' && /^[a-zA-Z0-9_-]{1,64}$/.test(name);
}

function createSnapshot(name) {
  if (!isValidSnapshotName(name)) throw new Error(`Invalid snapshot name: "${name}"`);
  ensureSnapshotDir();
  const bookmarks = loadBookmarks();
  const snap = { name, createdAt: new Date().toISOString(), bookmarks };
  fs.writeFileSync(getSnapshotPath(name), JSON.stringify(snap, null, 2), 'utf8');
  return snap;
}

function restoreSnapshot(name) {
  const snapPath = getSnapshotPath(name);
  if (!fs.existsSync(snapPath)) throw new Error(`Snapshot not found: "${name}"`);
  const snap = JSON.parse(fs.readFileSync(snapPath, 'utf8'));
  saveBookmarks(snap.bookmarks);
  return snap;
}

function listSnapshots() {
  ensureSnapshotDir();
  const dir = getSnapshotDir();
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      const raw = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
      return { name: raw.name, createdAt: raw.createdAt, count: raw.bookmarks.length };
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function deleteSnapshot(name) {
  const snapPath = getSnapshotPath(name);
  if (!fs.existsSync(snapPath)) throw new Error(`Snapshot not found: "${name}"`);
  fs.unlinkSync(snapPath);
  return true;
}

module.exports = { getSnapshotDir, isValidSnapshotName, createSnapshot, restoreSnapshot, listSnapshots, deleteSnapshot };
