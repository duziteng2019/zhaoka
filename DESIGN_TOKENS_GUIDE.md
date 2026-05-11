# 设计令牌使用文档

## 📋 概述

本项目采用**赛博朋克科技感**设计风格，所有设计令牌统一定义在 `miniprogram/app.wxss` 文件中，通过 CSS 变量的方式供所有页面使用。

---

## 🎨 颜色系统

### 背景色

| 变量名 | 值 | 效果 | 使用场景 |
|--------|-----|------|----------|
| `--bg-primary` | `#0A0E27` | 深蓝背景 | 主页面背景 |
| `--bg-secondary` | `#1A1F3A` | 中蓝背景 | 卡片、组件背景 |
| `--bg-tertiary` | `#252B4D` | 浅蓝背景 | 次级组件背景 |

**使用示例**:
```wxss
.page {
  background: var(--bg-primary);
}

.card {
  background: var(--bg-secondary);
}
```

### 强调色（霓虹色系）

| 变量名 | 值 | 效果 | 使用场景 |
|--------|-----|------|----------|
| `--accent-cyan` | `#00F0FF` | 青色霓虹 | 主强调色、按钮、边框 |
| `--accent-pink` | `#FF2E7D` | 粉色霓虹 | 次强调色、特殊按钮 |
| `--accent-orange` | `#FF6B00` | 橙色霓虹 | 警示、特殊提示 |
| `--accent-purple` | `#8B5CF6` | 紫色霓虹 | 装饰元素 |

**使用示例**:
```wxss
.btn-primary {
  background: var(--accent-cyan);
  color: var(--bg-primary);
}

.btn-secondary {
  background: var(--accent-pink);
  color: #FFFFFF;
}

.text-highlight {
  color: var(--accent-cyan);
  text-shadow: 0 0 10rpx var(--shadow-glow);
}
```

### 文本色

| 变量名 | 值 | 效果 | 使用场景 |
|--------|-----|------|----------|
| `--text-primary` | `#FFFFFF` | 白色 | 主标题、重要文本 |
| `--text-secondary` | `#8B9BB4` | 浅蓝灰 | 副标题、说明文本 |
| `--text-muted` | `#5A6A8A` | 深蓝灰 | 弱化文本、占位符 |

**使用示例**:
```wxss
.title {
  color: var(--text-primary);
}

.subtitle {
  color: var(--text-secondary);
}

.caption {
  color: var(--text-muted);
}
```

### 特效色

| 变量名 | 值 | 效果 | 使用场景 |
|--------|-----|------|----------|
| `--border-glow` | `rgba(0, 240, 255, 0.3)` | 青色发光边框 | 按钮边框、装饰边框 |
| `--shadow-glow` | `rgba(0, 240, 255, 0.15)` | 青色发光阴影 | 按钮阴影、卡片阴影 |
| `--shadow-pink` | `rgba(255, 46, 125, 0.2)` | 粉色发光阴影 | 粉色按钮阴影 |
| `--card-glass` | `rgba(26, 31, 58, 0.8)` | 玻璃态背景 | 卡片背景（半透明） |
| `--card-border` | `rgba(0, 240, 255, 0.15)` | 卡片边框 | 卡片边框 |

**使用示例**:
```wxss
.card {
  background: var(--card-glass);
  border: 2rpx solid var(--card-border);
  box-shadow: 0 0 20rpx var(--shadow-glow);
  backdrop-filter: blur(20rpx);
}

.btn-glow {
  border: 2rpx solid var(--accent-cyan);
  box-shadow: 0 0 20rpx var(--shadow-glow);
}
```

---

## 📏 间距系统

### 间距值

| 等级 | 变量 | 值 | 使用场景 |
|------|------|-----|----------|
| XS | - | `10rpx` | 超小间距（徽章内边距） |
| SM | - | `20rpx` | 小间距（元素间间距） |
| MD | - | `30rpx` | 中间距（卡片内边距） |
| LG | - | `40rpx` | 大间距（页面内边距） |
| XL | - | `60rpx` | 超大间距（区块间距） |
| XXL | - | `160rpx` | 特大间距（底部留白） |

**使用示例**:
```wxss
.container {
  padding: 40rpx 30rpx;
}

.card {
  margin-bottom: 32rpx;
}

.page-container {
  padding-bottom: 160rpx; /* TabBar 空间 */
}
```

---

## 📝 字体排印

### 字号

| 等级 | 类名 | 值 | 使用场景 |
|------|------|-----|----------|
| XS | `.text-sm` | `24rpx` | 小字（徽章、注释） |
| SM | - | `26rpx` | 小字（副标题） |
| Base | `page` | `28rpx` | 正文字号 |
| LG | `.btn` | `30rpx` | 按钮文字 |
| XL | `.card-title` | `36rpx` | 卡片标题 |
| 2XL | `.title` | `40rpx` | 页面标题 |

### 字重

| 等级 | 值 | 使用场景 |
|------|-----|----------|
| Normal | `400` | 正文 |
| Medium | `600` | 副标题、按钮 |
| Bold | `700` | 主标题 |

### 行高

| 等级 | 值 | 使用场景 |
|------|-----|----------|
| Tight | `1.4` | 紧凑文本 |
| Normal | `1.6` | 正常文本（默认） |
| Relaxed | `1.8` | 宽松文本 |

**使用示例**:
```wxss
.title {
  font-size: 40rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
}

.subtitle {
  font-size: 30rpx;
  font-weight: 600;
  color: var(--text-secondary);
}

.text-sm {
  font-size: 24rpx;
  color: var(--text-muted);
}
```

---

## 🔲 圆角系统

| 等级 | 值 | 使用场景 |
|------|-----|----------|
| SM | `4rpx` | 徽章、小标签 |
| MD | `12rpx` | 列表项、小卡片 |
| LG | `16rpx` | 大卡片、面板 |
| XL | `20rpx` | 超大卡片 |

**使用示例**:
```wxss
.badge {
  border-radius: 4rpx;
}

.card {
  border-radius: 16rpx;
}
```

---

## 🎬 动画系统

### 动画时长

| 等级 | 值 | 使用场景 |
|------|-----|----------|
| Fast | `0.2s` | 快速反馈 |
| Normal | `0.3s` | 正常过渡（默认） |
| Slow | `0.4s` | 慢速进入 |
| Very Slow | `2s` | 脉冲、扫描 |
| Extreme | `3s` | 卡片闪烁 |
| Scanline | `8s` | 背景扫描线 |

### 预定义动画类

| 类名 | 动画效果 | 时长 |
|------|----------|------|
| `.fade-in` | 淡入 | 0.4s |
| `.slide-in-left` | 从左侧滑入 | 0.4s |
| `.slide-in-right` | 从右侧滑入 | 0.4s |
| `.pulse` | 脉冲闪烁 | 2s 无限循环 |
| `.glow-pulse` | 发光脉冲 | 2s 无限循环 |
| `.scanning` | 扫描效果 | 2s 无限循环 |

**使用示例**:
```wxss
/* 页面进入动画 */
.container {
  animation: fadeIn 0.4s ease forwards;
}

/* 按钮悬停效果 */
.btn:active {
  transform: scale(0.98);
  transition: all 0.3s ease;
}

/* 装饰元素动画 */
.diagonal-divider::before {
  animation: shimmer 2s infinite;
}
```

---

## 📐 布局系统

### Flex 布局类

```wxss
.flex-row { display: flex; flex-direction: row; }
.flex-column { display: flex; flex-direction: column; }
.justify-between { justify-content: space-between; }
.justify-center { justify-content: center; }
.align-center { align-items: center; }
```

### Grid 布局

```wxss
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
}
```

**使用示例**:
```html
<view class="flex-row justify-between align-center">
  <text>左侧内容</text>
  <text>右侧内容</text>
</view>

<view class="grid">
  <view class="grid-item">项目 1</view>
  <view class="grid-item">项目 2</view>
</view>
```

---

## 🎯 组件样式

### 按钮

| 类名 | 效果 | 使用场景 |
|------|------|----------|
| `.btn` | 基础按钮 | 所有按钮 |
| `.btn-glow` | 青色霓虹 | 主按钮 |
| `.btn-glow-pink` | 粉色霓虹 | 次按钮 |
| `.btn-glow-orange` | 橙色霓虹 | 警示按钮 |
| `.btn-ghost` | 幽灵按钮 | 次要操作 |

**使用示例**:
```html
<button class="btn btn-glow">立即制作</button>
<button class="btn btn-glow-pink">取消</button>
<button class="btn btn-ghost">查看详情</button>
```

### 卡片

```wxss
.card {
  background: var(--card-glass);
  border-radius: 16rpx;
  padding: 40rpx;
  border: 2rpx solid var(--card-border);
  backdrop-filter: blur(20rpx);
}
```

**使用示例**:
```html
<view class="card">
  <text class="card-title">标题</text>
  <text class="card-subtitle">副标题</text>
  <view class="card-content">内容</view>
</view>
```

### 徽章

| 类名 | 效果 |
|------|------|
| `.badge-cyan` | 青色徽章 |
| `.badge-pink` | 粉色徽章 |
| `.badge-orange` | 橙色徽章 |

**使用示例**:
```html
<view class="badge badge-cyan">新品</view>
<view class="badge badge-pink">热门</view>
```

---

## 🌟 装饰元素

### 对角线分割

```html
<view class="diagonal-divider"></view>
```

### 科技装饰线

```html
<view class="tech-deco-line"></view>
```

### 卡片角落装饰

```html
<view class="card card-corner-tl"></view>
<view class="card card-corner-tr"></view>
<view class="card card-corner-bl"></view>
<view class="card card-corner-br"></view>
```

---

## 📱 响应式设计

### 断点

| 名称 | 值 | 说明 |
|------|-----|------|
| Mobile | `750rpx` | 移动端最大宽度 |

**使用示例**:
```wxss
@media (max-width: 750rpx) {
  .grid {
    grid-template-columns: 1fr;
  }
  
  .container {
    padding: 30rpx 20rpx;
  }
}
```

---

## 🔧 快速参考

### 常用类名

```wxss
/* 文本 */
.title, .subtitle, .text-sm, .text-cyan, .text-pink

/* 间距 */
.mt-10, .mt-20, .mb-20, .p-20, .p-40

/* 布局 */
.flex-row, .flex-column, .justify-between, .align-center

/* 组件 */
.btn, .card, .badge, .list-item, .grid-item

/* 动画 */
.fade-in, .pulse, .glow-pulse
```

---

## 📄 相关文件

- **设计令牌 JSON**: `design-tokens.json`
- **全局样式**: `miniprogram/app.wxss`
- **设计文档**: `CYBERPUNK_DESIGN.md`

---

## 🎨 设计理念

**赛博朋克科技感**：
- 深色背景营造沉浸式体验
- 霓虹配色突出科技感
- 玻璃态卡片增加层次
- 发光效果增强视觉冲击
- 扫描线和网格背景营造未来感
- 非对称布局打破常规

---

**最后更新**: 2026-03-14
