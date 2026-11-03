# FLOW-CATALOG｜同一产品的跨角色流程目录

按业务闭环分组；角色底栏按各自源母版，不把角色切换画成自动业务步骤。完整入口/结果/返回见对应 `flows/<flow>/FLOW.md`。提示词可用于Stitch逐流程生成多屏交互原型。

| 流程ID | 流程 | 角色 | 页面/组件ID | 图片总数 | 采用/部分参考 | 状态 |
|---|---|---|---|---:|---:|---|
| `E10-content-handoff` | [脚本审核与剪辑交接](E10-content-handoff/FLOW.md) | 编导/运营/剪辑 | `P60`, `P61`, `P62` | 26 | 6 | 已有图/说明；以单图采用状态为准 |
| `E11-ops-core` | [运营工作台与主播业务分支](E11-ops-core/FLOW.md) | 运营 | `P20`, `P21`, `P22`, `P23`, `P24`, `P25` | 65 | 23 | 已有图/说明；以单图采用状态为准 |
| `E12-ops-my-ai` | [运营我的与助理](E12-ops-my-ai/FLOW.md) | 运营 | `AI`, `MY` | 23 | 6 | 已有图/说明；以单图采用状态为准 |
| `E13-broker-core` | [经纪人招募、资料与关怀](E13-broker-core/FLOW.md) | 经纪人 | `P31`, `P32`, `P33` | 27 | 8 | 已有图/说明；以单图采用状态为准 |
| `E14-finance` | [账期与只读账单测算](E14-finance/FLOW.md) | 财务 | `P70`, `P71` | 21 | 2 | 已有图/说明；以单图采用状态为准 |
| `E15-leadership-snapshot` | [老板经营总览与主播资产](E15-leadership-snapshot/FLOW.md) | 老板/管理层 | `P13`, `P14` | 18 | 3 | 已有图/说明；以单图采用状态为准 |
| `E15-streamer-core` | [主播首页、计划、复盘与消息](E15-streamer-core/FLOW.md) | 主播/跨角色 | `P25`, `P80`, `P81`, `P82`, `P83`, `P84`, `P85`, `P90`, `P91`, `P92` | 56 | 20 | 已有图/说明；以单图采用状态为准 |
| `E16-owner-my` | [老板我的与AI用量](E16-owner-my/FLOW.md) | 老板 | `P16` | 4 | 1 | 已有图/说明；以单图采用状态为准 |
| `E17-owner-org` | [总监组务与组织管理](E17-owner-org/FLOW.md) | 运营总监/组长 | `P93`, `P94`, `P95` | 50 | 16 | 已有图/说明；以单图采用状态为准 |
| `E18-guild-onboarding` | [公会申请、审核与开通](E18-guild-onboarding/FLOW.md) | 申请人/平台审核员/公会管理员 | `P01`, `P10`, `P11`, `P12` | 29 | 14 | 已有图/说明；以单图采用状态为准 |
| `E19-platform-core` | [平台入口、公会经营与能力说明](E19-platform-core/FLOW.md) | 平台管理员 | `P00`, `P02`, `P03`, `P96` | 32 | 14 | 已有图/说明；以单图采用状态为准 |
| `E20-platform-notice` | [平台公告与P92消息中心设计补充](E20-platform-notice/FLOW.md) | 公会角色/平台运营 | `P92` | 6 | 2 | 已有图/说明；以单图采用状态为准 |
| `E21-operator-dm` | [运营私聊与逐问题状态边界](E21-operator-dm/FLOW.md) | 运营/主播 | `P91` | 6 | 2 | 已有图/说明；以单图采用状态为准 |
| `E22-guild-group` | [公会群聊与本地未读/业务卡](E22-guild-group/FLOW.md) | 运营/主播/公会角色 | `P90` | 9 | 3 | 已有图/说明；以单图采用状态为准 |
| `E7-risk-handoff` | [预警派单与经纪人回访](E7-risk-handoff/FLOW.md) | 老板/经纪人 | `P15`, `P30`, `P30D` | 24 | 4 | 已有图/说明；以单图采用状态为准 |
| `E8-training-close` | [培训任务、证据与结业评估](E8-training-close/FLOW.md) | 培训师/学员 | `P40`, `P41`, `P41D`, `P42` | 30 | 5 | 已有图/说明；以单图采用状态为准 |
| `E9-visual-service` | [服务排期、工单与现场清单](E9-visual-service/FLOW.md) | 服务/妆造人员/主播 | `P50`, `P51`, `P52` | 25 | 5 | 已有图/说明；以单图采用状态为准 |

## 跨角色闭环索引

- 运营规划/主播确认：E11 ↔ E15（P23/P81/P80 同一计划）。
- 运营复盘/主播提问：E11 ↔ E15 ↔ E21（同review、reviewKey/questionId隔离）。
- 经纪人风险回访：E7 ↔ E15领导层（同warningId，任务和风险状态分开）。
- 公会开通及公告：E18 ↔ E19 ↔ E20（申请/审核/本地开通；P03公告→P92为设计补充）。
- 群聊与私聊：E22 ↔ E15 ↔ E20/E21（角色身份保持、消息目的地明确）。

全量图片有454条，逐图状态见 IMAGE-INDEX.csv；`PAGE-COVERAGE.csv`区分图已存在、流程映射和Stitch HTML输出。
