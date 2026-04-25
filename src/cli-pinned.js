#!/usr/bin/env node
'use strict';

const { loadBookmarks, saveBookmarks } = require('./storage');
const { pinBookmark, unpinBookmark, listPinned, isPinned } = require('./pinned');

async function main() {
  const [,, command, ...args] = process.argv;

  const bookmarks = await loadBookmarks();

  switch (command) {
    case 'pin': {
      const url = args[0];
      if (!url) {
        console.error('Usage: snapmark pin <url>');
        process.exit(1);
      }
      const updated = pinBookmark(bookmarks, url);
      if (!updated) {
        console.error(`No bookmark found for URL: ${url}`);
        process.exit(1);
      }
      await saveBookmarks(updated);
      console.log(`Pinned: ${url}`);
      break;
    }

    case 'unpin': {
      const url = args[0];
      if (!url) {
        console.error('Usage: snapmark unpin <url>');
        process.exit(1);
      }
      const updated = unpinBookmark(bookmarks, url);
      if (!updated) {
        console.error(`No bookmark found for URL: ${url}`);
        process.exit(1);
      }
      await saveBookmarks(updated);
      console.log(`Unpinned: ${url}`);
      break;
    }

    case 'list': {
      const pinned = listPinned(bookmarks);
      if (pinned.length === 0) {
        console.log('No pinned bookmarks.');
      } else {
        pinned.forEach(b => {
          console.log(`[pinned] ${b.title || '(no title)'} — ${b.url}`);
        });
      }
      break;
    }

    case 'check': {
      const url = args[0];
      if (!url) {
        console.error('Usage: snapmark pinned check <url>');
        process.exit(1);
      }
      const pinned = isPinned(bookmarks, url);
      console.log(`${url} is ${pinned ? '' : 'not '}pinned`);
      break;
    }

    default:
      console.log('Commands: pin <url> | unpin <url> | list | check <url>');
      process.exit(1);
  }
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
