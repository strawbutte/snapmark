const { register } = require('./cli-search');
const storage = require('./storage');
const search = require('./search');

jest.mock('./storage');
jest.mock('./search');
jest.mock('./tags', () => ({ filterByTag: (bms) => bms }));
jest.mock('./labels', () => ({ filterByLabel: (bms) => bms }));

function makeBookmarks() {
  return [
    { url: 'https://example.com', title: 'Example', tags: ['web'] },
    { url: 'https://nodejs.org', title: 'Node.js', tags: ['dev'] },
    { url: 'https://github.com', title: 'GitHub', tags: ['dev', 'git'] },
  ];
}

function makeProgram() {
  const actions = {};
  const program = {
    command: jest.fn().mockReturnThis(),
    description: jest.fn().mockReturnThis(),
    option: jest.fn().mockReturnThis(),
    action: jest.fn().mockImplementation((fn) => {
      actions._fn = fn;
      return program;
    }),
    _actions: actions,
  };
  return program;
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

test('register attaches search command to program', () => {
  const program = makeProgram();
  register(program);
  expect(program.command).toHaveBeenCalledWith('search <query>');
});

test('displays results sorted by score', async () => {
  const bms = makeBookmarks();
  storage.loadBookmarks.mockResolvedValue(bms);
  search.scoreBookmark
    .mockReturnValueOnce(0.9)
    .mockReturnValueOnce(0.4)
    .mockReturnValueOnce(0.7);

  const program = makeProgram();
  register(program);
  await program._actions._fn('node', { limit: '10', minScore: '0' });

  const output = console.log.mock.calls.map(c => c[0]).join('\n');
  expect(output).toContain('Example');
  expect(output).toContain('GitHub');
});

test('shows no results message when nothing matches', async () => {
  storage.loadBookmarks.mockResolvedValue(makeBookmarks());
  search.scoreBookmark.mockReturnValue(0);

  const program = makeProgram();
  register(program);
  await program._actions._fn('zzz', { limit: '10', minScore: '0' });

  expect(console.log).toHaveBeenCalledWith('No bookmarks matched your query.');
});

test('handles load error gracefully', async () => {
  storage.loadBookmarks.mockRejectedValue(new Error('disk error'));
  const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

  const program = makeProgram();
  register(program);
  await program._actions._fn('test', { limit: '10', minScore: '0' });

  expect(console.error).toHaveBeenCalledWith('Search failed:', 'disk error');
  mockExit.mockRestore();
});
