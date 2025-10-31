
# Assignment 5 — An App with Validation (Pizza Registration)

This repo contains a semantic HTML form with client-side validation using plain JavaScript.

## Files
- `index.html` — Semantic structure and form markup
- `style.css` — Usable, attractive styling (no frameworks)
- `script.js` — Validation logic and interactions

## How to run
Just open `index.html` in your browser. No build step required.

## Validation rules
- **Name**: required, at least 3 characters
- **Year of birth**: required, integer, > 1900 and < current year
- **US resident?**: checkbox toggles zipcode visibility
- **Zipcode**: required only if resident is in the US, exactly 5 digits
- **Password**: required, at least 8 characters
- **Pizza preference**: radio (one of three), required

On submit, field-specific errors are displayed. If all pass, an **Accepted** message appears.
