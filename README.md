# 证件照小程序 - 云开发项目

## 项目介绍

证件照制作微信小程序 MVP,提供手机拍照、AI 自动裁剪、背景替换、标准证件照导出等功能。用户可以通过小程序快速制作符合规格要求的证件照。

### 核心功能

- ✅ 手机拍照 / 相册选择照片
- ✅ AI 自动裁剪 + 手动微调
- ✅ 证件照规格选择 (一寸/二寸/护照/签证)
- ✅ AI 背景替换 (白/蓝/红)
- ✅ 基础美颜 (亮度/磨皮)
- ✅ 免费低清下载 / 付费高清下载
- ✅ 历史记录查看与重新编辑

## 技术架构

### 前端
- **框架**: 微信小程序原生开发
- **基础库版本**: latest
- **UI 设计**: Editorial/Magazine (杂志/编辑风格)
  - 配色: 暖橙红(#FF6B35) + 米白(#F7F3E8) + 深灰黑(#2D3436)
  - 字体: Georgia (标题) + Helvetica Neue (正文)
  - 布局: 非对称编辑式布局
- **云开发 SDK**: wx-server-sdk v2.6.3

### 后端
- **云函数**: Node.js 16.13
- **AI 能力**: 腾讯云 AI 服务 (人脸检测、人像分割)
- **支付**: 微信支付 JSAPI

### 数据存储
- **数据库**: 云开发文档型数据库 (NoSQL)
- **云存储**: 腾讯云 COS

## 云开发资源

### 环境信息
- **环境 ID**: cloud1-2ge2s3ln9adb1998
- **环境类型**: 小程序云开发 (miniapp)
- **状态**: 正常运行 (已统一所有配置文件)

### 数据库集合

| 集合名 | 用途 | 权限规则 |
|---------|------|---------|
| users | 用户表 | CUSTOM (用户只能读写自己的数据) |
| specs | 证件照规格表 | READONLY (管理员写,用户只读) |
| images | 图片表 | CUSTOM (用户只能读写自己的图片) |
| history | 历史记录表 | CUSTOM (用户只能读写自己的历史) |
| orders | 订单表 | CUSTOM (用户只能读写自己的订单) |

### 云函数

| 云函数名 | 功能 | 状态 |
|---------|------|------|
| auth | 获取用户 OPENID | ✅ 代码已创建 |
| upload | 上传图片到云存储 | ✅ 代码已创建 |
| faceDetect | 腾讯云人脸检测 | ✅ 代码已创建 |
| portraitSegment | 腾讯云人像分割 | ⏳ 待开发 |
| cropImage | 图片裁剪 | ⏳ 待开发 |
| replaceBackground | 背景替换 | ⏳ 待开发 |
| createOrder | 创建订单 + 微信支付 | ⏳ 待开发 |
| saveHistory | 保存历史记录 | ⏳ 待开发 |
| getHistory | 获取历史记录 | ⏳ 待开发 |
| deleteHistory | 删除历史记录 | ⏳ 待开发 |

### 页面结构

```
/pages/home/home              首页
/pages/upload/upload          上传照片页
/pages/sizeSelect/sizeSelect  规格选择页
/pages/cropEdit/cropEdit      裁剪调整页
/pages/backgroundReplace/backgroundReplace  背景替换页
/pages/export/export          导出页
/pages/history/history        历史记录页
/pages/historyDetail/historyDetail  历史详情页
/pages/profile/profile        我的
```

### 目录结构

```
F:\zhaoka\
├── miniprogram\              # 小程序代码
│   ├── pages\             # 页面
│   │   ├── home\
│   │   ├── upload\
│   │   ├── sizeSelect\
│   │   ├── cropEdit\
│   │   ├── backgroundReplace\
│   │   ├── export\
│   │   ├── history\
│   │   ├── historyDetail\
│   │   └── profile\
│   ├── components\         # 公共组件
│   ├── utils\            # 工具函数
│   ├── images\            # 图片资源
│   ├── app.js            # 小程序入口
│   ├── app.json           # 小程序配置
│   └── app.wxss           # 全局样式
├── cloudfunctions\          # 云函数代码
│   ├── auth\
│   ├── upload\
│   ├── faceDetect\
│   ├── portraitSegment\
│   ├── cropImage\
│   ├── replaceBackground\
│   ├── createOrder\
│   ├── saveHistory\
│   ├── getHistory\
│   ├── deleteHistory\
│   └── utils.js
├── specs\                  # 需求和技术文档
│   └── id-photo-miniprogram\
│       ├── requirements.md
│       ├── design.md
│       └── tasks.md
├── project.config.json      # 项目配置
└── README.md               # 项目说明
```

## 开发进度

### ✅ 已完成

**阶段 1: 项目初始化** (100%)
- ✅ 创建页面目录结构
- ✅ 配置云开发环境 (env: cloud1-2ge2s3ln9adb1998)
- ✅ 配置页面路由和 TabBar
- ✅ 创建全局样式文件 (Editorial/Magazine 风格)
- ✅ 创建云函数基础结构 (10个云函数目录)

**阶段 2: 数据库初始化** (100%)
- ✅ 创建数据库集合 (users, specs, images, history, orders)
- ✅ 配置数据库权限规则 (CUSTOM/READONLY)
- ✅ 初始化规格数据 (一寸/二寸/护照/签证)

### ⏳ 进行中

**阶段 3-13: 页面和云函数开发 (已完成))

## 后续步骤

### 阶段 3: 认证云函数开发
- [ ] 部署 auth 云函数
- [ ] 前端集成认证

### 阶段 4: 首页开发
- [ ] 设计首页 UI
- [ ] 实现首页页面结构
- [ ] 实现首页样式
- [ ] 实现首页逻辑

### 阶段 5-11: 核心功能开发
- [ ] 照片上传功能
- [ ] 规格选择功能
- [ ] AI 裁剪功能
- [ ] 背景替换功能

### 阶段 12-19: 完整功能开发
- [ ] 导出与支付功能
- [ ] 历史记录功能
- [ ] 我的页面

### 阶段 20-23: 测试与优化
- [ ] 功能测试
- [ ] 性能优化
- [ ] 多机型兼容测试

### 阶段 24-26: 部署与上线
- [ ] 小程序审核准备
- [ ] 云函数部署
- [ ] 小程序提交审核
- [ ] 监控与运维

## 云开发控制台链接

- **概览**: [查看环境概览](https://tcb.cloud.tencent.com/dev?envId=cloud1-2ge2s3ln9adb1998#/overview)
- **数据库**: [管理数据库](https://tcb.cloud.tencent.com/dev?envId=cloud1-2ge2s3ln9adb1998#/db/doc)
- **云函数**: [管理云函数](https://tcb.cloud.tencent.com/dev?envId=cloud1-2ge2s3ln9adb1998#/scf)
- **云存储**: [管理云存储](https://tcb.cloud.tencent.com/dev?envId=cloud1-2ge2s3ln9adb1998#/storage)

## 注意事项

1. **小程序 AppID**: 需要在 project.config.json 中配置小程序 AppID
2. **TabBar 图标**: 需要下载图标到 miniprogram/images 目录 (tab-home.png, tab-history.png, tab-profile.png)
3. **AI API**: 需要配置腾讯云 AI 服务的 API Key (待配置)
4. **微信支付**: 需要配置微信支付参数 (待配置)
5. **权限**: 云函数部署后可能需要在微信开发者工具中安装云调用权限

## 参考文档

- [需求文档](specs/id-photo-miniprogram/requirements.md)
- [技术方案](specs/id-photo-miniprogram/design.md)
- [实施计划](specs/id-photo-miniprogram/tasks.md)
- [小程序开发规则](rules/miniprogram-development/rule.md)
- [UI 设计规则](rules/ui-design/rule.md)
