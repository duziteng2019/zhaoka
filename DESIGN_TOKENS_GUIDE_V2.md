# 设计令牌使用指南 v2.0

## 📋 概述

本设计系统采用**赛博朋克科技感**风格，包含完整的颜色、间距、字体、圆角、阴影、动画等设计令牌。

**版本**: 2.0.0  
**风格**: 赛博朋克科技感（Cyberpunk Tech）  
**特点**: 未来感、科技感、沉浸式体验

---

## 🎨 颜色系统

### 1. 色板系统

#### 主色板（Primary）
蓝色系，用于品牌元素和重要交互

| Token | 值 | 使用场景 |
|-------|-----|----------|
| `--primary-500` | `#2196F3` | 主色 |
| `--primary-600` | `#1E88E5` | 悬停态 |
| `--primary-700` | `#1976D2` | 按下态 |

#### 强调色板

**青色（Cyan）- 主霓虹色**
| Token | 值 | 使用场景 |
|-------|-----|----------|
| `--cyan-500` | `#00F0FF` | 主霓虹色 |
| `--cyan-600` | `#00B8D4` | 深青色 |

**粉色（Pink）- 次霓虹色**
| Token | 值 | 使用场景 |
|-------|-----|----------|
| `--pink-500` | `#FF2E7D` | 霓虹粉 |
| `--pink-600` | `#E91E63` | 深粉色 |

**橙色（Orange）- 警示色**
| Token | 值 | 使用场景 |
|-------|-----|----------|
| `--orange-500` | `#FF6B00` | 警示橙 |
| `--orange-600` | `#FF8C00` | 深橙色 |

**紫色（Purple）- 装饰色**
| Token | 值 | 使用场景 |
|-------|-----|----------|
| `--purple-500` | `#8B5CF6` | 神秘紫 |

### 2. 功能色板

#### 背景色
```wxss
/* 主背景 - 深邃蓝黑 */
--bg-primary: #0A0E27;

/* 次级背景 - 中蓝色 */
--bg-secondary: #1A1F3A;

/* 第三级背景 - 浅蓝色 */
--bg-tertiary: #252B4D;

/* 遮罩层 */
--bg-overlay: rgba(10, 14, 39, 0.8);
```

**使用示例**:
```html
<view class="page bg-primary">
  <view class="card bg-secondary">
    卡片内容
  </view>
</view>
```

#### 文本色
```wxss
/* 主文本 - 白色 */
--text-primary: #FFFFFF;

/* 次级文本 - 浅蓝灰 */
--text-secondary: #8B9BB4;

/* 弱化文本 - 深蓝灰 */
--text-tertiary: #5A6A8A;

/* 反色文本 - 深色 */
--text-inverse: #0A0E27;
```

#### 强调色
```wxss
/* 主强调色 - 霓虹青 */
--accent-primary: #00F0FF;

/* 次强调色 - 霓虹粉 */
--accent-secondary: #FF2E7D;

/* 警示色 - 橙色 */
--accent-tertiary: #FF6B00;

/* 装饰色 - 紫色 */
--accent-quaternary: #8B5CF6;
```

#### 特效色
```wxss
/* 发光边框 */
--effect-border-glow: rgba(0, 240, 255, 0.3);

/* 青色发光阴影 */
--effect-shadow-glow: rgba(0, 240, 255, 0.15);

/* 粉色发光阴影 */
--effect-shadow-pink: rgba(255, 46, 125, 0.2);

/* 玻璃态卡片 */
--effect-card-glass: rgba(26, 31, 58, 0.8);

/* 卡片边框 */
--effect-card-border: rgba(0, 240, 255, 0.15);
```

#### 状态色
```wxss
/* 成功 */
--status-success: #00E676;

/* 警告 */
--status-warning: #FFB300;

/* 错误 */
--status-error: #FF5252;

/* 信息 */
--status-info: #2979FF;
```

### 3. 渐变背景

```wxss
/* 主背景渐变 */
--gradient-main: linear-gradient(135deg, #0A0E27 0%, #1A1F3A 50%, #151A35 100%);

/* 卡片背景渐变 */
--gradient-card: linear-gradient(135deg, rgba(26, 31, 58, 0.9), rgba(37, 43, 77, 0.9));
```

---

## 📏 间距系统

基于 4rpx 的倍数系统：

| Token | 值 | 说明 | 使用场景 |
|-------|-----|------|----------|
| `--spacing-0` | `0` | 无间距 | - |
| `--spacing-1` | `4rpx` | 超小间距 | 图标与文字间距 |
| `--spacing-2` | `8rpx` | 特小间距 | 紧凑元素 |
| `--spacing-3` | `12rpx` | 小间距 | 徽章内边距 |
| `--spacing-4` | `16rpx` | 中小间距 | 卡片内边距 |
| `--spacing-5` | `20rpx` | 中间距 | 元素间距 |
| `--spacing-6` | `24rpx` | 中大间距 | 组件间距 |
| `--spacing-8` | `32rpx` | 大间距 | 区块间距 |
| `--spacing-10` | `40rpx` | 特大间距 | 页面内边距 |
| `--spacing-12` | `48rpx` | 超大间距 | 大区块 |
| `--spacing-16` | `64rpx` | 极大间距 | 页面间距 |
| `--spacing-20` | `80rpx` | 特大间距 | TabBar 预留 |
| `--spacing-40` | `160rpx` | 超大间距 | 底部留白 |

**使用示例**:
```wxss
.container {
  padding: var(--spacing-10);
}

.card {
  margin-bottom: var(--spacing-8);
}

.btn {
  padding: var(--spacing-4) var(--spacing-6);
}
```

---

## 📝 字体排印系统

### 字号

| Token | 值 | 说明 | 使用场景 |
|-------|-----|------|----------|
| `--text-xs` | `20rpx` | 超小 | 注释、标签 |
| `--text-sm` | `22rpx` | 小 | 徽章、辅助文字 |
| `--text-base` | `24rpx` | 基础 | 正文内容 |
| `--text-md` | `26rpx` | 中等 | 说明文字 |
| `--text-lg` | `28rpx` | 大 | 重要正文 |
| `--text-xl` | `30rpx` | 超大 | 按钮文字 |
| `--text-2xl` | `32rpx` | 特大 | 小标题 |
| `--text-3xl` | `36rpx` | 超大 | 卡片标题 |
| `--text-4xl` | `40rpx` | 极大 | 页面标题 |
| `--text-5xl` | `48rpx` | 超大 | 主标题 |

### 字重

| Token | 值 | 说明 |
|-------|-----|------|
| `--font-light` | `300` | 细体 |
| `--font-normal` | `400` | 常规 |
| `--font-medium` | `500` | 中等 |
| `--font-semibold` | `600` | 半粗 |
| `--font-bold` | `700` | 粗体 |
| `--font-extrabold` | `800` | 特粗 |

### 行高

| Token | 值 | 说明 |
|-------|-----|------|
| `--leading-none` | `1` | 无行高 |
| `--leading-tight` | `1.25` | 紧凑 |
| `--leading-snug` | `1.375` | 较紧 |
| `--leading-normal` | `1.5` | 正常 |
| `--leading-relaxed` | `1.625` | 宽松 |
| `--leading-loose` | `2` | 特松 |

### 字间距

| Token | 值 | 说明 |
|-------|-----|------|
| `--tracking-tighter` | `-0.05em` | 特紧 |
| `--tracking-tight` | `-0.025em` | 紧 |
| `--tracking-normal` | `0` | 正常 |
| `--tracking-wide` | `0.025em` | 宽 |
| `--tracking-wider` | `0.05em` | 较宽 |
| `--tracking-widest` | `0.1em` | 特宽 |

### 字体族

```wxss
/* 无衬线字体 */
--font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;

/* 标题字体（Editorial 风格） */
--font-title: Georgia, 'Times New Roman', serif;

/* 正文字体 */
--font-body: Helvetica Neue, Arial, sans-serif;

/* 等宽字体 */
--font-mono: Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
```

**使用示例**:
```wxss
.title {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  font-family: var(--font-title);
  letter-spacing: var(--tracking-wide);
}

.body {
  font-size: var(--text-base);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
}
```

---

## 🔲 圆角系统

| Token | 值 | 说明 | 使用场景 |
|-------|-----|------|----------|
| `--radius-none` | `0` | 无圆角 | 分割线 |
| `--radius-sm` | `4rpx` | 小圆角 | 徽章、标签 |
| `--radius-md` | `8rpx` | 中圆角 | 输入框、小按钮 |
| `--radius-lg` | `12rpx` | 大圆角 | 卡片、按钮 |
| `--radius-xl` | `16rpx` | 超大圆角 | 大卡片 |
| `--radius-2xl` | `20rpx` | 特大圆角 | 弹窗 |
| `--radius-3xl` | `24rpx` | 极大圆角 | 特殊组件 |
| `--radius-full` | `9999px` | 完全圆角 | 圆形、头像 |

**使用示例**:
```wxss
.badge {
  border-radius: var(--radius-sm);
}

.card {
  border-radius: var(--radius-xl);
}

.avatar {
  border-radius: var(--radius-full);
}
```

---

## 🌈 阴影系统

### 基础阴影

| Token | 值 | 说明 |
|-------|-----|------|
| `--shadow-none` | `none` | 无阴影 |
| `--shadow-sm` | `0 2rpx 8rpx rgba(0, 0, 0, 0.1)` | 小阴影 |
| `--shadow-md` | `0 4rpx 16rpx rgba(0, 0, 0, 0.15)` | 中阴影 |
| `--shadow-lg` | `0 8rpx 32rpx rgba(0, 0, 0, 0.2)` | 大阴影 |
| `--shadow-xl` | `0 12rpx 48rpx rgba(0, 0, 0, 0.25)` | 超大阴影 |

### 发光阴影（特色）

| Token | 值 | 说明 |
|-------|-----|------|
| `--shadow-glow` | `0 0 20rpx rgba(0, 240, 255, 0.15)` | 青色发光 |
| `--shadow-glow-pink` | `0 0 20rpx rgba(255, 46, 125, 0.2)` | 粉色发光 |
| `--shadow-glow-orange` | `0 0 20rpx rgba(255, 107, 0, 0.2)` | 橙色发光 |
| `--shadow-inner` | `inset 0 4rpx 16rpx rgba(0, 0, 0, 0.2)` | 内阴影 |

**使用示例**:
```wxss
.btn-primary {
  box-shadow: var(--shadow-glow);
}

.btn-secondary {
  box-shadow: var(--shadow-glow-pink);
}

.card {
  box-shadow: var(--shadow-lg);
}
```

---

## 🎬 动画系统

### 动画时长

| Token | 值 | 说明 | 使用场景 |
|-------|-----|------|----------|
| `--duration-fastest` | `100ms` | 最快 | 微交互 |
| `--duration-faster` | `150ms` | 很快 | 快速反馈 |
| `--duration-fast` | `200ms` | 快 | 按钮悬停 |
| `--duration-normal` | `300ms` | 正常 | 默认过渡 |
| `--duration-slow` | `400ms` | 慢 | 页面进入 |
| `--duration-slower` | `500ms` | 很慢 | 大型动画 |
| `--duration-slowest` | `1000ms` | 最慢 | 特殊效果 |
| `--duration-pulse` | `2000ms` | 脉冲 | 脉冲动画 |
| `--duration-scanline` | `8000ms` | 扫描 | 背景扫描 |

### 缓动函数

| Token | 值 | 说明 |
|-------|-----|------|
| `--ease-linear` | `linear` | 线性 |
| `--ease` | `ease` | 标准缓动 |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | 进入缓动 |
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | 退出缓动 |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | 进出缓动 |
| `--ease-bounce` | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | 弹跳效果 |

### 预定义动画

```wxss
/* 淡入 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(30rpx); }
  to { opacity: 1; transform: translateY(0); }
}

/* 脉冲 */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 闪烁 */
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
}

/* 扫描线 */
@keyframes scanline {
  0% { background-position: 0 0; }
  100% { background-position: 0 100rpx; }
}

/* 发光脉冲 */
@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 10rpx var(--shadow-glow); }
  50% { box-shadow: 0 0 30rpx var(--shadow-glow), 0 0 50rpx rgba(0, 240, 255, 0.3); }
}
```

**使用示例**:
```wxss
.fade-in {
  animation: fadeIn var(--duration-slow) var(--ease-out) forwards;
}

.pulse {
  animation: pulse var(--duration-pulse) ease-in-out infinite;
}

.glow-pulse {
  animation: glowPulse var(--duration-pulse) ease-in-out infinite;
}
```

---

## 📐 布局系统

### Z-Index 层级

| Token | 值 | 说明 |
|-------|-----|------|
| `--z-0` | `0` | 基础层 |
| `--z-10` | `10` | 装饰层 |
| `--z-20` | `20` | 内容层 |
| `--z-30` | `30` | 悬浮层 |
| `--z-40` | `40` | 固定层 |
| `--z-50` | `50` | 模态框 |
| `--z-100` | `100` | 弹出层 |
| `--z-1000` | `1000` | 提示层 |
| `--z-9999` | `9999` | 顶层 |

### 断点

| Token | 值 | 说明 |
|-------|-----|------|
| `--breakpoint-sm` | `750rpx` | 小屏手机 |
| `--breakpoint-md` | `1024rpx` | 平板 |
| `--breakpoint-lg` | `1440rpx` | 大屏平板 |
| `--breakpoint-xl` | `1920rpx` | 桌面 |

### 透明度

| Token | 值 | Token | 值 |
|-------|-----|-------|-----|
| `--opacity-0` | `0` | `--opacity-60` | `0.6` |
| `--opacity-5` | `0.05` | `--opacity-70` | `0.7` |
| `--opacity-10` | `0.1` | `--opacity-80` | `0.8` |
| `--opacity-20` | `0.2` | `--opacity-90` | `0.9` |
| `--opacity-30` | `0.3` | `--opacity-100` | `1` |
| `--opacity-40` | `0.4` | - | - |
| `--opacity-50` | `0.5` | - | - |

### 背景模糊

| Token | 值 | 说明 |
|-------|-----|------|
| `--blur-none` | `none` | 无模糊 |
| `--blur-sm` | `blur(8rpx)` | 小模糊 |
| `--blur-md` | `blur(16rpx)` | 中模糊 |
| `--blur-lg` | `blur(24rpx)` | 大模糊 |
| `--blur-xl` | `blur(32rpx)` | 超大模糊 |

---

## 🧩 组件样式规范

### 按钮

```wxss
/* 主按钮 */
.btn-primary {
  background: var(--accent-primary);
  color: var(--bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-6) var(--spacing-10);
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  box-shadow: var(--shadow-glow);
  transition: all var(--duration-normal) var(--ease);
}

/* 次按钮 */
.btn-secondary {
  background: var(--accent-secondary);
  color: var(--text-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-6) var(--spacing-10);
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  box-shadow: var(--shadow-glow-pink);
}

/* 幽灵按钮 */
.btn-ghost {
  background: transparent;
  color: var(--accent-primary);
  border: 2rpx solid var(--accent-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-6) var(--spacing-10);
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
}
```

### 卡片

```wxss
.card {
  background: var(--gradient-card);
  border-radius: var(--radius-xl);
  padding: var(--spacing-10);
  border: 2rpx solid var(--effect-card-border);
  backdrop-filter: var(--blur-lg);
  box-shadow: var(--shadow-lg);
  transition: all var(--duration-normal) var(--ease);
}
```

### 输入框

```wxss
.input {
  background: var(--bg-tertiary);
  border: 2rpx solid var(--effect-border-glow);
  border-radius: var(--radius-md);
  padding: var(--spacing-4) var(--spacing-6);
  color: var(--text-primary);
  font-size: var(--text-base);
  transition: all var(--duration-fast) var(--ease);
}

.input:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 10rpx var(--shadow-glow);
}
```

---

## 📱 响应式设计

```wxss
/* 小屏手机（≤750rpx） */
@media (max-width: 750rpx) {
  .grid {
    grid-template-columns: 1fr;
  }
  
  .container {
    padding: var(--spacing-6);
  }
}

/* 平板（≤1024rpx） */
@media (max-width: 1024rpx) {
  .container {
    padding: var(--spacing-8);
  }
}

/* 大屏平板（≤1440rpx） */
@media (max-width: 1440rpx) {
  .container {
    max-width: 1200rpx;
    margin: 0 auto;
  }
}
```

---

## 🔧 快速参考表

### 常用类名

```wxss
/* 背景色 */
.bg-primary, .bg-secondary, .bg-tertiary

/* 文本色 */
.text-primary, .text-secondary, .text-cyan, .text-pink

/* 间距 */
.p-4, .p-6, .p-8, .p-10 (padding)
.m-4, .m-6, .m-8, .m-10 (margin)

/* 字体大小 */
.text-xs, .text-sm, .text-base, .text-lg, .text-xl

/* 圆角 */
.rounded-sm, .rounded-md, .rounded-lg, .rounded-xl

/* 阴影 */
.shadow-sm, .shadow-md, .shadow-lg, .shadow-glow

/* 动画 */
.animate-fade, .animate-pulse, .animate-slide
```

---

## 📄 相关文件

- **设计令牌 JSON**: `design-tokens.json`
- **全局样式**: `miniprogram/app.wxss`
- **设计文档**: `CYBERPUNK_DESIGN.md`

---

**最后更新**: 2026-03-14  
**版本**: 2.0.0
