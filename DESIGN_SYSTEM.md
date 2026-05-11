# 证件照小程序 - 设计系统文档

## 📋 概述

**项目名称**: 证件照小程序  
**设计风格**: 赛博朋克科技感（Cyberpunk Tech）  
**设计令牌版本**: 2.0.0  
**更新时间**: 2026-03-14

---

## 🎨 设计理念

**赛博朋克科技感**：
- 🌌 **深色沉浸背景** - 营造未来科技氛围
- 💡 **霓虹发光效果** - 青色、粉色、橙色霓虹点缀
- 🔮 **玻璃态卡片** - 半透明模糊效果增加层次
- ⚡ **扫描线装饰** - 动态扫描线营造科技感
- 📐 **非对称布局** - 打破常规的编辑式布局
- 🎬 **流畅动画** - 脉冲、闪烁、扫描等动态效果

---

## 📁 设计文件

| 文件 | 路径 | 说明 |
|------|------|------|
| **设计令牌 JSON (v2.0)** | `design-tokens-optimized.json` | 完整设计令牌系统 |
| **设计令牌 JSON (v1.0)** | `design-tokens.json` | 基础设计令牌 |
| **使用指南 (v2.0)** | `DESIGN_TOKENS_GUIDE_V2.md` | 详细使用文档 |
| **使用指南 (v1.0)** | `DESIGN_TOKENS_GUIDE.md` | 基础使用文档 |
| **全局样式** | `miniprogram/app.wxss` | 赛博朋克风格样式 |

---

## 🎨 颜色系统

### 主色板

#### 背景色
| Token | 值 | 说明 |
|-------|-----|------|
| `--bg-primary` | `#0A0E27` | 深邃蓝黑背景 |
| `--bg-secondary` | `#1A1F3A` | 中蓝色背景 |
| `--bg-tertiary` | `#252B4D` | 浅蓝色背景 |

#### 强调色（霓虹色系）
| Token | 值 | 说明 | 使用场景 |
|-------|-----|------|----------|
| `--accent-cyan` | `#00F0FF` | 霓虹青 | 主按钮、边框 |
| `--accent-pink` | `#FF2E7D` | 霓虹粉 | 次按钮、标记 |
| `--accent-orange` | `#FF6B00` | 警示橙 | 警示、提示 |
| `--accent-purple` | `#8B5CF6` | 神秘紫 | 装饰元素 |

#### 文本色
| Token | 值 | 说明 |
|-------|-----|------|
| `--text-primary` | `#FFFFFF` | 主文本（白色） |
| `--text-secondary` | `#8B9BB4` | 次级文本（浅蓝灰） |
| `--text-tertiary` | `#5A6A8A` | 弱化文本（深蓝灰） |

#### 特效色
| Token | 值 | 说明 |
|-------|-----|------|
| `--border-glow` | `rgba(0, 240, 255, 0.3)` | 发光边框 |
| `--shadow-glow` | `rgba(0, 240, 255, 0.15)` | 青色发光阴影 |
| `--shadow-pink` | `rgba(255, 46, 125, 0.2)` | 粉色发光阴影 |
| `--card-glass` | `rgba(26, 31, 58, 0.8)` | 玻璃态卡片背景 |
| `--card-border` | `rgba(0, 240, 255, 0.15)` | 卡片边框 |

### 渐变色

```wxss
/* 主背景渐变 */
--gradient-main: linear-gradient(135deg, #0A0E27 0%, #1A1F3A 50%, #151A35 100%);

/* 卡片背景渐变 */
--gradient-card: linear-gradient(135deg, rgba(26, 31, 58, 0.9), rgba(37, 43, 77, 0.9));
```

---

## 📏 间距系统

基于 **4rpx** 的倍数系统：

| 等级 | Token | 值 | 使用场景 |
|------|-------|-----|----------|
| 0 | `--spacing-0` | `0` | 无间距 |
| 1 | `--spacing-1` | `4rpx` | 超小间距 |
| 2 | `--spacing-2` | `8rpx` | 特小间距 |
| 3 | `--spacing-3` | `12rpx` | 小间距 |
| 4 | `--spacing-4` | `16rpx` | 中小间距 |
| 5 | `--spacing-5` | `20rpx` | 中间距 |
| 6 | `--spacing-6` | `24rpx` | 中大间距 |
| 8 | `--spacing-8` | `32rpx` | 大间距 |
| 10 | `--spacing-10` | `40rpx` | 特大间距 |
| 12 | `--spacing-12` | `48rpx` | 超大间距 |
| 16 | `--spacing-16` | `64rpx` | 极大间距 |
| 20 | `--spacing-20` | `80rpx` | 特大间距 |
| 40 | `--spacing-40` | `160rpx` | 超大间距（TabBar） |

---

## 📝 字体排印系统

### 字号
| Token | 值 | 使用场景 |
|-------|-----|----------|
| `--text-xs` | `20rpx` | 注释、标签 |
| `--text-sm` | `22rpx` | 徽章、辅助文字 |
| `--text-base` | `24rpx` | 正文内容 |
| `--text-md` | `26rpx` | 说明文字 |
| `--text-lg` | `28rpx` | 重要正文 |
| `--text-xl` | `30rpx` | 按钮文字 |
| `--text-2xl` | `32rpx` | 小标题 |
| `--text-3xl` | `36rpx` | 卡片标题 |
| `--text-4xl` | `40rpx` | 页面标题 |
| `--text-5xl` | `48rpx` | 主标题 |

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
| `--leading-normal` | `1.5` | 正常 |
| `--leading-relaxed` | `1.625` | 宽松 |
| `--leading-loose` | `2` | 特松 |

---

## 🔲 圆角系统

| Token | 值 | 使用场景 |
|-------|-----|----------|
| `--radius-none` | `0` | 无圆角 |
| `--radius-sm` | `4rpx` | 徽章、标签 |
| `--radius-md` | `8rpx` | 输入框、小按钮 |
| `--radius-lg` | `12rpx` | 卡片、按钮 |
| `--radius-xl` | `16rpx` | 大卡片 |
| `--radius-2xl` | `20rpx` | 弹窗 |
| `--radius-full` | `9999px` | 圆形、头像 |

---

## 🌈 阴影系统

### 基础阴影
| Token | 说明 |
|-------|------|
| `--shadow-none` | 无阴影 |
| `--shadow-sm` | 小阴影 |
| `--shadow-md` | 中阴影 |
| `--shadow-lg` | 大阴影 |
| `--shadow-xl` | 超大阴影 |

### 发光阴影（特色）
| Token | 值 | 说明 |
|-------|-----|------|
| `--shadow-glow` | `0 0 20rpx rgba(0, 240, 255, 0.15)` | 青色发光 |
| `--shadow-glow-pink` | `0 0 20rpx rgba(255, 46, 125, 0.2)` | 粉色发光 |
| `--shadow-glow-orange` | `0 0 20rpx rgba(255, 107, 0, 0.2)` | 橙色发光 |
| `--shadow-inner` | `inset 0 4rpx 16rpx rgba(0, 0, 0, 0.2)` | 内阴影 |

---

## 🎬 动画系统

### 动画时长
| Token | 值 | 使用场景 |
|-------|-----|----------|
| `--duration-fastest` | `100ms` | 微交互 |
| `--duration-fast` | `200ms` | 按钮悬停 |
| `--duration-normal` | `300ms` | 默认过渡 |
| `--duration-slow` | `400ms` | 页面进入 |
| `--duration-pulse` | `2000ms` | 脉冲动画 |
| `--duration-scanline` | `8000ms` | 背景扫描 |

### 预定义动画
| 动画名 | 效果 | 时长 |
|--------|------|------|
| `fadeIn` | 淡入 | 0.4s |
| `slideInLeft` | 从左侧滑入 | 0.4s |
| `slideInRight` | 从右侧滑入 | 0.4s |
| `pulse` | 脉冲闪烁 | 2s 无限 |
| `shimmer` | 闪烁 | 2s 无限 |
| `scanline` | 扫描线 | 8s 无限 |
| `glowPulse` | 发光脉冲 | 2s 无限 |

---

## 🧩 组件样式

### 按钮

| 类名 | 效果 | 使用场景 |
|------|------|----------|
| `.btn` | 基础按钮 | 所有按钮 |
| `.btn-glow` | 青色霓虹 | 主按钮 |
| `.btn-glow-pink` | 粉色霓虹 | 次按钮 |
| `.btn-glow-orange` | 橙色霓虹 | 警示按钮 |
| `.btn-ghost` | 幽灵按钮 | 次要操作 |

**示例**:
```html
<button class="btn btn-glow">立即制作</button>
<button class="btn btn-glow-pink">取消</button>
<button class="btn btn-ghost">查看详情</button>
```

### 卡片

```wxss
.card {
  background: var(--card-glass);
  border-radius: var(--radius-xl);
  padding: var(--spacing-10);
  border: 2rpx solid var(--card-border);
  backdrop-filter: blur(24rpx);
  box-shadow: var(--shadow-lg);
}
```

**示例**:
```html
<view class="card">
  <text class="title">卡片标题</text>
  <text class="subtitle">卡片内容</text>
</view>
```

### 徽章

| 类名 | 效果 |
|------|------|
| `.badge-cyan` | 青色徽章 |
| `.badge-pink` | 粉色徽章 |
| `.badge-orange` | 橙色徽章 |

**示例**:
```html
<view class="badge badge-cyan">新品</view>
<view class="badge badge-pink">热门</view>
```

---

## 📐 布局辅助类

### Flex 布局
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
  gap: var(--spacing-6);
}
```

### 间距辅助类
```wxss
/* Margin */
.mt-4, .mt-6, .mt-8, .mt-10
.mb-4, .mb-6, .mb-8, .mb-10
.ml-4, .ml-6
.mr-4, .mr-6

/* Padding */
.p-4, .p-6, .p-8, .p-10
.pt-4, .pt-6
.pb-4, .pb-6
```

---

## 🎯 装饰元素

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
<view class="card-corner card-corner-tl"></view>
<view class="card-corner card-corner-tr"></view>
<view class="card-corner card-corner-bl"></view>
<view class="card-corner card-corner-br"></view>
```

---

## 📱 响应式断点

| 断点 | 值 | 说明 |
|------|-----|------|
| `--breakpoint-sm` | `750rpx` | 小屏手机 |
| `--breakpoint-md` | `1024rpx` | 平板 |
| `--breakpoint-lg` | `1440rpx` | 大屏平板 |
| `--breakpoint-xl` | `1920rpx` | 桌面 |

---

## 🔧 快速参考

### 常用 CSS 变量
```wxss
/* 颜色 */
var(--bg-primary)
var(--accent-cyan)
var(--text-primary)
var(--shadow-glow)

/* 间距 */
var(--spacing-4)
var(--spacing-6)
var(--spacing-8)
var(--spacing-10)

/* 字体 */
var(--text-base)
var(--text-xl)
var(--font-bold)

/* 圆角 */
var(--radius-lg)
var(--radius-xl)

/* 动画 */
var(--duration-normal)
var(--ease-out)
```

### 常用类名
```wxss
/* 文本 */
.title, .subtitle, .text-sm, .text-cyan, .text-pink

/* 按钮 */
.btn, .btn-glow, .btn-glow-pink, .btn-ghost

/* 卡片 */
.card, .card-title, .card-subtitle

/* 布局 */
.flex-row, .justify-between, .align-center, .grid

/* 动画 */
.fade-in, .pulse, .glow-pulse
```

---

## 📄 相关文档

- **设计令牌 JSON**: `design-tokens.json` / `design-tokens-optimized.json`
- **使用指南**: `DESIGN_TOKENS_GUIDE.md` / `DESIGN_TOKENS_GUIDE_V2.md`
- **全局样式**: `miniprogram/app.wxss`
- **项目说明**: `README.md`

---

**最后更新**: 2026-03-14  
**维护者**: 证件照小程序团队
