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
