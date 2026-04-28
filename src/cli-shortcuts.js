import { loadBookmarks, saveBookmarks } from './storage.js';
import {
  getShortcuts,
  setShortcut,
  clearShortcut,
  resolveShortcut,
  isValidAlias,
} from './shortcuts.js';

export function register(program) {
  const cmd = program.command('shortcut').description('Manage URL shortcuts / aliases');

  cmd
    .command('set <alias> <id>')
    .description('Assign an alias to a bookmark by id')
    .action(async (alias, id) => {
      if (!isValidAlias(alias)) {
        console.error(`Invalid alias "${alias}". Use only lowercase letters, numbers, _ or -.`);
        process.exitCode = 1;
        return;
      }
      const bookmarks = await loadBookmarks();
      const target = bookmarks.find((b) => b.id === id);
      if (!target) {
        console.error(`No bookmark found with id "${id}".`);
        process.exitCode = 1;
        return;
      }
      const updated = setShortcut(bookmarks, alias, id);
      await saveBookmarks(updated);
      console.log(`Shortcut "${alias}" -> ${target.url}`);
    });

  cmd
    .command('list')
    .description('List all shortcuts')
    .action(async () => {
      const bookmarks = await loadBookmarks();
      const shortcuts = getShortcuts(bookmarks);
      const entries = Object.entries(shortcuts);
      if (entries.length === 0) {
        console.log('No shortcuts defined.');
        return;
      }
      for (const [alias, id] of entries) {
        const bm = bookmarks.find((b) => b.id === id);
        const url = bm ? bm.url : '(bookmark not found)';
        console.log(`  ${alias.padEnd(16)} ${url}`);
      }
    });

  cmd
    .command('clear <alias>')
    .description('Remove a shortcut alias')
    .action(async (alias) => {
      const bookmarks = await loadBookmarks();
      const shortcuts = getShortcuts(bookmarks);
      if (!(alias in shortcuts)) {
        console.error(`Shortcut "${alias}" not found.`);
        process.exitCode = 1;
        return;
      }
      const updated = clearShortcut(bookmarks, alias);
      await saveBookmarks(updated);
      console.log(`Shortcut "${alias}" removed.`);
    });

  cmd
    .command('go <alias>')
    .description('Print the URL for a shortcut')
    .action(async (alias) => {
      const bookmarks = await loadBookmarks();
      const bm = resolveShortcut(bookmarks, alias);
      if (!bm) {
        console.error(`Shortcut "${alias}" not found.`);
        process.exitCode = 1;
        return;
      }
      console.log(bm.url);
    });
}
