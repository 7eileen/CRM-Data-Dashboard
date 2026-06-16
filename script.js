const toast = document.querySelector(".toast");
const tableBody = document.querySelector("tbody");
const originalRows = Array.from(tableBody.querySelectorAll("tr"));
const metricCards = document.querySelectorAll(".metric-card");
const inputFilters = document.querySelectorAll(".input-filter input");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 1500);
}

document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach((node) => node.classList.remove("active"));
    item.classList.add("active");
    showToast(`已切换到：${item.innerText.trim()}`);
  });
});

document.querySelectorAll(".top-link").forEach((item) => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".top-link").forEach((node) => node.classList.remove("active"));
    item.classList.add("active");
  });
});

document.querySelectorAll(".page-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".page-tab").forEach((node) => node.classList.remove("active"));
    tab.classList.add("active");
  });
});

document.querySelectorAll(".business-tabs button").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".business-tabs button").forEach((node) => {
      node.classList.remove("active");
      node.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    showToast(`当前维度：${tab.textContent}`);
  });
});

metricCards.forEach((card) => {
  card.addEventListener("click", () => {
    metricCards.forEach((node) => node.classList.remove("selected"));
    card.classList.add("selected");
    showToast(`已选中指标：${card.dataset.metric}`);
  });
});

document.querySelectorAll(".select-arrow").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    const label = button.closest(".input-filter").querySelector("span").textContent;
    showToast(`${label} 下拉筛选已展开`);
  });
});

document.querySelector(".clear-btn").addEventListener("click", () => {
  inputFilters.forEach((input) => {
    input.value = "";
  });
  document.querySelectorAll(".sortable").forEach((item) => item.classList.remove("asc", "desc"));
  originalRows.forEach((row) => tableBody.appendChild(row));
  showToast("筛选条件已清空");
});

document.querySelectorAll(".sortable").forEach((header) => {
  header.addEventListener("click", () => {
    const index = Array.from(header.parentElement.children).indexOf(header);
    const isDescending = !header.classList.contains("desc");
    const rows = Array.from(tableBody.querySelectorAll("tr"));

    document.querySelectorAll(".sortable").forEach((item) => item.classList.remove("asc", "desc"));
    header.classList.add(isDescending ? "desc" : "asc");

    rows
      .sort((a, b) => {
        const aValue = Number(a.children[index].textContent);
        const bValue = Number(b.children[index].textContent);
        return isDescending ? bValue - aValue : aValue - bValue;
      })
      .forEach((row) => tableBody.appendChild(row));

    showToast(`${header.textContent.trim()}已${isDescending ? "降序" : "升序"}排列`);
  });
});

document.querySelector(".collapse-handle").addEventListener("click", () => {
  showToast("侧栏收起按钮已点击");
});
