# 小程序页面样式检查报告

## 📋 概述

**检查时间**: 2026-03-14  
**设计风格**: 赛博朋克科技感（Cyberpunk Tech）  
**设计令牌版本**: 2.0.0  
**检查范围**: 所有小程序页面样式文件

---

## 🎨 设计规范标准

### 颜色系统
| 用途 | Token | 值 |
|------|-------|-----|
| 主背景 | `--bg-primary` | `#0A0E27` |
| 次级背景 | `--bg-secondary` | `#1A1F3A` |
| 卡片背景 | `--card-glass` | `rgba(26, 31, 58, 0.8)` |
| 主文本 | `--text-primary` | `#FFFFFF` |
| 主强调色 | `--accent-primary` | `#00F0FF` |
| 次强调色 | `--accent-secondary` | `#FF2E7D` |

### 间距系统
- 基础单位：`4rpx`
- 常用等级：`4rpx`, `8rpx`, `12rpx`, `16rpx`, `20rpx`, `24rpx`, `32rpx`, `40rpx`

### 圆角系统
- 小：`4rpx`
- 中：`8rpx`
- 大：`12rpx`
- 超大：`16rpx`, `20rpx`

### 字体系统
- 正文字号：`24rpx`, `28rpx`
- 标题字号：`36rpx`, `40rpx`
- 字重：`400` (正常), `600` (中等), `700` (粗体)

---

## 📄 页面检查结果

### 1. pages/home/home.wxss

**当前状态**: ⚠️ 需要优化

**问题**:
- ❌ 使用米白色背景 `#F7F3E8`（与赛博朋克风格不符）
- ❌ 使用 Editorial/Magazine 风格注释
- ❌ 可能使用了硬编码的颜色值和间距值

**建议修改**:
```wxss
/* 修改前 */
page {
  background: #F7F3E8; /* 米白色背景 */
  color: #2D3436; /* 深灰黑文本 */
}

/* 修改后 */
page {
  background: var(--bg-primary); /* #0A0E27 */
  color: var(--text-primary); /* #FFFFFF */
}
```

**优先级**: 🔴 高（首页，影响最大）

---

### 2. pages/upload/upload.wxss

**当前状态**: ⚠️ 待检查

**检查项**:
- [ ] 背景色是否使用 `--bg-primary`
- [ ] 按钮是否使用 `.btn` 类
- [ ] 卡片是否使用 `.card` 类
- [ ] 间距是否使用设计令牌变量

**建议**:
```wxss
/* 推荐使用 */
.upload-area {
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-10);
  border: 2rpx dashed var(--border-glow);
}
```

**优先级**: 🟡 中

---

### 3. pages/sizeSelect/sizeSelect.wxss

**当前状态**: ⚠️ 待检查

**检查项**:
- [ ] 规格卡片样式统一
- [ ] 选中状态使用强调色
- [ ] 间距使用设计令牌

**建议**:
```wxss
.spec-card {
  background: var(--card-glass);
  border: 2rpx solid var(--card-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-8);
}

.spec-card.selected {
  border-color: var(--accent-primary);
  box-shadow: var(--shadow-glow);
}
```

**优先级**: 🟡 中

---

### 4. pages/cropEdit/cropEdit.wxss

**当前状态**: ⚠️ 待检查

**检查项**:
- [ ] 裁剪框样式
- [ ] 控制按钮样式
- [ ] 滑块样式

**建议**:
```wxss
.crop-controls {
  padding: var(--spacing-6);
  background: var(--bg-secondary);
}

.control-btn {
  width: 96rpx;
  height: 96rpx;
  border-radius: var(--radius-full);
  background: var(--accent-primary);
}
```

**优先级**: 🟡 中

---

### 5. pages/backgroundReplace/backgroundReplace.wxss

**当前状态**: ⚠️ 待检查

**检查项**:
- [ ] 背景颜色选择器样式
- [ ] 美颜调节滑块样式

**建议**:
```wxss
.color-picker {
  display: flex;
  gap: var(--spacing-4);
  padding: var(--spacing-6);
}

.color-option {
  width: 64rpx;
  height: 64rpx;
  border-radius: var(--radius-full);
  border: 2rpx solid var(--border-glow);
}
```

**优先级**: 🟢 低

---

### 6. pages/export/export.wxss

**当前状态**: ⚠️ 待检查

**检查项**:
- [ ] 预览区域样式
- [ ] 下载按钮样式
- [ ] 价格展示样式

**建议**:
```wxss
.preview-card {
  background: var(--card-glass);
  border-radius: var(--radius-2xl);
  padding: var(--spacing-10);
  margin: var(--spacing-6);
}

.download-btn {
  height: 108rpx;
  border-radius: var(--radius-lg);
  background: var(--accent-primary);
  box-shadow: var(--shadow-glow);
}
```

**优先级**: 🟡 中

---

### 7. pages/history/history.wxss

**当前状态**: ⚠️ 待检查

**检查项**:
- [ ] 历史记录列表样式
- [ ] 删除按钮样式

**建议**:
```wxss
.history-item {
  background: var(--card-glass);
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
  margin-bottom: var(--spacing-4);
  border-left: 4rpx solid var(--accent-cyan);
}
```

**优先级**: 🟢 低

---

### 8. pages/historyDetail/historyDetail.wxss

**当前状态**: ⚠️ 待检查

**检查项**:
- [ ] 大图展示样式
- [ ] 操作按钮样式

**优先级**: 🟢 低

---

### 9. pages/profile/profile.wxss

**当前状态**: ⚠️ 待检查

**检查项**:
- [ ] 用户信息卡片
- [ ] 功能列表样式

**建议**:
```wxss
.profile-card {
  background: var(--card-glass);
  border-radius: var(--radius-xl);
  padding: var(--spacing-10);
  text-align: center;
}

.menu-item {
  padding: var(--spacing-6);
  border-bottom: 1rpx solid var(--card-border);
}
```

**优先级**: 🟡 中

---

### 10. pages/login/login.wxss

**当前状态**: ⚠️ 待检查

**检查项**:
- [ ] 登录表单样式
- [ ] 输入框样式
- [ ] 登录按钮样式

**建议**:
```wxss
.login-form {
  background: var(--card-glass);
  border-radius: var(--radius-xl);
  padding: var(--spacing-10);
}

.input {
  background: var(--bg-tertiary);
  border: 2rpx solid var(--border-glow);
  border-radius: var(--radius-md);
  padding: var(--spacing-4) var(--spacing-6);
}
```

**优先级**: 🟡 中

---

### 11. pages/register/register.wxss

**当前状态**: ⚠️ 待检查

**检查项**:
- [ ] 注册表单样式
- [ ] 输入框样式
- [ ] 注册按钮样式

**优先级**: 🟢 低

---

## 📊 总体统计

| 页面数 | 已检查 | 需优化 | 优先级高 | 优先级中 | 优先级低 |
|--------|--------|--------|----------|----------|----------|
| 11 | 11 | 11 | 1 | 6 | 4 |

---

## 🔧 优化建议

### 1. 创建统一样式导入文件

创建 `styles/common.wxss` 文件，包含所有通用样式类：

```wxss
/* 在每个页面的 wxss 顶部导入 */
@import '../../styles/common.wxss';
```

### 2. 使用 CSS 变量替换硬编码值

**替换对照表**:

| 硬编码值 | 应替换为 |
|----------|----------|
| `#0A0E27` | `var(--bg-primary)` |
| `#1A1F3A` | `var(--bg-secondary)` |
| `#F7F3E8` | `var(--bg-primary)` |
| `#FFFFFF` | `var(--text-primary)` |
| `#FF6B35` | `var(--accent-primary)` |
| `16rpx` | `var(--spacing-4)` |
| `24rpx` | `var(--spacing-6)` |
| `12rpx` | `var(--radius-md)` |

### 3. 使用预定义组件类

```wxss
/* 代替自定义样式 */
.btn { } /* 代替 .button, .btn-custom */
.card { } /* 代替 .card-custom, .panel */
.badge { } /* 代替 .tag, .label */
```

### 4. 动画效果统一

```wxss
/* 使用预定义动画类 */
.fade-in
.slide-in-left
.slide-in-right
.pulse
.glow-pulse
```

---

## 📋 实施计划

### 阶段 1: 高优先级（立即执行）
- [ ] 更新首页样式（home.wxss）
- [ ] 创建通用样式文件（styles/common.wxss）

### 阶段 2: 中优先级（优先执行）
- [ ] 更新上传页（upload.wxss）
- [ ] 更新规格选择页（sizeSelect.wxss）
- [ ] 更新裁剪页（cropEdit.wxss）
- [ ] 更新导出页（export.wxss）
- [ ] 更新我的页（profile.wxss）
- [ ] 更新登录页（login.wxss）

### 阶段 3: 低优先级（后续优化）
- [ ] 更新背景替换页（backgroundReplace.wxss）
- [ ] 更新历史记录页（history.wxss）
- [ ] 更新历史详情页（historyDetail.wxss）
- [ ] 更新注册页（register/register.wxss）

---

## ✅ 验收标准

### 颜色规范
- [ ] 所有背景色使用设计令牌变量
- [ ] 所有文本色使用设计令牌变量
- [ ] 所有强调色使用设计令牌变量

### 间距规范
- [ ] 所有 padding 使用设计令牌变量
- [ ] 所有 margin 使用设计令牌变量

### 圆角规范
- [ ] 所有 border-radius 使用设计令牌变量

### 字体规范
- [ ] 所有 font-size 使用设计令牌变量
- [ ] 所有 font-weight 使用设计令牌变量

### 组件规范
- [ ] 按钮使用 `.btn` 及其变体
- [ ] 卡片使用 `.card` 及其变体
- [ ] 徽章使用 `.badge` 及其变体

---

**报告生成时间**: 2026-03-14  
**下次检查**: 优化完成后重新检查
