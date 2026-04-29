const { loadBookmarks } = require('./storage');
const { scoreBookmark } = require('./search');
const { filterByTag } = require('./tags');
const { filterByLabel } = require('./labels');

function register(program) {
  program
    .command('search <query>')
    .description('Search bookmarks by relevance score')
    .option('-t, --tag <tag>', 'filter results by tag')
    .option('-l, --label <label>', 'filter results by label')
    .option('-n, --limit <n>', 'max results to show', '10')
    .option('--min-score <n>', 'minimum score threshold', '0')
    .action(async (query, opts) => {
      try {
        let bookmarks = await loadBookmarks();

        if (opts.tag) {
          bookmarks = filterByTag(bookmarks, opts.tag);
        }

        if (opts.label) {
          bookmarks = filterByLabel(bookmarks, opts.label);
        }

        const limit = parseInt(opts.limit, 10);
        const minScore = parseFloat(opts.minScore);

        const results = bookmarks
          .map(bm => ({ bm, score: scoreBookmark(bm, query) }))
          .filter(({ score }) => score > minScore)
          .sort((a, b) => b.score - a.score)
          .slice(0, limit);

        if (results.length === 0) {
          console.log('No bookmarks matched your query.');
          return;
        }

        console.log(`Found ${results.length} result(s) for "${query}":\n`);
        for (const { bm, score } of results) {
          console.log(`[${score.toFixed(2)}] ${bm.title || '(no title)'}`);
          console.log(`       ${bm.url}`);
          if (bm.tags && bm.tags.length > 0) {
            console.log(`       tags: ${bm.tags.join(', ')}`);
          }
          console.log();
        }
      } catch (err) {
        console.error('Search failed:', err.message);
        process.exit(1);
      }
    });
}

module.exports = { register };
