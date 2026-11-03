# 经纪人招募、签约资料与关怀（E13-broker-core）

- 角色：经纪人
- 页面：`P31`, `P32`, `P33`, `P15`, `P22`, `P40`
- 目标画布：390×884；图片原始尺寸在 `../../IMAGE-INDEX.csv`。
- Stitch基座：<https://stitch.withgoogle.com/projects/16903879618660142322>（仅指定基座链接；本包未上传或生成Stitch页面）。

## 流程概要

桃桃招募/资料/交接链与关怀风险分支分开；小白桃的待交培训状态独立存在，不接入桃桃对象。

## 页面、动作、跳转与返回

| 页面ID | 入口/前置 | 操作→结果/目的地 | 返回/边界 |
|---|---|---|---|
| `P31` | 招募线索列表/筛选 | 选桃桃查看/记录话术；本地邀约记录→P32 | 返回P31 |
| `P32` | 桃桃资料/准备项 | 登记材料更新同一对象；完成本地交接培训→P40生成待接手项 | 返回P32；不称培训端已收到 |
| `P33` | 关怀筛选与记录 | 保存关怀仅新增关怀记录；若已有风险，查看原P15 warningId | 返回P33；不自动创建/关闭风险 |
| `P15` | 已有预警对象 | 只跳到已有源风险条目 | 回P33 |
| `P22` | 同一主播档案 | 查看主播当前资料 | 返回原经纪页面 |
| `P40` | 培训工作台 | 看到本地待接手项 | 本地结果不表示培训师收到 |

## 状态与数据边界

邀约不是外发消息；本地交接不跨角色真实通知；关怀记录不等于风险已关闭，亦不自动造预警。

## 可用参考图（不代表Stitch已生成）

| 图ID | 页面/状态 | 版本 | 采用 | 包内原图 | 采用依据/勘误 |
|---|---|---|---|---|---|
| IMG-887829AD9D | P31 / 当前参考候选 | v6 | 是 | `assets/reference-originals/product-reference/batch-07-broker-core/P31-桃桃邀约话术状态-v6-c277c748.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-DF05952F41 | P31 / 当前参考候选 | v5 | 是 | `assets/reference-originals/product-reference/batch-07-broker-core/P31-经纪人线索池-v5-99956479.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-E2B42D7960 | P32 / 当前参考候选 | v2 | 是 | `assets/reference-originals/product-reference/batch-07-broker-core/P32-P40-本地交接状态-v2-3e8380d0.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-BE4A4C87A3 | P32 / 当前参考候选 | v4 | 是 | `assets/reference-originals/product-reference/batch-07-broker-core/P32-材料状态前后板-v4-124bf7ea.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-89D49B1AAE | P32 / 当前参考候选 | v3 | 是 | `assets/reference-originals/product-reference/batch-07-broker-core/P32-桃桃资料补齐-v3-40812279.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-8823A74B29 | P33 / 当前参考候选 | v1 | 是 | `assets/reference-originals/product-reference/batch-07-broker-core/P33-P15-预警入口分支-v1-163084d4.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-A20A9A1887 | P33 / 当前参考候选 | v4 | 是 | `assets/reference-originals/product-reference/batch-07-broker-core/P33-经纪人关怀列表-v4-31987771.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-6CFD5E04A8 | P33 / 当前参考候选 | v3 | 是 | `assets/reference-originals/product-reference/batch-07-broker-core/P33-记录关怀状态-v3-fd8e99e1.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |

## 证据与待确认

- 图片仅说明参考布局/状态，不证明控件已运行。操作结果以本文件的文字映射和当前源/正式映射为准。
- 未被列入“可用参考图”的历史/候选仍可在全量联系表查看，但不可作为当前视觉基准。
- 相关逐图SHA、源绝对路径、生成/原始来源与实际尺寸见 `../../IMAGE-INDEX.csv`。
