# Nexus Explorer — Design System Implementation

**Example implementation for the Avail Nexus Explorer**, demonstrating how to apply the official Avail design system from [docs.availproject.org](https://docs.availproject.org).

🔗 **Live Reference**: [nexus-v2.mainnet.avail.so](https://nexus-v2.mainnet.avail.so)
📚 **Design System**: [docs.availproject.org](https://docs.availproject.org)

---

## Quick Start

```bash
# Navigate to project
cd ~/Documents/Code/AvailNexusExplorer

# Start local preview server
python3 -m http.server 8080

# Open in browser
open http://localhost:8080                # Main site
open http://localhost:8080/examples.html  # Component showcase
```

---

## Project Structure

```
AvailNexusExplorer/
├── index.html              # Production homepage
├── examples.html           # Comprehensive component showcase (16 sections)
├── styles.css              # Design tokens + all component styles
├── script.js               # Theme toggle, keyboard shortcuts, rendering
├── DESIGN_SYSTEM_GUIDE.md  # Complete implementation guide
├── README.md               # This file
└── assets/
    ├── images/             # Logo variants (blue, black, white + grid)
    ├── fonts/
    │   └── Delight/        # Serif display font (Regular, Bold)
    ├── icons/              # SVG icons
    ├── favicon/            # Favicon
    ├── js/
    │   ├── halftone-background.js  # Animated dot-grid effect
    │   └── animated-grid.js        # Alternative grid animation
    └── screenshots/        # Reference screenshots
```

---

## Key Features

### Design Tokens
All colours, typography, spacing, radius, shadows, and transitions are defined as CSS custom properties matching the Avail docs design system. Light/dark mode is handled via semantic token pairs.

### Component Showcase
Open `examples.html` for interactive demonstrations of:
- Colour palette (brand, semantic, status)
- Typography (3 font families, size/weight scales)
- Spacing and border radius scales
- Shadows (4 levels, light/dark)
- Buttons (primary, secondary, ghost, icon)
- Form inputs (default, error, disabled)
- Status badges (with dark mode variants)
- Cards (with hover glow overlay animation)
- Data rows and tables
- Loading skeletons
- Toasts, tooltips, code blocks
- Empty states
- Dark mode comparison

### Card Hover Pattern
Cards use the **Avail docs hover glow** pattern — a `::after` pseudo-element with `bg-card-shadow` + `border-brand/20` that fades in on hover, combined with a subtle `translate(-1px, -1px)` animation.

### Hero Glow Effect
The hero title has a radial gradient pseudo-element matching the Avail docs hero section.

### Typography
Three-font system matching the Avail docs:
- **Geist Sans** (via Inter fallback) — UI text
- **Delight** — Headings and display numbers
- **JetBrains Mono** — Code, hashes, block numbers

### Accessibility
- Skip-to-content link
- Focus-visible states on all interactive elements
- ARIA labels on icon buttons
- ARIA attributes on mobile menu
- `prefers-color-scheme` detection
- Flash-prevention on dark mode load
- Semantic HTML landmarks
- `font-feature-settings: 'tnum'` for numeric alignment

### Dark Mode
- Class-based toggling via `.dark` on `<html>`
- Full semantic token pairs (light default, dark override)
- No-flash inline script in `<head>`
- localStorage persistence
- System preference detection

---

## What Changed (vs. Previous Version)

This version significantly enhances the design system implementation to accurately match [docs.availproject.org](https://docs.availproject.org):

| Area | Previous | Updated |
|---|---|---|
| **Colour tokens** | ~40 tokens | ~90+ tokens (full palette incl. blue-150, blue-850, blue-950, grey-l-400, grey-l-600, grey-d-800, etc.) |
| **Typography** | Inter/Delight/JetBrains | Added Geist font family, text size scale, weight scale, leading scale, tracking scale, tnum |
| **Border radius** | Hardcoded values | Full token scale (xs through full) |
| **Shadows** | Light-only | Dual light/dark shadow pairs |
| **Transitions** | Basic ease | Full easing library (ease-in-out, ease-out, ease-card) |
| **Card hover** | Box-shadow only | Avail docs pattern (translate + glow overlay with `color-mix`) |
| **Hero** | Plain text | Added `::before` glow effect pseudo-element |
| **Keyboard badge** | Basic border | Avail docs pattern (border-bottom separator) |
| **Status badges** | Light-only | Full dark mode variants (inverted colours) |
| **Accessibility** | ARIA labels | Added skip-to-content, mobile ARIA, focus-visible, flash prevention |
| **Mobile** | No mobile nav | Added hamburger menu + slide-down nav |
| **Examples page** | 6 sections | 16 sections (colours, typography, spacing, radius, shadows, buttons, inputs, badges, cards, data rows, tables, loading, tooltips, toasts, code blocks, empty states, dark mode) |
| **Design guide** | Basic | Comprehensive (full token tables, framework migration notes, component patterns) |

---

## Development Workflow

### 1. Preview Changes
```bash
python3 -m http.server 8080
open http://localhost:8080
```

### 2. Test Dark Mode
Click the sun/moon toggle or use the examples page to verify both themes.

### 3. Add New Components
1. Define semantic tokens in `styles.css` (if needed)
2. Add light/dark variants in `.dark` block
3. Create component using BEM naming: `.component`, `.component__element`, `.component--modifier`
4. Test in both themes on the examples page

### 4. Replace Example Data
Update `EXAMPLE_STATS`, `EXAMPLE_BLOCKS`, and `EXAMPLE_RFFS` in `script.js` with real API calls.

---

## Framework Migration

When moving to React/Next.js + Tailwind v4:
- All CSS custom properties map directly to Tailwind utility classes
- Use `next-themes` with `attribute="class"` for dark mode
- Follow Shadcn/ui component conventions (data-attribute variants)
- See `DESIGN_SYSTEM_GUIDE.md` for the full token-to-utility mapping

---

## Documentation

- **[DESIGN_SYSTEM_GUIDE.md](./DESIGN_SYSTEM_GUIDE.md)** — Complete token reference and implementation guide
- **[examples.html](./examples.html)** — Interactive component showcase
- **[docs.availproject.org](https://docs.availproject.org)** — Official Avail documentation

---

**Built with vanilla HTML, CSS, and JavaScript** — no frameworks or build tools required.