# 简约风格 UI 设计集成指南

> 证件照小程序 MVP - 从赛博朋克到简约专业风格

**更新时间**: 2026-05-11
**设计风格**: 简约专业 (Minimalist Professional)

---

## 📁 快速开始

### 方案一：一键替换全局样式（推荐）

直接替换 `miniprogram/app.wxss` 即可应用新的设计令牌，所有页面自动继承新风格。

### 方案二：按页面逐步替换

按本文档的「页面替换清单」逐个页面替换 WXML + WXSS 文件。

---

## 🎨 设计令牌

### 颜色系统 (Color Tokens)

```
主色调:
--primary:       #2563EB  (蓝色，主题强调色)
--primary-light: #3B82F6  (浅蓝)
--primary-dark:  #1D4ED8  (深蓝)

中性色:
--text-primary:   #111827  (主文字)
--text-secondary:#6B7280  (次文字)
--text-muted:    #9CA3AF  (弱化文字)

背景色:
--bg-page:       #F9FAFB  (页面背景)
--bg-card:      #FFFFFF  (卡片背景)
--bg-hover:     #F3F4F6  (悬停背景)

边框色:
--border:        #E5E7EB  (默认边框)
--border-light: #F3F4F6  (浅色边框)

状态色:
--success:       #10B981  (成功)
--warning:      #F59E0B  (警告)
--danger:       #EF4444  (错误)
--info:         #3B82F6  (信息)
```

### 圆角系统

```
--radius-sm:    8rpx    (小圆角)
--radius-md:    12rpx    (中等圆角)
--radius-lg:    16rpx    (大圆角)
--radius-full:  9999px   (圆形)
```

### 阴影系统

```
--shadow-sm:    0 1rpx 3rpx rgba(0,0,0,0.06)
--shadow-md:    0 4rpx 12rpx rgba(0,0,0,0.08)
--shadow-lg:    0 8rpx 24rpx rgba(0,0,0,0.12)
```

---

## 📄 app.wxss 完整代码

```wxss
/* ============================================
   证件照小程序 - 全局样式
   简约专业风格
   ============================================ */

/* ============================================
   设计令牌
   ============================================ */
page {
  /* 主色调 */
  --primary:       #2563EB;
  --primary-light: #3B82F6;
  --primary-dark:  #1D4ED8;
  
  /* 中性色 */
  --text-primary:   #111827;
  --text-secondary: #6B7280;
  --text-muted:    #9CA3AF;
  --text-white:    #FFFFFF;
  
  /* 背景色 */
  --bg-page:       #F9FAFB;
  --bg-card:       #FFFFFF;
  --bg-hover:      #F3F4F6;
  
  /* 边框色 */
  --border:        #E5E7EB;
  --border-light:  #F3F4F6;
  
  /* 状态色 */
  --success:       #10B981;
  --warning:       #F59E0B;
  --danger:        #EF4444;
  --info:          #3B82F6;
  
  /* 圆角 */
  --radius-sm:     8rpx;
  --radius-md:     12rpx;
  --radius-lg:     16rpx;
  --radius-full:   9999px;
  
  /* 阴影 */
  --shadow-sm:     0 1rpx 3rpx rgba(0,0,0,0.06);
  --shadow-md:     0 4rpx 12rpx rgba(0,0,0,0.08);
  --shadow-lg:     0 8rpx 24rpx rgba(0,0,0,0.12);
  
  /* 字号 */
  --text-xs:       22rpx;
  --text-sm:       24rpx;
  --text-base:     28rpx;
  --text-md:       30rpx;
  --text-lg:       34rpx;
  --text-xl:       38rpx;
  --text-2xl:      44rpx;
  
  /* 间距 */
  --space-xs:      8rpx;
  --space-sm:      16rpx;
  --space-md:      24rpx;
  --space-lg:      32rpx;
  --space-xl:      48rpx;
  
  background: var(--bg-page);
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  min-height: 100vh;
  color: var(--text-primary);
  font-size: var(--text-base);
  line-height: 1.6;
}

/* ============================================
   页面容器
   ============================================ */
.page-container {
  min-height: 100vh;
  padding-bottom: 140rpx;
}

.container {
  padding: var(--space-md);
}

/* ============================================
   卡片
   ============================================ */
.card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
  margin-bottom: var(--space-md);
  box-shadow: var(--shadow-sm);
}

.card-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
}

.card-subtitle {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-bottom: var(--space-md);
}

/* ============================================
   按钮
   ============================================ */
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88rpx;
  border-radius: var(--radius-md);
  font-size: var(--text-md);
  font-weight: 600;
  padding: 0 48rpx;
  margin: var(--space-sm) 0;
  transition: all 0.2s ease;
  border: none;
}

.btn:active {
  transform: scale(0.98);
  opacity: 0.9;
}

.btn-primary {
  background: var(--primary);
  color: var(--text-white);
}

.btn-primary:active {
  background: var(--primary-dark);
}

.btn-ghost {
  background: transparent;
  color: var(--primary);
  border: 2rpx solid var(--primary);
}

.btn-ghost:active {
  background: rgba(37, 99, 235, 0.08);
}

.btn-success {
  background: var(--success);
  color: var(--text-white);
}

.btn-danger {
  background: var(--danger);
  color: var(--text-white);
}

.btn-large {
  height: 100rpx;
  font-size: var(--text-lg);
}

.btn-block {
  width: 100%;
}

.btn-icon {
  width: 56rpx;
  height: 56rpx;
  border-radius: var(--radius-md);
  background: var(--bg-hover);
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon.active {
  background: var(--primary);
  color: var(--text-white);
}

/* ============================================
   表单
   ============================================ */
.form-input {
  width: 100%;
  height: 88rpx;
  padding: 0 24rpx;
  background: var(--bg-card);
  border: 2rpx solid var(--border);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  color: var(--text-primary);
  box-sizing: border-box;
}

.form-input:focus {
  border-color: var(--primary);
}

.form-input.error {
  border-color: var(--danger);
}

.form-label {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
  display: block;
}

/* ============================================
   列表项
   ============================================ */
.list-item {
  display: flex;
  align-items: center;
  padding: var(--space-md);
  background: var(--bg-card);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-sm);
  box-shadow: var(--shadow-sm);
}

.list-item:active {
  background: var(--bg-hover);
}

/* ============================================
   徽章
   ============================================ */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4rpx 16rpx;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 500;
}

.badge-primary {
  background: rgba(37, 99, 235, 0.1);
  color: var(--primary);
}

.badge-success {
  background: rgba(16, 185, 129, 0.1);
  color: var(--success);
}

.badge-warning {
  background: rgba(245, 158, 11, 0.1);
  color: var(--warning);
}

.badge-danger {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger);
}

/* ============================================
   空状态
   ============================================ */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-xl) 0;
}

.empty-icon {
  width: 160rpx;
  height: 160rpx;
  margin-bottom: var(--space-md);
  opacity: 0.4;
}

.empty-text {
  font-size: var(--text-base);
  color: var(--text-muted);
  margin-bottom: var(--space-xs);
}

.empty-hint {
  font-size: var(--text-sm);
  color: var(--text-muted);
}

/* ============================================
   Flex 布局辅助
   ============================================ */
.flex-row { display: flex; flex-direction: row; }
.flex-col { display: flex; flex-direction: column; }
.flex-center { display: flex; align-items: center; justify-content: center; }
.flex-between { display: flex; align-items: center; justify-content: space-between; }
.flex-1 { flex: 1; }
.flex-wrap { flex-wrap: wrap; }
.gap-xs { gap: var(--space-xs); }
.gap-sm { gap: var(--space-sm); }
.gap-md { gap: var(--space-md); }

/* ============================================
   文本
   ============================================ */
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }
.text-primary { color: var(--primary); }
.text-secondary { color: var(--text-secondary); }
.text-muted { color: var(--text-muted); }
.text-white { color: var(--text-white); }
.text-success { color: var(--success); }
.text-danger { color: var(--danger); }
.text-bold { font-weight: 600; }
.text-sm { font-size: var(--text-sm); }
.text-xs { font-size: var(--text-xs); }
.text-lg { font-size: var(--text-lg); }
.text-xl { font-size: var(--text-xl); }
.text-ellipsis { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* ============================================
   间距
   ============================================ */
.mt-xs { margin-top: var(--space-xs); }
.mt-sm { margin-top: var(--space-sm); }
.mt-md { margin-top: var(--space-md); }
.mt-lg { margin-top: var(--space-lg); }
.mt-xl { margin-top: var(--space-xl); }
.mb-xs { margin-bottom: var(--space-xs); }
.mb-sm { margin-bottom: var(--space-sm); }
.mb-md { margin-bottom: var(--space-md); }
.mb-lg { margin-bottom: var(--space-lg); }
.ml-sm { margin-left: var(--space-sm); }
.mr-sm { margin-right: var(--space-sm); }
.p-sm { padding: var(--space-sm); }
.p-md { padding: var(--space-md); }

/* ============================================
   分割线
   ============================================ */
.divider {
  height: 2rpx;
  background: var(--border);
  margin: var(--space-md) 0;
}

/* ============================================
   动画
   ============================================ */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20rpx); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30rpx); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in { animation: fadeIn 0.3s ease forwards; }
.fade-in-up { animation: fadeInUp 0.4s ease forwards; }

/* ============================================
   图片
   ============================================ */
.img-round {
  border-radius: var(--radius-md);
}

.img-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ============================================
   加载
   ============================================ */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.85);
  z-index: 999;
}
```

---

## 📱 首页 (home) 完整代码

### home.wxml

```xml
<!--pages/home/home.wxml-->
<view class="home-container page-container">
  <!-- 页面头部 -->
  <view class="header fade-in">
    <view class="logo-area">
      <view class="logo-icon">📷</view>
      <view class="logo-text">证件照制作</view>
    </view>
    <view class="title">AI智能证件照</view>
    <view class="subtitle">快速制作专业证件照，支持多种规格和背景色</view>
  </view>

  <!-- 主功能入口 -->
  <view class="hero-card fade-in">
    <view class="hero-content">
      <view class="hero-badge">✨ AI智能制作</view>
      <view class="hero-title">三步完成专业证件照</view>
      <view class="hero-steps">
        <view class="step-item">
          <view class="step-num">1</view>
          <view class="step-text">选择规格</view>
        </view>
        <view class="step-arrow">→</view>
        <view class="step-item">
          <view class="step-num">2</view>
          <view class="step-text">上传照片</view>
        </view>
        <view class="step-arrow">→</view>
        <view class="step-item">
          <view class="step-num">3</view>
          <view class="step-text">导出下载</view>
        </view>
      </view>
    </view>
    <button class="btn btn-primary btn-large btn-block" bindtap="startCreate">
      立即制作
    </button>
  </view>

  <!-- 常用规格 -->
  <view class="specs-section fade-in">
    <view class="section-header">
      <view class="section-title">常用规格</view>
    </view>
    <view class="specs-grid">
      <view class="spec-card" bindtap="selectSpec" data-spec="1">
        <view class="spec-icon primary">1</view>
        <view class="spec-info">
          <text class="spec-name">一寸</text>
          <text class="spec-desc">25×35mm</text>
        </view>
      </view>
      <view class="spec-card" bindtap="selectSpec" data-spec="2">
        <view class="spec-icon secondary">2</view>
        <view class="spec-info">
          <text class="spec-name">二寸</text>
          <text class="spec-desc">35×49mm</text>
        </view>
      </view>
      <view class="spec-card" bindtap="selectSpec" data-spec="3">
        <view class="spec-icon accent">护</view>
        <view class="spec-info">
          <text class="spec-name">护照</text>
          <text class="spec-desc">33×48mm</text>
        </view>
      </view>
      <view class="spec-card" bindtap="selectSpec" data-spec="4">
        <view class="spec-icon success">签</view>
        <view class="spec-info">
          <text class="spec-name">签证</text>
          <text class="spec-desc">35×45mm</text>
        </view>
      </view>
    </view>
  </view>

  <!-- 功能说明 -->
  <view class="features-section fade-in">
    <view class="section-header">
      <view class="section-title">服务特色</view>
    </view>
    <view class="features-grid">
      <view class="feature-item">
        <view class="feature-icon">🎯</view>
        <view class="feature-title">智能抠图</view>
        <view class="feature-desc">AI精准识别人像</view>
      </view>
      <view class="feature-item">
        <view class="feature-icon">🎨</view>
        <view class="feature-title">多色背景</view>
        <view class="feature-desc">白/蓝/红背景可选</view>
      </view>
      <view class="feature-item">
        <view class="feature-icon">📱</view>
        <view class="feature-title">高清导出</view>
        <view class="feature-desc">多种分辨率支持</view>
      </view>
      <view class="feature-item">
        <view class="feature-icon">📁</view>
        <view class="feature-title">历史记录</view>
        <view class="feature-desc">随时查看和下载</view>
      </view>
    </view>
  </view>
</view>
```

### home.wxss

```wxss
/* home.wxss - 首页 | 简约风格 */

/* 页面容器 */
page {
  background: var(--bg-page);
  min-height: 100vh;
  overflow-x: hidden;
}

.home-container {
  min-height: 100vh;
  padding-bottom: 180rpx;
}

/* ============================================
   页面头部
   ============================================ */
.header {
  padding: var(--space-lg) var(--space-md) var(--space-md);
  background: var(--bg-card);
}

.logo-area {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
}

.logo-icon {
  font-size: 48rpx;
}

.logo-text {
  font-size: var(--text-sm);
  color: var(--primary);
  font-weight: 500;
}

.title {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 var(--space-xs) 0;
  line-height: 1.2;
}

.subtitle {
  font-size: var(--text-base);
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

/* ============================================
   Hero 卡片
   ============================================ */
.hero-card {
  margin: var(--space-md);
  padding: var(--space-lg);
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.hero-content {
  margin-bottom: var(--space-lg);
}

.hero-badge {
  display: inline-block;
  font-size: var(--text-sm);
  color: var(--primary);
  background: rgba(37, 99, 235, 0.08);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  margin-bottom: var(--space-sm);
}

.hero-title {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-md);
}

.hero-steps {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--space-sm);
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
}

.step-num {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: var(--primary);
  color: var(--text-white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-base);
  font-weight: 600;
}

.step-text {
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

.step-arrow {
  font-size: var(--text-lg);
  color: var(--text-muted);
  margin-top: -24rpx;
}

/* ============================================
   规格网格
   ============================================ */
.specs-section {
  padding: 0 var(--space-md);
  margin-bottom: var(--space-lg);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
}

.section-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-md);
}

.spec-card {
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  display: flex;
  align-items: center;
  gap: var(--space-md);
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}

.spec-card:active {
  transform: scale(0.98);
  box-shadow: var(--shadow-sm);
  background: var(--bg-hover);
}

.spec-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--text-white);
  flex-shrink: 0;
}

.spec-icon.primary { background: var(--primary); }
.spec-icon.secondary { background: var(--text-secondary); }
.spec-icon.accent { background: var(--warning); }
.spec-icon.success { background: var(--success); }

.spec-info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.spec-name {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--text-primary);
}

.spec-desc {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

/* ============================================
   功能说明
   ============================================ */
.features-section {
  padding: 0 var(--space-md);
  margin-bottom: var(--space-lg);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-md);
}

.feature-item {
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: var(--shadow-sm);
}

.feature-icon {
  font-size: 48rpx;
  margin-bottom: var(--space-sm);
}

.feature-title {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4rpx;
}

.feature-desc {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

/* ============================================
   动画
   ============================================ */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20rpx); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.4s ease forwards;
}
```

---

## 📱 上传页 (upload) 完整代码

### upload.wxml

```xml
<!--pages/upload/upload.wxml-->
<view class="upload-container page-container">
  <!-- 页面头部 -->
  <view class="header fade-in">
    <view class="header-title">上传照片</view>
    <view class="header-step">第 1 步</view>
  </view>

  <!-- 上传区域 -->
  <view class="upload-section fade-in">
    <view class="upload-area" bindtap="chooseImage">
      <view class="upload-placeholder" wx:if="{{!tempFilePath}}">
        <view class="upload-icon">📷</view>
        <view class="upload-text">点击上传照片</view>
        <view class="upload-hint">支持 JPG、PNG 格式</view>
      </view>
      <image wx:else class="preview-image" src="{{tempFilePath}}" mode="aspectFit"></image>
      <view class="upload-mask" wx:if="{{tempFilePath}}">
        <view class="mask-btn">重新选择</view>
      </view>
    </view>
  </view>

  <!-- 上传方式 -->
  <view class="actions-section fade-in">
    <view class="action-buttons">
      <view class="action-btn" bindtap="chooseImage">
        <view class="action-icon">🖼️</view>
        <view class="action-text">相册选择</view>
      </view>
      <view class="action-btn" bindtap="takePhoto">
        <view class="action-icon">📸</view>
        <view class="action-text">拍照上传</view>
      </view>
    </view>
  </view>

  <!-- 拍摄建议 -->
  <view class="tips-section fade-in">
    <view class="tips-header">
      <view class="tips-title">📌 拍摄建议</view>
    </view>
    <view class="tips-grid">
      <view class="tip-item">
        <view class="tip-icon">💡</view>
        <view class="tip-text">光线充足</view>
      </view>
      <view class="tip-item">
        <view class="tip-icon">👤</view>
        <view class="tip-text">正面直视</view>
      </view>
      <view class="tip-item">
        <view class="tip-icon">🎨</view>
        <view class="tip-text">背景简洁</view>
      </view>
    </view>
  </view>

  <!-- 底部按钮 -->
  <view class="bottom-action">
    <button class="btn btn-primary btn-large btn-block" bindtap="goNext" disabled="{{!tempFilePath}}">
      下一步
    </button>
  </view>
</view>
```

### upload.wxss

```wxss
/* upload.wxss - 上传页 | 简约风格 */

page {
  background: var(--bg-page);
  min-height: 100vh;
}

.upload-container {
  min-height: 100vh;
  padding-bottom: 180rpx;
}

/* ============================================
   页面头部
   ============================================ */
.header {
  padding: var(--space-lg) var(--space-md) var(--space-md);
  background: var(--bg-card);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--text-primary);
}

.header-step {
  font-size: var(--text-sm);
  color: var(--primary);
  background: rgba(37, 99, 235, 0.08);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
}

/* ============================================
   上传区域
   ============================================ */
.upload-section {
  padding: var(--space-lg) var(--space-md);
}

.upload-area {
  position: relative;
  width: 100%;
  aspect-ratio: 3/4;
  background: var(--bg-card);
  border: 4rpx dashed var(--border);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: all 0.2s ease;
}

.upload-area:active {
  border-color: var(--primary);
  background: rgba(37, 99, 235, 0.02);
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
}

.upload-icon {
  font-size: 96rpx;
  opacity: 0.6;
}

.upload-text {
  font-size: var(--text-lg);
  font-weight: 500;
  color: var(--text-primary);
}

.upload-hint {
  font-size: var(--text-sm);
  color: var(--text-muted);
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.upload-mask {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  padding: var(--space-md);
  display: flex;
  justify-content: center;
}

.mask-btn {
  font-size: var(--text-sm);
  color: var(--text-white);
  background: rgba(255, 255, 255, 0.2);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-full);
}

/* ============================================
   操作按钮
   ============================================ */
.actions-section {
  padding: 0 var(--space-md);
  margin-bottom: var(--space-lg);
}

.action-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-md);
}

.action-btn {
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}

.action-btn:active {
  transform: scale(0.98);
  background: var(--bg-hover);
}

.action-icon {
  font-size: 48rpx;
}

.action-text {
  font-size: var(--text-sm);
  color: var(--text-primary);
  font-weight: 500;
}

/* ============================================
   拍摄建议
   ============================================ */
.tips-section {
  padding: 0 var(--space-md);
}

.tips-header {
  margin-bottom: var(--space-md);
}

.tips-title {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--text-primary);
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
}

.tip-item {
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  box-shadow: var(--shadow-sm);
}

.tip-icon {
  font-size: 36rpx;
}

.tip-text {
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

/* ============================================
   底部按钮
   ============================================ */
.bottom-action {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--space-md);
  background: var(--bg-card);
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.bottom-action .btn[disabled] {
  background: var(--border);
  color: var(--text-muted);
}

/* ============================================
   动画
   ============================================ */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20rpx); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.4s ease forwards;
}
```

---

## 📱 裁剪页 (cropEdit) 完整代码

### cropEdit.wxml

```xml
<!--pages/cropEdit/cropEdit.wxml-->
<view class="crop-container page-container">
  <!-- 页面头部 -->
  <view class="header fade-in">
    <view class="header-title">裁剪调整</view>
    <view class="header-step">第 2 步</view>
  </view>

  <!-- 预览区域 -->
  <view class="preview-section fade-in">
    <view class="preview-area">
      <image class="preview-image" src="{{tempFilePath}}" mode="aspectFit"></image>
      <!-- 裁剪框 -->
      <view class="crop-overlay">
        <view class="crop-box">
          <view class="crop-corner top-left"></view>
          <view class="crop-corner top-right"></view>
          <view class="crop-corner bottom-left"></view>
          <view class="crop-corner bottom-right"></view>
        </view>
      </view>
    </view>
    <view class="preview-hint">拖动裁剪框调整人像位置</view>
  </view>

  <!-- 工具栏 -->
  <view class="tools-section fade-in">
    <view class="tools-grid">
      <view class="tool-item {{currentTool === 'auto' ? 'active' : ''}}" bindtap="setTool" data-tool="auto">
        <view class="tool-icon">🎯</view>
        <view class="tool-text">自动</view>
      </view>
      <view class="tool-item {{currentTool === 'rotate' ? 'active' : ''}}" bindtap="setTool" data-tool="rotate">
        <view class="tool-icon">🔄</view>
        <view class="tool-text">旋转</view>
      </view>
      <view class="tool-item {{currentTool === 'mirror' ? 'active' : ''}}" bindtap="setTool" data-tool="mirror">
        <view class="tool-icon">↔️</view>
        <view class="tool-text">镜像</view>
      </view>
      <view class="tool-item" bindtap="resetEdit">
        <view class="tool-icon">🔄</view>
        <view class="tool-text">重置</view>
      </view>
    </view>
  </view>

  <!-- 旋转控制 -->
  <view class="rotate-section" wx:if="{{showRotateControl}}">
    <view class="rotate-slider">
      <slider min="-45" max="45" value="{{rotateAngle}}" bindchange="onRotateChange" block-size="20" activeColor="#2563EB" backgroundColor="#E5E7EB"/>
    </view>
    <view class="rotate-value">{{rotateAngle}}°</view>
  </view>

  <!-- 底部按钮 -->
  <view class="bottom-action">
    <button class="btn btn-ghost" bindtap="goBack">上一步</button>
    <button class="btn btn-primary" bindtap="goNext">确认裁剪</button>
  </view>
</view>
```

### cropEdit.wxss

```wxss
/* cropEdit.wxss - 裁剪页 | 简约风格 */

page {
  background: var(--bg-page);
  min-height: 100vh;
}

.crop-container {
  min-height: 100vh;
  padding-bottom: 180rpx;
}

/* ============================================
   页面头部
   ============================================ */
.header {
  padding: var(--space-lg) var(--space-md) var(--space-md);
  background: var(--bg-card);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--text-primary);
}

.header-step {
  font-size: var(--text-sm);
  color: var(--primary);
  background: rgba(37, 99, 235, 0.08);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
}

/* ============================================
   预览区域
   ============================================ */
.preview-section {
  padding: var(--space-lg) var(--space-md);
}

.preview-area {
  position: relative;
  width: 100%;
  aspect-ratio: 3/4;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.crop-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.crop-box {
  width: 60%;
  height: 75%;
  border: 4rpx solid var(--text-white);
  border-radius: var(--radius-md);
  position: relative;
}

.crop-corner {
  position: absolute;
  width: 32rpx;
  height: 32rpx;
  border-color: var(--primary);
  border-style: solid;
  border-width: 0;
}

.crop-corner.top-left {
  top: -4rpx;
  left: -4rpx;
  border-top-width: 6rpx;
  border-left-width: 6rpx;
  border-top-left-radius: var(--radius-sm);
}

.crop-corner.top-right {
  top: -4rpx;
  right: -4rpx;
  border-top-width: 6rpx;
  border-right-width: 6rpx;
  border-top-right-radius: var(--radius-sm);
}

.crop-corner.bottom-left {
  bottom: -4rpx;
  left: -4rpx;
  border-bottom-width: 6rpx;
  border-left-width: 6rpx;
  border-bottom-left-radius: var(--radius-sm);
}

.crop-corner.bottom-right {
  bottom: -4rpx;
  right: -4rpx;
  border-bottom-width: 6rpx;
  border-right-width: 6rpx;
  border-bottom-right-radius: var(--radius-sm);
}

.preview-hint {
  text-align: center;
  font-size: var(--text-sm);
  color: var(--text-muted);
  margin-top: var(--space-md);
}

/* ============================================
   工具栏
   ============================================ */
.tools-section {
  padding: 0 var(--space-md);
  margin-bottom: var(--space-md);
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-md);
}

.tool-item {
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}

.tool-item:active {
  transform: scale(0.98);
}

.tool-item.active {
  background: var(--primary);
}

.tool-item.active .tool-text {
  color: var(--text-white);
}

.tool-icon {
  font-size: 36rpx;
}

.tool-text {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  font-weight: 500;
}

/* ============================================
   旋转控制
   ============================================ */
.rotate-section {
  padding: var(--space-md);
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.rotate-slider {
  flex: 1;
}

.rotate-value {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  min-width: 80rpx;
  text-align: center;
}

/* ============================================
   底部按钮
   ============================================ */
.bottom-action {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--space-md);
  background: var(--bg-card);
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.06);
  display: flex;
  gap: var(--space-md);
}

.bottom-action .btn {
  flex: 1;
  margin: 0;
}

/* ============================================
   动画
   ============================================ */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20rpx); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.4s ease forwards;
}
```

---

## 📱 背景替换页 (backgroundReplace) 完整代码

### backgroundReplace.wxml

```xml
<!--pages/backgroundReplace/backgroundReplace.wxml-->
<view class="bg-container page-container">
  <!-- 页面头部 -->
  <view class="header fade-in">
    <view class="header-title">背景颜色</view>
    <view class="header-step">第 3 步</view>
  </view>

  <!-- 预览区域 -->
  <view class="preview-section fade-in">
    <view class="preview-area">
      <image class="preview-image" src="{{processedImage}}" mode="aspectFit"></image>
    </view>
  </view>

  <!-- 背景色选择 -->
  <view class="color-section fade-in">
    <view class="section-title">选择背景色</view>
    <view class="color-grid">
      <view class="color-item {{currentBg === 'white' ? 'active' : ''}}" bindtap="selectBg" data-bg="white">
        <view class="color-swatch white"></view>
        <view class="color-label">白色</view>
      </view>
      <view class="color-item {{currentBg === 'blue' ? 'active' : ''}}" bindtap="selectBg" data-bg="blue">
        <view class="color-swatch blue"></view>
        <view class="color-label">蓝色</view>
      </view>
      <view class="color-item {{currentBg === 'red' ? 'active' : ''}}" bindtap="selectBg" data-bg="red">
        <view class="color-swatch red"></view>
        <view class="color-label">红色</view>
      </view>
    </view>
  </view>

  <!-- 美颜调整 -->
  <view class="beauty-section fade-in">
    <view class="section-title">美颜调整</view>
    <view class="slider-item">
      <view class="slider-label">
        <text>亮度</text>
        <text class="slider-value">{{brightness}}</text>
      </view>
      <slider min="0" max="100" value="{{brightness}}" bindchange="onBrightnessChange" block-size="20" activeColor="#2563EB" backgroundColor="#E5E7EB"/>
    </view>
    <view class="slider-item">
      <view class="slider-label">
        <text>磨皮</text>
        <text class="slider-value">{{smoothness}}</text>
      </view>
      <slider min="0" max="100" value="{{smoothness}}" bindchange="onSmoothnessChange" block-size="20" activeColor="#2563EB" backgroundColor="#E5E7EB"/>
    </view>
  </view>

  <!-- 底部按钮 -->
  <view class="bottom-action">
    <button class="btn btn-ghost" bindtap="goBack">上一步</button>
    <button class="btn btn-primary" bindtap="goNext">下一步</button>
  </view>
</view>
```

### backgroundReplace.wxss

```wxss
/* backgroundReplace.wxss - 背景替换页 | 简约风格 */

page {
  background: var(--bg-page);
  min-height: 100vh;
}

.bg-container {
  min-height: 100vh;
  padding-bottom: 180rpx;
}

/* ============================================
   页面头部
   ============================================ */
.header {
  padding: var(--space-lg) var(--space-md) var(--space-md);
  background: var(--bg-card);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--text-primary);
}

.header-step {
  font-size: var(--text-sm);
  color: var(--primary);
  background: rgba(37, 99, 235, 0.08);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
}

/* ============================================
   预览区域
   ============================================ */
.preview-section {
  padding: var(--space-lg) var(--space-md);
}

.preview-area {
  width: 100%;
  aspect-ratio: 3/4;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* ============================================
   背景色选择
   ============================================ */
.color-section {
  padding: 0 var(--space-md);
  margin-bottom: var(--space-lg);
}

.section-title {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-md);
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
}

.color-item {
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  box-shadow: var(--shadow-sm);
  border: 4rpx solid transparent;
  transition: all 0.2s ease;
}

.color-item:active {
  transform: scale(0.98);
}

.color-item.active {
  border-color: var(--primary);
}

.color-swatch {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  box-shadow: var(--shadow-sm);
}

.color-swatch.white {
  background: #FFFFFF;
  border: 2rpx solid var(--border);
}

.color-swatch.blue {
  background: #2563EB;
}

.color-swatch.red {
  background: #EF4444;
}

.color-label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

/* ============================================
   美颜调整
   ============================================ */
.beauty-section {
  padding: 0 var(--space-md);
}

.slider-item {
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  margin-bottom: var(--space-sm);
  box-shadow: var(--shadow-sm);
}

.slider-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-sm);
  font-size: var(--text-sm);
  color: var(--text-primary);
}

.slider-value {
  color: var(--primary);
  font-weight: 600;
}

/* ============================================
   底部按钮
   ============================================ */
.bottom-action {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--space-md);
  background: var(--bg-card);
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.06);
  display: flex;
  gap: var(--space-md);
}

.bottom-action .btn {
  flex: 1;
  margin: 0;
}

/* ============================================
   动画
   ============================================ */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20rpx); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.4s ease forwards;
}
```

---

## 📱 导出页 (export) 完整代码

### export.wxml

```xml
<!--pages/export/export.wxml-->
<view class="export-container page-container">
  <!-- 页面头部 -->
  <view class="header fade-in">
    <view class="header-title">导出下载</view>
    <view class="header-step">完成</view>
  </view>

  <!-- 预览卡片 -->
  <view class="preview-card fade-in">
    <view class="preview-area">
      <image class="preview-image" src="{{finalImage}}" mode="aspectFit"></image>
    </view>
    <view class="preview-info">
      <view class="info-item">
        <text class="info-label">照片规格</text>
        <text class="info-value">{{specName}}</text>
      </view>
      <view class="info-item">
        <text class="info-label">背景颜色</text>
        <text class="info-value">{{bgColorName}}</text>
      </view>
    </view>
  </view>

  <!-- 下载选项 -->
  <view class="download-section fade-in">
    <view class="section-title">选择下载方式</view>
    <view class="download-options">
      <view class="option-item {{selectedOption === 'free' ? 'active' : ''}}" bindtap="selectOption" data-option="free">
        <view class="option-content">
          <view class="option-icon">🆓</view>
          <view class="option-info">
            <view class="option-title">免费预览</view>
            <view class="option-desc">标准画质，适合预览</view>
          </view>
        </view>
        <view class="option-badge">免费</view>
      </view>
      <view class="option-item {{selectedOption === 'hd' ? 'active' : ''}}" bindtap="selectOption" data-option="hd">
        <view class="option-content">
          <view class="option-icon">✨</view>
          <view class="option-info">
            <view class="option-title">高清下载</view>
            <view class="option-desc">高分辨率，可用于打印</view>
          </view>
        </view>
        <view class="option-price">¥{{hdPrice}}</view>
      </view>
    </view>
  </view>

  <!-- 注意事项 -->
  <view class="notice-section fade-in">
    <view class="notice-icon">ℹ️</view>
    <view class="notice-text">
      <view>• 高清版本支持冲印和正式使用</view>
      <view>• 下载后可前往打印店进行打印</view>
      <view>• 历史记录可随时查看和重新下载</view>
    </view>
  </view>

  <!-- 底部按钮 -->
  <view class="bottom-action">
    <button class="btn btn-ghost" bindtap="goHome">返回首页</button>
    <button class="btn btn-primary" bindtap="download">
      {{selectedOption === 'free' ? '免费下载' : '立即支付'}}
    </button>
  </view>
</view>
```

### export.wxss

```wxss
/* export.wxss - 导出页 | 简约风格 */

page {
  background: var(--bg-page);
  min-height: 100vh;
}

.export-container {
  min-height: 100vh;
  padding-bottom: 180rpx;
}

/* ============================================
   页面头部
   ============================================ */
.header {
  padding: var(--space-lg) var(--space-md) var(--space-md);
  background: var(--bg-card);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--text-primary);
}

.header-step {
  font-size: var(--text-sm);
  color: var(--success);
  background: rgba(16, 185, 129, 0.08);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
}

/* ============================================
   预览卡片
   ============================================ */
.preview-card {
  margin: var(--space-md);
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.preview-area {
  width: 100%;
  aspect-ratio: 3/4;
  background: #F0F0F0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.preview-info {
  padding: var(--space-md);
  display: flex;
  gap: var(--space-lg);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.info-label {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.info-value {
  font-size: var(--text-sm);
  color: var(--text-primary);
  font-weight: 500;
}

/* ============================================
   下载选项
   ============================================ */
.download-section {
  padding: 0 var(--space-md);
  margin-bottom: var(--space-lg);
}

.section-title {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-md);
}

.download-options {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.option-item {
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: var(--shadow-sm);
  border: 4rpx solid transparent;
  transition: all 0.2s ease;
}

.option-item:active {
  transform: scale(0.99);
}

.option-item.active {
  border-color: var(--primary);
  background: rgba(37, 99, 235, 0.02);
}

.option-content {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.option-icon {
  font-size: 48rpx;
}

.option-info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.option-title {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--text-primary);
}

.option-desc {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.option-badge {
  font-size: var(--text-xs);
  color: var(--success);
  background: rgba(16, 185, 129, 0.1);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-weight: 500;
}

.option-price {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--primary);
}

/* ============================================
   注意事项
   ============================================ */
.notice-section {
  margin: 0 var(--space-md);
  padding: var(--space-md);
  background: rgba(37, 99, 235, 0.04);
  border-radius: var(--radius-md);
  display: flex;
  gap: var(--space-sm);
}

.notice-icon {
  font-size: 32rpx;
  flex-shrink: 0;
}

.notice-text {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  font-size: var(--text-xs);
  color: var(--text-secondary);
  line-height: 1.6;
}

/* ============================================
   底部按钮
   ============================================ */
.bottom-action {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--space-md);
  background: var(--bg-card);
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.06);
  display: flex;
  gap: var(--space-md);
}

.bottom-action .btn {
  flex: 1;
  margin: 0;
}

/* ============================================
   动画
   ============================================ */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20rpx); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.4s ease forwards;
}
```

---

## 📱 历史记录页 (history) 完整代码

### history.wxml

```xml
<!--pages/history/history.wxml-->
<view class="history-container page-container">
  <!-- 页面头部 -->
  <view class="header fade-in">
    <view class="header-title">历史记录</view>
  </view>

  <!-- 历史列表 -->
  <view class="history-list" wx:if="{{historyList.length > 0}}">
    <view class="history-item fade-in" wx:for="{{historyList}}" wx:key="id" bindtap="viewDetail" data-id="{{item.id}}">
      <view class="item-thumb">
        <image src="{{item.thumbUrl}}" mode="aspectFill"></image>
      </view>
      <view class="item-info">
        <view class="item-title">{{item.specName}}</view>
        <view class="item-meta">
          <text class="meta-date">{{item.createTime}}</text>
          <text class="meta-status {{item.status}}">{{item.statusText}}</text>
        </view>
      </view>
      <view class="item-arrow">›</view>
    </view>
  </view>

  <!-- 空状态 -->
  <view class="empty-state" wx:else>
    <view class="empty-icon">📁</view>
    <view class="empty-text">暂无历史记录</view>
    <view class="empty-hint">完成制作后将在此显示</view>
    <button class="btn btn-primary" bindtap="goHome">开始制作</button>
  </view>
</view>
```

### history.wxss

```wxss
/* history.wxss - 历史记录页 | 简约风格 */

page {
  background: var(--bg-page);
  min-height: 100vh;
}

.history-container {
  min-height: 100vh;
  padding-bottom: 180rpx;
}

/* ============================================
   页面头部
   ============================================ */
.header {
  padding: var(--space-lg) var(--space-md) var(--space-md);
  background: var(--bg-card);
}

.header-title {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--text-primary);
}

/* ============================================
   历史列表
   ============================================ */
.history-list {
  padding: var(--space-md);
}

.history-item {
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  margin-bottom: var(--space-md);
  display: flex;
  align-items: center;
  gap: var(--space-md);
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}

.history-item:active {
  transform: scale(0.99);
  background: var(--bg-hover);
}

.item-thumb {
  width: 120rpx;
  height: 160rpx;
  border-radius: var(--radius-sm);
  overflow: hidden;
  flex-shrink: 0;
  background: var(--bg-hover);
}

.item-thumb image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.item-title {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--text-primary);
}

.item-meta {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.meta-date {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.meta-status {
  font-size: var(--text-xs);
  padding: 2rpx 12rpx;
  border-radius: var(--radius-full);
  font-weight: 500;
}

.meta-status.completed {
  background: rgba(16, 185, 129, 0.1);
  color: var(--success);
}

.meta-status.pending {
  background: rgba(245, 158, 11, 0.1);
  color: var(--warning);
}

.meta-status.failed {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger);
}

.item-arrow {
  font-size: var(--text-xl);
  color: var(--text-muted);
  flex-shrink: 0;
}

/* ============================================
   空状态
   ============================================ */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-xl) 0;
}

.empty-icon {
  font-size: 96rpx;
  margin-bottom: var(--space-md);
  opacity: 0.5;
}

.empty-text {
  font-size: var(--text-lg);
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
}

.empty-hint {
  font-size: var(--text-sm);
  color: var(--text-muted);
  margin-bottom: var(--space-lg);
}

/* ============================================
   动画
   ============================================ */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20rpx); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.4s ease forwards;
}
```

---

## ✅ 集成检查清单

替换完文件后，请确认以下内容：

- [ ] `app.wxss` - 全局样式已更新
- [ ] `pages/home/` - 首页样式已更新
- [ ] `pages/upload/` - 上传页样式已更新
- [ ] `pages/cropEdit/` - 裁剪页样式已更新
- [ ] `pages/backgroundReplace/` - 背景替换页样式已更新
- [ ] `pages/export/` - 导出页样式已更新
- [ ] `pages/history/` - 历史记录页样式已更新

---

## 🔧 注意事项

1. **保留原有 JS 逻辑**：WXML 和 WXSS 只是视图层，页面逻辑在 `.js` 文件中，请勿修改
2. **图标替换**：简约风格使用 Emoji 作为图标，如需使用 iconfont 请自行替换
3. **组件兼容性**：所有样式基于微信小程序原生组件，确保 `app.json` 中的组件配置正确
4. **测试验证**：替换后请在开发者工具中预览效果，确保布局正常

---

**如需进一步调整或有其他问题，请随时告知！**
