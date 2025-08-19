# Warnier-Orr Diagram Generator

A React application for creating and editing Warnier-Orr diagrams.

## Features

- **Light/Dark Mode**: Toggle between light and dark themes with the switch in the top navigation
  - Automatically detects OS preference on first visit
  - Persists user choice in localStorage
  - No flash of unstyled content (FOUC)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run deploy` - Deploy to GitHub Pages

## Theme System

The app uses CSS custom properties for theming:

```css
:root {
  --bg: #ffffff;      /* Background color */
  --fg: #111111;      /* Foreground/text color */
  --surface: #f6f6f6; /* Surface/card backgrounds */
  --border: #e5e5e5;  /* Border colors */
  --link: #0a66c2;    /* Link colors */
  --link-hover: #085394; /* Link hover colors */
}

[data-theme='dark'] {
  --bg: #0f1115;
  --fg: #e6e8eb;
  --surface: #171a21;
  --border: #2a2f3a;
  --link: #62a0ff;
  --link-hover: #4285d4;
}
```

To add new theme-aware styles, use `var(--token-name)` instead of hardcoded colors.

## Live Site

https://bengsquared.github.io/warnier