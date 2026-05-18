# BLE SDK FAQ — 按日期排序功能设计

**版本：** v1.0.0
**日期：** 2026-05-18
**状态：** 已确认

---

## 1. 概述

为 BLE SDK FAQ 系统添加按日期排序功能，使 FAQ 按添加日期倒序（最新在前）展示，提升新内容的可见性。

---

## 2. 修改范围

| 文件 | 修改内容 |
|------|----------|
| `faq.js` | `FAQStorage` 的 `getAll()` 和 `getByModule()` 添加排序逻辑 |
| `index.html` | 无需修改，排序在存储层完成 |
| `detail.html` | 无需修改，排序在存储层完成 |

---

## 3. 实现方案

### 排序逻辑

所有 FAQ 数据（`DEFAULT_FAQS` + localStorage 用户数据）在返回前统一按 `date` 字段降序排列。

```javascript
// 获取所有FAQ并按日期倒序
getAll() {
  const stored = localStorage.getItem(this.KEY);
  const userFaqs = stored ? JSON.parse(stored) : [];
  return [...DEFAULT_FAQS, ...userFaqs]
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

// 按模块获取FAQ并按日期倒序
getByModule(moduleId) {
  return this.getAll().filter(faq => faq.module === moduleId);
}
```

### 排序时机

- 排序在数据读取时进行，不修改存储结构
- 内置数据与用户数据合并后统一排序

---

## 4. 行为影响

- 首页模块内 FAQ 条目按最新日期排
- 详情页单模块内 FAQ 按最新日期排
- 搜索结果同样按最新日期排
- 不影响 `add()` 等写入逻辑

---

## 5. 交付物

| 文件 | 说明 |
|------|------|
| `faq.js` | 添加排序逻辑 |
| 本文档 | 设计确认 |
