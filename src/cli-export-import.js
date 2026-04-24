#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { program } from 'commander';
import { loadBookmarks, saveBookmarks } from './storage.js';
import { exportBookmarks, FORMATS as EXPORT_FORMATS } from './export.js';
import { importBookmarks, mergeBookmarks, IMPORT_FORMATS } from './import.js';

program
  .command('export')
  .description('Export bookmarks to a file or stdout')
  .option('-f, --format <format>', `Output format: ${EXPORT_FORMATS.join(', ')}`, 'json')
  .option('-o, --output <file>', 'Write output to file instead of stdout')
  .option('--tag <tag>', 'Only export bookmarks with this tag')
  .action(async (opts) => {
    try {
      let bookmarks = await loadBookmarks();

      if (opts.tag) {
        bookmarks = bookmarks.filter(b => b.tags && b.tags.includes(opts.tag));
      }

      const output = exportBookmarks(bookmarks, opts.format);

      if (opts.output) {
        fs.writeFileSync(path.resolve(opts.output), output, 'utf8');
        console.log(`Exported ${bookmarks.length} bookmark(s) to ${opts.output}`);
      } else {
        process.stdout.write(output + '\n');
      }
    } catch (err) {
      console.error('Export failed:', err.message);
      process.exit(1);
    }
  });

program
  .command('import')
  .description('Import bookmarks from a file')
  .argument('<file>', 'File to import')
  .option('-f, --format <format>', `File format: ${IMPORT_FORMATS.join(', ')}`, 'json')
  .option('--dry-run', 'Preview import without saving')
  .action(async (file, opts) => {
    try {
      const filePath = path.resolve(file);
      if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        process.exit(1);
      }

      const content = fs.readFileSync(filePath, 'utf8');
      const incoming = importBookmarks(content, opts.format);
      const existing = await loadBookmarks();
      const { bookmarks, added } = mergeBookmarks(existing, incoming);

      if (opts.dryRun) {
        console.log(`Dry run: would add ${added} new bookmark(s) (${incoming.length - added} duplicate(s) skipped)`);
        return;
      }

      await saveBookmarks(bookmarks);
      console.log(`Imported ${added} new bookmark(s). ${incoming.length - added} duplicate(s) skipped.`);
    } catch (err) {
      console.error('Import failed:', err.message);
      process.exit(1);
    }
  });

program.parse();
