# 赛博朋克科技感设计文档

## 📐 设计规范

### 美学方向
**Retro-futuristic Cyberpunk**（复古未来主义赛博朋克）

结合工业金属质感与霓虹光影，打造强烈的科技感视觉体验。

---

## 🎨 色彩系统

### 主色调
```css
--bg-primary: #0A0E27       /* 深蓝黑背景 */
--bg-secondary: #1A1F3A     /* 次级背景 */
--bg-tertiary: #252B4D     /* 第三级背景 */
```

### 霓虹色彩
```css
--accent-cyan: #00F0FF      /* 赛博青 - 主要霓虹色 */
--accent-pink: #FF2E7D      /* 霓虹粉 - 强调色 */
--accent-orange: #FF6B00    /* 暖橙色 - 交互提示 */
--accent-purple: #8B5CF6    /* 霓虹紫 */
```

### 文字色彩
```css
--text-primary: #FFFFFF      /* 主文字 */
--text-secondary: #8B9BB4    /* 次级文字 */
--text-muted: #5A6A8A       /* 静音文字 */
```

### 发光效果
```css
--border-glow: rgba(0, 240, 255, 0.3)
--shadow-glow: rgba(0, 240, 255, 0.15)
--shadow-pink: rgba(255, 46, 125, 0.2)
```

---

## 🔤 字体系统

### 字体方案
- **标题字体**: `Orbitron` - 科技感显示字体（需从网络加载）
- **正文字体**: `Rajdhani` - 工业风格等宽字体
- **数字字体**: `Share Tech Mono` - 技术数据字体

### 字体特性
- 大写字母为主
- 字间距加大
- 科技感边框装饰

---

## 📐 布局策略

### 非对称布局
- 内容区域偏移 20-30%
- 对角线分割和渐变过渡
- 悬浮卡片层次叠加
- 多层级阴影和发光效果

### 视觉层次
1. **背景层**: 网格线 + 扫描线动画
2. **装饰层**: 动态光晕 + 霓虹效果
3. **内容层**: 玻璃态卡片
4. **交互层**: 悬浮按钮 + 动态指示器

---

## 🧩 组件样式

### 按钮
- **霓虹发光按钮**: 青色渐变 + 多层阴影
- **粉霓虹按钮**: 粉色渐变 + 发光效果
- **科技边框按钮**: 透明背景 + 霓虹边框
- **切角设计**: clip-path 创造科技感

### 卡片
- **玻璃态**: backdrop-filter 模糊背景
- **霓虹边框**: 渐变动画边框
- **角落装饰**: 科技感标记
- **扫描效果**: 顶部光线扫过动画

### 输入框
- **深色背景**: rgba(10, 14, 39, 0.6)
- **聚焦发光**: 青色/粉色边框 + 阴影
- **底部动画**: 聚焦时出现渐变线条

### 列表项
- **左侧高亮**: 4rpx 霓虹边框
- **渐变背景**: 双色渐变
- **悬停位移**: translateX(12rpx)
- **右侧装饰**: 渐变光线

---

## ✨ 动画效果

### 关键动画
```css
/* 扫描线动画 */
@keyframes scanline {
  0% { background-position: 0 0; }
  100% { background-position: 0 100rpx; }
}

/* 浮动动画 */
@keyframes float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-30rpx) scale(1.05); }
}

/* 脉冲动画 */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 闪光动画 */
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
}

/* 发光脉冲 */
@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 10rpx var(--shadow-glow); }
  50% { box-shadow: 0 0 30rpx var(--shadow-glow), 0 0 50rpx rgba(0, 240, 255, 0.3); }
}

/* 旋转动画 */
@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

---

## 🎭 页面设计

### 1. 首页 (home)
- **动态光晕背景**: 浮动的彩色光球
- **Logo 区域**: 霓虹发光标题
- **状态面板**: 数据统计展示
- **功能网格**: 非对称卡片布局
- **快捷操作**: 底部悬浮按钮

### 2. 上传页面 (upload)
- **大上传区域**: 虚线边框 + 旋转图标
- **动态边框**: 渐变动画边框
- **预览卡片**: 扫描效果图片展示
- **AI 处理状态**: 双环旋转加载器

### 3. 历史页面 (history)
- **统计面板**: 三列数据展示
- **历史列表**: 左侧缩略图 + 内容
- **空状态**: 脉冲圆形图标
- **操作按钮**: 青色/粉色双按钮

### 4. 个人中心 (profile)
- **用户卡片**: 头像 + 霓虹边框
- **数据网格**: 三列统计卡片
- **功能菜单**: 图标 + 文字列表
- **退出登录**: 粉色危险按钮

### 5. 登录页面 (login)
- **动态背景**: 三个浮动光球
- **玻璃态卡片**: 模糊背景 + 霓虹边框
- **表单输入**: 深色背景 + 聚焦效果
- **登录按钮**: 青色渐变 + 扫描光效

### 6. 注册页面 (register)
- **动态背景**: 三个浮动光球（粉紫配色）
- **玻璃态卡片**: 粉色霓虹边框
- **表单输入**: 粉色聚焦效果
- **注册按钮**: 粉色渐变

### 7. 自定义 TabBar
- **玻璃态底部栏**: 模糊背景 + 顶部发光线
- **霓虹图标**: 选中时发光 + 脉冲动画
- **底部指示器**: 青粉渐变指示线

---

## 🖼️ 装饰元素

### 科技装饰
- **网格线**: 60rpx 网格背景
- **扫描线**: 8rpx 间距扫描效果
- **角落标记**: 科技感边角装饰
- **数据点**: 脉冲小点装饰
- **对角线分割**: 渐变分割线
- **光晕效果**: 径向渐变光球

### 装饰代码示例
```css
/* 角落装饰 */
.corner-mark {
  position: absolute;
  width: 12rpx;
  height: 12rpx;
  border: 2rpx solid var(--accent-cyan);
}

/* 数据点装饰 */
.data-points::before {
  content: '';
  position: absolute;
  left: 10rpx;
  top: 0;
  bottom: 0;
  width: 2rpx;
  background: linear-gradient(to bottom, transparent, var(--accent-cyan) 50%, transparent);
}
```

---

## 📱 响应式设计

### 断点处理
```css
@media (max-width: 750rpx) {
  .grid {
    grid-template-columns: 1fr;
    gap: 24rpx;
  }
  
  .container {
    padding: 30rpx 20rpx;
  }
}
```

### 安全区域适配
```css
.tab-bar-safe-area {
  height: constant(safe-area-inset-bottom);
  height: env(safe-area-inset-bottom);
}
```

---

## 🚀 性能优化

### CSS 优化
- 使用 CSS 变量统一管理
- transform 和 opacity 动画启用 GPU 加速
- backdrop-filter 替代复杂滤镜叠加

### 动画优化
- 使用 requestAnimationFrame
- 限制同时执行的动画数量
- 使用 will-change 提示浏览器

---

## 📦 文件清单

### 全局样式
- `miniprogram/app.wxss` - 全局样式定义

### 页面样式
- `miniprogram/pages/home/home.wxss` - 首页
- `miniprogram/pages/upload/upload.wxss` - 上传页
- `miniprogram/pages/history/history.wxss` - 历史页
- `miniprogram/pages/profile/profile.wxss` - 个人中心
- `miniprogram/pages/login/login.wxss` - 登录页
- `miniprogram/pages/register/register.wxss` - 注册页

### 组件样式
- `miniprogram/custom-tab-bar/index.wxss` - 自定义TabBar

---

## 🎯 设计原则

### ✅ 遵循原则
1. **非对称布局**: 避免标准居中布局
2. **霓虹发光**: 使用青色和粉色霓虹效果
3. **玻璃态卡片**: backdrop-filter 模糊背景
4. **科技装饰**: 网格线、扫描线、角落标记
5. **动态交互**: 悬浮、缩放、发光反馈

### ❌ 避免元素
1. 紫色、靛蓝、紫罗兰色系
2. 标准居中对称布局
3. 过度渐变和模糊效果
4. 普通阴影和高亮
5. Emoji 图标（使用专业图标库）

---

## 🔧 使用说明

### 1. 更新 TabBar 图标
```bash
# TabBar 图标需要 PNG 格式
miniprogram/images/tabbar/
├── home.png           # 首页
├── home-active.png   # 首页选中
├── history.png       # 历史
├── history-active.png # 历史选中
├── profile.png       # 我的
└── profile-active.png # 我的选中
```

### 2. 字体加载
建议从 Google Fonts 加载字体：
- Orbitron: `https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap`
- Rajdhani: `https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&display=swap`
- Share Tech Mono: `https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap`

### 3. 配置 app.json
确保小程序配置正确：
```json
{
  "usingComponents": {},
  "window": {
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#0A0E27",
    "navigationBarTitleText": "AI证件照",
    "navigationBarTextStyle": "white"
  },
  "tabBar": {
    "custom": true,
    "color": "#8B9BB4",
    "selectedColor": "#00F0FF",
    "backgroundColor": "#0A0E27",
    "borderStyle": "black"
  }
}
```

---

## 📊 设计审核清单

### ✅ 颜色审核
- [ ] 无紫色、靛蓝、紫罗兰色系
- [ ] 使用青色、粉色霓虹配色
- [ ] 深色背景与霓虹色对比

### ✅ 字体审核
- [ ] 无 Inter、Roboto、Arial 字体
- [ ] 使用科技感字体
- [ ] 字间距适中

### ✅ 图标审核
- [ ] 无 Emoji 图标
- [ ] 使用 PNG 图标资源
- [ ] 图标风格统一

### ✅ 布局审核
- [ ] 非对称布局
- [ ] 创意网格突破
- [ ] 多层次叠加

### ✅ 动画审核
- [ ] GPU 加速动画
- [ ] 流畅的过渡效果
- [ ] 适中的动画时长

---

## 🎓 设计灵感

### 参考风格
- **Cyberpunk 2077**: 赛博朋克游戏界面
- **Tron**: 电影中的数字世界
- **The Matrix**: 矩阵代码雨效果
- **Blade Runner 2049**: 霓虹城市夜景

### 关键元素
- 霓虹灯效
- 数据可视化
- 扫描线效果
- 玻璃态界面
- 全息投影感

---

**设计完成时间**: 2026-01-12
**设计风格**: Retro-futuristic Cyberpunk
**设计师**: AI Assistant
