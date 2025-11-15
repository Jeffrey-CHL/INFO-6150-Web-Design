// Single JS file used by all pages

const API_BASE = "https://6917d88921a96359486e110a.mockapi.io/Stations";

document.addEventListener("DOMContentLoaded", () => {
  const listElement = document.getElementById("stationsList");
  const detailsElement = document.getElementById("details");
  const form = document.getElementById("createForm");

  // ============ INDEX: list ============
  if (listElement) {
    fetch(API_BASE)
      .then(res => res.json())
      .then(data => {
        data.forEach(station => {
          // 用 Stations 字段作为一个“代码”放到 URL 里
          const code = station.Stations || station.id;
          const name = station.name ?? "(No name)";
          const location = station.location ?? "N/A";

          const li = document.createElement("li");
          li.innerHTML =
            '<a href="station.html?code=' + encodeURIComponent(code) + '">' +
            '<strong>' + name + '</strong> — ' + location +
            '</a>';
          listElement.appendChild(li);
        });
      })
      .catch(err => {
        listElement.innerHTML = "<p>Failed to load data.</p>";
        console.error(err);
      });
  }

  // ============ DETAIL: single item ============
  if (detailsElement) {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) {
      detailsElement.innerHTML = "<p>Missing station code in URL.</p>";
      return;
    }

    // 这里不再请求 /Stations/:id，而是请求整个列表，然后在前端找到匹配的那一条
    fetch(API_BASE)
      .then(res => res.json())
      .then(list => {
        console.log("Full list from API:", list);

        const station = list.find(item =>
          String(item.Stations) === String(code) ||
          String(item.id) === String(code)
        );

        console.log("Matched station:", station);

        if (!station) {
          detailsElement.innerHTML = "<p>Station not found.</p>";
          return;
        }

        const name = station.name ?? "(No name)";
        const location = station.location ?? "N/A";
        const chargerType =
          station.chargerType ?? station.chargeType ?? "N/A";

        let price = "N/A";
        if (typeof station.price === "number") {
          price = station.price.toFixed(2);
        }

        const raw = station.available;
        let available = "Unknown";
        if (raw === true || raw === "true") available = "Yes";
        else if (raw === false || raw === "false") available = "No";

        detailsElement.innerHTML =
          "<h1>" + name + "</h1>" +
          "<p><strong>Location:</strong> " + location + "</p>" +
          "<p><strong>Charger Type:</strong> " + chargerType + "</p>" +
          "<p><strong>Price (per kWh):</strong> " +
          (price === "N/A" ? "N/A" : "$" + price) + "</p>" +
          "<p><strong>Available Now:</strong> " + available + "</p>";
      })
      .catch(err => {
        detailsElement.innerHTML = "<p>Failed to load station data.</p>";
        console.error(err);
      });
  }

  // ============ CREATE: form ============
  if (form) {
    const msg = document.getElementById("message");

    form.addEventListener("submit", evt => {
      evt.preventDefault();

      const name = document.getElementById("name").value.trim();
      const location = document.getElementById("location").value.trim();
      const chargerType = document.getElementById("chargerType").value;
      const priceValue = document.getElementById("price").value;
      const price = parseFloat(priceValue);
      const available = document.getElementById("available").value === "true";

      if (!name || name.length < 2) {
        msg.textContent = "Name must be at least 2 characters.";
        msg.className = "error";
        return;
      }
      if (!location || location.length < 3) {
        msg.textContent = "Location must be at least 3 characters.";
        msg.className = "error";
        return;
      }
      if (!chargerType) {
        msg.textContent = "Please select a charger type.";
        msg.className = "error";
        return;
      }
      if (!priceValue || isNaN(price) || price <= 0) {
        msg.textContent = "Price must be a positive number (e.g. 0.29).";
        msg.className = "error";
        return;
      }

      const newStation = { name, location, chargerType, price, available };

      fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStation)
      })
        .then(res => res.json())
        .then(data => {
          console.log("Created:", data);
          msg.textContent = "Created successfully! Redirecting...";
          msg.className = "";
          setTimeout(() => {
            window.location.href = "index.html";
          }, 1000);
        })
        .catch(err => {
          msg.textContent = "Failed to create station.";
          msg.className = "error";
          console.error(err);
        });
    });
  }
});
