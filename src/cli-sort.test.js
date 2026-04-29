const { register } = require('./cli-sort');
const { loadBookmarks } = require('./storage');

jest.mock('./storage');

function makeBookmarks() {
  return [
    { url: 'https://zebra.com/', title: 'Zebra', createdAt: '2024-01-01T00:00:00Z', tags: ['z'] },
    { url: 'https://alpha.io/', title: 'Alpha', createdAt: '2024-06-01T00:00:00Z', tags: [] },
    { url: 'https://middle.net/', title: 'Middle', createdAt: '2024-03-15T00:00:00Z', tags: ['m'] },
  ];
}

function makeProgram() {
  const { Command } = require('commander');
  const prog = new Command();
  prog.exitOverride();
  register(prog);
  return prog;
}

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  console.log.mockRestore();
  console.error.mockRestore();
});

describe('cli-sort', () => {
  test('lists sort fields with --fields flag', async () => {
    const prog = makeProgram();
    await prog.parseAsync(['node', 'snap', 'sort', '--fields']);
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Available sort fields:'));
  });

  test('sorts by title asc by default direction override', async () => {
    loadBookmarks.mockResolvedValue(makeBookmarks());
    const prog = makeProgram();
    await prog.parseAsync(['node', 'snap', 'sort', '--field', 'title', '--dir', 'asc']);
    const calls = console.log.mock.calls.map(c => c[0]);
    const titleLine = calls.find(c => c && c.includes('1.'));
    expect(titleLine).toContain('Alpha');
  });

  test('shows message when no bookmarks', async () => {
    loadBookmarks.mockResolvedValue([]);
    const prog = makeProgram();
    await prog.parseAsync(['node', 'snap', 'sort']);
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No bookmarks found'));
  });

  test('shows error on invalid field', async () => {
    loadBookmarks.mockResolvedValue(makeBookmarks());
    const prog = makeProgram();
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
    await expect(prog.parseAsync(['node', 'snap', 'sort', '--field', 'banana'])).rejects.toThrow();
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Invalid sort field'));
    mockExit.mockRestore();
  });

  test('shows error when storage fails', async () => {
    loadBookmarks.mockRejectedValue(new Error('disk error'));
    const prog = makeProgram();
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
    await expect(prog.parseAsync(['node', 'snap', 'sort'])).rejects.toThrow();
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Failed to load bookmarks'), 'disk error');
    mockExit.mockRestore();
  });
});
