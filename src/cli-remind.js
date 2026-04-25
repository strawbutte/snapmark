#!/usr/bin/env node
// CLI subcommands for bookmark reminders

const { program } = require('commander');
const { setReminder, clearReminder, getDueReminders, listReminders } = require('./remind');

program
  .command('set <url> <days>')
  .description('Set a reminder to revisit a bookmark after N days')
  .action((url, days) => {
    const n = parseInt(days, 10);
    if (isNaN(n) || n <= 0) {
      console.error('days must be a positive integer');
      process.exit(1);
    }
    try {
      const bm = setReminder(url, n);
      console.log(`Reminder set for "${bm.title || bm.url}" on ${new Date(bm.remindAt).toLocaleDateString()}`);
    } catch (e) {
      console.error(e.message);
      process.exit(1);
    }
  });

program
  .command('clear <url>')
  .description('Remove reminder from a bookmark')
  .action((url) => {
    try {
      clearReminder(url);
      console.log(`Reminder cleared for ${url}`);
    } catch (e) {
      console.error(e.message);
      process.exit(1);
    }
  });

program
  .command('due')
  .description('List bookmarks with past-due reminders')
  .action(() => {
    const due = getDueReminders();
    if (due.length === 0) {
      console.log('No reminders due.');
      return;
    }
    due.forEach(b => {
      console.log(`[DUE ${new Date(b.remindAt).toLocaleDateString()}] ${b.title || b.url}  ${b.url}`);
    });
  });

program
  .command('list')
  .description('List all upcoming reminders')
  .action(() => {
    const reminders = listReminders();
    if (reminders.length === 0) {
      console.log('No reminders set.');
      return;
    }
    reminders.forEach(b => {
      console.log(`${new Date(b.remindAt).toLocaleDateString()}  ${b.title || b.url}  ${b.url}`);
    });
  });

program.parse(process.argv);
