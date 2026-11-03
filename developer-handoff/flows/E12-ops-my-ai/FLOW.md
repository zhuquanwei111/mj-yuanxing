# 运营我的与助理（E12-ops-my-ai）

- 角色：运营
- 页面：`MY`, `AI`, `P00`, `P23`
- 目标画布：390×884；图片原始尺寸在 `../../IMAGE-INDEX.csv`。
- Stitch基座：<https://stitch.withgoogle.com/projects/16903879618660142322>（仅指定基座链接；本包未上传或生成Stitch页面）。

## 流程概要

MY展角色、可见范围和工作入口；AI固定意图是进入规划表单的指引，不是已生成的业务计划。

## 页面、动作、跳转与返回

| 页面ID | 入口/前置 | 操作→结果/目的地 | 返回/边界 |
|---|---|---|---|
| `MY` | 运营底栏“我的” | 查看角色/范围/工作入口；切换身份→P00 | P00选择角色后按源上下文返回 |
| `AI` | 运营助理入口 | 固定规划意图只提示下一步；唯一主CTA去小雨P23规划；未匹配只建议改问 | 从P23回AI，本次演示保留线程 |
| `P00` | 切换身份目标页 | 选择角色只切本地演示上下文 | 回MY/来源页 |
| `P23` | AI关联规划页 | 用户自行编辑/确认/发送；AI卡不代表已生成或采纳计划 | 回AI |

## 状态与数据边界

AI答复本次演示保留；aiAccept类本地标记不能被表述为业务采纳，清标记不撤销P23操作；身份切换非鉴权。

## 可用参考图（不代表Stitch已生成）

| 图ID | 页面/状态 | 版本 | 采用 | 包内原图 | 采用依据/勘误 |
|---|---|---|---|---|---|
| IMG-78EBACA8D0 | AI / 当前参考候选 | v2 | 是 | `assets/reference-originals/product-reference/batch-06-ops-my-ai/AI-关联规划返回态-v2-5f31ee2d.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-F664565E0F | AI / 当前参考候选 | v5 | 是 | `assets/reference-originals/product-reference/batch-06-ops-my-ai/AI-固定答复主态-v5-7f383799.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-DDF0BDC661 | AI / 当前参考候选 | v3 | 是 | `assets/reference-originals/product-reference/batch-06-ops-my-ai/AI-替换问题弹层-v3-bf45cf5b.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-8DE293C438 | AI / 当前参考候选 | v4 | 是 | `assets/reference-originals/product-reference/batch-06-ops-my-ai/AI-未匹配与空输入-v4-fdd8614d.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-6B0B1EC554 | AI / 当前参考候选 | v5 | 是 | `assets/reference-originals/product-reference/batch-06-ops-my-ai/AI-运营助理欢迎态-v5-a5475479.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-C5CC136E47 | MY / 当前参考候选 | v2 | 是 | `assets/reference-originals/product-reference/batch-06-ops-my-ai/MY-运营我的-v2-0170b53d.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |

## 证据与待确认

- 图片仅说明参考布局/状态，不证明控件已运行。操作结果以本文件的文字映射和当前源/正式映射为准。
- 未被列入“可用参考图”的历史/候选仍可在全量联系表查看，但不可作为当前视觉基准。
- 相关逐图SHA、源绝对路径、生成/原始来源与实际尺寸见 `../../IMAGE-INDEX.csv`。
