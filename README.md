# Warnier-Orr Diagram Generator

A React application for creating and editing Warnier-Orr diagrams.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run deploy` - Deploy to GitHub Pages

## Live Site

https://bengsquared.github.io/warnier

## Theme System

The application supports light/dark theme switching with automatic OS preference detection and persistence.

### How It Works

Themes are implemented using CSS custom properties (variables) controlled by a `data-theme` attribute on the `<html>` element:

```css
/* Light theme (default) */
:root {
  --color-bg: #ffffff;
  --color-text: #000000;
  --color-border: #cccccc;
}

/* Dark theme */
[data-theme="dark"] {
  --color-bg: #1a1a1a;
  --color-text: #ffffff;
  --color-border: #444444;
}
```

### Available Tokens

The following CSS custom properties are available for theme-aware styling:

- `--color-bg` - Primary background color
- `--color-text` - Primary text color  
- `--color-border` - Border and outline color
- `--color-accent` - Interactive elements (buttons, links)
- `--spacing-sm` - Small spacing (4px)
- `--spacing-md` - Medium spacing (8px)
- `--spacing-lg` - Large spacing (16px)

### Adding New Theme Tokens

1. Define the token in `:root` for the light theme default
2. Override it in `[data-theme="dark"]` for dark theme
3. Use the token in your CSS: `background-color: var(--color-bg)`

### Requirements

**Meta Tag**: Add theme-color meta tag to prevent flash during theme switching:
```html
<meta name="theme-color" content="#000000" />
```

**Boot Script**: Include a theme detection script in `<head>` before other stylesheets to prevent FOUC (Flash of Unstyled Content):
```html
<script>
  // Detect and apply theme before page renders
  const theme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
</script>
```

### Persistence

Theme preference is stored in localStorage using the key `"theme"` with values:
- `"light"` - Force light theme
- `"dark"` - Force dark theme  
- `null` - Follow OS preference (default)

The system automatically detects OS dark mode preference via `prefers-color-scheme` media query when no explicit preference is stored.