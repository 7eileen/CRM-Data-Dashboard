const toast = document.querySelector(".toast");
const metricGrid = document.querySelector(".metric-grid");
const filters = document.querySelector(".filters");
const tableWrap = document.querySelector(".table-wrap");
const followModal = document.querySelector(".follow-modal");
const followConfirmButton = document.querySelector(".dialog-confirm");
const businessTabs = Array.from(document.querySelectorAll(".business-tabs button"));
const defaultView = {
  metrics: metricGrid.innerHTML,
  filters: filters.innerHTML,
  table: tableWrap.innerHTML,
};

let toastTimer;
let currentView = "business";

const tooltipMap = {
  "跟进优惠金额": "查询时间段内跟进达人的成交优惠金额求和",
  "跟进总GSV": "查询时间段内跟进达人的成交净额求和",
  "跟进退款金额": "查询时间段内跟进达人的退款金额求和",
};

const influencerMetrics = [
  { tone: "amber", title: "跟进优惠金额", value: "4,997,538.92" },
  { tone: "mint", title: "跟进总GSV", value: "39,938,170.87" },
  { tone: "violet", title: "跟进退款金额", value: "14,957,868.59" },
];

const influencerRows = [
  {
    platform: "蘑菇街",
    avatar: "小甜",
    name: "小甜心呢",
    accountLabel: "蘑菇街账号:",
    uid: "达人UID:0",
    owner: "姜婉婷",
    category: "定型,定妆,粉底,遮瑕,防晒喷雾",
    play: "混播",
    level: "A",
    firstFollow: "2026-06-11",
    canCooperate: "",
    status: "已建联",
  },
  {
    platform: "抖音",
    avatar: "爱跑",
    name: "爱跑步的李老师",
    accountLabel: "抖音账号:",
    uid: "达人UID:100420077645",
    owner: "戴娜",
    category: "定型,防晒喷雾",
    play: "混播",
    level: "C",
    firstFollow: "2026-04-13",
    canCooperate: "",
    status: "已跟进",
  },
  {
    platform: "抖音",
    avatar: "彩虹",
    name: "彩虹糖不是糖",
    accountLabel: "抖音账号:",
    uid: "达人UID:102693386219",
    owner: "李梦洁",
    category: "遮瑕",
    play: "短视频挂车",
    level: "A",
    firstFollow: "2026-04-03",
    canCooperate: "",
    status: "合作",
  },
  {
    platform: "抖音",
    avatar: "甜心",
    name: "甜心哩哩BABI定妆喷雾专场",
    accountLabel: "抖音账号:",
    uid: "达人UID:109816728631",
    owner: "赵磊",
    category: "定妆,防晒喷雾",
    play: "混播",
    level: "B",
    firstFollow: "2026-03-28",
    canCooperate: "是",
    status: "合作",
  },
];

const unfollowedRows = [
  {
    name: "小栗子不熬夜",
    uid: "11203948021",
    gmv: "386,492.80",
    category: "定妆喷雾",
    platform: "抖音",
    source: "达人自然流",
  },
  {
    name: "一颗橘子呀",
    uid: "10887455290",
    gmv: "279,185.66",
    category: "防晒喷雾",
    platform: "抖音",
    source: "达播",
  },
  {
    name: "晚风美妆日记",
    uid: "10089376145",
    gmv: "193,850.12",
    category: "粉底液",
    platform: "快手",
    source: "达人自然流",
  },
  {
    name: "阿蓝护肤实验室",
    uid: "9876420351",
    gmv: "151,604.37",
    category: "遮瑕",
    platform: "小红书",
    source: "达播",
  },
  {
    name: "柚子今天营业",
    uid: "7629042188",
    gmv: "96,733.20",
    category: "定型喷雾",
    platform: "抖音",
    source: "达人自然流",
  },
];

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[char];
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 1500);
}

function metricHelp(title) {
  const tooltip = tooltipMap[title] || "查看该指标的数据统计构成";
  return `<span class="metric-help" data-tooltip="${escapeHtml(tooltip)}">?</span>`;
}

function renderMetricCard(metric) {
  return `
    <button class="metric-card ${metric.tone}" data-metric="${escapeHtml(metric.title)}">
      <span class="metric-icon">◔</span>
      <span class="metric-label">
        <span class="metric-title">${escapeHtml(metric.title)}</span>
        ${metricHelp(metric.title)}
      </span>
      <strong>${escapeHtml(metric.value)}</strong>
    </button>
  `;
}

function renderInfluencerFilters() {
  filters.innerHTML = `
    <button class="filter disabled">
      <span>集团跟进类型：</span>
      <em>BABI 达播</em>
    </button>
    <button class="filter date">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M16 2v4" />
        <path d="M8 2v4" />
        <path d="M3 10h18" />
      </svg>
      <span>2026-05-18</span>
      <span>-</span>
      <span>2026-06-16</span>
    </button>
    <label class="filter input-filter">
      <span>商务名称:</span>
      <input type="text" placeholder="请输入" />
      <button class="select-arrow" aria-label="展开商务名称">⌄</button>
    </label>
    <label class="filter input-filter">
      <span>末级部门:</span>
      <input type="text" placeholder="请输入" />
      <button class="select-arrow" aria-label="展开末级部门">⌄</button>
    </label>
    <button class="clear-btn">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 12a9 9 0 0 1 14.65-7" />
        <path d="M17 3v5h-5" />
        <path d="M21 12a9 9 0 0 1-14.65 7" />
        <path d="M7 21v-5h5" />
      </svg>
      <span>清空</span>
    </button>
  `;
}

function renderInfluencerTable() {
  const rows = influencerRows
    .map(
      (row) => `
        <tr>
          <td>${escapeHtml(row.platform)}</td>
          <td>
            <div class="creator-info">
              <span class="creator-avatar">${escapeHtml(row.avatar)}</span>
              <span class="creator-copy">
                <strong>${escapeHtml(row.name)}</strong>
                <em>${escapeHtml(row.accountLabel)}</em>
                <em>${escapeHtml(row.uid)}</em>
              </span>
            </div>
          </td>
          <td>${escapeHtml(row.owner)}</td>
          <td>${escapeHtml(row.category)}</td>
          <td>${escapeHtml(row.play)}</td>
          <td>${escapeHtml(row.level)}</td>
          <td>${escapeHtml(row.firstFollow)}</td>
          <td>${escapeHtml(row.canCooperate)}</td>
          <td>${escapeHtml(row.status)}</td>
        </tr>
      `,
    )
    .join("");

  tableWrap.innerHTML = `
    <table>
      <colgroup>
        <col style="width: 120px" />
        <col style="width: 350px" />
        <col style="width: 130px" />
        <col style="width: 290px" />
        <col style="width: 190px" />
        <col style="width: 130px" />
        <col style="width: 190px" />
        <col style="width: 190px" />
        <col style="width: 160px" />
      </colgroup>
      <thead>
        <tr>
          <th>跟进平台</th>
          <th>达人信息</th>
          <th>跟进商务</th>
          <th>合作品类</th>
          <th>玩法</th>
          <th>重要程度</th>
          <th>首次跟进时间</th>
          <th>是否可合作新品</th>
          <th>跟进状态</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function renderUnfollowedFilters() {
  filters.innerHTML = `
    <button class="filter disabled">
      <span>统计范围：</span>
      <em>当月达播未跟进</em>
    </button>
    <button class="filter date">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M16 2v4" />
        <path d="M8 2v4" />
        <path d="M3 10h18" />
      </svg>
      <span>2026-06-01</span>
      <span>-</span>
      <span>2026-06-16</span>
    </button>
    <label class="filter input-filter">
      <span>达人昵称:</span>
      <input type="text" placeholder="请输入" />
      <button class="select-arrow" aria-label="展开达人昵称">⌄</button>
    </label>
    <label class="filter input-filter">
      <span>来源:</span>
      <input type="text" placeholder="请输入" />
      <button class="select-arrow" aria-label="展开来源">⌄</button>
    </label>
    <button class="clear-btn">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 12a9 9 0 0 1 14.65-7" />
        <path d="M17 3v5h-5" />
        <path d="M21 12a9 9 0 0 1-14.65 7" />
        <path d="M7 21v-5h5" />
      </svg>
      <span>清空</span>
    </button>
  `;
}

function renderUnfollowedTable() {
  const rows = unfollowedRows
    .map(
      (row) => `
        <tr>
          <td>${escapeHtml(row.name)}</td>
          <td>${escapeHtml(row.uid)}</td>
          <td>${escapeHtml(row.gmv)}</td>
          <td>${escapeHtml(row.category)}</td>
          <td>${escapeHtml(row.platform)}</td>
          <td><span class="source-pill">${escapeHtml(row.source)}</span></td>
          <td>
            <div class="operation-cell">
              <button class="table-action follow-record-btn" type="button" data-name="${escapeHtml(row.name)}">达人跟进记录</button>
              <button class="table-action confirm-follow-btn" type="button" data-name="${escapeHtml(row.name)}">确认跟进</button>
            </div>
          </td>
        </tr>
      `,
    )
    .join("");

  tableWrap.innerHTML = `
    <table>
      <colgroup>
        <col style="width: 270px" />
        <col style="width: 230px" />
        <col style="width: 220px" />
        <col style="width: 260px" />
        <col style="width: 180px" />
        <col style="width: 240px" />
        <col style="width: 270px" />
      </colgroup>
      <thead>
        <tr>
          <th>达人昵称</th>
          <th>UID</th>
          <th class="sortable" data-sort="gmv">成交GMV <span></span></th>
          <th>对应订单品类</th>
          <th>平台</th>
          <th>来源</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function renderInfluencerView() {
  currentView = "influencer";
  metricGrid.innerHTML = influencerMetrics.map(renderMetricCard).join("");
  renderInfluencerFilters();
  renderInfluencerTable();
  metricGrid.classList.remove("empty");
  tableWrap.classList.remove("unfollowed-view");
  tableWrap.classList.add("influencer-view");
  bindDynamicControls();
}

function renderUnfollowedView() {
  currentView = "unfollowed";
  metricGrid.innerHTML = "";
  renderUnfollowedFilters();
  renderUnfollowedTable();
  metricGrid.classList.add("empty");
  tableWrap.classList.remove("influencer-view");
  tableWrap.classList.add("unfollowed-view");
  bindDynamicControls();
}

function renderDefaultView() {
  currentView = "business";
  metricGrid.innerHTML = defaultView.metrics;
  filters.innerHTML = defaultView.filters;
  tableWrap.innerHTML = defaultView.table;
  metricGrid.classList.remove("empty");
  tableWrap.classList.remove("influencer-view", "unfollowed-view");
  bindDynamicControls();
}

function bindMetricCards() {
  metricGrid.querySelectorAll(".metric-card").forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest(".metric-help")) return;
      metricGrid.querySelectorAll(".metric-card").forEach((node) => node.classList.remove("selected"));
      card.classList.add("selected");
      showToast(`已选中指标：${card.dataset.metric}`);
    });
  });
}

function bindFilters() {
  filters.querySelectorAll(".select-arrow").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const label = button.closest(".input-filter").querySelector("span").textContent;
      showToast(`${label} 下拉筛选已展开`);
    });
  });

  const clearButton = filters.querySelector(".clear-btn");
  if (clearButton) {
    clearButton.addEventListener("click", () => {
      filters.querySelectorAll(".input-filter input").forEach((input) => {
        input.value = "";
      });
      if (currentView === "influencer") {
        renderInfluencerTable();
      } else if (currentView === "unfollowed") {
        renderUnfollowedTable();
        bindSortHeaders();
      } else {
        tableWrap.innerHTML = defaultView.table;
        bindSortHeaders();
      }
      showToast("筛选条件已清空");
    });
  }
}

function bindSortHeaders() {
  tableWrap.querySelectorAll(".sortable").forEach((header) => {
    header.addEventListener("click", () => {
      const tableBody = tableWrap.querySelector("tbody");
      const index = Array.from(header.parentElement.children).indexOf(header);
      const isDescending = !header.classList.contains("desc");
      const rows = Array.from(tableBody.querySelectorAll("tr"));

      tableWrap.querySelectorAll(".sortable").forEach((item) => item.classList.remove("asc", "desc"));
      header.classList.add(isDescending ? "desc" : "asc");

      rows
        .sort((a, b) => {
          const aValue = parseSortableNumber(a.children[index].textContent);
          const bValue = parseSortableNumber(b.children[index].textContent);
          return isDescending ? bValue - aValue : aValue - bValue;
        })
        .forEach((row) => tableBody.appendChild(row));

      showToast(`${header.textContent.trim()}已${isDescending ? "降序" : "升序"}排列`);
    });
  });
}

function parseSortableNumber(value) {
  const normalized = String(value).replace(/,/g, "").trim();
  const parsed = Number(normalized);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function bindFollowActions() {
  tableWrap.querySelectorAll(".follow-record-btn").forEach((button) => {
    button.addEventListener("click", () => {
      showToast(`已打开：${button.dataset.name} 达人跟进记录`);
    });
  });

  tableWrap.querySelectorAll(".confirm-follow-btn").forEach((button) => {
    button.addEventListener("click", () => {
      openFollowModal(button.dataset.name);
    });
  });
}

function openFollowModal(name) {
  if (!followModal) return;
  followModal.dataset.creator = name || "";
  followModal.classList.add("open");
  followModal.setAttribute("aria-hidden", "false");
}

function closeFollowModal() {
  if (!followModal) return;
  followModal.classList.remove("open");
  followModal.setAttribute("aria-hidden", "true");
}

function bindDynamicControls() {
  bindMetricCards();
  bindFilters();
  bindSortHeaders();
  bindFollowActions();
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

businessTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    businessTabs.forEach((node) => {
      node.classList.remove("active");
      node.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");

    const tabName = tab.textContent.trim();
    if (tabName === "达人") {
      renderInfluencerView();
    } else if (tabName === "未跟进达人") {
      renderUnfollowedView();
    } else {
      renderDefaultView();
    }
    showToast(`当前维度：${tabName}`);
  });
});

document.querySelector(".collapse-handle").addEventListener("click", () => {
  showToast("侧栏收起按钮已点击");
});

document.querySelectorAll("[data-close-follow]").forEach((button) => {
  button.addEventListener("click", closeFollowModal);
});

if (followConfirmButton) {
  followConfirmButton.addEventListener("click", () => {
    const creatorName = followModal?.dataset.creator || "达人";
    closeFollowModal();
    showToast(`${creatorName} 已确认跟进`);
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && followModal?.classList.contains("open")) {
    closeFollowModal();
  }
});

bindDynamicControls();
