#!/usr/bin/env node
// cli-notes.js — CLI commands for managing bookmark notes

const { loadBookmarks, saveBookmarks } = require('./storage');
const { setNote, clearNote, getNote, listNotedBookmarks } = require('./notes');
const { validateNote } = require('./notes.schema');

async function cmdSetNote(url, note) {
  const { valid, error } = validateNote(note);
  if (!valid) {
    console.error(`Invalid note: ${error}`);
    process.exit(1);
  }
  const bookmarks = await loadBookmarks();
  try {
    const updated = setNote(bookmarks, url, note);
    await saveBookmarks(updated);
    console.log(`Note set for ${url}`);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}

async function cmdClearNote(url) {
  const bookmarks = await loadBookmarks();
  try {
    const updated = clearNote(bookmarks, url);
    await saveBookmarks(updated);
    console.log(`Note cleared for ${url}`);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}

async function cmdGetNote(url) {
  const bookmarks = await loadBookmarks();
  try {
    const note = getNote(bookmarks, url);
    if (note) {
      console.log(`Note: ${note}`);
    } else {
      console.log('No note set for this bookmark.');
    }
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}

async function cmdListNotes() {
  const bookmarks = await loadBookmarks();
  const noted = listNotedBookmarks(bookmarks);
  if (noted.length === 0) {
    console.log('No bookmarks with notes.');
    return;
  }
  noted.forEach(b => {
    console.log(`[${b.title || b.url}] ${b.url}`);
    console.log(`  Note: ${b.note}`);
    if (b.noteUpdatedAt) console.log(`  Updated: ${b.noteUpdatedAt}`);
  });
}

module.exports = { cmdSetNote, cmdClearNote, cmdGetNote, cmdListNotes };
