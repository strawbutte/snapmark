#!/usr/bin/env node
// cli-labels.js — CLI interface for bookmark color labels

const { loadBookmarks, saveBookmarks } = require('./storage');
const { setLabel, clearLabel, getLabel, filterByLabel, listLabels, VALID_LABELS } = require('./labels');

async function handleLabels(argv) {
  const [subcommand, ...args] = argv;

  switch (subcommand) {
    case 'set': {
      const [url, label] = args;
      if (!url || !label) {
        console.error('Usage: snapmark label set <url> <label>');
        process.exit(1);
      }
      const bms = await loadBookmarks();
      setLabel(bms, url, label);
      await saveBookmarks(bms);
      console.log(`Label '${label}' set on ${url}`);
      break;
    }
    case 'clear': {
      const [url] = args;
      if (!url) {
        console.error('Usage: snapmark label clear <url>');
        process.exit(1);
      }
      const bms = await loadBookmarks();
      clearLabel(bms, url);
      await saveBookmarks(bms);
      console.log(`Label cleared from ${url}`);
      break;
    }
    case 'get': {
      const [url] = args;
      if (!url) {
        console.error('Usage: snapmark label get <url>');
        process.exit(1);
      }
      const bms = await loadBookmarks();
      const label = getLabel(bms, url);
      console.log(label ? `Label: ${label}` : 'No label set');
      break;
    }
    case 'filter': {
      const [label] = args;
      if (!label) {
        console.error('Usage: snapmark label filter <label>');
        process.exit(1);
      }
      const bms = await loadBookmarks();
      const results = filterByLabel(bms, label);
      if (results.length === 0) {
        console.log('No bookmarks with that label.');
      } else {
        results.forEach(b => console.log(`[${b.label}] ${b.title} — ${b.url}`));
      }
      break;
    }
    case 'list': {
      const bms = await loadBookmarks();
      const counts = listLabels(bms);
      if (Object.keys(counts).length === 0) {
        console.log('No labels in use.');
      } else {
        for (const [label, count] of Object.entries(counts)) {
          console.log(`  ${label}: ${count}`);
        }
      }
      break;
    }
    default:
      console.log(`Available label commands: set, clear, get, filter, list`);
      console.log(`Valid labels: ${VALID_LABELS.join(', ')}`);
  }
}

module.exports = { handleLabels };
