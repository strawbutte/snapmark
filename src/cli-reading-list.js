// cli-reading-list.js — CLI commands for the reading list feature
const { loadBookmarks, saveBookmarks } = require('./storage');
const { getReadingList, addToReadingList, removeFromReadingList, markAsRead } = require('./reading-list');

async function cmdAdd(url) {
  let bms = await loadBookmarks();
  bms = addToReadingList(bms, url);
  await saveBookmarks(bms);
  console.log(`Added to reading list: ${url}`);
}

async function cmdRemove(url) {
  let bms = await loadBookmarks();
  bms = removeFromReadingList(bms, url);
  await saveBookmarks(bms);
  console.log(`Removed from reading list: ${url}`);
}

async function cmdRead(url) {
  let bms = await loadBookmarks();
  bms = markAsRead(bms, url);
  await saveBookmarks(bms);
  console.log(`Marked as read: ${url}`);
}

async function cmdList() {
  const bms = await loadBookmarks();
  const list = getReadingList(bms);
  if (list.length === 0) {
    console.log('Reading list is empty.');
    return;
  }
  list.forEach((b, i) => {
    const added = b.readLaterAddedAt ? ` (added ${b.readLaterAddedAt.slice(0, 10)})` : '';
    console.log(`${i + 1}. ${b.title || b.url}${added}\n   ${b.url}`);
  });
}

function register(program) {
  const rl = program.command('readlater').description('Manage your reading list');

  rl.command('add <url>')
    .description('Add a bookmark to the reading list')
    .action(url => cmdAdd(url).catch(e => { console.error(e.message); process.exit(1); }));

  rl.command('remove <url>')
    .description('Remove a bookmark from the reading list')
    .action(url => cmdRemove(url).catch(e => { console.error(e.message); process.exit(1); }));

  rl.command('done <url>')
    .description('Mark a bookmark as read')
    .action(url => cmdRead(url).catch(e => { console.error(e.message); process.exit(1); }));

  rl.command('list')
    .description('Show all bookmarks in the reading list')
    .action(() => cmdList().catch(e => { console.error(e.message); process.exit(1); }));
}

module.exports = { register, cmdAdd, cmdRemove, cmdRead, cmdList };
