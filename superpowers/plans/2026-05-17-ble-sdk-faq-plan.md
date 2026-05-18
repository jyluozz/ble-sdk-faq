# BLE SDK FAQ Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建BLE SDK FAQ HTML文档系统，包含首页、详情页、添加FAQ功能，数据存储在localStorage。

**Architecture:** 纯前端HTML/CSS/JS，无后端依赖。首页展示模块卡片和FAQ列表，详情页展示单模块完整FAQ，支持通过localStorage增补FAQ数据。

**Tech Stack:** 原生HTML5 + CSS3 + JavaScript (ES6+)，无框架依赖

---

## 文件结构

```
doc/
└── ble-sdk-faq/
    ├── index.html      # 首页（模块卡片 + FAQ列表）
    ├── detail.html     # 详情页（单模块FAQ完整内容）
    ├── faq.css         # 样式文件
    ├── faq.js          # 逻辑脚本（数据操作 + 渲染）
    └── SPEC.md         # 设计规格书
```

---

## Task 1: 创建项目目录和CSS样式文件

**Files:**
- Create: `doc/ble-sdk-faq/faq.css`

- [ ] **Step 1: 创建faq.css基础样式**

```css
/* ===== 基础变量 ===== */
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f6f8fa;
  --bg-card: #ffffff;
  --text-primary: #24292f;
  --text-secondary: #57606a;
  --text-muted: #8b949e;
  --accent: #0969da;
  --accent-hover: #0860ca;
  --border: #d0d7de;
  --border-light: #eaecef;
  --tag-bg: #ddf4ff;
  --tag-text: #0969da;
  --shadow: 0 1px 3px rgba(0,0,0,0.08);
  --shadow-hover: 0 4px 12px rgba(0,0,0,0.12);
  --radius: 8px;
  --radius-lg: 12px;
}

/* ===== 重置样式 ===== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  background: var(--bg-secondary);
  color: var(--text-primary);
  line-height: 1.6;
  min-height: 100vh;
}

/* ===== 容器 ===== */
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

/* ===== 头部工具栏 ===== */
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-box {
  flex: 1;
  max-width: 400px;
  position: relative;
}

.search-box input {
  width: 100%;
  padding: 0.6rem 1rem 0.6rem 2.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 0.95rem;
  background: var(--bg-primary);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-box input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(9, 105, 218, 0.1);
}

.search-box::before {
  content: "🔍";
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.9rem;
  opacity: 0.6;
}

.btn-add {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.2rem;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: var(--radius);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

.btn-add:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
}

/* ===== 模块卡片 ===== */
.module-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  margin-bottom: 1.25rem;
  overflow: hidden;
  transition: box-shadow 0.2s, border-color 0.2s;
}

.module-card:hover {
  box-shadow: var(--shadow-hover);
  border-color: var(--border);
}

.module-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-light);
  cursor: pointer;
  user-select: none;
}

.module-icon {
  font-size: 1.25rem;
}

.module-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.module-toggle {
  margin-left: auto;
  color: var(--text-muted);
  transition: transform 0.2s;
}

.module-card.expanded .module-toggle {
  transform: rotate(180deg);
}

.module-body {
  display: none;
  padding: 1rem 1.25rem;
}

.module-card.expanded .module-body {
  display: block;
}

/* ===== FAQ列表项 ===== */
.faq-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-light);
  gap: 1rem;
}

.faq-item:last-child {
  border-bottom: none;
}

.faq-question {
  flex: 1;
  font-size: 0.95rem;
  color: var(--text-primary);
  cursor: pointer;
  transition: color 0.2s;
}

.faq-question:hover {
  color: var(--accent);
}

.faq-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.faq-tag {
  font-size: 0.7rem;
  padding: 0.15rem 0.5rem;
  background: var(--tag-bg);
  color: var(--tag-text);
  border-radius: 20px;
  font-weight: 500;
}

.module-footer {
  padding: 0.75rem 1.25rem;
  border-top: 1px solid var(--border-light);
  text-align: right;
}

.btn-detail {
  font-size: 0.85rem;
  color: var(--accent);
  text-decoration: none;
  cursor: pointer;
}

.btn-detail:hover {
  text-decoration: underline;
}

/* ===== 模态框 ===== */
.modal-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-overlay.active {
  display: flex;
}

.modal {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-light);
}

.modal-title {
  font-size: 1.1rem;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-muted);
  cursor: pointer;
  line-height: 1;
}

.modal-close:hover {
  color: var(--text-primary);
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 0.9rem;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group textarea {
  min-height: 120px;
  resize: vertical;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(9, 105, 218, 0.1);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-light);
}

.btn {
  padding: 0.6rem 1.25rem;
  border-radius: var(--radius);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  color: var(--text-primary);
}

.btn-secondary:hover {
  background: var(--border-light);
}

.btn-primary {
  background: var(--accent);
  border: 1px solid var(--accent);
  color: white;
}

.btn-primary:hover {
  background: var(--accent-hover);
}

/* ===== 响应式 ===== */
@media (max-width: 640px) {
  .container {
    padding: 1.5rem 1rem;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    max-width: none;
  }

  .btn-add {
    justify-content: center;
  }
}
```

- [ ] **Step 2: 提交CSS文件**

```bash
git add doc/ble-sdk-faq/faq.css
git commit -m "style: add faq.css with minimalist white theme styles"
```

---

## Task 2: 创建JavaScript数据层

**Files:**
- Create: `doc/ble-sdk-faq/faq.js`

- [ ] **Step 1: 创建faq.js - 数据定义和存储模块**

```javascript
// ===== 模块配置 =====
const MODULES = {
  connection: { id: 'connection', name: '连接配对', icon: '📡' },
  data: { id: 'data', name: '数据传输', icon: '📤' },
  power: { id: 'power', name: '低功耗', icon: '🔋' },
  ota: { id: 'ota', name: 'OTA升级', icon: '🔄' },
  error: { id: 'error', name: '异常处理', icon: '⚠️' }
};

// ===== 默认FAQ数据 =====
const DEFAULT_FAQS = [
  {
    id: 'faq_001',
    module: 'connection',
    question: '配对失败如何排查？',
    answer: '配对失败常见原因包括：\n\n1. **距离过远**：确保设备在1米以内\n2. **名称冲突**：多个设备同名可能导致配对错误\n3. **芯片忙碌**：上一个连接未完全断开\n4. **加密不匹配**：确认双方加密等级一致\n\n排查步骤：\n1. 重启双方设备\n2. 清除已配对列表\n3. 确认设备处于可发现模式\n4. 检查BLE协议栈日志',
    code: '// 清除配对列表\nble_pair_clear_all();\n\n// 重新开始配对\nble_pair_start();',
    tags: ['常见'],
    date: '2026-05-10'
  },
  {
    id: 'faq_002',
    module: 'connection',
    question: '多设备连接策略说明',
    answer: 'TS8001支持多设备连接，但有以下限制：\n\n- 最多同时连接4个设备\n- 建议不超过3个以保证通信质量\n- 各连接共享带宽资源',
    code: '// 设置最大连接数\nble_config.max_conn = 3;',
    tags: ['常见'],
    date: '2026-05-10'
  },
  {
    id: 'faq_003',
    module: 'connection',
    question: '信号强度阈值如何配置？',
    answer: '信号强度(RSSI)阈值用于控制连接质量和断开判定。\n\n推荐配置：\n- 最小连接阈值：-80 dBm\n- 警告阈值：-70 dBm',
    code: 'ble_config.rssi_min = -80;\nble_config.rssi_warn = -70;',
    tags: ['常见'],
    date: '2026-05-10'
  },
  {
    id: 'faq_004',
    module: 'data',
    question: 'MTU配置常见误区',
    answer: 'MTU（最大传输单元）配置常见错误：\n\n1. **MTU不是越大越好**：过大会增加功耗\n2. **两端MTU不匹配**：以较小值为准\n3. **未在连接建立后协商**：需要手动触发MTU协商\n\n推荐默认值为23字节（BLE 4.0兼容），可升级到247字节（BLE 4.2+）',
    code: '// 请求MTU协商\nble_att_request_mtu(247);',
    tags: ['常见'],
    date: '2026-05-12'
  },
  {
    id: 'faq_005',
    module: 'data',
    question: '小包传输优化技巧',
    answer: '针对小数据包（<20字节）的优化建议：\n\n1. 合并高频小数据为一批传输\n2. 使用Notify而非Write+Response\n3. 合理设置连接间隔',
    code: '// 批量发送数据\nuint8_t batch_data[] = {0x01, 0x02, 0x03};\nble_notify_send(handle, batch_data, sizeof(batch_data));',
    tags: ['常见'],
    date: '2026-05-12'
  },
  {
    id: 'faq_006',
    module: 'data',
    question: '传输延迟如何排查？',
    answer: '传输延迟排查思路：\n\n1. 检查连接间隔是否过大\n2. 确认对端设备响应速度\n3. 查看协议栈是否有数据堆积',
    tags: ['常见'],
    date: '2026-05-12'
  },
  {
    id: 'faq_007',
    module: 'power',
    question: '待机功耗如何优化？',
    answer: '待机功耗优化关键点：\n\n1. 合理配置Deep Sleep模式\n2. 关闭不必要的外设时钟\n3. 降低CPU频率\n4. 优化广播间隔',
    code: '// 进入深度睡眠\nsystem_sleep(SLEEP_MODE_DEEP);\n\n// 关闭未使用外设\nperipheral_clock_disable(UART_ID);',
    tags: ['常见'],
    date: '2026-05-15'
  },
  {
    id: 'faq_008',
    module: 'ota',
    question: 'OTA升级失败如何处理？',
    answer: 'OTA升级失败处理流程：\n\n1. 检查固件签名是否正确\n2. 确认升级区大小足够\n3. 确保传输过程不断电\n4. 验证新固件完整性',
    tags: ['常见'],
    date: '2026-05-15'
  }
];

// ===== localStorage操作 =====
const FAQStorage = {
  KEY: 'ble_faq_data',

  // 获取所有FAQ（合并默认数据 + 用户数据）
  getAll() {
    const stored = localStorage.getItem(this.KEY);
    const userFaqs = stored ? JSON.parse(stored) : [];
    return [...DEFAULT_FAQS, ...userFaqs];
  },

  // 按模块获取FAQ
  getByModule(moduleId) {
    return this.getAll().filter(faq => faq.module === moduleId);
  },

  // 搜索FAQ
  search(query) {
    const q = query.toLowerCase();
    return this.getAll().filter(faq =>
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q)
    );
  },

  // 添加FAQ
  add(faq) {
    const stored = localStorage.getItem(this.KEY);
    const userFaqs = stored ? JSON.parse(stored) : [];

    const newFaq = {
      ...faq,
      id: 'faq_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      date: new Date().toISOString().split('T')[0]
    };

    userFaqs.push(newFaq);
    localStorage.setItem(this.KEY, JSON.stringify(userFaqs));
    return newFaq;
  },

  // 获取单个FAQ
  getById(id) {
    return this.getAll().find(faq => faq.id === id);
  }
};
```

- [ ] **Step 2: 提交JS数据层**

```bash
git add doc/ble-sdk-faq/faq.js
git commit -m "feat: add faq.js with data layer and localStorage operations"
```

---

## Task 3: 创建首页index.html

**Files:**
- Create: `doc/ble-sdk-faq/index.html`

- [ ] **Step 1: 创建index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BLE SDK FAQ - 常见问题解答</title>
  <link rel="stylesheet" href="faq.css">
</head>
<body>
  <div class="container">
    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="search-box">
        <input type="text" id="searchInput" placeholder="搜索FAQ...">
      </div>
      <button class="btn-add" id="btnAddFaq">+ 添加FAQ</button>
    </div>

    <!-- FAQ模块列表 -->
    <div id="faqModules"></div>
  </div>

  <!-- 添加FAQ模态框 -->
  <div class="modal-overlay" id="modalAddFaq">
    <div class="modal">
      <div class="modal-header">
        <h2 class="modal-title">添加新FAQ</h2>
        <button class="modal-close" id="modalClose">&times;</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label>问题标题</label>
          <input type="text" id="faqQuestion" placeholder="请输入问题描述...">
        </div>
        <div class="form-group">
          <label>所属模块</label>
          <select id="faqModule">
            <option value="">选择模块...</option>
            <option value="connection">📡 连接配对</option>
            <option value="data">📤 数据传输</option>
            <option value="power">🔋 低功耗</option>
            <option value="ota">🔄 OTA升级</option>
            <option value="error">⚠️ 异常处理</option>
          </select>
        </div>
        <div class="form-group">
          <label>详细解答</label>
          <textarea id="faqAnswer" placeholder="请输入详细解答..."></textarea>
        </div>
        <div class="form-group">
          <label>代码示例（可选）</label>
          <textarea id="faqCode" placeholder="请输入代码示例..." style="min-height: 80px;"></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" id="btnCancel">取消</button>
        <button class="btn btn-primary" id="btnSubmit">提交</button>
      </div>
    </div>
  </div>

  <script src="faq.js"></script>
  <script>
    // ===== 首页渲染逻辑 =====

    // 渲染模块列表
    function renderModules(faqs) {
      const container = document.getElementById('faqModules');
      container.innerHTML = '';

      // 按模块分组
      const modules = {};
      faqs.forEach(faq => {
        if (!modules[faq.module]) {
          modules[faq.module] = [];
        }
        modules[faq.module].push(faq);
      });

      // 渲染每个模块
      Object.keys(modules).forEach(moduleId => {
        const module = MODULES[moduleId];
        if (!module) return;

        const faqList = modules[moduleId];

        const card = document.createElement('div');
        card.className = 'module-card';
        card.innerHTML = `
          <div class="module-header" data-module="${moduleId}">
            <span class="module-icon">${module.icon}</span>
            <span class="module-title">${module.name}</span>
            <span class="module-toggle">▼</span>
          </div>
          <div class="module-body">
            ${faqList.map(faq => `
              <div class="faq-item">
                <span class="faq-question" data-id="${faq.id}">${faq.question}</span>
                <div class="faq-meta">
                  ${faq.tags.map(tag => `<span class="faq-tag">${tag}</span>`).join('')}
                </div>
              </div>
            `).join('')}
          </div>
          <div class="module-footer">
            <a class="btn-detail" href="detail.html?module=${moduleId}">查看详情 →</a>
          </div>
        `;

        container.appendChild(card);
      });

      // 绑定模块展开/收起事件
      document.querySelectorAll('.module-header').forEach(header => {
        header.addEventListener('click', () => {
          header.parentElement.classList.toggle('expanded');
        });
      });

      // 绑定FAQ点击事件
      document.querySelectorAll('.faq-question').forEach(item => {
        item.addEventListener('click', () => {
          const faqId = item.dataset.id;
          const faq = FAQStorage.getById(faqId);
          if (faq) {
            window.location.href = `detail.html?module=${faq.module}&highlight=${faqId}`;
          }
        });
      });
    }

    // 搜索功能
    function handleSearch(query) {
      if (query.trim() === '') {
        renderModules(FAQStorage.getAll());
      } else {
        const results = FAQStorage.search(query);
        renderModules(results);
      }
    }

    // 初始化
    document.addEventListener('DOMContentLoaded', () => {
      renderModules(FAQStorage.getAll());

      // 搜索输入
      const searchInput = document.getElementById('searchInput');
      searchInput.addEventListener('input', (e) => {
        handleSearch(e.target.value);
      });

      // 添加FAQ模态框
      const modal = document.getElementById('modalAddFaq');
      const btnAddFaq = document.getElementById('btnAddFaq');
      const btnClose = document.getElementById('modalClose');
      const btnCancel = document.getElementById('btnCancel');
      const btnSubmit = document.getElementById('btnSubmit');

      function openModal() {
        modal.classList.add('active');
        document.getElementById('faqQuestion').focus();
      }

      function closeModal() {
        modal.classList.remove('active');
        // 清空表单
        document.getElementById('faqQuestion').value = '';
        document.getElementById('faqModule').value = '';
        document.getElementById('faqAnswer').value = '';
        document.getElementById('faqCode').value = '';
      }

      btnAddFaq.addEventListener('click', openModal);
      btnClose.addEventListener('click', closeModal);
      btnCancel.addEventListener('click', closeModal);

      // 点击遮罩关闭
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });

      // 提交FAQ
      btnSubmit.addEventListener('click', () => {
        const question = document.getElementById('faqQuestion').value.trim();
        const module = document.getElementById('faqModule').value;
        const answer = document.getElementById('faqAnswer').value.trim();
        const code = document.getElementById('faqCode').value.trim();

        if (!question || !module || !answer) {
          alert('请填写必填项：问题标题、所属模块、详细解答');
          return;
        }

        FAQStorage.add({
          module,
          question,
          answer,
          code,
          tags: ['新增'],
          author: ''
        });

        closeModal();
        renderModules(FAQStorage.getAll());
        alert('FAQ添加成功！');
      });

      // ESC关闭模态框
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
          closeModal();
        }
      });
    });
  </script>
</body>
</html>
```

- [ ] **Step 2: 提交index.html**

```bash
git add doc/ble-sdk-faq/index.html
git commit -m "feat: add index.html homepage with module cards and search"
```

---

## Task 4: 创建详情页detail.html

**Files:**
- Create: `doc/ble-sdk-faq/detail.html`

- [ ] **Step 1: 创建detail.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FAQ详情 - BLE SDK</title>
  <link rel="stylesheet" href="faq.css">
  <style>
    /* 详情页额外样式 */
    .detail-header {
      margin-bottom: 2rem;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      font-size: 0.9rem;
      color: var(--text-muted);
    }

    .breadcrumb a {
      color: var(--accent);
      text-decoration: none;
    }

    .breadcrumb a:hover {
      text-decoration: underline;
    }

    .module-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .module-info .module-icon {
      font-size: 2rem;
    }

    .module-info .module-name {
      font-size: 1.5rem;
      font-weight: 600;
    }

    .faq-detail-card {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .faq-detail-card:target {
      background: var(--tag-bg);
      border-color: var(--accent);
    }

    .faq-detail-question {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .faq-detail-question::before {
      content: "Q";
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.5rem;
      height: 1.5rem;
      background: var(--accent);
      color: white;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .faq-detail-answer {
      color: var(--text-secondary);
      line-height: 1.8;
      white-space: pre-wrap;
    }

    .faq-detail-answer p {
      margin-bottom: 0.75rem;
    }

    .faq-detail-answer p:last-child {
      margin-bottom: 0;
    }

    .faq-detail-code {
      background: #1e1e1e;
      color: #d4d4d4;
      padding: 1rem;
      border-radius: var(--radius);
      margin: 1rem 0;
      overflow-x: auto;
      font-family: "SF Mono", Monaco, Consolas, monospace;
      font-size: 0.85rem;
      line-height: 1.5;
    }

    .faq-detail-date {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-top: 1rem;
      text-align: right;
    }

    .btn-back-top {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 2.5rem;
      height: 2.5rem;
      background: var(--accent);
      color: white;
      border: none;
      border-radius: 50%;
      font-size: 1.2rem;
      cursor: pointer;
      box-shadow: var(--shadow);
      opacity: 0;
      transition: opacity 0.2s;
    }

    .btn-back-top.visible {
      opacity: 1;
    }

    .btn-back-top:hover {
      background: var(--accent-hover);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="detail-header">
      <div class="breadcrumb">
        <a href="index.html">← 返回首页</a>
        <span>/</span>
        <span id="breadcrumbModule">加载中...</span>
      </div>
      <div class="module-info" id="moduleInfo"></div>
    </div>

    <div id="faqList"></div>
  </div>

  <button class="btn-back-top" id="btnBackTop">↑</button>

  <script src="faq.js"></script>
  <script>
    // ===== 详情页渲染逻辑 =====

    function renderDetailPage() {
      const params = new URLSearchParams(window.location.search);
      const moduleId = params.get('module');
      const highlightId = params.get('highlight');

      if (!moduleId) {
        window.location.href = 'index.html';
        return;
      }

      const module = MODULES[moduleId];
      if (!module) {
        window.location.href = 'index.html';
        return;
      }

      // 渲染面包屑和模块信息
      document.getElementById('breadcrumbModule').textContent = module.name;
      document.getElementById('moduleInfo').innerHTML = `
        <span class="module-icon">${module.icon}</span>
        <span class="module-name">${module.name}</span>
      `;

      // 设置页面标题
      document.title = `${module.name} - FAQ详情 - BLE SDK`;

      // 渲染FAQ列表
      const faqs = FAQStorage.getByModule(moduleId);
      const container = document.getElementById('faqList');

      if (faqs.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 2rem;">暂无FAQ内容</p>';
        return;
      }

      container.innerHTML = faqs.map(faq => `
        <div class="faq-detail-card" id="${faq.id}">
          <div class="faq-detail-question">${faq.question}</div>
          <div class="faq-detail-answer">${formatAnswer(faq.answer)}</div>
          ${faq.code ? `<div class="faq-detail-code">${escapeHtml(faq.code)}</div>` : ''}
          <div class="faq-detail-date">${faq.date}</div>
        </div>
      `).join('');

      // 如果有高亮ID，滚动到该位置
      if (highlightId) {
        setTimeout(() => {
          const target = document.getElementById(highlightId);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    }

    // 格式化答案（简单处理换行和粗体）
    function formatAnswer(text) {
      return text
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    }

    // HTML转义
    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    // 回到顶部按钮
    function initBackTopButton() {
      const btn = document.getElementById('btnBackTop');

      window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
          btn.classList.add('visible');
        } else {
          btn.classList.remove('visible');
        }
      });

      btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // 初始化
    document.addEventListener('DOMContentLoaded', () => {
      renderDetailPage();
      initBackTopButton();
    });
  </script>
</body>
</html>
```

- [ ] **Step 2: 提交detail.html**

```bash
git add doc/ble-sdk-faq/detail.html
git commit -m "feat: add detail.html with FAQ detail view"
```

---

## Task 5: 验证和测试

**Files:**
- Modify: `doc/ble-sdk-faq/SPEC.md`（复制设计文档）

- [ ] **Step 1: 复制SPEC.md到项目目录**

```bash
cp doc/superpowers/specs/2026-05-17-ble-sdk-faq-design.md doc/ble-sdk-faq/SPEC.md
git add doc/ble-sdk-faq/SPEC.md
git commit -m "docs: add SPEC.md to project directory"
```

- [ ] **Step 2: 验证文件完整性**

```bash
# 检查文件是否存在
ls -la doc/ble-sdk-faq/
# 预期输出:
# index.html
# detail.html
# faq.css
# faq.js
# SPEC.md
```

- [ ] **Step 3: 用浏览器打开测试**

```bash
# 直接用浏览器打开index.html
start doc/ble-sdk-faq/index.html
# 或
open doc/ble-sdk-faq/index.html  # macOS
```

**测试清单：**
- [ ] 首页加载正常，模块卡片显示正确
- [ ] 点击模块卡片可以展开/收起FAQ列表
- [ ] 搜索功能可以过滤FAQ
- [ ] 点击FAQ问题标题可以跳转到详情页
- [ ] 点击"查看详情"可以跳转详情页
- [ ] 详情页正确显示FAQ内容和代码高亮
- [ ] 添加FAQ功能正常工作
- [ ] 添加的FAQ在localStorage中持久化

---

## Task 6: 最终提交

- [ ] **提交所有更改**

```bash
git add -A
git status
git commit -m "$(cat <<'EOF'
feat: complete BLE SDK FAQ v1.0.0

- 首页：模块卡片 + FAQ列表 + 搜索 + 添加FAQ
- 详情页：FAQ完整内容 + 代码高亮 + 返回顶部
- 数据层：localStorage存储 + 默认FAQ数据
- 样式：极简白底风格

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## 自检清单

**Spec覆盖检查：**
- [x] 首页结构（模块卡片 + FAQ列表预览）
- [x] 详情页结构（FAQ完整内容 + 代码示例）
- [x] 添加FAQ弹窗（问题/模块/解答/代码）
- [x] 数据结构（id, module, question, answer, code, tags, date）
- [x] localStorage存储
- [x] 极简白底样式
- [x] 搜索功能
- [x] 模块展开/收起交互
- [x] 跳转详情页
- [x] 返回首页导航

**占位符检查：**
- [x] 无TBD/TODO
- [x] 无"类似Task N"引用
- [x] 所有代码块完整

**类型一致性：**
- [x] MODULES对象ID与FAQ.module一致
- [x] FAQStorage.getAll()返回格式一致
- [x] 模态框表单字段与FAQ对象属性一致
