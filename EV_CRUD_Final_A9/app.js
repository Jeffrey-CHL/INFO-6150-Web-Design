// 定义后端 MockAPI 的基础 URL，所有请求都基于这个地址
const API_BASE = "https://6917d88921a96359486e110a.mockapi.io/Stations";

/**
 * 通用表单读取 + 校验函数
 * （Create 和 Edit 页面都会用到这个函数）
 *
 * 参数：
 *  - fields：一个对象，里面存的是各个 input 的 id（比如 nameId、locationId）
 *  - messageElement：用来显示错误提示的那个 <p> 元素
 *
 * 返回：
 *  - 如果校验通过：返回一个包含所有字段的对象 { name, location, chargerType, price, available }
 *  - 如果校验失败：返回 null
 */
function readAndValidateForm(fields, messageElement) {
  // 根据传入的字段配置，从页面上拿到“名称”输入框的值，并去掉前后空格
  const name = document.getElementById(fields.nameId).value.trim();
  // 拿到“位置”输入框的值，并去掉前后空格
  const location = document.getElementById(fields.locationId).value.trim();
  // 拿到“充电类型”下拉框当前选择的值
  const chargerType = document.getElementById(fields.chargerTypeId).value;
  // 拿到“价格”输入框的字符串值
  const priceValue = document.getElementById(fields.priceId).value;
  // 把价格字符串转换成数字类型，方便后面做大小比较
  const price = parseFloat(priceValue);
  // 拿到“是否可用”下拉框的值，结果是 "true" 或 "false" 字符串，将其转成真正的布尔值
  const available =
    document.getElementById(fields.availableId).value === "true";

  // ======== 以下是表单校验部分 ========

  // 如果名字为空，或者长度小于 2，认为不合法
  if (!name || name.length < 2) {
    // 在 messageElement 中显示错误信息
    messageElement.textContent = "Name must be at least 2 characters.";
    // 添加一个错误样式 class（在 CSS 里控制成红色文字）
    messageElement.className = "error";
    // 返回 null 表示校验失败，外面不要继续发请求
    return null;
  }

  // 如果位置为空，或者长度小于 3，认为不合法
  if (!location || location.length < 3) {
    messageElement.textContent = "Location must be at least 3 characters.";
    messageElement.className = "error";
    return null;
  }

  // 如果没有选择充电类型（值为空字符串），也不合法
  if (!chargerType) {
    messageElement.textContent = "Please choose a charger type.";
    messageElement.className = "error";
    return null;
  }

  // 价格字段必须有值、且是数字、并且大于 0
  if (!priceValue || isNaN(price) || price <= 0) {
    messageElement.textContent =
      "Price must be a positive number (e.g. 0.29).";
    messageElement.className = "error";
    return null;
  }

  // 如果所有校验都通过，清空错误信息和错误样式
  messageElement.textContent = "";
  messageElement.className = "";

  // 返回一个对象，包含所有合法的字段值
  // 这个对象会在后面被 JSON.stringify 发给 API
  return { name, location, chargerType, price, available };
}

// 监听 DOMContentLoaded 事件，表示 HTML 结构已经完全加载完毕（但图片等资源可能还没）
document.addEventListener("DOMContentLoaded", () => {
  // 尝试获取首页列表元素，如果存在说明当前页面是 index.html
  const listElement = document.getElementById("stationsList");
  // 尝试获取详情区域元素，如果存在说明当前页面是 station.html
  const detailsElement = document.getElementById("details");
  // 尝试获取“创建”表单，如果存在说明当前页面是 create.html
  const createForm = document.getElementById("createForm");
  // 尝试获取“编辑”表单，如果存在说明当前页面是 edit.html
  const editForm = document.getElementById("editForm");

  // ========================
  // 首页逻辑：index.html
  // 功能：列出所有充电站 + 每条记录的 Edit、Delete 按钮
  // ========================
  if (listElement) {
    // 使用 fetch 发送 GET 请求到 API_BASE，获取所有充电站数据
    fetch(API_BASE)
      // 第一个 then：把 HTTP Response 转成 JSON 对象/数组
      .then((res) => res.json())
      // 第二个 then：拿到真正的 data（数组），开始渲染页面
      .then((data) => {
        // 在控制台打印一下数据，方便调试
        console.log("Index list data:", data);

        // data 是一个数组，里面每一项都是一个 station 对象
        data.forEach((station) => {
          // 有的记录有 station.id，有的只在 station.Stations 这个字段里存了编号
          // 使用空值合并运算符 ?? ：如果 station.id 有值就用它，否则用 station.Stations
          const id = station.id ?? station.Stations;
          // 在控制台打印当前这条记录，以及最后使用的 id，方便定位 bug
          console.log("Station item:", station, "using id:", id);

          // 为当前 station 创建一个 <li> 元素，用来放在 <ul> 里面
          const li = document.createElement("li");

          // 创建左边的 div，显示主要信息（名称 + 位置）
          const mainDiv = document.createElement("div");
          // 添加一个 class，方便在 CSS 里控制样式
          mainDiv.className = "item-main";
          // 使用 innerHTML 创建内部结构：一个链接，点击跳到详情页面 station.html?id=xxx
          mainDiv.innerHTML =
            '<a href="station.html?id=' +
            encodeURIComponent(id) + // 对 id 做 URL 编码，避免特殊字符造成问题
            '"><strong>' +
            // 显示名称，如果 name 不存在，就显示 "(No name)"
            (station.name ?? "(No name)") +
            "</strong> — " +
            // 显示位置，如果 location 不存在，就显示 "N/A"
            (station.location ?? "N/A") +
            "</a>";

          // 创建右边的 div，用来放操作按钮（Edit + Delete）
          const actionsDiv = document.createElement("div");
          actionsDiv.className = "item-actions";

          // ----- Edit 按钮（实际上是一个 <a> 链接） -----
          const editLink = document.createElement("a");
          // 跳转到编辑页面 edit.html，并带上 id 参数
          editLink.href = "edit.html?id=" + encodeURIComponent(id);
          // 按钮文字
          editLink.textContent = "Edit";
          // 使用次级按钮样式
          editLink.className = "btn-secondary";

          // ----- Delete 按钮 -----
          const deleteBtn = document.createElement("button");
          // 按钮显示的文字
          deleteBtn.textContent = "Delete";
          // 指定按钮类型为 "button"，避免在 form 里触发提交
          deleteBtn.type = "button";
          // 使用“危险”样式（红色）
          deleteBtn.className = "btn-danger";

          // 给 Delete 按钮绑定点击事件，用户点击时会执行这个函数
          deleteBtn.addEventListener("click", () => {
            // 弹出浏览器自带的确认对话框，用户选择 OK/Cancel
            const confirmed = window.confirm(
              "Are you sure you want to delete this?"
            );
            // 如果用户点击“取消”，直接 return，不再继续删除
            if (!confirmed) {
              return;
            }

            // 用户确认删除后，发送 DELETE 请求到 API，对应这条 station 的 id
            fetch(API_BASE + "/" + encodeURIComponent(id), {
              method: "DELETE", // 指定 HTTP 方法为 DELETE
            })
              // 检查响应状态码，如果不是 2xx，则认为失败
              .then((res) => {
                if (!res.ok) {
                  // 抛出错误，触发下面的 catch
                  throw new Error("Delete failed");
                }
                // 如果删除成功，从 DOM 中移除这条 <li>，这样页面上立即消失
                li.remove();
              })
              // 如果网络错误或上面 throw 了错误，会进入这里
              .catch((err) => {
                // 在控制台打印错误详情
                console.error(err);
                // 提示用户删除失败
                alert("Failed to delete station.");
              });
          });

          // 把 Edit 按钮和 Delete 按钮放进 actionsDiv 里
          actionsDiv.appendChild(editLink);
          actionsDiv.appendChild(deleteBtn);

          // 把左边的 mainDiv 和右边的 actionsDiv 都添加到 <li> 里
          li.appendChild(mainDiv);
          li.appendChild(actionsDiv);

          // 最后把这一整条 <li> 加到 <ul id="stationsList"> 列表中
          listElement.appendChild(li);
        });
      })
      // 如果一开始的 fetch 请求失败（比如网络问题），会进入这里
      .catch((err) => {
        // 显示一条错误信息在页面上
        listElement.innerHTML = "<p>Failed to load data.</p>";
        // 控制台打印详细错误信息，方便调试
        console.error(err);
      });
  }

  // ========================
  // 详情页逻辑：station.html
  // 功能：根据 URL 里的 id，展示某一个充电站的详细信息
  // ========================
  if (detailsElement) {
    // 使用 URLSearchParams 解析当前页面 URL 中的查询参数（例如 ?id=3）
    const params = new URLSearchParams(window.location.search);
    // 从查询参数中获取键为 "id" 的值
    const id = params.get("id");

    // 如果 URL 里根本没有 id 参数，就没法知道要看哪条数据
    if (!id) {
      // 显示一条提示信息
      detailsElement.innerHTML = "<p>Missing station id in URL.</p>";
      // 直接退出，不再往下执行
      return;
    }

    // 在控制台打印当前详情页使用的 id，方便调试
    console.log("Detail page id from URL:", id);

    // 调用 API_BASE/id 获取这一条充电站的数据
    fetch(API_BASE + "/" + encodeURIComponent(id))
      // 把响应转成 JSON 对象
      .then((res) => res.json())
      // 拿到 station 对象后，开始处理
      .then((station) => {
        console.log("Detail station data:", station);

        // name 不存在时，显示 "(No name)"，防止 undefined 出现在页面
        const name = station.name ?? "(No name)";
        // location 不存在时，显示 "N/A"
        const location = station.location ?? "N/A";
        // 优先用 chargerType，如果没有，再尝试 chargeType，都没有就显示 "N/A"
        const chargerType =
          station.chargerType ?? station.chargeType ?? "N/A";

        // 处理价格字段
        let price = "N/A";
        // 如果 price 是数字类型，就保留两位小数
        if (typeof station.price === "number") {
          price = station.price.toFixed(2);
        }

        // 处理 available 字段，把 true/false 转成 "Yes"/"No"
        const raw = station.available;
        let available = "Unknown";
        if (raw === true || raw === "true") {
          available = "Yes";
        } else if (raw === false || raw === "false") {
          available = "No";
        }

        // 使用 innerHTML 把详情内容插入到页面上
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
      // 如果详情页请求失败（比如网络问题或 id 不存在），进入这里
      .catch((err) => {
        // 在页面上显示加载失败
        detailsElement.innerHTML = "<p>Failed to load station data.</p>";
        // 控制台打印错误用于调试
        console.error(err);
      });
  }

  // ========================
  // 创建页逻辑：create.html
  // 功能：通过表单创建一条新的充电站记录（POST）
  // ========================
  if (createForm) {
    // 获取用于显示提示信息的 <p id="message">
    const message = document.getElementById("message");

    // 给创建表单绑定 submit 事件监听
    createForm.addEventListener("submit", (event) => {
      // 阻止浏览器默认提交表单行为（默认会刷新页面）
      event.preventDefault();

      // 调用通用的表单读取 + 校验函数
      // 传入当前页面中各个 input 的 id
      const formData = readAndValidateForm(
        {
          nameId: "name",
          locationId: "location",
          chargerTypeId: "chargerType",
          priceId: "price",
          availableId: "available",
        },
        message // 用于显示错误信息的元素
      );

      // 如果返回 null，说明校验没通过，直接停止，不发请求
      if (!formData) {
        return;
      }

      // 如果校验通过，发送 POST 请求创建新记录
      fetch(API_BASE, {
        method: "POST", // HTTP 方法为 POST，表示创建
        headers: { "Content-Type": "application/json" }, // 告诉服务器我们发的是 JSON
        body: JSON.stringify(formData), // 把 JS 对象转换成 JSON 字符串
      })
        // 把响应转成 JSON，虽然这里不一定强依赖返回值，但打印有助于调试
        .then((res) => res.json())
        .then((data) => {
          console.log("Created station:", data);
          // 提示用户创建成功
          message.textContent =
            "Created successfully! Redirecting to homepage...";
          message.className = "";
          // 0.8 秒后跳回首页，让用户看到最新的列表
          setTimeout(() => {
            window.location.href = "index.html";
          }, 800);
        })
        // 如果请求失败，显示错误提示
        .catch((err) => {
          message.textContent = "Failed to create station.";
          message.className = "error";
          console.error(err);
        });
    });
  }

  // ========================
  // 编辑页逻辑：edit.html
  // 功能：先拉取已有数据，预填表单，然后提交 PUT 更新
  // ========================
  if (editForm) {
    // 获取用于显示编辑页提示信息的元素
    const editMessage = document.getElementById("edit-message");
    // 从 URL 中读取 id 参数（例如 edit.html?id=3）
    const params = new URLSearchParams(window.location.search);
    const urlId = params.get("id");

    // 如果 URL 没有带 id，那就没法编辑任何记录
    if (!urlId) {
      editMessage.textContent = "Missing station id in URL.";
      editMessage.className = "error";
      return;
    }

    // 打印当前编辑的 id，方便调试
    console.log("Edit page id from URL:", urlId);

    // 第一步：页面加载时，先根据 id 从后端拉一次数据，用来预填表单
    fetch(API_BASE + "/" + encodeURIComponent(urlId))
      .then((res) => res.json())
      .then((station) => {
        console.log("Edit page station data:", station);

        // 把接口返回的数据填入到对应的 input 和 select 中
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
      // 如果预填数据失败，比如网断了或 id 找不到，就显示错误
      .catch((err) => {
        editMessage.textContent = "Failed to load station data.";
        editMessage.className = "error";
        console.error(err);
      });

    // 第二步：用户修改完表单后，提交更新（PUT）
    editForm.addEventListener("submit", (event) => {
      // 同样阻止表单默认提交行为
      event.preventDefault();

      // 复用通用的表单读取 + 校验函数，这次传 edit 页的 input id
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

      // 如果校验失败，直接 return，不发请求
      if (!formData) {
        return;
      }

      // 校验通过，用 PUT 请求更新这一条 station
      fetch(API_BASE + "/" + encodeURIComponent(urlId), {
        method: "PUT", // 使用 PUT 表示更新整个资源
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Updated station:", data);
          // 提示用户更新成功，并且稍后跳转回首页
          editMessage.textContent =
            "Updated successfully! Redirecting to homepage...";
          editMessage.className = "";
          setTimeout(() => {
            window.location.href = "index.html";
          }, 800);
        })
        // 如果更新失败，显示错误信息
        .catch((err) => {
          editMessage.textContent = "Failed to update station.";
          editMessage.className = "error";
          console.error(err);
        });
    });
  }
});
