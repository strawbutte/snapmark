'use strict';

const { Command } = require('commander');
const { register } = require('./cli-stats');
const storage = require('./storage');
const stats = require('./stats');

jest.mock('./storage');
jest.mock('./stats');

function makeBookmarks() {
  return [
    { url: 'https://github.com/foo', title: 'Foo', tags: ['dev'], createdAt: '2024-01-01T00:00:00Z', pinned: true, favorite: false, archived: false },
    { url: 'https://github.com/bar', title: 'Bar', tags: [], createdAt: '2024-02-01T00:00:00Z', pinned: false, favorite: true, archived: false },
    { url: 'https://news.ycombinator.com', title: 'HN', tags: ['news', 'dev'], createdAt: '2024-03-01T00:00:00Z', pinned: false, favorite: false, archived: true },
  ];
}

async function run(argv) {
  const program = new Command();
  program.exitOverride();
  register(program);
  await program.parseAsync(['node', 'test', ...argv]);
}

beforeEach(() => {
  jest.clearAllMocks();
  storage.loadBookmarks.mockResolvedValue(makeBookmarks());
});

describe('stats summary', () => {
  it('prints summary fields', async () => {
    stats.getSummary.mockReturnValue({ total: 3, uniqueDomains: 2, tagged: 2, untagged: 1, archived: 1, pinned: 1, favorites: 1 });
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await run(['stats', 'summary']);
    expect(stats.getSummary).toHaveBeenCalled();
    const output = spy.mock.calls.map((c) => c[0]).join('\n');
    expect(output).toMatch('Total bookmarks');
    expect(output).toMatch('3');
    spy.mockRestore();
  });
});

describe('stats domains', () => {
  it('lists domains sorted by count', async () => {
    stats.countByDomain.mockReturnValue({ 'github.com': 2, 'news.ycombinator.com': 1 });
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await run(['stats', 'domains']);
    expect(stats.countByDomain).toHaveBeenCalled();
    const output = spy.mock.calls.map((c) => c[0]).join('\n');
    expect(output).toMatch('github.com');
    spy.mockRestore();
  });

  it('shows no bookmarks message when empty', async () => {
    stats.countByDomain.mockReturnValue({});
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await run(['stats', 'domains']);
    expect(spy.mock.calls[0][0]).toMatch('No bookmarks found');
    spy.mockRestore();
  });
});

describe('stats tags', () => {
  it('lists tags sorted by count', async () => {
    stats.countByTag.mockReturnValue({ dev: 2, news: 1 });
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await run(['stats', 'tags']);
    const output = spy.mock.calls.map((c) => c[0]).join('\n');
    expect(output).toMatch('dev');
    spy.mockRestore();
  });
});

describe('stats recent', () => {
  it('lists recent bookmarks', async () => {
    stats.recentBookmarks.mockReturnValue([makeBookmarks()[2]]);
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await run(['stats', 'recent', '--count', '1']);
    expect(stats.recentBookmarks).toHaveBeenCalledWith(expect.any(Array), 1);
    const output = spy.mock.calls.map((c) => c[0]).join('\n');
    expect(output).toMatch('HN');
    spy.mockRestore();
  });
});
