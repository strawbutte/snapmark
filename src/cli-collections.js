#!/usr/bin/env node
// cli-collections.js — CLI interface for collection management

const { loadBookmarks, saveBookmarks } = require('./storage');
const {
  addToCollection,
  removeFromCollection,
  listCollections,
  getBookmarksInCollection,
} = require('./collections');

const [,, cmd, ...args] = process.argv;

async function main() {
  const bookmarks = await loadBookmarks();

  if (cmd === 'add') {
    const [url, name] = args;
    if (!url || !name) {
      console.error('Usage: cli-collections add <url> <collection>');
      process.exit(1);
    }
    try {
      addToCollection(bookmarks, url, name);
      await saveBookmarks(bookmarks);
      console.log(`Added ${url} to collection "${name}"`);
    } catch (e) {
      console.error(e.message);
      process.exit(1);
    }

  } else if (cmd === 'remove') {
    const [url] = args;
    if (!url) {
      console.error('Usage: cli-collections remove <url>');
      process.exit(1);
    }
    try {
      removeFromCollection(bookmarks, url);
      await saveBookmarks(bookmarks);
      console.log(`Removed ${url} from its collection`);
    } catch (e) {
      console.error(e.message);
      process.exit(1);
    }

  } else if (cmd === 'list') {
    const names = listCollections(bookmarks);
    if (names.length === 0) {
      console.log('No collections found.');
    } else {
      console.log('Collections:');
      names.forEach(n => console.log(`  - ${n}`));
    }

  } else if (cmd === 'show') {
    const [name] = args;
    if (!name) {
      console.error('Usage: cli-collections show <collection>');
      process.exit(1);
    }
    const bms = getBookmarksInCollection(bookmarks, name);
    if (bms.length === 0) {
      console.log(`No bookmarks in collection "${name}".`);
    } else {
      console.log(`Collection: ${name}`);
      bms.forEach(b => console.log(`  [${b.title || 'untitled'}] ${b.url}`));
    }

  } else {
    console.error('Commands: add <url> <collection> | remove <url> | list | show <collection>');
    process.exit(1);
  }
}

main();
