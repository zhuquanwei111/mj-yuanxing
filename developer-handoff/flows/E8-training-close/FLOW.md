# 培训任务、证据与结业评估（E8-training-close）

- 角色：培训师/主播学员
- 页面：`P40`, `P41`, `P41D`, `P42`, `C-E8`
- 目标画布：390×884；图片原始尺寸在 `../../IMAGE-INDEX.csv`。
- Stitch基座：<https://stitch.withgoogle.com/projects/16903879618660142322>（仅指定基座链接；本包未上传或生成Stitch页面）。

## 流程概要

任务证据与考试门槛分开。麦子当前3/4且完整彩排待验收，不能结业；栗子74分需重考，不能与麦子串线。

## 页面、动作、跳转与返回

| 页面ID | 入口/前置 | 操作→结果/目的地 | 返回/边界 |
|---|---|---|---|
| `P40` | 培训师工作台选择学员 | 打开同一学员P41任务或P41D档案 | 回P40保留学员上下文 |
| `P41` | 查看第n/5项与任务状态 | 打开证据/练习→P41D；查看评估→P42 | 返回P41任务列表 |
| `P41D` | 同一学员任务证据和考试记录分组查看 | 证据只按源状态显示，不推断核验通过 | 返回P41/P42 |
| `P42` | 分别检查任务证据和考试分数≥80 | 未满足则待补/重考；满足后才显示可结业评估/交接动作 | 回P41D同一学员 |
| `C-E8` | 任务/考试/结业状态板 | 状态示意不证明交互或持久化 | 随来源页返回 |

## 状态与数据边界

源规则为考试≥80并满足任务证据；样例状态不可补造。结业/运营待接手等本地边界按映射，不声称外部已收件。

## 可用参考图（不代表Stitch已生成）

| 图ID | 页面/状态 | 版本 | 采用 | 包内原图 | 采用依据/勘误 |
|---|---|---|---|---|---|
| IMG-57BAB7D470 | P42 / 当前参考候选 | v2 | 是 | `assets/reference-originals/product-reference/batch-02-training-close/C-E8-任务证据与结业门槛-v2-b98605f4.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-1D04B99522 | P40 / 当前参考候选 | v3 | 是 | `assets/reference-originals/product-reference/batch-02-training-close/P40-培训工作台-v3-59fa5c01.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-31AF8885B1 | P41 / 当前参考候选 | v10 | 是 | `assets/reference-originals/product-reference/batch-02-training-close/P41-成长任务-v10-2e3ea939.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-293D9B0D26 | P41D / 当前参考候选 | v5 | 是 | `assets/reference-originals/product-reference/batch-02-training-close/P41D-学员档案-v5-129fc5da.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-057EB5B9EF | P42 / 当前参考候选 | v11 | 是 | `assets/reference-originals/product-reference/batch-02-training-close/P42-结业评估-v11-ccf00c0a.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |

## 证据与待确认

- 图片仅说明参考布局/状态，不证明控件已运行。操作结果以本文件的文字映射和当前源/正式映射为准。
- 未被列入“可用参考图”的历史/候选仍可在全量联系表查看，但不可作为当前视觉基准。
- 相关逐图SHA、源绝对路径、生成/原始来源与实际尺寸见 `../../IMAGE-INDEX.csv`。
