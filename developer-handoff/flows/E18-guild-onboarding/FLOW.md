# 公会申请、平台审核与开通配置（E18-guild-onboarding）

- 角色：申请人/平台审核员/公会管理员
- 页面：`P10`, `P01`, `P11`, `P12`, `P00`
- 目标画布：390×884；图片原始尺寸在 `../../IMAGE-INDEX.csv`。
- Stitch基座：<https://stitch.withgoogle.com/projects/16903879618660142322>（仅指定基座链接；本包未上传或生成Stitch页面）。

## 流程概要

申请人提交、平台审核、公会管理员配置是三个责任阶段；不表示跨角色自动推进。

## 页面、动作、跳转与返回

| 页面ID | 入口/前置 | 操作→结果/目的地 | 返回/边界 |
|---|---|---|---|
| `P10` | P00选择“申请入驻” | 分步填公会/联系人/可选材料；提交→本地待审核 | 留在P10查看进度；无处理SLA |
| `P01` | 平台审核待办入口 | 打开申请详情；驳回需原因；本地通过/驳回 | 通过后由管理角色进入P11，不自动切角色 |
| `P11` | 审核通过后的公会管理配置 | 配置部门→邀请（可跳过/待接受）→导入主播；至少1位才满足完成条件 | 留在P11对应步骤 |
| `P12` | 组织与权限 | 角色选择/资源行/部门人数；敏感权限按确认前后状态本地演示 | 回组织管理 |
| `P00` | 平台/公会角色选择入口 | 申请/切换角色仅本地演示 | 回来源页 |

## 状态与数据边界

邀请可跳过但不代表已发送/接受；开通至少导入1位主播；敏感权限开放是本地只读演示。

## 可用参考图（不代表Stitch已生成）

| 图ID | 页面/状态 | 版本 | 采用 | 包内原图 | 采用依据/勘误 |
|---|---|---|---|---|---|
| IMG-7DAF8B4F7AC96A | P01 / 页面参考候选 | v1 | 部分 | `assets/reference-originals/product-reference/batch-12-guild-onboarding/E18-P01-A1-平台审核申请列表-v1-f2d40470.jpg` | 平台审核列表参考 |
| IMG-21E7916AD98687 | P01 / 页面参考候选 | v4 | 部分 | `assets/reference-originals/product-reference/batch-12-guild-onboarding/E18-P01-A2-平台审核申请详情-v4-26875d28.jpg` | 审核详情参考；字段和本地动作以映射为准 |
| IMG-0B769F388866F3 | P01 / 组件/状态参考 | v2 | 部分 | `assets/reference-originals/product-reference/batch-12-guild-onboarding/E18-P01-B-平台审核状态板-v2-b2471024.jpg` | 平台审核结果状态参考；本地演示 |
| IMG-E8A5C8B6436625 | P10 / 页面参考候选 | v1 | 是 | `assets/reference-originals/product-reference/batch-12-guild-onboarding/E18-P10-A-入驻申请步骤1-v1-cb7ff57b.jpg` | 申请页当前参考 |
| IMG-DFD7CF14A39C0D | P10 / 页面参考候选 | v1 | 是 | `assets/reference-originals/product-reference/batch-12-guild-onboarding/E18-P10-B-联系人与材料-v1-614fa7ee.jpg` | 申请字段页当前参考 |
| IMG-6653E8816CD5E2 | P10 / 页面参考候选 | v3 | 部分 | `assets/reference-originals/product-reference/batch-12-guild-onboarding/E18-P10-C-申请已提交状态-v3-30398cf0.jpg` | 提交状态参考；不表示真实审核/SLA |
| IMG-E24E45C422D9C7 | P11 / 页面参考候选 | v2 | 部分 | `assets/reference-originals/product-reference/batch-12-guild-onboarding/E18-P11-A-部门配置步骤1-v2-b1533387.jpg` | 开通配置步骤参考 |
| IMG-9A2DE3468E19EE | P11 / 组件/状态参考 | v2 | 部分 | `assets/reference-originals/product-reference/batch-12-guild-onboarding/E18-P11-B-C-邀请员工状态板-v2-4b0d9ec3.jpg` | 邀请状态参考；本地动作和待接受边界 |
| IMG-C0046579102F46 | P11 / 页面参考候选 | v1 | 部分 | `assets/reference-originals/product-reference/batch-12-guild-onboarding/E18-P11-B-邀请员工步骤2-v1-83c90fbb.jpg` | 邀请步骤参考；可跳过且不表示已发送/接受 |
| IMG-DDC17275FF4CD9 | P11 / 组件/状态参考 | v3 | 部分 | `assets/reference-originals/product-reference/batch-12-guild-onboarding/E18-P11-C-C-导入主播关键状态板-v3-1b0d0579.jpg` | 导入/完成状态参考；本地示例 |
| IMG-AB988D05286215 | P11 / 页面参考候选 | v1 | 部分 | `assets/reference-originals/product-reference/batch-12-guild-onboarding/E18-P11-C-导入主播步骤3-v1-5ee3822a.jpg` | 导入主播步骤参考；至少导入一位为完成条件 |
| IMG-9707829B301F6B | P12 / 组件/状态参考 | v2 | 部分 | `assets/reference-originals/product-reference/batch-12-guild-onboarding/E18-P12-A-C-敏感权限状态板-v2-6ba034a6.jpg` | 敏感权限本地状态参考 |
| IMG-800D7F922292E7 | P12 / 页面参考候选 | v3 | 部分 | `assets/reference-originals/product-reference/batch-12-guild-onboarding/E18-P12-A-角色权限-v3-ffdbc146.jpg` | P12权限页当前结构参考；组织架构未开放不展示名下对象 |
| IMG-A1C8CD58BE2F53 | P12 / 页面参考候选 | v2 | 部分 | `assets/reference-originals/product-reference/batch-12-guild-onboarding/E18-P12-B-部门与人数-v2-0d773f06.jpg` | P12部门统计当前结构参考；源部门名与真实字段映射优先 |

## 证据与待确认

- 图片仅说明参考布局/状态，不证明控件已运行。操作结果以本文件的文字映射和当前源/正式映射为准。
- 未被列入“可用参考图”的历史/候选仍可在全量联系表查看，但不可作为当前视觉基准。
- 相关逐图SHA、源绝对路径、生成/原始来源与实际尺寸见 `../../IMAGE-INDEX.csv`。
