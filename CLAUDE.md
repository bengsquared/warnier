# Warnier-Orr Diagram Generator

## Project Overview
A React-based web application for creating and editing Warnier-Orr diagrams. These diagrams are used for hierarchical data structure visualization and system design documentation.

**Live URL**: https://bengsquared.github.io/warnier  
**Tech Stack**: React 16.8.6, Create React App 3.0.1  
**Deployment**: GitHub Pages via gh-pages package

## Quick Navigation Guide

### Core Application Logic
- **Main Component**: `src/App.js:111-118` - App function that renders the application
- **Block Component**: `src/App.js:7-107` - Primary component for diagram blocks
- **Entry Point**: `src/index.js:7` - React DOM render call

### Key Features & Functions

#### Block Management
- **Block Constructor**: `src/App.js:9-25` - Initializes block state with title and children
- **Add Child**: `src/App.js:28-45` - AddChild() method for creating new child blocks
- **Child Change Handler**: `src/App.js:47-73` - ChildChange() method for propagating updates
- **UUID Generator**: `src/App.js:120-128` - create_UUID() for unique block IDs

#### Component Structure
- **Root Block**: Created at `src/App.js:115` with isChild=false
- **Child Blocks**: Recursively rendered at `src/App.js:86-88`
- **Block Rendering**: `src/App.js:76-103` - Main render method

### Known Issues & Areas for Improvement

1. **Input Field Not Connected**: `src/App.js:93` - Input field exists but doesn't update block title
2. **Missing Title Editing**: No onChange handler for title updates
3. **State Management**: Mix of props/state in Block component could be simplified
4. **NotifyParent Bug**: `src/App.js:87` - NotifyParent callback missing parameters
5. **No Persistence**: Changes are lost on page refresh
6. **No Delete Function**: Can only add blocks, not remove them
7. **No Export/Import**: Cannot save or load diagrams

### File Structure

```
/src
├── App.js           # Main application component and Block component
├── App.css          # Styling for blocks, braces, and layout
├── App.test.js      # Basic render test
├── index.js         # Application entry point
├── index.css        # Global styles
└── serviceWorker.js # PWA service worker (currently unregistered)

/public
├── index.html       # HTML template (title needs update)
├── manifest.json    # PWA manifest
└── favicon.ico      # App icon
```

### Styling Classes
- `.blockBox` - Main container for each block (`src/App.css:25-28`)
- `.blockInfo` - Block content area (`src/App.css:29-35`)
- `.brace` - Visual brace connector (`src/App.css:36-46`)
- `.children` - Container for child blocks (`src/App.css:47-52`)
- `.addChild` - Clickable "add child" button (`src/App.css:53-58`)

### Commands
```bash
npm start       # Development server at localhost:3000
npm test        # Run tests
npm run build   # Production build
npm run deploy  # Deploy to GitHub Pages
```

### Common Tasks

#### Fix Title Editing
1. Add state for title in Block component
2. Add onChange handler to input at `src/App.js:93`
3. Update ChildChange to handle title changes

#### Add Delete Functionality
1. Add delete button to each block
2. Implement DeleteChild method in Block component
3. Update parent's children array

#### Add Persistence
1. Add save/load buttons to App component
2. Serialize block tree to JSON
3. Store in localStorage or backend

#### Fix NotifyParent Callback
1. Update line `src/App.js:87` to pass correct parameters
2. Ensure parent receives child updates properly

#### Update Page Title
1. Change title in `public/index.html:22` from "React App" to "Warnier-Orr Diagram Generator"

## Testing
- Basic render test at `src/App.test.js:5-8`
- No component-specific tests currently exist
- Testing framework: Jest with React Testing Library

## Deployment
Configured for GitHub Pages deployment:
- Build output: `/build` directory
- Deploy command: `npm run deploy`
- Homepage: https://bengsquared.github.io/warnier

## Dependencies
- react: ^16.8.6
- react-dom: ^16.8.6
- react-scripts: 3.0.1 (Create React App)
- gh-pages: ^2.2.0 (dev dependency for deployment)