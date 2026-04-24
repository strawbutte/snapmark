# snapmark

A lightweight CLI bookmark manager that syncs across machines via a git repo backend.

---

## Installation

```bash
npm install -g snapmark
```

---

## Usage

Initialize snapmark with a git repo to store your bookmarks:

```bash
snapmark init https://github.com/yourname/bookmarks-repo.git
```

Add, list, and open bookmarks from the command line:

```bash
# Add a bookmark
snapmark add "My Project" https://github.com/yourname/myproject

# List all bookmarks
snapmark list

# Open a bookmark by name
snapmark open "My Project"

# Sync bookmarks across machines
snapmark sync
```

Bookmarks are stored as a simple JSON file in your configured git repo. Run `snapmark sync` on any machine to pull the latest changes or push new additions.

---

## Commands

| Command | Description |
|---|---|
| `init <repo-url>` | Connect snapmark to a git repo |
| `add <name> <url>` | Save a new bookmark |
| `list` | Display all saved bookmarks |
| `open <name>` | Open a bookmark in your default browser |
| `remove <name>` | Delete a bookmark |
| `sync` | Pull and push changes to the remote repo |

---

## Requirements

- Node.js v14 or higher
- Git installed and available in your PATH

---

## License

MIT © 2024