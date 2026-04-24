const { execSync } = require('child_process');
const path = require('path');
const { getStorePath } = require('./storage');

function runGit(args, cwd) {
  try {
    return execSync(`git ${args}`, {
      cwd,
      stdio: 'pipe',
      encoding: 'utf8'
    }).trim();
  } catch (err) {
    throw new Error(`git ${args.split(' ')[0]} failed: ${err.stderr || err.message}`);
  }
}

function isGitRepo(dir) {
  try {
    runGit('rev-parse --is-inside-work-tree', dir);
    return true;
  } catch {
    return false;
  }
}

function initRepo(remoteUrl) {
  const storePath = getStorePath();
  if (isGitRepo(storePath)) {
    throw new Error('Repo already initialized at ' + storePath);
  }
  runGit('init', storePath);
  if (remoteUrl) {
    runGit(`remote add origin ${remoteUrl}`, storePath);
  }
  return storePath;
}

function syncPull() {
  const storePath = getStorePath();
  if (!isGitRepo(storePath)) throw new Error('Not a git repo. Run snapmark init first.');
  runGit('pull --rebase origin main', storePath);
}

function syncPush(message = 'sync bookmarks') {
  const storePath = getStorePath();
  if (!isGitRepo(storePath)) throw new Error('Not a git repo. Run snapmark init first.');
  const status = runGit('status --porcelain', storePath);
  if (!status) return false; // nothing to commit
  runGit('add .', storePath);
  runGit(`commit -m "${message}"`, storePath);
  runGit('push origin main', storePath);
  return true;
}

function getLastCommit() {
  const storePath = getStorePath();
  if (!isGitRepo(storePath)) return null;
  try {
    return runGit('log -1 --format="%h %s (%cr)"', storePath);
  } catch {
    return null;
  }
}

module.exports = { initRepo, syncPull, syncPush, getLastCommit, isGitRepo };
