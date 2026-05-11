# 实施计划

## 阶段 1: 项目初始化 (Day 1-2)

- [ ] 1.1 创建页面目录结构
  - 创建 8 个页面目录: home, upload, sizeSelect, cropEdit, backgroundReplace, export, history, historyDetail, profile
  - 创建 components 目录用于存放公共组件
  - 创建 utils 目录用于存放工具函数
  - _需求: 需求 1, 需求 2, 需求 3, 需求 4, 需求 5, 需求 6, 需求 7, 需求 8, 需求 9

- [ ] 1.2 配置云开发环境
  - 修改 project.config.json 配置环境 ID 为 cloud1-3gffxfbw1b36f8a6
  - 配置 app.js 初始化云开发 SDK
  - 配置云函数根目录路径
  - _需求: 需求 9

- [ ] 1.3 配置页面路由
  - 修改 app.json 添加所有页面路由配置
  - 配置 TabBar (首页、历史记录、我的)
  - 配置窗口样式和导航栏
  - _需求: 需求 1, 需求 7

- [ ] 1.4 创建全局样式文件
  - 创建全局 wxss 文件定义 CSS 变量和基础样式
  - 定义颜色变量: --primary, --secondary, --accent 等
  - 定义字体变量: --font-title, --font-body
  - _需求: 需求 1

- [ ] 1.5 创建云函数基础结构
  - 创建 10 个云函数目录
  - 初始化每个云函数的 package.json
  - 创建统一的工具函数库
  - _需求: 需求 1-9

## 阶段 2: 数据库初始化 (Day 3)

- [ ] 2.1 创建数据库集合
  - 创建 5 个集合: users, specs, images, history, orders
  - 配置每个集合的权限规则
  - _需求: 需求 9

- [ ] 2.2 初始化规格数据
  - 创建规格数据: 一寸(25x35mm)、二寸(35x49mm)、护照(33x48mm)、签证(35x45mm)
  - 插入到 specs 集合
  - _需求: 需求 3

- [ ] 2.3 配置数据库索引
  - 为 users 集合的 openid 字段创建索引
  - 为 history 集合的 user_id 字段创建索引
  - 为 orders 集合的 user_id 和 status 字段创建索引
  - _需求: 需求 7, 需求 9

## 阶段 3: 认证云函数开发 (Day 4)

- [ ] 3.1 开发 auth 云函数
  - 实现 getWXContext 获取 OPENID
  - 返回用户身份信息
  - 处理异常情况
  - _需求: 需求 9

- [ ] 3.2 部署 auth 云函数
  - 使用 createFunction 创建云函数
  - 配置运行时为 Node.js 16.13
  - 测试云函数调用
  - _需求: 需求 9

- [ ] 3.3 前端集成认证
  - 在 app.js 中调用 auth 云函数
  - 保存 OPENID 到 app.globalData
  - 实现认证失败重试机制
  - _需求: 需求 9

## 阶段 4: 首页开发 (Day 5)

- [ ] 4.1 设计首页 UI (UI Design Rule)
  - 输出设计规范: Purpose Statement, Aesthetic Direction, Color Palette, Typography, Layout Strategy
  - 设计 Magazine 风格首页布局
  - 设计规格快捷入口卡片
  - 设计立即制作主按钮
  - _需求: 需求 1

- [ ] 4.2 实现首页页面结构
  - 创建 pages/home/home.wxml
  - 实现规格快捷入口列表
  - 实现立即制作按钮
  - 添加页面装饰元素
  - _需求: 需求 1

- [ ] 4.3 实现首页样式
  - 创建 pages/home/home.wxss
  - 应用暖橙红配色方案
  - 实现非对称编辑式布局
  - 添加动画和交互效果
  - _需求: 需求 1

- [ ] 4.4 实现首页逻辑
  - 创建 pages/home/home.js
  - 实现规格选择跳转逻辑
  - 实现立即制作跳转逻辑
  - 处理用户交互事件
  - _需求: 需求 1

## 阶段 5: 照片上传功能开发 (Day 6-7)

- [ ] 5.1 开发 upload 云函数
  - 实现图片上传到云存储
  - 生成文件 ID 和访问 URL
  - 处理文件大小限制
  - _需求: 需求 2

- [ ] 5.2 部署 upload 云函数
  - 使用 createFunction 创建云函数
  - 测试图片上传功能
  - _需求: 需求 2

- [ ] 5.3 设计上传页面 UI
  - 输出设计规范
  - 设计拍照按钮和相册按钮
  - 设计照片预览区域
  - _需求: 需求 2

- [ ] 5.4 实现上传页面结构
  - 创建 pages/upload/upload.wxml
  - 实现拍照和相册选择按钮
  - 实现照片预览组件
  - _需求: 需求 2

- [ ] 5.5 实现上传页面样式
  - 创建 pages/upload/upload.wxss
  - 应用 Magazine 风格
  - 实现按钮交互效果
  - _需求: 需求 2

- [ ] 5.6 实现上传页面逻辑
  - 创建 pages/upload/upload.js
  - 调用 wx.chooseMedia 选择照片
  - 调用 upload 云函数上传图片
  - 跳转到下一步页面
  - _需求: 需求 2

## 阶段 6: 规格选择功能开发 (Day 8)

- [ ] 6.1 开发 getSpecs 云函数
  - 实现从数据库获取规格列表
  - 返回规格信息
  - _需求: 需求 3

- [ ] 6.2 部署 getSpecs 云函数
  - 测试规格获取功能
  - _需求: 需求 3

- [ ] 6.3 设计规格选择页面 UI
  - 输出设计规范
  - 设计规格列表卡片
  - 设计选中状态样式
  - _需求: 需求 3

- [ ] 6.4 实现规格选择页面结构
  - 创建 pages/sizeSelect/sizeSelect.wxml
  - 实现规格列表展示
  - 实现规格选择交互
  - _需求: 需求 3

- [ ] 6.5 实现规格选择页面样式
  - 创建 pages/sizeSelect/sizeSelect.wxss
  - 应用 Magazine 风格
  - 实现卡片选中效果
  - _需求: 需求 3

- [ ] 6.6 实现规格选择页面逻辑
  - 创建 pages/sizeSelect/sizeSelect.js
  - 调用 getSpecs 云函数
  - 保存选中的规格
  - 跳转到裁剪页面
  - _需求: 需求 3

## 阶段 7: AI 裁剪功能开发 (Day 9-11)

- [ ] 7.1 开发 faceDetect 云函数
  - 集成腾讯云人脸检测 API
  - 返回人脸坐标信息
  - 处理检测失败情况
  - _需求: 需求 4

- [ ] 7.2 开发 cropImage 云函数
  - 实现图片裁剪逻辑
  - 根据规格计算裁剪框
  - 生成裁剪后的图片
  - _需求: 需求 4

- [ ] 7.3 部署 faceDetect 和 cropImage 云函数
  - 测试人脸检测功能
  - 测试图片裁剪功能
  - _需求: 需求 4

- [ ] 7.4 设计裁剪页面 UI
  - 输出设计规范
  - 设计裁剪框交互区域
  - 设计缩放和拖动手势
  - _需求: 需求 4

- [ ] 7.5 实现裁剪页面结构
  - 创建 pages/cropEdit/cropEdit.wxml
  - 实现图片展示
  - 实现裁剪框组件
  - 实现控制按钮
  - _需求: 需求 4

- [ ] 7.6 实现裁剪页面样式
  - 创建 pages/cropEdit/cropEdit.wxss
  - 应用 Magazine 风格
  - 实现裁剪框样式
  - _需求: 需求 4

- [ ] 7.7 实现裁剪页面逻辑
  - 创建 pages/cropEdit/cropEdit.js
  - 调用 faceDetect 云函数
  - 实现裁剪框拖动和缩放
  - 调用 cropImage 云函数生成裁剪图
  - 跳转到背景替换页面
  - _需求: 需求 4

## 阶段 8: 背景替换功能开发 (Day 12-14)

- [ ] 8.1 开发 portraitSegment 云函数
  - 集成腾讯云人像分割 API
  - 返回人像遮罩
  - _需求: 需求 5

- [ ] 8.2 开发 replaceBackground 云函数
  - 实现背景替换逻辑
  - 支持白/蓝/红三种背景
  - 实现亮度和磨皮调整
  - _需求: 需求 5

- [ ] 8.3 部署 portraitSegment 和 replaceBackground 云函数
  - 测试人像分割功能
  - 测试背景替换功能
  - _需求: 需求 5

- [ ] 8.4 设计背景替换页面 UI
  - 输出设计规范
  - 设计背景颜色选择器
  - 设计美颜调节滑块
  - _需求: 需求 5

- [ ] 8.5 实现背景替换页面结构
  - 创建 pages/backgroundReplace/backgroundReplace.wxml
  - 实现图片预览
  - 实现背景颜色选择
  - 实现美颜调节组件
  - _需求: 需求 5

- [ ] 8.6 实现背景替换页面样式
  - 创建 pages/backgroundReplace/backgroundReplace.wxss
  - 应用 Magazine 风格
  - 实现颜色选择器样式
  - _需求: 需求 5

- [ ] 8.7 实现背景替换页面逻辑
  - 创建 pages/backgroundReplace/backgroundReplace.js
  - 调用 portraitSegment 云函数
  - 调用 replaceBackground 云函数
  - 实现实时背景和美颜预览
  - 跳转到导出页面
  - _需求: 需求 5

## 阶段 9: 导出与支付功能开发 (Day 15-17)

- [ ] 9.1 开发 createOrder 云函数
  - 实现订单创建逻辑
  - 集成微信支付 API
  - 生成预支付 ID
  - _需求: 需求 6

- [ ] 9.2 开发 saveHistory 云函数
  - 实现历史记录保存逻辑
  - 关联用户、规格、图片
  - _需求: 需求 6, 需求 8

- [ ] 9.3 部署 createOrder 和 saveHistory 云函数
  - 测试订单创建功能
  - 测试历史保存功能
  - 配置微信支付参数
  - _需求: 需求 6

- [ ] 9.4 设计导出页面 UI
  - 输出设计规范
  - 设计预览区域
  - 设计下载按钮组
  - _需求: 需求 6

- [ ] 9.5 实现导出页面结构
  - 创建 pages/export/export.wxml
  - 实现最终图片预览
  - 实现免费下载和付费下载按钮
  - 实现价格展示
  - _需求: 需求 6

- [ ] 9.6 实现导出页面样式
  - 创建 pages/export/export.wxss
  - 应用 Magazine 风格
  - 实现按钮交互效果
  - _需求: 需求 6

- [ ] 9.7 实现导出页面逻辑
  - 创建 pages/export/export.js
  - 实现免费低清下载
  - 调用 createOrder 云函数创建订单
  - 调用 wx.requestPayment 调起支付
  - 调用 saveHistory 云函数保存历史
  - 处理支付成功和失败
  - 实现高清下载
  - _需求: 需求 6

## 阶段 10: 历史记录功能开发 (Day 18-19)

- [ ] 10.1 开发 getHistory 云函数
  - 实现历史记录查询逻辑
  - 支持分页查询
  - 关联图片和规格信息
  - _需求: 需求 7

- [ ] 10.2 开发 deleteHistory 云函数
  - 实现历史记录删除逻辑
  - 删除关联的图片数据
  - _需求: 需求 7

- [ ] 10.3 部署 getHistory 和 deleteHistory 云函数
  - 测试历史查询功能
  - 测试历史删除功能
  - _需求: 需求 7

- [ ] 10.4 设计历史记录页面 UI
  - 输出设计规范
  - 设计历史记录卡片列表
  - 设计删除按钮
  - _需求: 需求 7

- [ ] 10.5 实现历史记录页面结构
  - 创建 pages/history/history.wxml
  - 实现历史记录列表
  - 实现删除按钮
  - _需求: 需求 7

- [ ] 10.6 实现历史记录页面样式
  - 创建 pages/history/history.wxss
  - 应用 Magazine 风格
  - 实现卡片样式
  - _需求: 需求 7

- [ ] 10.7 实现历史记录页面逻辑
  - 创建 pages/history/history.js
  - 调用 getHistory 云函数
  - 实现删除逻辑
  - 实现跳转到详情页面
  - _需求: 需求 7

- [ ] 10.8 设计历史详情页面 UI
  - 输出设计规范
  - 设计大图展示
  - 设计重新编辑按钮
  - _需求: 需求 8

- [ ] 10.9 实现历史详情页面结构
  - 创建 pages/historyDetail/historyDetail.wxml
  - 实现大图展示
  - 实现重新编辑和删除按钮
  - _需求: 需求 8

- [ ] 10.10 实现历史详情页面样式
  - 创建 pages/historyDetail/historyDetail.wxss
  - 应用 Magazine 风格
  - _需求: 需求 8

- [ ] 10.11 实现历史详情页面逻辑
  - 创建 pages/historyDetail/historyDetail.js
  - 加载历史详情数据
  - 实现重新编辑逻辑
  - 实现删除逻辑
  - _需求: 需求 8

## 阶段 11: 我的页面开发 (Day 20)

- [ ] 11.1 设计我的页面 UI
  - 输出设计规范
  - 设计用户信息展示
  - 设计功能列表
  - _需求: 需求 9

- [ ] 11.2 实现我的页面结构
  - 创建 pages/profile/profile.wxml
  - 实现用户头像和昵称
  - 实现功能菜单
  - _需求: 需求 9

- [ ] 11.3 实现我的页面样式
  - 创建 pages/profile/profile.wxss
  - 应用 Magazine 风格
  - _需求: 需求 9

- [ ] 11.4 实现我的页面逻辑
  - 创建 pages/profile/profile.js
  - 加载用户信息
  - 实现功能跳转
  - _需求: 需求 9

## 阶段 12: 测试与优化 (Day 21-23)

- [ ] 12.1 功能冒烟测试
  - 测试完整流程: 上传 → 裁剪 → 背景 → 导出
  - 测试所有页面跳转
  - 测试云函数调用
  - _需求: 需求 1-9

- [ ] 12.2 支付沙箱测试
  - 配置微信支付沙箱环境
  - 测试支付流程
  - 测试支付回调
  - _需求: 需求 6

- [ ] 12.3 多机型兼容测试
  - 在不同屏幕尺寸测试
  - 在不同操作系统测试
  - 修复适配问题
  - _需求: 需求 1-9

- [ ] 12.4 性能优化
  - 图片加载优化
  - 云函数调用优化
  - 页面渲染优化
  - _需求: 需求 1-9

## 阶段 13: 部署与上线 (Day 24-26)

- [ ] 13.1 小程序审核准备
  - 准备小程序图标
  - 准备小程序截图
  - 编写小程序介绍文案
  - _需求: 需求 1-9

- [ ] 13.2 云函数部署到生产环境
  - 使用 createFunction 部署所有云函数
  - 配置云函数环境变量
  - 验证云函数可用性
  - _需求: 需求 1-9

- [ ] 13.3 小程序提交审核
  - 配置小程序合法域名
  - 使用微信开发者工具上传代码
  - 提交审核
  - _需求: 需求 1-9

- [ ] 13.4 监控与运维准备
  - 配置云函数日志监控
  - 配置错误告警
  - 准备运维文档
  - _需求: 需求 1-9
