import { Command } from 'commander';
import { loadBookmarks, saveBookmarks } from './storage.js';
import { bulkTag, bulkUntag, bulkDelete, bulkExport } from './bulk.js';

export function register(program) {
  const bulk = program.command('bulk').description('bulk operations on bookmarks');

  bulk
    .command('tag <tag> [urls...]')
    .description('add a tag to multiple bookmarks by URL')
    .option('--all', 'apply to all bookmarks')
    .action(async (tag, urls, opts) => {
      const bookmarks = await loadBookmarks();
      const targets = opts.all ? bookmarks.map(b => b.url) : urls;
      if (!targets.length) return console.error('No URLs specified.');
      const updated = bulkTag(bookmarks, targets, tag);
      await saveBookmarks(updated);
      console.log(`Tagged ${targets.length} bookmark(s) with "${tag}".`);
    });

  bulk
    .command('untag <tag> [urls...]')
    .description('remove a tag from multiple bookmarks')
    .option('--all', 'apply to all bookmarks')
    .action(async (tag, urls, opts) => {
      const bookmarks = await loadBookmarks();
      const targets = opts.all ? bookmarks.map(b => b.url) : urls;
      if (!targets.length) return console.error('No URLs specified.');
      const updated = bulkUntag(bookmarks, targets, tag);
      await saveBookmarks(updated);
      console.log(`Removed tag "${tag}" from ${targets.length} bookmark(s).`);
    });

  bulk
    .command('delete [urls...]')
    .description('delete multiple bookmarks by URL')
    .option('--all', 'delete all bookmarks')
    .action(async (urls, opts) => {
      const bookmarks = await loadBookmarks();
      const targets = opts.all ? bookmarks.map(b => b.url) : urls;
      if (!targets.length) return console.error('No URLs specified.');
      const { remaining, removed } = bulkDelete(bookmarks, targets);
      await saveBookmarks(remaining);
      console.log(`Deleted ${removed} bookmark(s).`);
    });

  bulk
    .command('list-urls')
    .description('print all bookmark URLs (useful for piping into bulk commands)')
    .action(async () => {
      const bookmarks = await loadBookmarks();
      bookmarks.forEach(b => console.log(b.url));
    });
}
