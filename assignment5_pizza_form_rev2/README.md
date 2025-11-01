
# Assignment 5 — An App with Validation (Rev 2)

This revision addresses instructor feedback:

- **Contrast**: Increased border thickness and contrast for inputs, fieldsets, and buttons. Stronger focus outline.
- **Semantics**: Removed unnecessary `<article>` wrapper under `<main>` (now using `<section class="card">`).
- **Coding style**:
  - Renamed short/ambiguous names (`s()` → `trimStringSafely()`, etc.).
  - Avoided one-line `if` statements—now all `if` blocks use braces with one statement per line.
  - Replaced terse variables with descriptive names.

## Files
- `index.html` — Form markup, semantic structure
- `style.css` — Higher-contrast, accessible styling
- `script.js` — Validation logic with clear naming and full `if` blocks

## How to run
Open `index.html` in your browser. No build step required.
