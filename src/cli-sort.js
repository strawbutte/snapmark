const { loadBookmarks } = require('./storage');
const { sortBookmarks, getSortFields } = require('./custom-sort');

function register(program) {
  program
    .command('sort')
    .description('List bookmarks sorted by a given field')
    .option('-f, --field <field>', 'Field to sort by (title, url, createdAt, visitCount, domain)', 'createdAt')
    .option('-d, --dir <direction>', 'Sort direction: asc or desc', 'desc')
    .option('--fields', 'List available sort fields')
    .action(async (opts) => {
      if (opts.fields) {
        console.log('Available sort fields:');
        getSortFields().forEach(f => console.log(`  ${f}`));
        return;
      }

      let bookmarks;
      try {
        bookmarks = await loadBookmarks();
      } catch (err) {
        console.error('Failed to load bookmarks:', err.message);
        process.exit(1);
      }

      if (!bookmarks.length) {
        console.log('No bookmarks found.');
        return;
      }

      let sorted;
      try {
        sorted = sortBookmarks(bookmarks, opts.field, opts.dir);
      } catch (err) {
        console.error(err.message);
        process.exit(1);
      }

      console.log(`Showing ${sorted.length} bookmark(s) sorted by ${opts.field} (${opts.dir}):\n`);
      sorted.forEach((b, i) => {
        const tags = b.tags && b.tags.length ? `  [${b.tags.join(', ')}]` : '';
        const domain = (() => { try { return new URL(b.url).hostname; } catch { return b.url; } })();
        console.log(`${i + 1}. ${b.title || '(no title)'}${tags}`);
        console.log(`   ${b.url}  (${domain})`);
        if (b.createdAt) console.log(`   Added: ${b.createdAt.slice(0, 10)}`);
      });
    });
}

module.exports = { register };
