import { loadBookmarks, saveBookmarks } from './storage.js';
import {
  addToReadingList,
  removeFromReadingList,
  markAsRead,
  getReadingList,
} from './reading-list.js';

export function register(program) {
  const rl = program
    .command('reading-list')
    .description('Manage your reading list');

  rl.command('add <id>')
    .description('Add a bookmark to the reading list')
    .action(async (id) => {
      const bookmarks = await loadBookmarks();
      const updated = addToReadingList(bookmarks, id);
      if (!updated) {
        console.error(`Bookmark ${id} not found.`);
        process.exitCode = 1;
        return;
      }
      await saveBookmarks(updated);
      console.log(`Added bookmark ${id} to reading list.`);
    });

  rl.command('remove <id>')
    .description('Remove a bookmark from the reading list')
    .action(async (id) => {
      const bookmarks = await loadBookmarks();
      const updated = removeFromReadingList(bookmarks, id);
      if (!updated) {
        console.error(`Bookmark ${id} not found.`);
        process.exitCode = 1;
        return;
      }
      await saveBookmarks(updated);
      console.log(`Removed bookmark ${id} from reading list.`);
    });

  rl.command('read <id>')
    .description('Mark a reading list bookmark as read')
    .action(async (id) => {
      const bookmarks = await loadBookmarks();
      const updated = markAsRead(bookmarks, id);
      if (!updated) {
        console.error(`Bookmark ${id} not found.`);
        process.exitCode = 1;
        return;
      }
      await saveBookmarks(updated);
      console.log(`Marked bookmark ${id} as read.`);
    });

  rl.command('list')
    .description('List all bookmarks in the reading list')
    .option('--unread', 'Show only unread items')
    .action(async (opts) => {
      const bookmarks = await loadBookmarks();
      let items = getReadingList(bookmarks);
      if (opts.unread) {
        items = items.filter((b) => !b.readAt);
      }
      if (items.length === 0) {
        console.log('No bookmarks in reading list.');
        return;
      }
      items.forEach((b) => {
        const readStatus = b.readAt ? `[read ${b.readAt}]` : '[unread]';
        console.log(`${b.id}  ${readStatus}  ${b.title || b.url}  <${b.url}>`);
      });
    });
}
