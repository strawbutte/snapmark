import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock storage and labels modules
vi.mock('./storage.js', () => ({
  loadBookmarks: vi.fn(),
  saveBookmarks: vi.fn(),
}));

vi.mock('./labels.js', () => ({
  setLabel: vi.fn(),
  clearLabel: vi.fn(),
  getLabel: vi.fn(),
  filterByLabel: vi.fn(),
  listLabels: vi.fn(),
}));

import { loadBookmarks, saveBookmarks } from './storage.js';
import { setLabel, clearLabel, getLabel, filterByLabel, listLabels } from './labels.js';

// Import CLI handlers after mocks
import { handleLabelSet, handleLabelClear, handleLabelGet, handleLabelFilter, handleLabelList } from './cli-labels.js';

function makeBookmarks() {
  return [
    { id: 'abc123', url: 'https://example.com', title: 'Example', tags: [], label: 'work' },
    { id: 'def456', url: 'https://github.com', title: 'GitHub', tags: [], label: 'dev' },
    { id: 'ghi789', url: 'https://news.ycombinator.com', title: 'HN', tags: [] },
  ];
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('handleLabelSet', () => {
  it('sets a label on a bookmark and saves', async () => {
    const bookmarks = makeBookmarks();
    loadBookmarks.mockResolvedValue(bookmarks);
    const updated = bookmarks.map((b) => (b.id === 'ghi789' ? { ...b, label: 'reading' } : b));
    setLabel.mockReturnValue(updated);

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await handleLabelSet('ghi789', 'reading');

    expect(loadBookmarks).toHaveBeenCalled();
    expect(setLabel).toHaveBeenCalledWith(bookmarks, 'ghi789', 'reading');
    expect(saveBookmarks).toHaveBeenCalledWith(updated);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('ghi789'));
    consoleSpy.mockRestore();
  });

  it('prints error if bookmark not found', async () => {
    const bookmarks = makeBookmarks();
    loadBookmarks.mockResolvedValue(bookmarks);
    setLabel.mockImplementation(() => { throw new Error('Bookmark not found'); });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await handleLabelSet('notexist', 'work');

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error'));
    consoleSpy.mockRestore();
  });
});

describe('handleLabelClear', () => {
  it('clears the label from a bookmark', async () => {
    const bookmarks = makeBookmarks();
    loadBookmarks.mockResolvedValue(bookmarks);
    const updated = bookmarks.map((b) => (b.id === 'abc123' ? { ...b, label: undefined } : b));
    clearLabel.mockReturnValue(updated);

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await handleLabelClear('abc123');

    expect(clearLabel).toHaveBeenCalledWith(bookmarks, 'abc123');
    expect(saveBookmarks).toHaveBeenCalledWith(updated);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('abc123'));
    consoleSpy.mockRestore();
  });
});

describe('handleLabelGet', () => {
  it('prints the label for a bookmark', async () => {
    const bookmarks = makeBookmarks();
    loadBookmarks.mockResolvedValue(bookmarks);
    getLabel.mockReturnValue('work');

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await handleLabelGet('abc123');

    expect(getLabel).toHaveBeenCalledWith(bookmarks, 'abc123');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('work'));
    consoleSpy.mockRestore();
  });

  it('prints message if no label set', async () => {
    const bookmarks = makeBookmarks();
    loadBookmarks.mockResolvedValue(bookmarks);
    getLabel.mockReturnValue(null);

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await handleLabelGet('ghi789');

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(/no label|none/i));
    consoleSpy.mockRestore();
  });
});

describe('handleLabelFilter', () => {
  it('lists bookmarks matching a label', async () => {
    const bookmarks = makeBookmarks();
    loadBookmarks.mockResolvedValue(bookmarks);
    filterByLabel.mockReturnValue([bookmarks[0]]);

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await handleLabelFilter('work');

    expect(filterByLabel).toHaveBeenCalledWith(bookmarks, 'work');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('example.com'));
    consoleSpy.mockRestore();
  });

  it('prints message if no bookmarks match', async () => {
    const bookmarks = makeBookmarks();
    loadBookmarks.mockResolvedValue(bookmarks);
    filterByLabel.mockReturnValue([]);

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await handleLabelFilter('nonexistent');

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(/no bookmarks|none/i));
    consoleSpy.mockRestore();
  });
});

describe('handleLabelList', () => {
  it('lists all unique labels', async () => {
    const bookmarks = makeBookmarks();
    loadBookmarks.mockResolvedValue(bookmarks);
    listLabels.mockReturnValue(['dev', 'work']);

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await handleLabelList();

    expect(listLabels).toHaveBeenCalledWith(bookmarks);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('dev'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('work'));
    consoleSpy.mockRestore();
  });

  it('prints message if no labels exist', async () => {
    const bookmarks = makeBookmarks();
    loadBookmarks.mockResolvedValue(bookmarks);
    listLabels.mockReturnValue([]);

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await handleLabelList();

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(/no labels/i));
    consoleSpy.mockRestore();
  });
});
