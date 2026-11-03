# 预警派单与经纪人回访（E7-risk-handoff）

- 角色：老板/经纪人
- 页面：`P15`, `P30`, `P30D`
- 目标画布：390×884；图片原始尺寸在 `../../IMAGE-INDEX.csv`。
- Stitch基座：<https://stitch.withgoogle.com/projects/16903879618660142322>（仅指定基座链接；本包未上传或生成Stitch页面）。

## 流程概要

P15把w2预警派给经纪人，形成P30本地待回访项；P30D保存沟通记录后只完成回访任务。风险生命周期与回访任务状态分离。

## 页面、动作、跳转与返回

| 页面ID | 入口/前置 | 操作→结果/目的地 | 返回/边界 |
|---|---|---|---|
| `P15` | 老板查看风险条目；选原warningId派给经纪人 | 本地新增P30回访项；打开档案去同主播P22 | 回P15时原风险仍处理中，不自动关闭 |
| `P30` | 经纪人查看“预警跟进·待回访”及派单来源 | 记沟通→P30D；查看详情→P30D；P15风险查看原条目 | 回P30或P15；不能把回访完成当风险关闭 |
| `P30D` | 查看任务、对象和沟通背景 | 填写内容/方式/下次跟进；保存仅将VISITS置为已回访 | 返回P30；风险仍由老板复核 |

## 状态与数据边界

本地派单/回访记录；不声称跨账号通知或风险已解决。字段使用同一warningId/sid；不显示内部键。

## 可用参考图（不代表Stitch已生成）

| 图ID | 页面/状态 | 版本 | 采用 | 包内原图 | 采用依据/勘误 |
|---|---|---|---|---|---|
| IMG-CAC1FD26F4 | P30D / 当前参考候选 | v9 | 是 | `assets/reference-originals/product-reference/batch-01-p15-p30-risk-handoff/C-E7-记沟通表单状态板-v9-5dffbb04.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-CC048AD38D | P15 / 当前参考候选 | v7 | 是 | `assets/reference-originals/product-reference/batch-01-p15-p30-risk-handoff/P15-v7-4c957a0e.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-238B8FD329 | P30 / 当前参考候选 | v3 | 是 | `assets/reference-originals/product-reference/batch-01-p15-p30-risk-handoff/P30-v3-b3ef96f3.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-3C9DEA3878 | P30D / 当前参考候选 | v3 | 是 | `assets/reference-originals/product-reference/batch-01-p15-p30-risk-handoff/P30D-v3-3e3be010.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |

## 证据与待确认

- 图片仅说明参考布局/状态，不证明控件已运行。操作结果以本文件的文字映射和当前源/正式映射为准。
- 未被列入“可用参考图”的历史/候选仍可在全量联系表查看，但不可作为当前视觉基准。
- 相关逐图SHA、源绝对路径、生成/原始来源与实际尺寸见 `../../IMAGE-INDEX.csv`。
