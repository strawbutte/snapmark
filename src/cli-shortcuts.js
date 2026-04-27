// cli-shortcuts.js — CLI commands for bookmark shortcut aliases

import { loadBookmarks, saveBookmarks } from './storage.js';
import { setShortcut, clearShortcut, resolveShortcut, getShortcuts } from './shortcuts.js';

export function register(program) {
  const sc = program.command('shortcut').description('Manage bookmark shortcut aliases');

  sc.command('set <url> <alias>')
    .description('Assign a shortcut alias to a bookmark URL')
    .action(async (url, alias) => {
      try {
        const bookmarks = await loadBookmarks();
        const updated = setShortcut(bookmarks, url, alias);
        await saveBookmarks(updated);
        console.log(`Shortcut "${alias}" -> ${url}`);
      } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
      }
    });

  sc.command('clear <url>')
    .description('Remove the shortcut alias from a bookmark')
    .action(async (url) => {
      try {
        const bookmarks = await loadBookmarks();
        const updated = clearShortcut(bookmarks, url);
        await saveBookmarks(updated);
        console.log(`Cleared shortcut for ${url}`);
      } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
      }
    });

  sc.command('go <alias>')
    .description('Resolve a shortcut alias to its URL')
    .action(async (alias) => {
      const bookmarks = await loadBookmarks();
      const url = resolveShortcut(bookmarks, alias);
      if (!url) {
        console.error(`No bookmark found for alias "${alias}"`);
        process.exit(1);
      }
      console.log(url);
    });

  sc.command('list')
    .description('List all shortcut aliases')
    .action(async () => {
      const bookmarks = await loadBookmarks();
      const map = getShortcuts(bookmarks);
      const entries = Object.entries(map);
      if (entries.length === 0) {
        console.log('No shortcuts defined.');
        return;
      }
      for (const [alias, url] of entries) {
        console.log(`${alias.padEnd(20)} ${url}`);
      }
    });
}
