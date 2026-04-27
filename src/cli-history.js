// cli-history.js — CLI commands for bookmark visit history

const { loadBookmarks, saveBookmarks } = require('./storage');
const { getHistory, recordVisit, clearHistory, visitCount, lastVisited } = require('./history');

function register(program) {
  const hist = program.command('history').description('Manage bookmark visit history');

  hist
    .command('log')
    .description('Show recently visited bookmarks')
    .option('-n, --limit <n>', 'Max entries to show', '20')
    .action(async (opts) => {
      const bms = await loadBookmarks();
      const limit = parseInt(opts.limit, 10);
      const recent = getHistory(bms).slice(0, limit);
      if (recent.length === 0) {
        console.log('No visit history found.');
        return;
      }
      recent.forEach(b => {
        const last = lastVisited(b);
        const count = visitCount(b);
        console.log(`[${count} visit(s)] ${b.title || b.url}`);
        console.log(`  URL:  ${b.url}`);
        console.log(`  Last: ${last}`);
      });
    });

  hist
    .command('visit <url>')
    .description('Record a visit to a bookmark')
    .action(async (url) => {
      const bms = await loadBookmarks();
      try {
        const updated = recordVisit(bms, url);
        await saveBookmarks(updated);
        console.log(`Recorded visit to: ${url}`);
      } catch (e) {
        console.error(e.message);
        process.exit(1);
      }
    });

  hist
    .command('clear <url>')
    .description('Clear visit history for a bookmark')
    .action(async (url) => {
      const bms = await loadBookmarks();
      try {
        const updated = clearHistory(bms, url);
        await saveBookmarks(updated);
        console.log(`Cleared history for: ${url}`);
      } catch (e) {
        console.error(e.message);
        process.exit(1);
      }
    });
}

module.exports = { register };
