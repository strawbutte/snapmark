import { jest } from '@jest/globals';

const mockLoad = jest.fn();
const mockSave = jest.fn();
const mockAdd = jest.fn();
const mockRemove = jest.fn();
const mockMarkRead = jest.fn();
const mockGetList = jest.fn();

jest.unstable_mockModule('./storage.js', () => ({
  loadBookmarks: mockLoad,
  saveBookmarks: mockSave,
}));

jest.unstable_mockModule('./reading-list.js', () => ({
  addToReadingList: mockAdd,
  removeFromReadingList: mockRemove,
  markAsRead: mockMarkRead,
  getReadingList: mockGetList,
  isInReadingList: jest.fn(),
}));

const { register } = await import('./cli-reading-list.js');

function makeBookmarks() {
  return [
    { id: '1', url: 'https://example.com', title: 'Example' },
    { id: '2', url: 'https://foo.com', title: 'Foo', readingList: true },
  ];
}

describe('cli-reading-list register', () => {
  let program;

  beforeEach(() => {
    jest.clearAllMocks();
    const { Command } = await import('commander');
    program = new Command();
    register(program);
  });

  test('reading-list add calls addToReadingList', async () => {
    const bms = makeBookmarks();
    mockLoad.mockResolvedValue(bms);
    mockAdd.mockReturnValue([...bms]);
    await program.parseAsync(['node', 'cli', 'reading-list', 'add', '1']);
    expect(mockAdd).toHaveBeenCalledWith(bms, '1');
    expect(mockSave).toHaveBeenCalled();
  });

  test('reading-list remove calls removeFromReadingList', async () => {
    const bms = makeBookmarks();
    mockLoad.mockResolvedValue(bms);
    mockRemove.mockReturnValue([...bms]);
    await program.parseAsync(['node', 'cli', 'reading-list', 'remove', '2']);
    expect(mockRemove).toHaveBeenCalledWith(bms, '2');
    expect(mockSave).toHaveBeenCalled();
  });

  test('reading-list read marks bookmark as read', async () => {
    const bms = makeBookmarks();
    mockLoad.mockResolvedValue(bms);
    mockMarkRead.mockReturnValue([...bms]);
    await program.parseAsync(['node', 'cli', 'reading-list', 'read', '2']);
    expect(mockMarkRead).toHaveBeenCalledWith(bms, '2');
    expect(mockSave).toHaveBeenCalled();
  });

  test('reading-list list prints reading list items', async () => {
    const bms = makeBookmarks();
    mockLoad.mockResolvedValue(bms);
    mockGetList.mockReturnValue([bms[1]]);
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await program.parseAsync(['node', 'cli', 'reading-list', 'list']);
    expect(mockGetList).toHaveBeenCalledWith(bms);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test('reading-list list shows empty message when none', async () => {
    mockLoad.mockResolvedValue([]);
    mockGetList.mockReturnValue([]);
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await program.parseAsync(['node', 'cli', 'reading-list', 'list']);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('No'));
    spy.mockRestore();
  });
});
