/* INFO 6150 — Assignment 6 — app.js
   App name: ZIP Lookup using Zippopotam.us
   Why this API?
     - Free, public, no API key, no credit card.
     - CORS-enabled; can be called directly from the browser.
     - Predictable REST path: https://api.zippopotam.us/us/{ZIP}
   What does the app do?
     - Validates a 5-digit U.S. ZIP code from the user.
     - Uses fetch() to call the API.
     - Renders the returned places (city/state/lat/lng) into the page.
     - Handles loading states, 404 (ZIP not found), and network errors.
*/

const form = document.getElementById('zip-form');
const input = document.getElementById('zip-input');
const results = document.getElementById('results');
const errorMsg = document.getElementById('form-error');
const demoChips = document.querySelectorAll('[data-demo]');

// Hook up demo chips for quick testing
demoChips.forEach(chip => {
  chip.addEventListener('click', () => {
    input.value = chip.getAttribute('data-demo');
    input.focus();
  });
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearMessages();

  const zip = (input.value || '').trim();
  if (!/^\d{5}$/.test(zip)) {
    showFormError('Please enter exactly 5 digits (e.g., 94105).');
    input.focus();
    return;
  }

  // Render loading state
  results.innerHTML = '<p class="muted">Loading… fetching data from Zippopotam.us</p>';

  try {
    const endpoint = `https://api.zippopotam.us/us/${zip}`;
    const res = await fetch(endpoint, { method: 'GET' });

    // The API returns 404 for unknown ZIPs; handle explicitly
    if (!res.ok) {
      if (res.status === 404) {
        results.innerHTML = '<p class="error">No data found for that ZIP code.</p>';
      } else {
        results.innerHTML = `<p class="error">API error: ${res.status} ${res.statusText}</p>`;
      }
      return;
    }

    const data = await res.json();
    renderResults(data);
  } catch (err) {
    console.error(err);
    results.innerHTML = '<p class="error">Network error. Please check your connection and try again.</p>';
  }
});

function clearMessages() {
  errorMsg.textContent = '';
}

function showFormError(msg) {
  errorMsg.textContent = msg;
}

function renderResults(data) {
  /* Expected data shape (example for 94105):
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
  */
  const country = data.country;
  const abbr = data["country abbreviation"];
  const list = data.places || [];

  if (!Array.isArray(list) || list.length === 0) {
    results.innerHTML = '<p class="error">No places returned by the API.</p>';
    return;
  }

  // Create a heading summary and a list of places
  const ul = document.createElement('ul');
  ul.className = 'result-list';

  list.forEach(place => {
    const li = document.createElement('li');
    li.className = 'result-item';

    const city = place["place name"];
    const state = place["state"];
    const stateAbbr = place["state abbreviation"];
    const lat = place["latitude"];
    const lng = place["longitude"];

    // Build an accessible card per place
    li.innerHTML = `
      <div><strong>${city}, ${state} (${stateAbbr})</strong></div>
      <div class="meta">Country: ${country} (${abbr})</div>
      <div class="meta">Coordinates: ${lat}, ${lng}</div>
      <div><a class="map-link" href="https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=12/${lat}/${lng}" target="_blank" rel="noopener">Open in OpenStreetMap</a></div>
    `;

    ul.appendChild(li);
  });

  // Replace results content with the list
  results.innerHTML = '';
  const summary = document.createElement('p');
  summary.className = 'muted';
  summary.textContent = `Found ${list.length} place(s) for ZIP ${data["post code"]}.`;

  results.appendChild(summary);
  results.appendChild(ul);
}
