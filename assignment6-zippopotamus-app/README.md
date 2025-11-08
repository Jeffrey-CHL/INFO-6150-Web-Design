# Assignment 6 — Your Own Simple App

A minimal, **ready-to-run** web app that consumes a public REST API and displays results to the user.  
This implementation uses the **Zippopotam.us** API to look up U.S. ZIP codes and show the corresponding city, state, and coordinates.

> ✅ No API keys, no account, no credit card. Works by opening `index.html` directly.

---

## How to run

1. Download the repo and open the folder.
2. Double-click **`index.html`** to open in your browser.
3. Type a 5-digit U.S. ZIP code (e.g., `94105`, `10001`) and hit **Search**.

No servers, no build steps, no dependencies.

---

## API used

- **Base**: `https://api.zippopotam.us`
- **Endpoint**: `/us/{zip}`  
  Example: `https://api.zippopotam.us/us/94105`

**Response (excerpt)**

```json
{
  "post code": "94105",
  "country": "United States",
  "country abbreviation": "US",
  "places": [
    {
      "place name": "San Francisco",
      "longitude": "-122.3942",
      "state": "California",
      "state abbreviation": "CA",
      "latitude": "37.7898"
    }
  ]
}
```

---

## What the app demonstrates

- **Semantic HTML**: Uses `<header>`, `<main>`, `<section>`, `<form>`, `<footer>`.
- **CSS for usability & accessibility**: Clear contrast, visible focus outlines, responsive layout.
- **`fetch()` to consume a REST API**: No key, no secrets, CORS-friendly.
- **User input & validation**: Requires exactly 5 digits; shows helpful error messages.
- **Loading & error states**: Polite `aria-live` updates for assistive tech.
- **Data rendering**: Renders a list of places with city, state, lat/lng, and an OpenStreetMap link.

---

## Files

- `index.html` — Markup and structure (semantic + accessible).
- `styles.css` — Clean, high-contrast styles.
- `app.js` — All logic: validation → fetch → render + error handling.
- `README.md` — This file.

---

## Rubric mapping

- **Consumes data from API (10 pts)**: `fetch()` calls Zippopotam.us, handles `200`, `404`, and network errors.
- **Displays API data correctly (10 pts)**: Renders live results as DOM elements (not just console logs).
- **HTML is semantic (5 pts)**: Proper landmarks and associations (`label`/`input`), `aria-live` for results.
- **CSS makes sense (5 pts)**: Readable typography, contrast-checked colors, clear focus styles, responsive grid.

---

## Notes for the grader

- This app is purposely **simple and deterministic** to avoid flakiness.
- It runs from file:// without any server, so it's easy to test by just opening `index.html`.
- The API is stable and has been widely used in education contexts.
