#!/usr/bin/env node
'use strict';

const { loadBookmarks, saveBookmarks } = require('./storage');
const { findDuplicates, dedupeBookmarks } = require('./dedupe');

function register(program) {
  program
    .command('dedupe')
    .description('Find and remove duplicate bookmarks')
    .option('--dry-run', 'Show duplicates without removing them')
    .option('--verbose', 'Show detailed duplicate info')
    .action(async (opts) => {
      const bookmarks = await loadBookmarks();
      const groups = findDuplicates(bookmarks);

      if (groups.length === 0) {
        console.log('No duplicate bookmarks found.');
        return;
      }

      const totalDupes = groups.reduce((sum, g) => sum + g.length - 1, 0);
      console.log(`Found ${groups.length} duplicate group(s) (${totalDupes} extra bookmark(s)).`);

      if (opts.verbose) {
        groups.forEach((group, i) => {
          console.log(`\nGroup ${i + 1}:`);
          group.forEach((b, j) => {
            const marker = j === 0 ? '[keep]' : '[remove]';
            console.log(`  ${marker} ${b.url}${b.title ? ' — ' + b.title : ''}`);
          });
        });
      }

      if (opts.dryRun) {
        console.log('\nDry run — no changes saved.');
        return;
      }

      const deduped = dedupeBookmarks(bookmarks);
      await saveBookmarks(deduped);
      console.log(`Removed ${totalDupes} duplicate(s). ${deduped.length} bookmark(s) remaining.`);
    });
}

module.exports = { register };
