# 主播首页、规划、复盘与跨角色消息（E15-streamer-core）

- 角色：主播（关联运营/公会）
- 页面：`P80`, `P81`, `P82`, `P83`, `P84`, `P85`, `P90`, `P91`, `P92`, `C01`, `C02`, `C03`, `C04`, `C05`, `C06`, `C07`, `C08`, `C09`, `C10`
- 目标画布：390×884；图片原始尺寸在 `../../IMAGE-INDEX.csv`。
- Stitch基座：<https://stitch.withgoogle.com/projects/16903879618660142322>（仅指定基座链接；本包未上传或生成Stitch页面）。

## 流程概要

同一主播身份下连接P80/P81计划、P82复盘、P92消息、P90群和P91私聊；P84/P85为个人与权益说明支线。

## 页面、动作、跳转与返回

| 页面ID | 入口/前置 | 操作→结果/目的地 | 返回/边界 |
|---|---|---|---|
| `P80` | 主播默认首页 | 查看规划→P81；复盘→P82；消息/群→P92/P90；自检六项 | 本地自检记录；不作为开播门槛 |
| `P81` | P80规划卡或P92规划通知 | 同一当前计划；我已了解→本地确认并禁用，P80同步 | 返回来源；计划字段同对象 |
| `P82` | P80/P92复盘入口 | 最新/历史切换；展开只读同review.snap；提问→P91携reviewKey | P91回同review；历史不读当前read.ev |
| `P83` | 主播助理 | 固定意图/未匹配答复；按映射进入P81/P82/P84 | 回原助理线程 |
| `P84` | 主播我的 | 排班/收益/账户等说明入口 | 回P84主视图 |
| `P85` | 账号状态与权益 | 查看状态/权益，不支付 | 回P84 |
| `P90` | 主播从P92公会群入口 | 打开群按本地规则清群级未读；业务卡去P81/P82/P15 | 返回P92保持主播身份 |
| `P91` | 主播与运营私聊/复盘问答需隔离 | 普通聊天本地追加不清C03问答状态；review问题按questionId规则 | 返回对应P82或P92 |
| `P92` | 主播消息中心 | 消息筛选；通知进入P81/P82；会话去P90/P91 | 返回来源上下文 |

## 状态与数据边界

同一currentPlan、reviewKey/questionId关联；本地已读/回执不代表后台送达、对方已读或跨会话持久化。各角色底栏按原角色母版，不混入运营导航。

## 可用参考图（不代表Stitch已生成）

| 图ID | 页面/状态 | 版本 | 采用 | 包内原图 | 采用依据/勘误 |
|---|---|---|---|---|---|
| IMG-D5843C2774 | P80 / 当前参考候选 | v1 | 是 | `assets/reference-originals/streamer-research/atlas-batch-01/C01-P80-v1-ddfccdaf.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-E79A5DE014 | P81 / 当前参考候选 | v1 | 是 | `assets/reference-originals/streamer-research/atlas-batch-01/C02-P81-v1-81b2e115.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-DE68ABC56A | P80 / 当前参考候选 | v2 | 部分 | `assets/reference-originals/streamer-research/atlas-batch-01/C10-P80-P82-v2-9a6b79b1.jpg` | P80/P82复用状态组件参考 |
| IMG-9D45114814 | P80 / 当前参考候选 | v4 | 是 | `assets/reference-originals/streamer-research/atlas-batch-01/H01-P80-v4-f2f9a1f4.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-30EE36F30D | P81 / 当前参考候选 | v8 | 是 | `assets/reference-originals/streamer-research/atlas-batch-01/H02-P81-v8-3ce9234b.jpg` | 沿用既有索引标记；以对应批次实施映射为准 |
| IMG-2512AED3BE | P82 / 当前参考候选 | v2.9 | 是 | `assets/reference-originals/streamer-research/atlas-batch-02-p82-c03/C03-P82-v2.9-ac9e9222.jpg` | P82组件状态板当前参考 |
| IMG-AC00ED4E4B | P82 / 当前参考候选 | v3.7 | 是 | `assets/reference-originals/streamer-research/atlas-batch-02-p82-c03/H03-P82-v3.7-e3c63ed6.jpg` | P82/C03组冻结参考；snap/lines分开来源 |
| IMG-605EB7DD13 | P92 / 历史/候选 | v2 | 部分 | `assets/reference-originals/streamer-research/atlas-batch-03-p92-c04/C04-P92-v2-031a585e.jpg` | P92状态组件参考；状态/本地边界按映射 |
| IMG-1E17F02DFA | P92 / 历史/候选 | v4 | 部分 | `assets/reference-originals/streamer-research/atlas-batch-03-p92-c04/H07-P92-v4-a8f8cf92.jpg` | P92主页面结构候选；以P92映射及角色导航为准 |
| IMG-5D5859A188 | P91 / 历史/候选 | v1 | 部分 | `assets/reference-originals/streamer-research/atlas-batch-04-p83-p90-p91-crossrole/C05-P91-v1-e6fcda35.jpg` | P91逐问题状态参考；与普通私聊消息隔离 |
| IMG-FB89979EBF | P92 / 历史/候选 | v1 | 部分 | `assets/reference-originals/streamer-research/atlas-batch-04-p83-p90-p91-crossrole/C06-P92-P90-v1-b63a0d8b.jpg` | P90/P92跨页未读触发状态参考 |
| IMG-6B9FD39BED | P25 / 历史/候选 | v1 | 部分 | `assets/reference-originals/streamer-research/atlas-batch-04-p83-p90-p91-crossrole/C07-P25-P20-v1-3ff58994.jpg` | P25/P20交接关联参考；本地边界按映射 |
| IMG-82B040708E | P84 / 历史/候选 | v2 | 部分 | `assets/reference-originals/streamer-research/atlas-batch-04-p83-p90-p91-crossrole/C08-P84-v2-cf7eced8.jpg` | P84资产组件参考 |
| IMG-56F700604A | P84 / 历史/候选 | v7 | 部分 | `assets/reference-originals/streamer-research/atlas-batch-04-p83-p90-p91-crossrole/C09-P84-account-v7-d3ed691e.jpg` | P84账户组件参考 |
| IMG-B704BF4420 | P84 / 历史/候选 | v6 | 部分 | `assets/reference-originals/streamer-research/atlas-batch-04-p83-p90-p91-crossrole/C09-P84-schedule-v6-ce0dcea6.jpg` | P84排班组件参考 |
| IMG-3B80B7D2E7 | P83 / 历史/候选 | v1 | 部分 | `assets/reference-originals/streamer-research/atlas-batch-04-p83-p90-p91-crossrole/H04-P83-v1-d6f17648.jpg` | P83主播助理结构参考 |
| IMG-58ECE87E2B | P84 / 历史/候选 | v4 | 部分 | `assets/reference-originals/streamer-research/atlas-batch-04-p83-p90-p91-crossrole/H05-P84-v4-f11ba096.jpg` | P84主播我的结构参考 |
| IMG-C130BB903A | P85 / 历史/候选 | v7 | 部分 | `assets/reference-originals/streamer-research/atlas-batch-04-p83-p90-p91-crossrole/H06-P85-membership-v7-3166b2f4.jpg` | P85权益状态参考 |
| IMG-2528DA8AF5 | P90 / 历史/候选 | v1 | 部分 | `assets/reference-originals/streamer-research/atlas-batch-04-p83-p90-p91-crossrole/H08-P90-v1-f9d5ee5c.jpg` | 主播P90结构参考；群事件与运营样例图分角色 |
| IMG-1BE5C9EFB6 | P91 / 历史/候选 | v1 | 部分 | `assets/reference-originals/streamer-research/atlas-batch-04-p83-p90-p91-crossrole/H09-P91-v1-eec135f6.jpg` | 主播私聊结构参考；不套运营H10的导航 |

## 证据与待确认

- 图片仅说明参考布局/状态，不证明控件已运行。操作结果以本文件的文字映射和当前源/正式映射为准。
- 未被列入“可用参考图”的历史/候选仍可在全量联系表查看，但不可作为当前视觉基准。
- 相关逐图SHA、源绝对路径、生成/原始来源与实际尺寸见 `../../IMAGE-INDEX.csv`。
