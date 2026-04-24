const { syncPull, syncPush, initRepo, getLastCommit, isGitRepo } = require('./git');
const { getStorePath } = require('./storage');

async function cmdInit(remoteUrl) {
  try {
    const storePath = initRepo(remoteUrl);
    console.log(`✓ Initialized snapmark repo at ${storePath}`);
    if (remoteUrl) {
      console.log(`✓ Remote set to ${remoteUrl}`);
    } else {
      console.log('  No remote set. Add one later with: git remote add origin <url>');
    }
  } catch (err) {
    console.error('✗ Init failed:', err.message);
    process.exit(1);
  }
}

async function cmdPull() {
  try {
    console.log('Pulling latest bookmarks...');
    syncPull();
    console.log('✓ Bookmarks up to date');
    const last = getLastCommit();
    if (last) console.log('  Last commit:', last);
  } catch (err) {
    console.error('✗ Pull failed:', err.message);
    process.exit(1);
  }
}

async function cmdPush(message) {
  try {
    console.log('Pushing bookmarks...');
    const pushed = syncPush(message || 'sync bookmarks');
    if (pushed) {
      console.log('✓ Bookmarks pushed successfully');
    } else {
      console.log('  Nothing to push — bookmarks are already in sync');
    }
  } catch (err) {
    console.error('✗ Push failed:', err.message);
    process.exit(1);
  }
}

async function cmdStatus() {
  const storePath = getStorePath();
  const repoReady = isGitRepo(storePath);
  console.log('Snapmark sync status:');
  console.log('  Store path:', storePath);
  console.log('  Git repo:  ', repoReady ? '✓ yes' : '✗ no (run snapmark init)');
  if (repoReady) {
    const last = getLastCommit();
    console.log('  Last sync: ', last || 'no commits yet');
  }
}

module.exports = { cmdInit, cmdPull, cmdPush, cmdStatus };
