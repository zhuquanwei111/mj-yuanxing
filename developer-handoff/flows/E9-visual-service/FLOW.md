# 服务排期、妆造工单与现场清单（E9-visual-service）

- 角色：服务/妆造人员/主播
- 页面：`P50`, `P51`, `P52`, `C-E9`
- 目标画布：390×884；图片原始尺寸在 `../../IMAGE-INDEX.csv`。
- Stitch基座：<https://stitch.withgoogle.com/projects/16903879618660142322>（仅指定基座链接；本包未上传或生成Stitch页面）。

## 流程概要

同日样例：小雨09:40直播间A调试j1与14:00妆造j2；“出发前确认路线”置于两单间。

## 页面、动作、跳转与返回

| 页面ID | 入口/前置 | 操作→结果/目的地 | 返回/边界 |
|---|---|---|---|
| `P50` | 服务排期按日/本周/全部浏览 | j1直播间调试→P52；j2妆造→P51；路线提示位于两单之间 | 返回P50原时间顺序 |
| `P51` | 从j2查看待接单/服务中/已完成工单 | 待接单可接单或改期；服务中可完成回传；已完成只读 | 返回P50的j2 |
| `P52` | 从j1打开现场六项检查 | 勾选更新0/6→n/6；完成仅本地记录，不等于工单完成 | 返回P50的j1 |
| `C-E9` | 工单状态/清单状态组件 | 同一对象不同快照，不混用两个进度尺度 | 随P51/P52返回P50 |

## 状态与数据边界

照片在服务后上传；P52六项检查不代表P51工单已完成；路线上不造风险或自动改派。

## 可用参考图（不代表Stitch已生成）

| 图ID | 页面/状态 | 版本 | 采用 | 包内原图 | 采用依据/勘误 |
|---|---|---|---|---|---|
| IMG-7D00F18723 | P51 / 当前参考候选 | v3 | 是 | `assets/reference-originals/product-reference/batch-03-visual-service/C-E9-P51-工单阶段-v3-34b16081.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-0B4CC96BBB | P52 / 当前参考候选 | v5 | 是 | `assets/reference-originals/product-reference/batch-03-visual-service/C-E9-P52-清单状态-v5-a6e08c97.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-CFEC70B2EA | P50 / 当前参考候选 | v3 | 是 | `assets/reference-originals/product-reference/batch-03-visual-service/P50-服务排期-v3-6edab6b8.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-A0B6BDE806 | P51 / 当前参考候选 | v11 | 是 | `assets/reference-originals/product-reference/batch-03-visual-service/P51-妆造跟进工单-v11-6fcf981c.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-3B9767D8CF | P52 / 当前参考候选 | v3 | 是 | `assets/reference-originals/product-reference/batch-03-visual-service/P52-直播间调试清单-v3-dffcd0e7.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |

## 证据与待确认

- 图片仅说明参考布局/状态，不证明控件已运行。操作结果以本文件的文字映射和当前源/正式映射为准。
- 未被列入“可用参考图”的历史/候选仍可在全量联系表查看，但不可作为当前视觉基准。
- 相关逐图SHA、源绝对路径、生成/原始来源与实际尺寸见 `../../IMAGE-INDEX.csv`。
