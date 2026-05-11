# 证件照小程序 - 实现计划（分解和优先级排序的任务列表）

## [x] 任务 1: 认证云函数开发
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 实现 auth 云函数，获取用户 OPENID
  - 部署云函数到云开发环境
  - 前端集成认证功能
- **Acceptance Criteria Addressed**: AC-9
- **Test Requirements**:
  - `programmatic` TR-1.1: 调用 auth 云函数返回正确的 OPENID
  - `programmatic` TR-1.2: 前端成功获取并存储 OPENID
- **Notes**: 使用 wx-server-sdk 的 getWXContext 方法获取 OPENID

## [x] 任务 2: 首页开发
- **Priority**: P0
- **Depends On**: 任务 1
- **Description**: 
  - 设计首页 UI (Editorial/Magazine 风格)
  - 实现首页页面结构和样式
  - 实现首页逻辑，包括规格快捷入口和跳转
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `human-judgment` TR-2.1: 首页界面美观，符合设计风格
  - `programmatic` TR-2.2: 点击立即制作按钮跳转到上传页面
  - `programmatic` TR-2.3: 点击规格快捷入口预选对应规格并跳转
- **Notes**: 使用暖橙红色主色调，非对称编辑式布局

## [x] 任务 3: 照片上传功能开发
- **Priority**: P0
- **Depends On**: 任务 1
- **Description**: 
  - 开发 upload 云函数，实现图片上传到云存储
  - 设计上传页面 UI
  - 实现上传页面结构和样式
  - 实现上传页面逻辑，支持拍照和相册选择
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `programmatic` TR-3.1: 成功上传图片到云存储
  - `programmatic` TR-3.2: 拍照功能正常工作
  - `programmatic` TR-3.3: 相册选择功能正常工作
  - `programmatic` TR-3.4: 上传成功后显示预览和下一步按钮
- **Notes**: 限制图片大小不超过 5MB

## [/] 任务 4: 规格选择功能开发
- **Priority**: P0
- **Depends On**: 任务 3
- **Description**: 
  - 开发 getSpecs 云函数，从数据库获取规格列表
  - 设计规格选择页面 UI
  - 实现规格选择页面结构和样式
  - 实现规格选择页面逻辑
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**:
  - `programmatic` TR-4.1: 成功获取规格列表
  - `programmatic` TR-4.2: 选择不同规格后正确配置参数
  - `programmatic` TR-4.3: 确认后跳转到裁剪调整页面
- **Notes**: 实现一寸(25×35mm)、二寸(35×49mm)、护照(33×48mm)、签证(35×45mm)四种规格

## [ ] 任务 5: AI 裁剪功能开发
- **Priority**: P0
- **Depends On**: 任务 4
- **Description**: 
  - 开发 faceDetect 云函数，集成腾讯云人脸检测 API
  - 开发 cropImage 云函数，实现图片裁剪逻辑
  - 设计裁剪页面 UI
  - 实现裁剪页面结构和样式
  - 实现裁剪页面逻辑，支持 AI 自动裁剪和手动微调
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `programmatic` TR-5.1: 成功调用人脸检测 API
  - `programmatic` TR-5.2: 自动生成裁剪框
  - `programmatic` TR-5.3: 手动微调裁剪框功能正常
  - `programmatic` TR-5.4: 确认后生成裁剪预览并跳转到背景替换页面
- **Notes**: 需要配置腾讯云 AI 服务 API Key

## [ ] 任务 6: 背景替换功能开发
- **Priority**: P0
- **Depends On**: 任务 5
- **Description**: 
  - 开发 portraitSegment 云函数，集成腾讯云人像分割 API
  - 开发 replaceBackground 云函数，实现背景替换逻辑
  - 设计背景替换页面 UI
  - 实现背景替换页面结构和样式
  - 实现背景替换页面逻辑，支持白、蓝、红三种背景颜色
- **Acceptance Criteria Addressed**: AC-5
- **Test Requirements**:
  - `programmatic` TR-6.1: 成功调用人像分割 API
  - `programmatic` TR-6.2: 背景颜色替换功能正常
  - `programmatic` TR-6.3: 美颜调节功能正常
  - `programmatic` TR-6.4: 确认后生成最终预览并跳转到导出页面
- **Notes**: 需要配置腾讯云 AI 服务 API Key

## [ ] 任务 7: 导出与支付功能开发
- **Priority**: P0
- **Depends On**: 任务 6
- **Description**: 
  - 开发 createOrder 云函数，集成微信支付 API
  - 开发 saveHistory 云函数，实现历史记录保存
  - 设计导出页面 UI
  - 实现导出页面结构和样式
  - 实现导出页面逻辑，支持免费低清下载和付费高清下载
- **Acceptance Criteria Addressed**: AC-6
- **Test Requirements**:
  - `programmatic` TR-7.1: 免费低清下载功能正常
  - `programmatic` TR-7.2: 付费高清下载功能正常
  - `programmatic` TR-7.3: 微信支付流程正常
  - `programmatic` TR-7.4: 下载完成后显示成功提示
- **Notes**: 需要配置微信支付参数

## [ ] 任务 8: 历史记录功能开发
- **Priority**: P1
- **Depends On**: 任务 7
- **Description**: 
  - 开发 getHistory 云函数，实现历史记录查询
  - 开发 deleteHistory 云函数，实现历史记录删除
  - 设计历史记录页面 UI
  - 实现历史记录页面结构和样式
  - 实现历史记录页面逻辑
- **Acceptance Criteria Addressed**: AC-7
- **Test Requirements**:
  - `programmatic` TR-8.1: 成功获取历史记录列表
  - `programmatic` TR-8.2: 历史记录按创建时间倒序排列
  - `programmatic` TR-8.3: 删除历史记录功能正常
  - `programmatic` TR-8.4: 点击历史记录项跳转到详情页面
- **Notes**: 支持分页查询

## [ ] 任务 9: 历史详情与重新编辑功能开发
- **Priority**: P1
- **Depends On**: 任务 8
- **Description**: 
  - 设计历史详情页面 UI
  - 实现历史详情页面结构和样式
  - 实现历史详情页面逻辑，支持重新编辑和删除
- **Acceptance Criteria Addressed**: AC-8
- **Test Requirements**:
  - `programmatic` TR-9.1: 成功加载历史详情数据
  - `programmatic` TR-9.2: 重新编辑功能正常
  - `programmatic` TR-9.3: 删除功能正常
  - `programmatic` TR-9.4: 重新编辑后创建新的历史记录
- **Notes**: 重新编辑时加载原始照片

## [ ] 任务 10: 我的页面开发
- **Priority**: P2
- **Depends On**: 任务 1
- **Description**: 
  - 设计我的页面 UI
  - 实现我的页面结构和样式
  - 实现我的页面逻辑，显示用户信息和功能菜单
- **Acceptance Criteria Addressed**: AC-9
- **Test Requirements**:
  - `human-judgment` TR-10.1: 我的页面界面美观
  - `programmatic` TR-10.2: 成功加载用户信息
  - `programmatic` TR-10.3: 功能菜单跳转正常
- **Notes**: 显示用户头像和昵称

## [ ] 任务 11: 测试与优化
- **Priority**: P1
- **Depends On**: 任务 1-10
- **Description**: 
  - 功能冒烟测试，测试完整流程
  - 支付沙箱测试
  - 多机型兼容测试
  - 性能优化，包括图片加载、云函数调用和页面渲染
- **Acceptance Criteria Addressed**: AC-1-9
- **Test Requirements**:
  - `programmatic` TR-11.1: 完整流程测试通过
  - `programmatic` TR-11.2: 支付流程测试通过
  - `human-judgment` TR-11.3: 多机型适配良好
  - `programmatic` TR-11.4: 性能优化效果明显
- **Notes**: 修复测试中发现的问题

## [ ] 任务 12: 部署与上线
- **Priority**: P1
- **Depends On**: 任务 11
- **Description**: 
  - 小程序审核准备，包括图标、截图和介绍文案
  - 云函数部署到生产环境
  - 小程序提交审核
  - 监控与运维准备
- **Acceptance Criteria Addressed**: AC-1-9
- **Test Requirements**:
  - `human-judgment` TR-12.1: 审核材料准备完整
  - `programmatic` TR-12.2: 云函数部署成功
  - `programmatic` TR-12.3: 小程序提交审核成功
  - `programmatic` TR-12.4: 监控配置正常
- **Notes**: 确保所有云函数和配置正确