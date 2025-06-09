# Auxilium

A tool for reviewing research papers (a overkill app for a very specific use case and very specific data format! lol)

## Features

- Load and review research papers from CSV files
- Rate and annotate research details
- Export review data to CSV
- Save and load review sessions

## File Operations

Auxilium supports saving and loading review sessions in the `.auxl` format. This saves all your ratings and progress.

### File Menu

- **Open auxl**: Load a previously saved review session
- **Save auxl**: Save the current review session
- **Save auxl as**: Save the current review session to a new location

The window title will show a `*` when there are unsaved changes, and you'll be warned when trying to close the app with unsaved changes.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run tauri dev

# Build for production
npm run tauri build
```

## License

MIT

## Keyboard Shortcuts

### File Operations
- `Cmd/Ctrl + S`: Save the current review session
  - If it's the first save, you'll be prompted to choose a location
  - If you've saved before, it will save to the same file
- `Cmd/Ctrl + Shift + S`: Save the review session to a new location

### Paper Navigation
- `←` (Left Arrow): Navigate to previous paper
- `→` (Right Arrow): Navigate to next paper

### Research Detail Navigation
- `↑` (Up Arrow): Navigate to previous research detail
- `↓` (Down Arrow): Navigate to next research detail

### Tab Navigation
- `Q`: Switch to Quotes tab
- `R`: Switch to Reasoning tab
- `T`: Switch to Tables tab

### Rating Research Details
- `1`: Rate current detail with 1 star
- `2`: Rate current detail with 2 stars
- `3`: Rate current detail with 3 stars
- `4`: Rate current detail with 4 stars
- `5`: Rate current detail with 5 stars

Note: When switching papers, the view automatically resets to the Research Goal field.
