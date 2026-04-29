'use strict';

const { register } = require('./cli-dedupe');
const storage = require('./storage');
const { Command } = require('commander');

jest.mock('./storage');

function makeProgram() {
  const program = new Command();
  program.exitOverride();
  register(program);
  return program;
}

function makeBookmarks() {
  return [
    { url: 'https://example.com', title: 'Example' },
    { url: 'https://example.com/', title: 'Example Dupe' },
    { url: 'https://other.com', title: 'Other' },
    { url: 'https://other.com', title: 'Other Dupe' },
  ];
}

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('reports no duplicates when all bookmarks are unique', async () => {
  storage.loadBookmarks.mockResolvedValue([
    { url: 'https://a.com', title: 'A' },
    { url: 'https://b.com', title: 'B' },
  ]);
  const program = makeProgram();
  await program.parseAsync(['node', 'cli', 'dedupe']);
  expect(console.log).toHaveBeenCalledWith('No duplicate bookmarks found.');
  expect(storage.saveBookmarks).not.toHaveBeenCalled();
});

test('removes duplicates and saves', async () => {
  storage.loadBookmarks.mockResolvedValue(makeBookmarks());
  storage.saveBookmarks.mockResolvedValue();
  const program = makeProgram();
  await program.parseAsync(['node', 'cli', 'dedupe']);
  expect(storage.saveBookmarks).toHaveBeenCalledTimes(1);
  const saved = storage.saveBookmarks.mock.calls[0][0];
  expect(saved.length).toBe(2);
});

test('dry-run does not save', async () => {
  storage.loadBookmarks.mockResolvedValue(makeBookmarks());
  const program = makeProgram();
  await program.parseAsync(['node', 'cli', 'dedupe', '--dry-run']);
  expect(storage.saveBookmarks).not.toHaveBeenCalled();
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Dry run'));
});

test('verbose lists groups with keep/remove markers', async () => {
  storage.loadBookmarks.mockResolvedValue(makeBookmarks());
  storage.saveBookmarks.mockResolvedValue();
  const program = makeProgram();
  await program.parseAsync(['node', 'cli', 'dedupe', '--verbose']);
  const output = console.log.mock.calls.map(c => c[0]).join('\n');
  expect(output).toMatch('[keep]');
  expect(output).toMatch('[remove]');
});
