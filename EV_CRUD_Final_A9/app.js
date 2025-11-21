// Base URL for your MockAPI "Stations" resource
const API_BASE = "https://6917d88921a96359486e110a.mockapi.io/Stations";

/**
 * Helper: read and validate form fields for both create and edit.
 * Returns an object with the field values, or null if validation fails.
 */
function readAndValidateForm(fields, messageElement) {
  const name = document.getElementById(fields.nameId).value.trim();
  const location = document.getElementById(fields.locationId).value.trim();
  const chargerType = document.getElementById(fields.chargerTypeId).value;
  const priceValue = document.getElementById(fields.priceId).value;
  const price = parseFloat(priceValue);
  const available =
    document.getElementById(fields.availableId).value === "true";

  // Simple validations
  if (!name || name.length < 2) {
    messageElement.textContent = "Name must be at least 2 characters.";
    messageElement.className = "error";
    return null;
  }

  if (!location || location.length < 3) {
    messageElement.textContent = "Location must be at least 3 characters.";
    messageElement.className = "error";
    return null;
  }

  if (!chargerType) {
    messageElement.textContent = "Please choose a charger type.";
    messageElement.className = "error";
    return null;
  }

  if (!priceValue || isNaN(price) || price <= 0) {
    messageElement.textContent =
      "Price must be a positive number (e.g. 0.29).";
    messageElement.className = "error";
    return null;
  }

  messageElement.textContent = "";
  messageElement.className = "";
  return { name, location, chargerType, price, available };
}

document.addEventListener("DOMContentLoaded", () => {
  const listElement = document.getElementById("stationsList");
  const detailsElement = document.getElementById("details");
  const createForm = document.getElementById("createForm");
  const editForm = document.getElementById("editForm");

  // ========================
  // INDEX PAGE (list + edit + delete)
  // ========================
  if (listElement) {
    fetch(API_BASE)
      .then((res) => res.json())
      .then((data) => {
        console.log("Index list data:", data);

        data.forEach((station) => {
          // 关键：这里统一拿 id（兼容你的 Stations 字段）
          const id = station.id ?? station.Stations;
          console.log("Station item:", station, "using id:", id);

          const li = document.createElement("li");

          const mainDiv = document.createElement("div");
          mainDiv.className = "item-main";
          mainDiv.innerHTML =
            '<a href="station.html?id=' +
            encodeURIComponent(id) +
            '"><strong>' +
            (station.name ?? "(No name)") +
            "</strong> — " +
            (station.location ?? "N/A") +
            "</a>";

          const actionsDiv = document.createElement("div");
          actionsDiv.className = "item-actions";

          // Edit link
          const editLink = document.createElement("a");
          editLink.href = "edit.html?id=" + encodeURIComponent(id);
          editLink.textContent = "Edit";
          editLink.className = "btn-secondary";

          // Delete button
          const deleteBtn = document.createElement("button");
          deleteBtn.textContent = "Delete";
          deleteBtn.type = "button";
          deleteBtn.className = "btn-danger";
          deleteBtn.addEventListener("click", () => {
            const confirmed = window.confirm(
              "Are you sure you want to delete this?"
            );
            if (!confirmed) {
              return;
            }

            fetch(API_BASE + "/" + encodeURIComponent(id), {
              method: "DELETE",
            })
              .then((res) => {
                if (!res.ok) {
                  throw new Error("Delete failed");
                }
                li.remove();
              })
              .catch((err) => {
                console.error(err);
                alert("Failed to delete station.");
              });
          });

          actionsDiv.appendChild(editLink);
          actionsDiv.appendChild(deleteBtn);

          li.appendChild(mainDiv);
          li.appendChild(actionsDiv);
          listElement.appendChild(li);
        });
      })
      .catch((err) => {
        listElement.innerHTML = "<p>Failed to load data.</p>";
        console.error(err);
      });
  }

  // ========================
  // DETAIL PAGE (station.html)
  // ========================
  if (detailsElement) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
      detailsElement.innerHTML = "<p>Missing station id in URL.</p>";
      return;
    }

    console.log("Detail page id from URL:", id);

    fetch(API_BASE + "/" + encodeURIComponent(id))
      .then((res) => res.json())
      .then((station) => {
        console.log("Detail station data:", station);

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
        if (raw === true || raw === "true") {
          available = "Yes";
        } else if (raw === false || raw === "false") {
          available = "No";
        }

        detailsElement.innerHTML =
          "<h1>" +
          name +
          "</h1>" +
          "<p><strong>Location:</strong> " +
          location +
          "</p>" +
          "<p><strong>Charger Type:</strong> " +
          chargerType +
          "</p>" +
          "<p><strong>Price (per kWh):</strong> " +
          (price === "N/A" ? "N/A" : "$" + price) +
          "</p>" +
          "<p><strong>Available Now:</strong> " +
          available +
          "</p>";
      })
      .catch((err) => {
        detailsElement.innerHTML = "<p>Failed to load station data.</p>";
        console.error(err);
      });
  }

  // ========================
  // CREATE PAGE (create.html)
  // ========================
  if (createForm) {
    const message = document.getElementById("message");

    createForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = readAndValidateForm(
        {
          nameId: "name",
          locationId: "location",
          chargerTypeId: "chargerType",
          priceId: "price",
          availableId: "available",
        },
        message
      );

      if (!formData) {
        return;
      }

      fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Created station:", data);
          message.textContent =
            "Created successfully! Redirecting to homepage...";
          message.className = "";
          setTimeout(() => {
            window.location.href = "index.html";
          }, 800);
        })
        .catch((err) => {
          message.textContent = "Failed to create station.";
          message.className = "error";
          console.error(err);
        });
    });
  }

  // ========================
  // EDIT PAGE (edit.html)
  // ========================
  if (editForm) {
    const editMessage = document.getElementById("edit-message");
    const params = new URLSearchParams(window.location.search);
    const urlId = params.get("id");

    if (!urlId) {
      editMessage.textContent = "Missing station id in URL.";
      editMessage.className = "error";
      return;
    }

    console.log("Edit page id from URL:", urlId);

    // 1) 进入页面时，先拉取旧数据预填 form
    fetch(API_BASE + "/" + encodeURIComponent(urlId))
      .then((res) => res.json())
      .then((station) => {
        console.log("Edit page station data:", station);

        document.getElementById("edit-name").value = station.name ?? "";
        document.getElementById("edit-location").value =
          station.location ?? "";
        document.getElementById("edit-chargerType").value =
          station.chargerType ?? station.chargeType ?? "";
        document.getElementById("edit-price").value =
          station.price ?? "";
        document.getElementById("edit-available").value =
          station.available === true || station.available === "true"
            ? "true"
            : "false";
      })
      .catch((err) => {
        editMessage.textContent = "Failed to load station data.";
        editMessage.className = "error";
        console.error(err);
      });

    // 2) 提交修改
    editForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = readAndValidateForm(
        {
          nameId: "edit-name",
          locationId: "edit-location",
          chargerTypeId: "edit-chargerType",
          priceId: "edit-price",
          availableId: "edit-available",
        },
        editMessage
      );

      if (!formData) {
        return;
      }

      fetch(API_BASE + "/" + encodeURIComponent(urlId), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Updated station:", data);
          editMessage.textContent =
            "Updated successfully! Redirecting to homepage...";
          editMessage.className = "";
          setTimeout(() => {
            window.location.href = "index.html";
          }, 800);
        })
        .catch((err) => {
          editMessage.textContent = "Failed to update station.";
          editMessage.className = "error";
          console.error(err);
        });
    });
  }
});
