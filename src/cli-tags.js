/**
 * CLI command handlers for tag operations
 */
const { loadBookmarks, saveBookmarks } = require('./storage');
const { addTag, removeTag, listTags, filterByTag } = require('./tags');

async function cmdAddTag(url, tag) {
  const bookmarks = await loadBookmarks();
  try {
    addTag(bookmarks, url, tag);
    await saveBookmarks(bookmarks);
    console.log(`Tag "${tag}" added to ${url}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exitCode = 1;
  }
}

async function cmdRemoveTag(url, tag) {
  const bookmarks = await loadBookmarks();
  try {
    removeTag(bookmarks, url, tag);
    await saveBookmarks(bookmarks);
    console.log(`Tag "${tag}" removed from ${url}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exitCode = 1;
  }
}

async function cmdListTags() {
  const bookmarks = await loadBookmarks();
  const tags = listTags(bookmarks);
  if (tags.length === 0) {
    console.log('No tags found.');
    return;
  }
  console.log('All tags:');
  tags.forEach(t => console.log(`  #${t}`));
}

async function cmdFilterByTag(tag) {
  const bookmarks = await loadBookmarks();
  const results = filterByTag(bookmarks, tag);
  if (results.length === 0) {
    console.log(`No bookmarks tagged "${tag}".`);
    return;
  }
  console.log(`Bookmarks tagged "${tag}":`);
  results.forEach(b => {
    const tagList = (b.tags || []).join(', ');
    console.log(`  [${b.title}] ${b.url}  tags: ${tagList}`);
  });
}

module.exports = { cmdAddTag, cmdRemoveTag, cmdListTags, cmdFilterByTag };
