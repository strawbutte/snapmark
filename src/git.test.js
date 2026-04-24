const { execSync } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');

jest.mock('child_process');
jest.mock('./storage');

const { getStorePath } = require('./storage');
const { initRepo, syncPush, syncPull, getLastCommit, isGitRepo } = require('./git');

const FAKE_STORE = '/tmp/fake-snapmark';

beforeEach(() => {
  jest.clearAllMocks();
  getStorePath.mockReturnValue(FAKE_STORE);
});

describe('isGitRepo', () => {
  it('returns true when git rev-parse succeeds', () => {
    execSync.mockReturnValue('true');
    expect(isGitRepo(FAKE_STORE)).toBe(true);
  });

  it('returns false when git rev-parse throws', () => {
    execSync.mockImplementation(() => { throw new Error('not a repo'); });
    expect(isGitRepo(FAKE_STORE)).toBe(false);
  });
});

describe('initRepo', () => {
  it('throws if already a git repo', () => {
    execSync.mockReturnValue('true');
    expect(() => initRepo()).toThrow('already initialized');
  });

  it('runs git init and sets remote when url provided', () => {
    execSync
      .mockImplementationOnce(() => { throw new Error(); }) // isGitRepo check
      .mockReturnValue('');
    initRepo('https://github.com/user/bookmarks.git');
    expect(execSync).toHaveBeenCalledWith(expect.stringContaining('git init'), expect.any(Object));
    expect(execSync).toHaveBeenCalledWith(expect.stringContaining('remote add origin'), expect.any(Object));
  });
});

describe('syncPush', () => {
  it('returns false when nothing to commit', () => {
    execSync
      .mockReturnValueOnce('true') // isGitRepo
      .mockReturnValueOnce('');    // status --porcelain empty
    const result = syncPush();
    expect(result).toBe(false);
  });

  it('commits and pushes when there are changes', () => {
    execSync
      .mockReturnValueOnce('true')       // isGitRepo
      .mockReturnValueOnce('M bookmarks.json') // status
      .mockReturnValue('');              // add, commit, push
    const result = syncPush('test sync');
    expect(result).toBe(true);
    expect(execSync).toHaveBeenCalledWith(expect.stringContaining('commit -m'), expect.any(Object));
  });
});

describe('getLastCommit', () => {
  it('returns null when not a git repo', () => {
    execSync.mockImplementation(() => { throw new Error(); });
    expect(getLastCommit()).toBeNull();
  });

  it('returns commit info string on success', () => {
    execSync
      .mockReturnValueOnce('true')
      .mockReturnValueOnce('"abc1234 sync bookmarks (2 hours ago)"');
    const result = getLastCommit();
    expect(result).toContain('abc1234');
  });
});
