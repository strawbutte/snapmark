#!/usr/bin/env node
// cli-favorites.js — CLI commands for managing favorite bookmarks

const { loadBookmarks, saveBookmarks } = require('./storage');
const { favoriteBookmark, unfavoriteBookmark, listFavorites, isFavorite } = require('./favorites');

async function cmdFavorite(url) {
  const bookmarks = await loadBookmarks();
  try {
    const updated = favoriteBookmark(bookmarks, url);
    await saveBookmarks(updated);
    console.log(`⭐ Favorited: ${url}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

async function cmdUnfavorite(url) {
  const bookmarks = await loadBookmarks();
  try {
    const updated = unfavoriteBookmark(bookmarks, url);
    await saveBookmarks(updated);
    console.log(`Removed favorite: ${url}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

async function cmdListFavorites() {
  const bookmarks = await loadBookmarks();
  const favs = listFavorites(bookmarks);
  if (favs.length === 0) {
    console.log('No favorites yet.');
    return;
  }
  favs.forEach(b => {
    const tags = b.tags && b.tags.length ? `  [${b.tags.join(', ')}]` : '';
    console.log(`⭐ ${b.title || '(no title)'}${tags}\n   ${b.url}`);
  });
}

async function cmdCheckFavorite(url) {
  const bookmarks = await loadBookmarks();
  const result = isFavorite(bookmarks, url);
  console.log(result ? `⭐ ${url} is a favorite.` : `${url} is not a favorite.`);
}

const [,, command, ...args] = process.argv;

switch (command) {
  case 'add':    cmdFavorite(args[0]); break;
  case 'remove': cmdUnfavorite(args[0]); break;
  case 'list':   cmdListFavorites(); break;
  case 'check':  cmdCheckFavorite(args[0]); break;
  default:
    console.log('Usage: cli-favorites <add|remove|list|check> [url]');
    process.exit(1);
}
