证件照小程序 MVP 项目指令文档.md
1. 项目概述
目标：开发一款低成本上线、高留存用户的证件照制作微信小程序 MVP。

核心价值：

手机拍照 → AI 自动裁剪 → 换底色 → 导出标准证件照

支持常用规格（一寸、二寸、护照、签证）

付费高清下载 + 历史记录

后续可扩展趣味模板、社交分享、提醒功能

MVP 范围（第一阶段）：

微信登录

上传照片（拍照/相册）

选择证件照规格

AI 自动裁剪 + 手动微调

AI 背景替换（白/蓝/红）

基础美颜（亮度/磨皮）

免费低清下载 / 付费高清下载（微信支付）

历史记录查看与重新编辑

2. 技术栈与架构
层级

技术选型

说明

前端

微信小程序原生 / uni-app

跨端兼容，低成本开发

后端

Node.js (Express) 或 Python (Flask/FastAPI)

轻量服务，Serverless 部署

数据库

MySQL 或 MongoDB（初期可用 SQLite 本地文件）

存储用户、订单、历史记录

文件存储

腾讯云 COS / 阿里云 OSS + CDN

图片上传与分发

AI 能力

腾讯云人脸检测/人像分割 API 或开源模型（MODNet、PP-HumanSeg）

按量付费，低成本启动

支付

微信支付 JSAPI

小程序内支付

部署

腾讯云 Serverless（云函数+API网关）或阿里云函数计算

按调用计费，降低运维成本

架构图（文字描述）：

复制
客户端(微信小程序) 
   ⇄ HTTPS API (Node.js/Python后端) 
   ⇄ 对象存储(COS/OSS) 
   ⇄ AI服务(云API/开源模型) 
   ⇄ 微信支付
3. 功能模块与接口清单
详见接口文档（见第 6 部分），MVP 共 6 大模块：

用户认证：微信登录 /auth/wechatLogin

图片上传：/upload/image

规格与裁剪：/size/list、/crop/preview、/crop/adjust

背景替换 & 美颜：/bg/replace、/beauty/apply

导出与支付：/export/preview、/order/create、/download/highres

历史记录：/history/list、/history/detail、/history/delete

4. 页面路由与页面结构
路由表（微信小程序路径）：

复制
/pages/home/home          首页
/pages/upload/upload      上传照片页
/pages/sizeSelect/sizeSelect  规格选择页
/pages/cropEdit/cropEdit      裁剪调整页
/pages/backgroundReplace/backgroundReplace  背景替换页
/pages/export/export          导出页
/pages/history/history        历史记录页
/pages/historyDetail/historyDetail  历史详情页
/pages/profile/profile        我的
/pages/login/login            登录（组件或页面）
页面功能简述：

首页：规格快捷入口、立即制作按钮

上传照片页：拍照/相册选择

规格选择页：列表选择证件照尺寸

裁剪调整页：AI 裁切框 + 手动微调

背景替换页：底色切换、美颜面板

导出页：预览、免费下载、付费高清下载（调起微信支付）

历史记录页：列表展示、删除

历史详情页：重新编辑跳转裁剪页

5. 数据库/存储设计（MVP 简化版）
用户表 users

复制
id, openid, nickname, avatar, create_time
图片记录表 images

复制
id, user_id, type (original/cropped/final), url, create_time
订单表 orders

复制
id, user_id, image_id, amount, status, create_time, pay_time
历史记录表 history

复制
id, user_id, original_image_id, cropped_image_id, final_image_id, spec_id, create_time
规格表 specs

复制
id, name, width_mm, height_mm, dpi
6. AI 能力接入说明
人脸检测 & 自动裁剪​

调用腾讯云人脸检测 API → 获取人脸位置 → 按规格比例计算裁切框。

备选：OpenCV DNN 人脸检测（部署在后端或云函数）。

人像分割 & 背景替换​

调用腾讯云人像分割 API 或百度智能云人体分析。

备选：使用开源 MODNet​ 或 PaddleHub PP-HumanSeg（部署在 GPU/CPU 云函数）。

调用方式​

上传原图到 COS → 将 URL 传给 AI API → 获取处理后图片 URL → 返回前端预览。

7. 开发顺序与 MVP 阶段指令
阶段 1：初始化项目（Day 1–5）

创建小程序项目结构

初始化后端服务（Express/FastAPI）

设计数据库表结构

完成微信登录接口

完成 UI 线框 & 高保真切图资源导入

阶段 2：核心流程开发（Day 6–16）

实现前端页面路由与页面结构

接入图片上传接口

接入规格列表与裁剪预览接口

接入背景替换接口

实现导出页与微信支付对接

完成后端历史记录 CRUD

阶段 3：集成测试 & 修复（Day 17–22）

功能冒烟测试（上传 → 裁剪 → 背景 → 导出）

支付沙箱测试

多机型兼容测试

Bug 修复与性能优化

阶段 4：上线准备（Day 23–26）

准备小程序提审资料

提交审核并修复问题

灰度发布与数据监控接入

上线公告与初始运营

8. AI 编程开发指令（给 AI 的 Prompt 示例）
你可以直接将这些指令分段发给 AI 编程助手，例如 Cursor 的 Chat 模式或 GitHub Copilot Workspace。

8.1 初始化项目指令
复制
请用 uni-app 创建一个微信小程序项目，包含 pages/home、pages/upload、pages/sizeSelect 等 MVP 页面结构，并配置好路由与底部导航栏。
8.2 微信登录实现指令
复制
使用微信小程序 wx.login 获取 code，调用后端 /auth/wechatLogin 接口（Node.js Express），返回 token 并存入 globalData。
8.3 图片上传指令
复制
实现前端 wx.chooseImage 与 wx.uploadFile，将图片上传到后端 /upload/image 接口，返回 imageId 与 url，并在页面预览。
8.4 AI 裁剪接入指令
复制
调用腾讯云人脸检测 API，根据返回的人脸坐标与规格比例计算裁切框，调用 /crop/preview 接口获取裁剪后图片 URL。
8.5 背景替换指令
复制
调用腾讯云人像分割 API，对裁剪图进行抠图，替换背景色（白/蓝/红），调用 /bg/replace 接口返回新图片 URL。
8.6 微信支付接入指令
复制
在小程序 export 页面，点击高清下载时调用 /order/create 创建订单，获取 prepay_id 并调起 wx.requestPayment。
9. 部署与上线指引
后端部署​

使用腾讯云 Serverless 云函数部署 Node.js/Python 接口。

配置 API 网关域名与 HTTPS。

前端部署​

微信开发者工具上传代码并提交审核。

配置合法域名（API、COS、支付回调）。

审核注意​

类目选择“工具-图片处理”或“生活服务”。

避免涉及身份证等敏感信息明文存储。

监控​

接入微信小程序数据分析 + 自建日志收集（如 Sentry）。

10. 附录
接口文档 JSON 示例（可单独提供）

UI 设计稿链接（Figma/蓝湖）

项目甘特图（Excel/图片）

AI API 文档地址（腾讯云/百度智能云）