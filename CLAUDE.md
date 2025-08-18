# Warnier-Orr Diagram Generator

## Project Overview
React web application for creating hierarchical Warnier-Orr diagrams.  
**Stack**: React 19.1.1, Vite 7.1.2  
**Deployment**: GitHub Pages (automatic via GitHub Actions on push to master)  
**Live**: https://bengsquared.github.io/warnier

## Quick Navigation

### Core Components
- **Main App**: `src/App.jsx:111-118` - Root component
- **Block Component**: `src/App.jsx:7-107` - Recursive block component for diagram nodes
- **Entry Point**: `src/index.jsx:6-12` - React 19 root render

### Key Functions
- **AddChild**: `src/App.jsx:28-45` - Adds new child block
- **ChildChange**: `src/App.jsx:47-73` - Propagates child updates to parent
- **UUID Generator**: `src/App.jsx:120-128` - Creates unique block IDs

### Known Issues
1. **Input Not Connected**: `src/App.jsx:93` - Title input field exists but doesn't update state
2. **NotifyParent Bug**: `src/App.jsx:87` - Missing parameters in callback
3. **No Delete**: Cannot remove blocks once created
4. **No Persistence**: State lost on refresh
5. **No Export**: Cannot save/load diagrams

### File Structure
```
/src
├── App.jsx          # Main app + Block component
├── App.css          # Component styles
├── index.jsx        # Entry point
└── index.css        # Global styles

/public
└── favicon.ico      # App icon

/.github/workflows
└── deploy.yml       # GitHub Actions auto-deploy

/
├── index.html       # Vite HTML entry
├── vite.config.js   # Vite configuration
└── package.json     # Dependencies + scripts
```

### Styles
- `.blockBox` - Block container (`src/App.css:25-28`)
- `.brace` - Visual connector (`src/App.css:36-46`)
- `.children` - Child container (`src/App.css:47-52`)
- `.addChild` - Add button (`src/App.css:53-58`)

### Commands
```bash
npm run dev     # Dev server localhost:3000
npm run build   # Build to /dist
npm run deploy  # Deploy to gh-pages
```

### Common Fixes

#### Enable Title Editing
Add onChange to input at `src/App.jsx:93`:
```jsx
<input value={title} onChange={(e) => this.setState({title: e.target.value})} />
```

#### Fix NotifyParent
Update `src/App.jsx:87` to pass all params:
```jsx
NotifyParent={(id, title, children) => this.ChildChange(id, title, children)}
```

#### Add Delete
1. Add delete button to each block
2. Create DeleteChild method
3. Filter out deleted child from parent's array

#### Add Persistence
1. Add localStorage save on state change
2. Load from localStorage on mount
3. Add export/import JSON buttons

## Build Configuration
- **Vite Config**: `vite.config.js`
  - Base path: `/warnier/` for GitHub Pages
  - Output: `dist/` directory
  - Port: 3000 for dev server

## Deployment
- **Manual**: `npm run deploy` uses gh-pages package
- **Automatic**: GitHub Actions workflow on push to master
- **Config**: See `.github/workflows/deploy.yml`