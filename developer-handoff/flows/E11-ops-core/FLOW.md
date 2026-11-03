# 运营工作台与主播计划/复盘/交接（E11-ops-core）

- 角色：运营
- 页面：`P20`, `P21`, `P22`, `P23`, `P24`, `P25`
- 目标画布：390×884；图片原始尺寸在 `../../IMAGE-INDEX.csv`。
- Stitch基座：<https://stitch.withgoogle.com/projects/16903879618660142322>（仅指定基座链接；本包未上传或生成Stitch页面）。

## 流程概要

运营核心主链：P20找今天事项→P21定位主播→P22进入主播上下文；P23/P24/P25是P22下并行任务分支，不串成强制流程。

## 页面、动作、跳转与返回

| 页面ID | 入口/前置 | 操作→结果/目的地 | 返回/边界 |
|---|---|---|---|
| `P20` | 运营底栏“今天”进入工作台 | 查看待办/风险→P22或P24；群发通知仅本地记录 | 返回P20 |
| `P21` | 主播名单/动态视图与筛选 | 选主播→同一sid的P22 | 返回保留名单筛选 |
| `P22` | 同主播概况与身份上下文 | 规划→P23；复盘→P24；交接→P25，三个分支并行 | 回P22 |
| `P23` | 编辑单场规划 | 生成草稿→确认草稿→发给主播；编辑回草稿 | 主播P81读取同一plan；仅本地记录 |
| `P24` | 复盘快照与结论 | 修改清除确认；未确认不可推送；确认后仅本地记录 | 与主播P82同review关联 |
| `P25` | 我收到/我发起/全部交接 | 本地操作更新单据状态/待办 | 返回原交接视图；不称对方已收到 |

## 状态与数据边界

计划、复盘、交接本地效果明示；消息群发和提醒不表示真实送达。P80/P81/P82/P92等接收端映射见E15/E20/E22。

## 可用参考图（不代表Stitch已生成）

| 图ID | 页面/状态 | 版本 | 采用 | 包内原图 | 采用依据/勘误 |
|---|---|---|---|---|---|
| IMG-86907AEC16 | P20 / 当前参考候选 | v1 | 是 | `assets/reference-originals/product-reference/batch-05-ops-core/P20-今日工作台-v1-51501fb9.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-8DF55E6EB9 | P20 / 当前参考候选 | v2 | 是 | `assets/reference-originals/product-reference/batch-05-ops-core/P20-今日开播-v2-c7ec41eb.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-64F158C894 | P20 / 当前参考候选 | v5 | 是 | `assets/reference-originals/product-reference/batch-05-ops-core/P20-经营分析组件板-v5-bc1ba846.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-1730A0A86E | P20 / 当前参考候选 | v1 | 是 | `assets/reference-originals/product-reference/batch-05-ops-core/P20-经营概况-v1-cb1495c7.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-CE6C77AC74 | P20 / 当前参考候选 | v3 | 是 | `assets/reference-originals/product-reference/batch-05-ops-core/P20-群发通知组件状态板-v3-2bc7b1c4.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-FB1D1434B6 | P21 / 当前参考候选 | v5 | 是 | `assets/reference-originals/product-reference/batch-05-ops-core/P21-主播动态-v5-0d8c972d.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-E4387B4814 | P21 / 当前参考候选 | v3 | 是 | `assets/reference-originals/product-reference/batch-05-ops-core/P21-主播名单-v3-c18c7b52.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-CEA885A1C8 | P22 / 当前参考候选 | v5 | 是 | `assets/reference-originals/product-reference/batch-05-ops-core/P22-主播档案概况-v5-43e03210.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-58CFA5E923 | P22 / 当前参考候选 | v1 | 是 | `assets/reference-originals/product-reference/batch-05-ops-core/P22-协作记录交接史-v1-a80fc472.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-26E2CFD672 | P22 / 当前参考候选 | v3 | 是 | `assets/reference-originals/product-reference/batch-05-ops-core/P22-协作记录沟通-v3-0ddba281.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-1446959DA0 | P22 / 当前参考候选 | v1 | 是 | `assets/reference-originals/product-reference/batch-05-ops-core/P22-规划历史-v1-4687cf08.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-C3B000AA65 | P22 / 当前参考候选 | v1 | 是 | `assets/reference-originals/product-reference/batch-05-ops-core/P22-规划复盘历史-v1-4d564e26.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-21C519F4E8 | P22 / 当前参考候选 | v5 | 是 | `assets/reference-originals/product-reference/batch-05-ops-core/P22-趋势-v5-36d0d37f.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-C86A1C9682 | P23 / 当前参考候选 | v2 | 是 | `assets/reference-originals/product-reference/batch-05-ops-core/P23-规划状态板-v2-45a799bf.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-3F27155F8B | P23 / 当前参考候选 | v3 | 是 | `assets/reference-originals/product-reference/batch-05-ops-core/P23-规划生成表单-v3-fee3956f.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-5552DCA3F5 | P24 / 当前参考候选 | v1 | 是 | `assets/reference-originals/product-reference/batch-05-ops-core/P24-依据与编辑状态板-v1-35092033.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-33C57966E3 | P24 / 当前参考候选 | v2 | 是 | `assets/reference-originals/product-reference/batch-05-ops-core/P24-复盘助手-v2-01ac030d.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-F6D76BD6DA | P24 / 当前参考候选 | v5 | 是 | `assets/reference-originals/product-reference/batch-05-ops-core/P24-确认与本地推送状态板-v5-1608d7c4.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-465FD7E000 | P25 / 当前参考候选 | v2 | 是 | `assets/reference-originals/product-reference/batch-05-ops-core/P25-交接中心-我收到-v2-3acc0ecf.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-3B781CBEF7 | P25 / 当前参考候选 | v1 | 是 | `assets/reference-originals/product-reference/batch-05-ops-core/P25-交接中心-状态板-v1-352e2684.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-7DEA52EE30 | P25 / 当前参考候选 | v4 | 是 | `assets/reference-originals/product-reference/batch-05-ops-core/P25-全部交接-v4-0af89bf6.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-303C4CD414 | P25 / 当前参考候选 | v3 | 是 | `assets/reference-originals/product-reference/batch-05-ops-core/P25-我发起交接-v3-301ed65c.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-DE9F2B972A | P25 / 当前参考候选 | v2 | 是 | `assets/reference-originals/product-reference/batch-05-ops-core/P25-空态组件板-v2-20cc3571.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |

## 证据与待确认

- 图片仅说明参考布局/状态，不证明控件已运行。操作结果以本文件的文字映射和当前源/正式映射为准。
- 未被列入“可用参考图”的历史/候选仍可在全量联系表查看，但不可作为当前视觉基准。
- 相关逐图SHA、源绝对路径、生成/原始来源与实际尺寸见 `../../IMAGE-INDEX.csv`。
