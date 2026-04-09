# Nexus Explorer — Design System Implementation Guide

This guide documents the **Avail Design System** implementation for the Nexus Explorer project. All tokens, components, and patterns are extracted from the production site at [docs.availproject.org](https://docs.availproject.org).

---

## Quick Start

```bash
# Start local preview server
cd ~/Documents/Code/AvailNexusExplorer
python3 -m http.server 8080

# Open in browser
open http://localhost:8080           # Main site
open http://localhost:8080/examples.html  # Component showcase
```

---

## Architecture

The design system is implemented in **vanilla HTML/CSS/JS** with no framework dependencies, matching the Avail docs approach (which uses Next.js + Tailwind CSS v4 + Shadcn/ui patterns in production).

| File | Purpose |
|---|---|
| `styles.css` | Design tokens + all component styles |
| `index.html` | Production homepage |
| `examples.html` | Full component showcase (16 sections) |
| `script.js` | Theme toggle, keyboard shortcuts, data rendering |
| `assets/js/halftone-background.js` | Animated dot-grid background |
| `assets/fonts/Delight/` | Serif display font |

---

## Design Tokens

All tokens are CSS custom properties in `styles.css`. Light mode is the default; dark mode overrides are in the `.dark` selector.

### Colour Palette

#### Blue (Primary Brand)
```css
--avail-blue-50:   #e6f1fe;
--avail-blue-100:  #cee2fd;
--avail-blue-150:  #b0d2fc;
--avail-blue-200:  #98c3fb;
--avail-blue-300:  #68a6f8;
--avail-blue-400:  #3187f6;
--avail-blue-500:  #0a6beb;  /* Primary brand colour */
--avail-blue-600:  #25599d;
--avail-blue-700:  #2c4668;
--avail-blue-800:  #002a61;
--avail-blue-850:  #001f47;
--avail-blue-900:  #00040f;
--avail-blue-950:  #00030a;
```

#### Grey (Light Theme)
```css
--avail-grey-l-100:  #f0f0ef;
--avail-grey-l-200:  #e9e9e8;  /* Borders */
--avail-grey-l-300:  #e1e1e0;
--avail-grey-l-400:  #e9e9e8;
--avail-grey-l-500:  #c2c2c1;
--avail-grey-l-600:  #9f9f9d;
--avail-grey-l-700:  #858585;  /* Muted text */
--avail-grey-l-800:  #737373;
--avail-grey-l-900:  #5a5a58;
--avail-grey-l-1000: #151514;  /* Foreground text */
```

#### Grey (Dark Theme)
```css
--avail-grey-d-100:  #1b1b18;
--avail-grey-d-200:  #1f1f1e;  /* Surface */
--avail-grey-d-300:  #292928;
--avail-grey-d-400:  #2e2e2d;  /* Borders */
--avail-grey-d-500:  #464644;
--avail-grey-d-600:  #878787;
--avail-grey-d-700:  #8f8f8f;  /* Muted text */
--avail-grey-d-800:  #7d7d7d;
--avail-grey-d-900:  #a2a2a0;
--avail-grey-d-1000: #eeeeed;  /* Foreground text */
```

#### Semantic Colours
```css
--avail-red-50:    #fbe9e9;
--avail-red-100:   #f6d5d5;
--avail-red-500:   #cf2a2a;  /* Error / Destructive */
--avail-red-800:   #561010;
--avail-green-50:  #e9fbf0;
--avail-green-100: #d4f7e0;
--avail-green-500: #25d061;  /* Success */
--avail-green-800: #0c5525;
```

#### Semantic Token Pairs (Light → Dark)

| Token | Light Value | Dark Value |
|---|---|---|
| `--background` | `#ffffff` | `#151514` |
| `--foreground` | `#151514` | `#eeeeed` |
| `--muted` | `#f0f0ef` | `#1f1f1e` |
| `--muted-foreground` | `#858585` | `#8f8f8f` |
| `--brand` | `#0a6beb` | `#eeeeed` |
| `--brand-foreground` | `#ffffff` | `#151514` |
| `--border-color` | `#e9e9e8` | `#2e2e2d` |
| `--card-bg` | `#ffffff` | `#1f1f1e` |
| `--card-border` | `#e9e9e8` | `#2e2e2d` |
| `--card-shadow` | `#e6f1fe` | `#2e2e2d` |
| `--card-header-bg` | `#f8f8f7` | `#292928` |
| `--surface` | `#f8f8f7` | `#1f1f1e` |
| `--accent` | `#e6f1fe` | `#292928` |

---

### Typography

```css
--font-sans:   'Inter', 'Geist', system-ui, sans-serif;      /* UI text */
--font-serif:  'Delight', 'Inter', 'Geist', system-ui, sans-serif; /* Headings, numbers */
--font-mono:   'JetBrains Mono', 'Geist Mono', monospace;     /* Hashes, block numbers */
```

#### Text Size Scale
```css
--text-xs:   0.75rem;    /* 12px — badges, hashes, hints */
--text-sm:   0.875rem;   /* 14px — labels, secondary text */
--text-base: 1rem;       /* 16px — body text */
--text-lg:   1.125rem;   /* 18px — subtitles */
--text-xl:   1.25rem;    /* 20px — section titles */
--text-2xl:  1.5rem;     /* 24px — card headings */
--text-3xl:  1.875rem;   /* 30px — stat values */
--text-4xl:  2.25rem;    /* 36px — hero title */
```

#### Font Weight Scale
```css
--font-light:    300;
--font-normal:   400;
--font-medium:   500;
--font-semibold: 600;
--font-bold:     700;
```

#### Line Height Scale
```css
--leading-tight:   1.25;
--leading-normal:   1.5;
--leading-relaxed:  1.625;
```

#### Letter Spacing Scale
```css
--tracking-tight:  -0.025em;
--tracking-normal:  0;
--tracking-wide:    0.025em;
--tracking-wider:   0.05em;
--tracking-widest:  0.1em;
```

#### Typography Presets (Matching Avail Docs)
| Class | Font | Size | Weight | Line-height | Use |
|---|---|---|---|---|---|
| Hero title | serif | 2.25rem (mobile) / 3.5rem | 500 | 1.1 | Page hero headings |
| Section title | serif | 1.25rem | 500 | normal | Section card titles |
| Body 16 | sans | 1rem | 400 | 1.5rem | Body paragraphs |
| Body 14 | sans | 0.875rem | 400 | 1.625 | Secondary text |
| UI 16 | sans | 1rem | 400 | 1.25rem | UI labels |
| UI 14 | sans | 0.875rem | 400 | 1.125rem | Small UI labels |
| Stat value | serif | 1.875rem | 700 | 1.1 | Dashboard numbers |
| Block number | mono | 0.875rem | 600 | — | `#31,009` |
| Hash | mono | 0.75rem | 400 | — | `0x05aefb…1f6aa5` |

**Important:** Always use `font-feature-settings: 'tnum'` and `font-variant-numeric: tabular-nums` for numeric data (stat values, block numbers) to ensure proper alignment.

---

### Border Radius Scale
```css
--radius-none: 0;
--radius-xs:   0.125rem;  /* 2px — small elements */
--radius-sm:   0.25rem;   /* 4px — badges, inputs */
--radius-md:   0.5rem;    /* 8px — buttons, cards, inputs */
--radius-lg:   0.75rem;   /* 12px — empty state icons */
--radius-xl:   1rem;      /* 16px — large cards */
--radius-2xl:  1.5rem;    /* 24px — modals */
--radius-full: 9999px;    /* Pills, avatars */
```

**Note:** The Avail docs use `--radius: 0px` as the base (sharp corners). Our card borders use `0px` to match this aesthetic.

---

### Shadow Scale (Light → Dark)

```css
/* Light mode */
--shadow-xs:  0px 1px  2px  0px #0000001a;
--shadow-sm:  0px 1px  4px  0px #5555550d;
--shadow-md:  0px 1px 12px  0px #5b5b5b0d;
--shadow-lg:  0px 4px 24px  0px #5b5b5b14;

/* Dark mode */
--shadow-xs:  0px 1px  2px  0px #0000001a;
--shadow-sm:  0px 1px  4px  0px #00000026;
--shadow-md:  0px 1px 12px  0px #00000026;
--shadow-lg:  0px 4px 24px  0px #0003;
```

---

### Spacing Scale
```css
--spacing: 0.25rem;  /* 4px base unit */
```
Common values: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 48px, 64px

---

### Transition Tokens
```css
--transition-duration: 0.15s;
--transition-timing: cubic-bezier(0.4, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-card: cubic-bezier(0.165, 0.84, 0.44, 1);  /* Card hover animation */
```

---

## Theme System (Light/Dark Mode)

### How It Works

1. **Default (Light Mode)**: Semantic tokens resolve to light theme colours
2. **Dark Mode**: Add `.dark` class to `<html>` — semantic tokens switch to dark values
3. **Flash Prevention**: Inline `<script>` in `<head>` sets the theme before CSS loads

### Implementation

```javascript
// Prevent flash of wrong theme
// (Inline script in <head>, before CSS loads)
(function() {
  var stored = localStorage.getItem('avail-theme');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (stored === 'dark' || (!stored && prefersDark)) {
    document.documentElement.classList.add('dark');
  }
  document.documentElement.style.setProperty('--transition-duration', '0s');
  document.addEventListener('DOMContentLoaded', function() {
    requestAnimationFrame(function() {
      document.documentElement.style.removeProperty('--transition-duration');
    });
  });
})();

// Toggle theme
function toggleTheme() {
  var isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('avail-theme', isDark ? 'dark' : 'light');
}
```

### Best Practices

```css
/* ✅ DO: Use semantic tokens */
.card {
  background-color: var(--card-bg);
  border: 1px solid var(--card-border);
  color: var(--foreground);
}

/* ❌ DON'T: Hardcode colours */
.card {
  background-color: #ffffff;
  border: 1px solid #e9e9e8;
}
```

---

## Component Patterns

### 1. Site Header
- **Height**: 72px (`var(--header-height)`)
- **Sticky**: `position: sticky; top: 0; z-index: 50`
- **Background**: `var(--navbar-bg)` with `border-bottom`
- **Mobile**: Hamburger menu toggle + slide-down navigation

### 2. Card Hover Pattern (Avail Docs)
Cards use a **hover glow overlay** — a pseudo-element with `bg-card-shadow` + `border-brand/20` that fades in on hover, combined with a subtle translate animation.

```css
.section-card {
  position: relative;
  transition: transform 0.2s var(--ease-card), border-color 0.2s var(--ease-out);
}
.section-card::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  border: 1px solid transparent;
  background-color: var(--card-shadow);
  opacity: 0;
  transition: opacity 0.2s var(--ease-out);
  z-index: 1;
}
.section-card:hover::after {
  opacity: 1;
  border-color: color-mix(in oklab, var(--brand) 20%, transparent);
}
.section-card:hover { transform: translate(-1px, -1px); }
.section-card:active { transform: translate(-0.5px, -0.5px); }
```

### 3. Hero Glow Effect
The hero title has a radial gradient pseudo-element behind it:

```css
.hero__title::before {
  content: '';
  position: absolute;
  border-radius: var(--radius-full);
  background: radial-gradient(
    ellipse 100% 100% at 50% 50%,
    var(--hero-glow) 0%, var(--hero-glow) 20%,
    transparent 70%
  );
  inset: -20% -15%;
  opacity: 0.5;
  pointer-events: none;
  z-index: -1;
}
```

### 4. Keyboard Shortcut Badge
```css
.search-kbd {
  border: 1px solid var(--border-color);
  border-bottom: 2px solid var(--key-underline);
  background-color: var(--key-bg);
  color: var(--key-fg);
  border-radius: var(--radius-sm);
}
```

### 5. Status Badges (with dark mode variants)
```css
/* Light mode */
.status-badge--fulfilled { background: var(--avail-green-50); color: var(--avail-green-800); }
.status-badge--failed    { background: var(--avail-red-50);   color: var(--avail-red-500); }
.status-badge--pending   { background: #fef1c8;              color: #72512c; }

/* Dark mode (inverted for contrast) */
.dark .status-badge--fulfilled { background: var(--avail-green-500); color: var(--avail-white); }
.dark .status-badge--failed    { background: var(--avail-red-500);   color: var(--avail-white); }
.dark .status-badge--pending   { background: #72512c;               color: #fef1c8; }
```

### 6. Loading Skeletons
```css
.skeleton {
  background-color: var(--muted);
  border-radius: var(--radius-sm);
  animation: skeleton-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

### 7. Dot Grid Pattern
The signature Avail dot grid is rendered as an animated canvas (`halftone-background.js`). A static SVG fallback is also available:

```css
.dot-grid {
  position: absolute;
  inset: 0;
  background-image: var(--dot-pattern);
  pointer-events: none;
  z-index: 0;
}
```

---

## Layout Structure

```
┌─────────────────────────────────────────────────┐
│ Skip to content (accessibility)                  │
├─────────────────────────────────────────────────┤
│ Site Header (72px, sticky)                      │
│ [Brand] [Nav links] [Search] [Theme] [Mobile]  │
├─────────────────────────────────────────────────┤
│ Site Main                                        │
│ ┌─────────────────────────────────────────────┐ │
│ │ Outer Container (surface bg, padding: 32px)│ │
│ │ ┌─────────────────────────────────────────┐ │ │
│ │ │ Inner Container (card bg, border)       │ │ │
│ │ │ ┌─ Hero ──────────────────────────────┐ │ │ │
│ │ │ │  Nexus Explorer • Live              │ │ │ │
│ │ │ ├──────────────────────────────────────┤ │ │ │
│ │ │ │ Stats Grid (2-col mobile, 4-col)   │ │ │ │
│ │ │ ├──────────────────────────────────────┤ │ │ │
│ │ │ │ Content Grid (1-col mobile, 2-col)  │ │ │ │
│ │ │ │ - Latest Blocks  │ Recent RFFs      │ │ │ │
│ │ │ └──────────────────────────────────────┘ │ │
│ │ └─────────────────────────────────────────┘ │
│ └─────────────────────────────────────────────┘
├─────────────────────────────────────────────────┤
│ Footer                                           │
└─────────────────────────────────────────────────┘
```

**Container widths:**
- Max content width: `938px`
- Header height: `72px` (`var(--header-height)`)
- Inner container padding: `20px`
- Outer container padding: `32px 24px`

---

## Additional Tokens (from Avail Docs)

### Keyboard Shortcut Tokens
```css
--key-bg:           var(--avail-grey-l-100);  /* Light */
--key-bg-hover:     var(--avail-grey-l-200);
--key-bg-active:    var(--avail-grey-l-300);
--key-fg:           var(--avail-grey-l-700);
--key-underline:    var(--avail-grey-l-200);
```

### Sidebar Tokens
```css
--sidebar-bg:       var(--avail-white);
--sidebar-border:   var(--avail-grey-l-200);
--sidebar-item-bg:  transparent;
--sidebar-item-bg-hover: var(--avail-grey-l-100);
--sidebar-item-fg:  var(--avail-grey-l-700);
--sidebar-item-fg-active: var(--avail-grey-l-1000);
```

### Selection Tokens
```css
--selection:        var(--avail-grey-l-1000);  /* Light */
--selection-fg:     var(--avail-white);
```

### Hero Glow Token
```css
--hero-glow:        var(--avail-white);  /* Light */
--hero-glow:        var(--avail-black-50);  /* Dark */
```

---

## Accessibility Checklist

- ✅ Skip-to-content link (`.skip-to-content`)
- ✅ All interactive elements have `:focus-visible` states
- ✅ Sufficient colour contrast (WCAG AA)
- ✅ Semantic HTML (`<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`)
- ✅ ARIA labels on icon-only buttons
- ✅ ARIA attributes on mobile menu (`aria-expanded`, `aria-hidden`)
- ✅ Keyboard navigation (Tab, Enter, `S` for search, Escape to close menu)
- ✅ `prefers-color-scheme` media query for initial theme
- ✅ No-transition flash prevention on page load
- ✅ `font-feature-settings: 'tnum'` for numeric data alignment

---

## Component Reference (examples.html)

The examples page at `/examples.html` demonstrates all components:

1. **Colour Palette** — Brand, semantic, and status colours
2. **Typography** — Font families, sizes, weights, and presets
3. **Spacing** — Visual spacing scale
4. **Borders & Radius** — All border radius tokens
5. **Shadows** — Four shadow levels (light/dark)
6. **Buttons** — Primary, secondary, ghost, icon
7. **Form Inputs** — Default, error, disabled states
8. **Badges** — Success, error, warning, brand (with dark variants)
9. **Cards** — Section cards with hover glow overlay
10. **Data Rows** — Block/transaction list rows
11. **Data Tables** — Full table with headers and status badges
12. **Loading States** — Skeleton placeholder patterns
13. **Tooltips** — Info tooltips on hover
14. **Toasts** — Success, error, info notification styles
15. **Code Blocks** — With header and copy button
16. **Empty States** — No-data placeholders
17. **Dark Mode** — Side-by-side light/dark surface comparison

---

## File Structure

```
AvailNexusExplorer/
├── index.html              # Main site (production example)
├── examples.html           # Comprehensive component showcase
├── styles.css              # Design tokens + component styles
├── script.js               # Theme toggle, keyboard shortcuts, data
├── DESIGN_SYSTEM_GUIDE.md  # This file
├── README.md                # Project overview
└── assets/
    ├── images/              # Logo variants (blue, black, white + grid)
    ├── fonts/
    │   └── Delight/         # Serif font for headings/numbers
    ├── icons/               # SVG icons
    ├── favicon/             # Favicon
    ├── js/
    │   ├── halftone-background.js  # Animated dot-grid effect
    │   └── animated-grid.js        # Alternative grid animation
    └── screenshots/         # Reference screenshots
```

---

## Framework Migration Notes

When migrating to a framework (React/Next.js + Tailwind v4):

| Vanilla CSS | Tailwind v4 |
|---|---|
| `var(--foreground)` | `text-foreground` |
| `var(--card-bg)` | `bg-card` |
| `var(--border-color)` | `border-border` |
| `var(--brand)` | `text-brand` |
| `var(--radius-md)` | `rounded-md` |
| `var(--shadow-lg)` | `shadow-lg` |
| `.dark` class on `<html>` | `next-themes` with `attribute="class"` |
| `font-family: var(--font-serif)` | `font-serif` |
| `font-feature-settings: 'tnum'` | `tabular-nums` |

The Avail docs use **Shadcn/ui** conventions for component variants (data-attributes, semantic colour tokens). Plan migration accordingly.

---

**Questions?** Check `styles.css` for token definitions or inspect [docs.availproject.org](https://docs.availproject.org) for the production implementation.