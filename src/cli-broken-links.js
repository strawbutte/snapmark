const { loadBookmarks, saveBookmarks } = require('./storage');
const { checkBrokenLinks, getBrokenResults } = require('./broken-links');
const { applyLinkCheck } = require('./broken-links.schema');

/**
 * Register the broken-links command on a Commander program.
 * @param {import('commander').Command} program
 */
function register(program) {
  program
    .command('check-links')
    .description('Check all bookmarks for broken URLs')
    .option('--concurrency <n>', 'number of parallel checks', '5')
    .option('--timeout <ms>', 'request timeout in ms', '5000')
    .option('--broken-only', 'only show broken links', false)
    .option('--save', 'save check results back to bookmarks store', false)
    .action(async (opts) => {
      const bookmarks = await loadBookmarks();
      if (!bookmarks.length) {
        console.log('No bookmarks to check.');
        return;
      }

      const concurrency = parseInt(opts.concurrency, 10);
      const timeoutMs = parseInt(opts.timeout, 10);

      console.log(`Checking ${bookmarks.length} bookmark(s)...`);
      const results = await checkBrokenLinks(bookmarks, { concurrency, timeoutMs });

      const toShow = opts.brokenOnly ? getBrokenResults(results) : results;

      if (!toShow.length) {
        console.log('All links are OK!');
      } else {
        for (const { bookmark, result } of toShow) {
          const status = result.ok
            ? `\x1b[32mOK (${result.status})\x1b[0m`
            : `\x1b[31mBROKEN${result.status ? ` (${result.status})` : ''} — ${result.error || ''}\x1b[0m`;
          console.log(`  ${status}  ${bookmark.url}  ${bookmark.title || ''}`);
        }
      }

      if (opts.save) {
        const updated = bookmarks.map((bm) => {
          const found = results.find((r) => r.bookmark.id === bm.id);
          return found ? applyLinkCheck(bm, found.result) : bm;
        });
        await saveBookmarks(updated);
        console.log('Check results saved.');
      }

      const broken = getBrokenResults(results);
      if (broken.length) {
        console.log(`\n${broken.length} broken link(s) found.`);
        process.exitCode = 1;
      }
    });
}

module.exports = { register };
