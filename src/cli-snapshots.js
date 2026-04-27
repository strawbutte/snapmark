// cli-snapshots.js — CLI commands for bookmark snapshots

const { createSnapshot, restoreSnapshot, listSnapshots, deleteSnapshot } = require('./snapshots');

function register(program) {
  const snap = program.command('snapshot').description('manage bookmark snapshots');

  snap
    .command('create <name>')
    .description('save current bookmarks as a named snapshot')
    .action((name) => {
      try {
        const s = createSnapshot(name);
        console.log(`Snapshot "${s.name}" created (${s.bookmarks.length} bookmarks) at ${s.createdAt}`);
      } catch (e) {
        console.error(`Error: ${e.message}`);
        process.exit(1);
      }
    });

  snap
    .command('restore <name>')
    .description('restore bookmarks from a named snapshot')
    .action((name) => {
      try {
        const s = restoreSnapshot(name);
        console.log(`Restored ${s.bookmarks.length} bookmarks from snapshot "${name}"`);
      } catch (e) {
        console.error(`Error: ${e.message}`);
        process.exit(1);
      }
    });

  snap
    .command('list')
    .description('list all saved snapshots')
    .action(() => {
      const snaps = listSnapshots();
      if (snaps.length === 0) {
        console.log('No snapshots found.');
        return;
      }
      snaps.forEach(s => {
        console.log(`  ${s.name.padEnd(24)} ${s.count} bookmarks   ${s.createdAt}`);
      });
    });

  snap
    .command('delete <name>')
    .description('delete a named snapshot')
    .action((name) => {
      try {
        deleteSnapshot(name);
        console.log(`Snapshot "${name}" deleted.`);
      } catch (e) {
        console.error(`Error: ${e.message}`);
        process.exit(1);
      }
    });
}

module.exports = { register };
