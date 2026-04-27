const fs = require('fs');
const path = require('path');
const os = require('os');

jest.mock('./storage');
const { loadBookmarks, saveBookmarks } = require('./storage');

// redirect snapshot dir to a temp location
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'snapmark-snap-'));
jest.mock('os', () => ({ ...jest.requireActual('os'), homedir: () => tmpDir }));

const {
  isValidSnapshotName,
  createSnapshot,
  restoreSnapshot,
  listSnapshots,
  deleteSnapshot
} = require('./snapshots');

const sampleBookmarks = [
  { id: '1', url: 'https://example.com', title: 'Example', tags: [], createdAt: '2024-01-01T00:00:00.000Z' },
  { id: '2', url: 'https://github.com', title: 'GitHub', tags: [], createdAt: '2024-01-02T00:00:00.000Z' }
];

beforeEach(() => {
  jest.clearAllMocks();
  loadBookmarks.mockReturnValue(sampleBookmarks);
});

afterAll(() => fs.rmSync(tmpDir, { recursive: true, force: true }));

describe('isValidSnapshotName', () => {
  it('accepts alphanumeric and dashes/underscores', () => {
    expect(isValidSnapshotName('my-snap_1')).toBe(true);
  });
  it('rejects empty string', () => expect(isValidSnapshotName('')).toBe(false));
  it('rejects spaces', () => expect(isValidSnapshotName('bad name')).toBe(false));
  it('rejects names over 64 chars', () => expect(isValidSnapshotName('a'.repeat(65))).toBe(false));
});

describe('createSnapshot', () => {
  it('saves a snapshot file with bookmarks', () => {
    const snap = createSnapshot('test-snap');
    expect(snap.name).toBe('test-snap');
    expect(snap.bookmarks).toEqual(sampleBookmarks);
    expect(snap.createdAt).toBeDefined();
  });
  it('throws on invalid name', () => {
    expect(() => createSnapshot('bad name!')).toThrow('Invalid snapshot name');
  });
});

describe('listSnapshots', () => {
  it('returns created snapshots with metadata', () => {
    createSnapshot('snap-a');
    createSnapshot('snap-b');
    const list = listSnapshots();
    expect(list.length).toBeGreaterThanOrEqual(2);
    expect(list[0]).toHaveProperty('name');
    expect(list[0]).toHaveProperty('count', 2);
  });
});

describe('restoreSnapshot', () => {
  it('restores bookmarks from snapshot', () => {
    createSnapshot('restore-me');
    restoreSnapshot('restore-me');
    expect(saveBookmarks).toHaveBeenCalledWith(sampleBookmarks);
  });
  it('throws if snapshot does not exist', () => {
    expect(() => restoreSnapshot('ghost')).toThrow('Snapshot not found');
  });
});

describe('deleteSnapshot', () => {
  it('deletes an existing snapshot', () => {
    createSnapshot('to-delete');
    expect(deleteSnapshot('to-delete')).toBe(true);
    expect(() => restoreSnapshot('to-delete')).toThrow();
  });
  it('throws if snapshot does not exist', () => {
    expect(() => deleteSnapshot('nope')).toThrow('Snapshot not found');
  });
});
