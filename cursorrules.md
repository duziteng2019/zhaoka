 .cursorrules（适配本证件照小程序 MVP）
markdown
复制
# Cursor Rules for 证件照小程序 MVP 项目
# 版本: v1.0
# 作用: 指导 AI 编程助手理解项目技术栈、架构、编码规范与业务流程

## 1. 项目概述
- 项目名称: 证件照助手（ID Photo Assistant）
- 目标: 微信小程序，实现手机拍照 → AI 自动裁剪 → 换底色 → 导出标准证件照
- 核心特性: 常用规格选择、AI 背景替换、免费/付费下载、历史记录
- 运行环境: 微信小程序客户端 + Node.js/Python 后端 API + 腾讯云 COS/OSS + AI 云服务

## 2. 技术栈约束
- 前端: 微信小程序原生 或 uni-app（Vue 语法），优先使用 uni-app 以便跨端
- 后端: Node.js (Express) 或 Python (FastAPI)，部署在腾讯云 Serverless（云函数）
- 数据库: MySQL 或 MongoDB（MVP 可用 SQLite 本地文件代替），表结构见项目文档
- 文件存储: 腾讯云 COS / 阿里云 OSS + CDN
- AI 服务: 腾讯云人脸检测 API、人像分割 API（按量付费）；备选开源模型 MODNet、PP-HumanSeg
- 支付: 微信支付 JSAPI
- 鉴权: 微信登录 → 后端签发 JWT/Token，Header `Authorization: Bearer <token>`

## 3. 项目结构约束
- 小程序端:
/pages

home/

upload/

sizeSelect/

cropEdit/

backgroundReplace/

export/

history/

historyDetail/

profile/

login/ (或组件)

/components

/static (图片、icon)

/utils (request封装、通用函数)

App.vue / main.js

复制
- 后端端（Node.js 示例）:
/routes

auth.js

upload.js

crop.js

bg.js

export.js

history.js

/controllers

/services (AI调用、支付调用)

/models (数据库ORM)

/middlewares (鉴权、错误处理)

server.js

复制
## 4. 接口风格约束
- RESTful 风格，JSON 数据交互
- 统一响应格式:
json

{

"code": 0,

"msg": "success",

"data": { ... }

}

复制
- 错误码: 0 成功，非 0 为错误（如 401 未授权，400 参数错误，500 服务错误）
- 文件上传使用 `multipart/form-data`
- 鉴权: 需要在 Authorization Header 中传递 Bearer Token

## 5. 命名与编码规范
- 前端变量/函数: camelCase（如 `uploadImage`, `selectSpec`）
- 组件文件名: PascalCase（如 `CropEditPage.vue`）
- 接口 URL 采用小写+连字符（如 `/auth/wechat-login`）
- SQL/NoSQL 字段: snake_case（如 `user_id`, `create_time`）
- 注释: 所有接口函数、复杂业务逻辑必须加简短注释
- 日志: 后端关键操作记录日志（上传、支付、AI调用）

## 6. 业务流程约束（AI 必须遵守）
- 用户首次使用可匿名制作免费低清证件照，只有高清下载或保存历史才触发微信登录
- 图片上传 → 选择规格 → AI 自动裁剪 → 手动微调 → AI 背景替换 → 预览 → 免费/付费导出
- 裁剪框必须锁定所选规格比例
- 背景替换只允许白/蓝/红三种基础底色（MVP），边缘需平滑处理
- 支付流程必须在服务端创建订单并返回签名参数，前端仅调起 `wx.requestPayment`
- 历史记录需保存原图、裁剪图、最终图的 ID 与规格，可重新编辑跳转裁剪页

## 7. AI 能力调用约束
- 人脸检测与裁剪优先调用腾讯云 API，返回人脸框后按比例裁切
- 人像分割与背景替换优先调用腾讯云人像分割 API，确保边缘自然
- 若云 API 异常，可降级使用开源模型推理（部署在云函数中）
- AI 处理结果图片必须存储在 COS/OSS，并返回可公开访问的 URL

## 8. 安全与合规
- 禁止在前端存储 Token 明文，必须放在 globalData 或安全存储
- 图片文件需校验类型与大小，防止恶意上传
- 用户敏感信息（如身份证号）不得存储在数据库中
- 小程序提审类目选择“工具-图片处理”，避免违规

## 9. 开发顺序建议（MVP）
1. 初始化前后端项目结构
2. 完成微信登录与鉴权
3. 实现图片上传与规格选择
4. 接入 AI 裁剪与背景替换
5. 实现导出与支付
6. 完成后端历史记录接口
7. 全链路测试与修复
8. 提交微信审核并上线

## 10. 其他指令
- AI 在生成代码时需参考本规则，保持技术栈一致
- 遇到未定义业务可询问产品经理或参考项目文档
- 生成的接口必须匹配接口清单中的字段与含义
- 优先使用 async/await 进行异步处理，避免回调地狱