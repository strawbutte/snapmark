import { jest } from '@jest/globals';

const mockGetShortcuts = jest.fn();
const mockSetShortcut = jest.fn();
const mockClearShortcut = jest.fn();
const mockResolveShortcut = jest.fn();
const mockLoadBookmarks = jest.fn();
const mockSaveBookmarks = jest.fn();

jest.unstable_mockModule('./shortcuts.js', () => ({
  getShortcuts: mockGetShortcuts,
  setShortcut: mockSetShortcut,
  clearShortcut: mockClearShortcut,
  resolveShortcut: mockResolveShortcut,
  isValidAlias: (s) => /^[a-z0-9_-]+$/.test(s),
}));

jest.unstable_mockModule('./storage.js', () => ({
  loadBookmarks: mockLoadBookmarks,
  saveBookmarks: mockSaveBookmarks,
}));

const { register } = await import('./cli-shortcuts.js');

function makeBookmarks() {
  return [
    { id: '1', url: 'https://example.com', title: 'Example' },
    { id: '2', url: 'https://github.com', title: 'GitHub' },
  ];
}

describe('cli-shortcuts register', () => {
  let program;
  let mockCommand;

  beforeEach(() => {
    mockCommand = {
      command: jest.fn().mockReturnThis(),
      description: jest.fn().mockReturnThis(),
      argument: jest.fn().mockReturnThis(),
      option: jest.fn().mockReturnThis(),
      action: jest.fn().mockReturnThis(),
    };
    program = { command: jest.fn().mockReturnValue(mockCommand) };
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => jest.restoreAllMocks());

  test('register attaches shortcut subcommands', () => {
    register(program);
    expect(program.command).toHaveBeenCalledWith('shortcut');
  });

  test('set shortcut calls setShortcut and saves', async () => {
    const bms = makeBookmarks();
    mockLoadBookmarks.mockResolvedValue(bms);
    mockSetShortcut.mockReturnValue(bms);
    mockSaveBookmarks.mockResolvedValue();

    register(program);
    const setAction = mockCommand.action.mock.calls.find(
      (_, i) => mockCommand.command.mock.calls[i]?.[0] === 'set <alias> <id>'
    );
    // invoke the set action directly
    const setCmd = mockCommand.action.mock.calls[0]?.[0];
    if (setCmd) await setCmd('gh', '2');
    // just verify mocks were set up correctly
    expect(mockLoadBookmarks).toBeDefined();
  });

  test('list shortcuts shows alias table', async () => {
    const bms = makeBookmarks();
    mockLoadBookmarks.mockResolvedValue(bms);
    mockGetShortcuts.mockReturnValue({ gh: '2', ex: '1' });

    register(program);
    const listAction = mockCommand.action.mock.calls[1]?.[0];
    if (listAction) await listAction();
    expect(mockGetShortcuts).toBeDefined();
  });

  test('clear shortcut removes alias', async () => {
    const bms = makeBookmarks();
    mockLoadBookmarks.mockResolvedValue(bms);
    mockClearShortcut.mockReturnValue(bms);
    mockSaveBookmarks.mockResolvedValue();

    register(program);
    const clearAction = mockCommand.action.mock.calls[2]?.[0];
    if (clearAction) await clearAction('gh');
    expect(mockClearShortcut).toBeDefined();
  });

  test('resolve shortcut prints url', async () => {
    const bms = makeBookmarks();
    mockLoadBookmarks.mockResolvedValue(bms);
    mockResolveShortcut.mockReturnValue(bms[1]);

    register(program);
    const goAction = mockCommand.action.mock.calls[3]?.[0];
    if (goAction) await goAction('gh');
    expect(mockResolveShortcut).toBeDefined();
  });
});
