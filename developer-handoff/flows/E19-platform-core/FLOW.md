# 平台入口、公会管理与能力说明（E19-platform-core）

- 角色：平台管理员
- 页面：`P00`, `P02`, `P03`, `P96`, `P01`, `P10`, `P92`
- 目标画布：390×884；图片原始尺寸在 `../../IMAGE-INDEX.csv`。
- Stitch基座：<https://stitch.withgoogle.com/projects/16903879618660142322>（仅指定基座链接；本包未上传或生成Stitch页面）。

## 流程概要

P00角色入口、P02公会管理、P03平台经营、P96能力说明是不同任务，不是必经开通流。

## 页面、动作、跳转与返回

| 页面ID | 入口/前置 | 操作→结果/目的地 | 返回/边界 |
|---|---|---|---|
| `P00` | 平台角色入口列表 | 选择角色只切本地演示；申请入驻去P10；能力去P96 | 回原上下文 |
| `P02` | 公会列表→同名详情 | 待审核北岸只进入P01；已开通详情按状态给允许动作 | 回P02列表 |
| `P03` | 平台经营概况/排行/公告 | 关注行去同名P02；排行查看；公告本地新增 | 公告接收端按E20→P92设计补充 |
| `P96` | 能力/工具/流程说明页签 | 点页签切换说明，不执行后台工具 | 返回P00/P03来源 |
| `P01` | 审核申请 | 处理申请见E18 | 回P02/进入管理步骤按角色 |

## 状态与数据边界

套餐/停用变更、公告新增、角色切换均为本地演示；P90不是平台公告收件端。

## 可用参考图（不代表Stitch已生成）

| 图ID | 页面/状态 | 版本 | 采用 | 包内原图 | 采用依据/勘误 |
|---|---|---|---|---|---|
| IMG-B14E6E8F6FA19F | P00 / 页面参考候选 | v3 | 是 | `assets/reference-originals/product-reference/batch-13-platform-core/E19-P00-统一角色入口-v3-7485023a.jpg` | P00当前参考；本地演示切换 |
| IMG-A254E4B595A2F4 | P02 / 组件/状态参考 | v2 | 部分 | `assets/reference-originals/product-reference/batch-13-platform-core/E19-P02-C-套餐调整状态板-v2-b8601d2c.jpg` | 套餐调整状态参考；本地状态更新 |
| IMG-FC684BB9B98E52 | P02 / 页面参考候选 | v2 | 部分 | `assets/reference-originals/product-reference/batch-13-platform-core/E19-P02-D-已开通概况-v2-3b70ecc2.jpg` | P02已开通详情参考；源状态与本地动作按映射 |
| IMG-BD9CF0240717A1 | P02 / 页面参考候选 | v1 | 是 | `assets/reference-originals/product-reference/batch-13-platform-core/E19-P02-L-公会列表-v1-d7f77bfe.jpg` | P02列表母版参考 |
| IMG-49EC2C1B4651BC | P02 / 页面参考候选 | v3 | 部分 | `assets/reference-originals/product-reference/batch-13-platform-core/E19-P02-P-待审核公会详情-v3-1e2120e4.jpg` | 待审核详情参考；只保留审核入口 |
| IMG-7902EE8634EC6F | P02 / 组件/状态参考 | v3 | 部分 | `assets/reference-originals/product-reference/batch-13-platform-core/E19-P02-S-停用恢复状态板-v3-ae04573c.jpg` | 停用恢复状态参考；移除生成残留E |
| IMG-F5BF771B1EAC23 | P03 / 组件/状态参考 | v2 | 部分 | `assets/reference-originals/product-reference/batch-13-platform-core/E19-P03-N-C01-发布状态板-v2-7c7a069e.jpg` | 公告发布状态参考；本地记录 |
| IMG-C508B6446B2344 | P03 / 页面参考候选 | v2 | 部分 | `assets/reference-originals/product-reference/batch-13-platform-core/E19-P03-N-平台公告列表-v2-da9ada55.jpg` | 公告列表结构参考；公告仅本地新增 |
| IMG-DEF998EA28A241 | P03 / 页面参考候选 | v2 | 是 | `assets/reference-originals/product-reference/batch-13-platform-core/E19-P03-O-平台经营概况-v2-8044a885.jpg` | P03经营结构参考；业务口径按映射 |
| IMG-F395F18F2ECE02 | P03 / 页面参考候选 | v1 | 部分 | `assets/reference-originals/product-reference/batch-13-platform-core/E19-P03-R-公会排行-v1-1f9156bd.jpg` | 排行列表参考；列头/数值按源映射 |
| IMG-1F7DDB1D3F7236 | P96 / 页面参考候选 | v2 | 部分 | `assets/reference-originals/product-reference/batch-13-platform-core/E19-P96-C-能力范围-v2-f4de24d4.jpg` | 能力范围页签参考 |
| IMG-8512B298BD9560 | P96 / 页面参考候选 | v1 | 部分 | `assets/reference-originals/product-reference/batch-13-platform-core/E19-P96-O-平台能力概览-v1-7b3c9323.jpg` | 平台能力入口/页签结构参考 |
| IMG-6477AF1D3CFE0E | P96 / 页面参考候选 | v2 | 部分 | `assets/reference-originals/product-reference/batch-13-platform-core/E19-P96-T-业务工具-v2-77ce71f4.jpg` | 业务工具页签参考；“权限内只读”按映射 |
| IMG-EBF5FFDB2C6E22 | P96 / 页面参考候选 | v2 | 部分 | `assets/reference-originals/product-reference/batch-13-platform-core/E19-P96-W-使用流程-v2-cc988c0b.jpg` | 使用流程页签结构参考；说明/分隔按映射 |

## 证据与待确认

- 图片仅说明参考布局/状态，不证明控件已运行。操作结果以本文件的文字映射和当前源/正式映射为准。
- 未被列入“可用参考图”的历史/候选仍可在全量联系表查看，但不可作为当前视觉基准。
- 相关逐图SHA、源绝对路径、生成/原始来源与实际尺寸见 `../../IMAGE-INDEX.csv`。
