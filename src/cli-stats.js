#!/usr/bin/env node
'use strict';

const { loadBookmarks } = require('./storage');
const { countByDomain, countByTag, recentBookmarks, getSummary } = require('./stats');

function register(program) {
  const stats = program.command('stats').description('Show bookmark statistics');

  stats
    .command('summary')
    .description('Show overall summary')
    .action(async () => {
      const bookmarks = await loadBookmarks();
      const summary = getSummary(bookmarks);
      console.log(`Total bookmarks : ${summary.total}`);
      console.log(`Unique domains  : ${summary.uniqueDomains}`);
      console.log(`Tagged          : ${summary.tagged}`);
      console.log(`Untagged        : ${summary.untagged}`);
      console.log(`Archived        : ${summary.archived}`);
      console.log(`Pinned          : ${summary.pinned}`);
      console.log(`Favorites       : ${summary.favorites}`);
    });

  stats
    .command('domains')
    .description('Count bookmarks by domain')
    .option('-n, --top <n>', 'show top N domains', '10')
    .action(async (opts) => {
      const bookmarks = await loadBookmarks();
      const counts = countByDomain(bookmarks);
      const entries = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, parseInt(opts.top, 10));
      if (entries.length === 0) {
        console.log('No bookmarks found.');
        return;
      }
      entries.forEach(([domain, count]) => {
        console.log(`${count.toString().padStart(4)}  ${domain}`);
      });
    });

  stats
    .command('tags')
    .description('Count bookmarks by tag')
    .option('-n, --top <n>', 'show top N tags', '10')
    .action(async (opts) => {
      const bookmarks = await loadBookmarks();
      const counts = countByTag(bookmarks);
      const entries = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, parseInt(opts.top, 10));
      if (entries.length === 0) {
        console.log('No tags found.');
        return;
      }
      entries.forEach(([tag, count]) => {
        console.log(`${count.toString().padStart(4)}  ${tag}`);
      });
    });

  stats
    .command('recent')
    .description('List recently added bookmarks')
    .option('-n, --count <n>', 'number of bookmarks to show', '5')
    .action(async (opts) => {
      const bookmarks = await loadBookmarks();
      const recent = recentBookmarks(bookmarks, parseInt(opts.count, 10));
      if (recent.length === 0) {
        console.log('No bookmarks found.');
        return;
      }
      recent.forEach((b) => {
        const date = b.createdAt ? b.createdAt.slice(0, 10) : 'unknown';
        console.log(`[${date}] ${b.title || b.url}  (${b.url})`);
      });
    });
}

module.exports = { register };
