#!/usr/bin/env node
'use strict';

const { archiveBookmark, unarchiveBookmark, listArchived, listActive } = require('./archive');

const [,, command, ...args] = process.argv;

async function main() {
  switch (command) {
    case 'archive': {
      const url = args[0];
      if (!url) { console.error('Usage: cli-archive archive <url>'); process.exit(1); }
      const bm = await archiveBookmark(url);
      console.log(`Archived: ${bm.url} (at ${bm.archivedAt})`);
      break;
    }
    case 'unarchive': {
      const url = args[0];
      if (!url) { console.error('Usage: cli-archive unarchive <url>'); process.exit(1); }
      const bm = await unarchiveBookmark(url);
      console.log(`Unarchived: ${bm.url}`);
      break;
    }
    case 'list-archived': {
      const bms = await listArchived();
      if (bms.length === 0) { console.log('No archived bookmarks.'); break; }
      bms.forEach(b => console.log(`[archived ${b.archivedAt || '?'}] ${b.url} — ${b.title || ''}`.trim()));
      break;
    }
    case 'list-active': {
      const bms = await listActive();
      if (bms.length === 0) { console.log('No active bookmarks.'); break; }
      bms.forEach(b => console.log(`${b.url} — ${b.title || ''}`.trim()));
      break;
    }
    default:
      console.log('Commands: archive <url> | unarchive <url> | list-archived | list-active');
      process.exit(0);
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
