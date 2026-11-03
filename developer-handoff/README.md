# 原型与业务规则开发交付包

> 版本基准：Stitch 合格页导出 2026-10-19；业务规则对账表 2026-11-03。源 HTML、参考图和 56 条规则副本均保留 SHA256 清单。

## 快速入口

- [逐页原型样本（36 个独立 HTML）](prototype/README.md)
- [业务规则对账表（56 条原文）](business/明镜-uni-app开发业务规则对账表-20261103.md)
- [流程说明与页面映射（17 个流程）](flows/FLOW-CATALOG-20261017.md)
- [设计参考索引（123 张）](design/references/IMAGE-INDEX.csv)
- [逐 ID 页面覆盖核对表](prototype/PAGE-COVERAGE.csv)
- [来源、选择和排除依据](provenance/README.md)

本包是开发输入资料，不是新建或整合后的产品原型。36 份 HTML 来自 Stitch 逐页原样导出；源记录只确认逐页合格/用户确认，不表示页面之间已连通。原型页面仍依赖源文件声明的 Tailwind CDN、Google Fonts/Material Symbols 网络资源；没有引入项目框架或后端。

## 当前原型页（36 个）

| 页面 ID | 页面名 | 文件 | Stitch源画布 |
|---|---|---|---|
| `AI` | AI｜运营助理｜统一产品版 | [`AI-AI｜运营助理｜统一产品版.html`](prototype/pages/AI-AI｜运营助理｜统一产品版.html) | MOBILE 780×1960 |
| `MY` | MY｜运营我的｜统一产品版 | [`MY-MY｜运营我的｜统一产品版.html`](prototype/pages/MY-MY｜运营我的｜统一产品版.html) | MOBILE 780×1768 |
| `P00` | P00｜选择工作身份｜统一产品版 | [`P00-P00｜选择工作身份｜统一产品版.html`](prototype/pages/P00-P00｜选择工作身份｜统一产品版.html) | MOBILE 780×2332 |
| `P13` | P13｜经营大盘｜统一产品版 | [`P13-P13｜经营大盘｜统一产品版.html`](prototype/pages/P13-P13｜经营大盘｜统一产品版.html) | DESKTOP 2560×2048 |
| `P14` | P14｜主播资产｜统一产品版 | [`P14-P14｜主播资产｜统一产品版.html`](prototype/pages/P14-P14｜主播资产｜统一产品版.html) | MOBILE 780×1768 |
| `P15` | P15｜预警与派单｜统一产品版 | [`P15-P15｜预警与派单｜统一产品版.html`](prototype/pages/P15-P15｜预警与派单｜统一产品版.html) | MOBILE 780×1768 |
| `P20` | P20｜运营工作台｜统一产品版 | [`P20-P20｜运营工作台｜统一产品版.html`](prototype/pages/P20-P20｜运营工作台｜统一产品版.html) | MOBILE 780×1768 |
| `P21` | P21｜我的主播｜统一产品版 | [`P21-P21｜我的主播｜统一产品版.html`](prototype/pages/P21-P21｜我的主播｜统一产品版.html) | MOBILE 780×1768 |
| `P22` | P22｜主播档案｜统一产品版 | [`P22-P22｜主播档案｜统一产品版.html`](prototype/pages/P22-P22｜主播档案｜统一产品版.html) | DESKTOP 2560×2048 |
| `P23` | P23｜直播规划｜统一产品版 | [`P23-P23｜直播规划｜统一产品版.html`](prototype/pages/P23-P23｜直播规划｜统一产品版.html) | DESKTOP 2560×2048 |
| `P25` | P25｜交接中心・暖橙精修版 | [`P25-0e7e6712.html`](prototype/pages/P25-0e7e6712.html) | MOBILE 780×1768 |
| `P30D` | P30D｜跟进详情｜统一产品版 | [`P30D-e9b726dc.html`](prototype/pages/P30D-e9b726dc.html) | MOBILE 780×1768 |
| `P31` | P31｜招募线索｜统一产品版 | [`P31-083e39c6.html`](prototype/pages/P31-083e39c6.html) | MOBILE 780×2096 |
| `P41` | P41｜新人成长任务｜统一产品版 | [`P41-P41｜新人成长任务｜统一产品版.html`](prototype/pages/P41-P41｜新人成长任务｜统一产品版.html) | MOBILE 780×1768 |
| `P41D` | P41D｜麦子学员档案・暖橙精修版 | [`P41D-P41D｜麦子学员档案・暖橙精修版.html`](prototype/pages/P41D-P41D｜麦子学员档案・暖橙精修版.html) | MOBILE 780×2442 |
| `P42` | P42｜结业评估｜统一产品版 | [`P42-P42｜结业评估｜统一产品版.html`](prototype/pages/P42-P42｜结业评估｜统一产品版.html) | MOBILE 780×1768 |
| `P50` | P50｜服务排期 | [`P50-P50｜服务排期.html`](prototype/pages/P50-P50｜服务排期.html) | MOBILE 780×1768 |
| `P51` | P51｜妆造工单 | [`P51-P51｜妆造工单.html`](prototype/pages/P51-P51｜妆造工单.html) | MOBILE 780×1768 |
| `P52` | P52｜直播间调试清单｜统一产品版（候选一） | [`P52-直播间调试清单-统一产品版-候选一.html`](prototype/pages/P52-直播间调试清单-统一产品版-候选一.html) | DESKTOP 2560×2048 |
| `P60` | P60｜内容工作台｜统一产品版 | [`P60-P60｜内容工作台｜统一产品版.html`](prototype/pages/P60-P60｜内容工作台｜统一产品版.html) | MOBILE 780×1960 |
| `P61` | P61｜脚本任务｜统一产品版 | [`P61-P61｜脚本任务｜统一产品版.html`](prototype/pages/P61-P61｜脚本任务｜统一产品版.html) | DESKTOP 2560×2048 |
| `P62` | P62｜剪辑任务｜统一产品版 | [`P62-P62｜剪辑任务｜统一产品版.html`](prototype/pages/P62-P62｜剪辑任务｜统一产品版.html) | MOBILE 780×1768 |
| `P70` | P70｜财务工作台｜统一产品版 | [`P70-P70｜财务工作台｜统一产品版.html`](prototype/pages/P70-P70｜财务工作台｜统一产品版.html) | MOBILE 780×1768 |
| `P80` | P80｜主播今天｜统一产品版 | [`P80-P80｜主播今天｜统一产品版.html`](prototype/pages/P80-P80｜主播今天｜统一产品版.html) | MOBILE 780×1768 |
| `P81` | P81｜当前直播规划｜统一产品版 | [`P81-P81｜当前直播规划｜统一产品版.html`](prototype/pages/P81-P81｜当前直播规划｜统一产品版.html) | MOBILE 780×1768 |
| `P83` | P83｜明镜助理・主播端 | [`P83-P83｜明镜助理・主播端.html`](prototype/pages/P83-P83｜明镜助理・主播端.html) | MOBILE 780×1768 |
| `P84` | P84｜我的·主播端・暖橙精修版 | [`P84-a182fbe5.html`](prototype/pages/P84-a182fbe5.html) | MOBILE 780×1768 |
| `P90` | P90｜公会群聊｜统一产品版 | [`P90-P90｜公会群聊｜统一产品版.html`](prototype/pages/P90-P90｜公会群聊｜统一产品版.html) | MOBILE 780×1768 |
| `P91` | P91｜运营私聊｜统一产品版 | [`P91-P91｜运营私聊｜统一产品版.html`](prototype/pages/P91-P91｜运营私聊｜统一产品版.html) | MOBILE 780×1768 |
| `P92` | P92｜消息中心・流式扁平精修版 | [`P92-a7b9212d.html`](prototype/pages/P92-a7b9212d.html) | DESKTOP 2560×2048 |
| `P93` | P93｜运营总监看板｜统一产品版 | [`P93-P93｜运营总监看板｜统一产品版.html`](prototype/pages/P93-P93｜运营总监看板｜统一产品版.html) | MOBILE 780×2132 |
| `P94` | P94｜组长组务｜统一产品版 | [`P94-a6ac2e09.html`](prototype/pages/P94-a6ac2e09.html) | MOBILE 780×1768 |
| `P96` | P96｜平台能力说明｜统一产品版 | [`P96-f30f5469.html`](prototype/pages/P96-f30f5469.html) | DESKTOP 2560×2048 |
| `P71` | P71｜主播账单详情｜统一产品版 | [`P71-6668568f.html`](prototype/pages/P71-6668568f.html) | MOBILE 780×1768 |
| `P40` | P40｜培训工作台｜统一产品版 | [`P40-e7dd5cc8.html`](prototype/pages/P40-e7dd5cc8.html) | MOBILE 780×1768 |
| `P24` | P24｜复盘助手｜统一产品版 | [`P24-3b895025.html`](prototype/pages/P24-3b895025.html) | MOBILE 780×1768 |

## 阅读顺序与边界

1. 业务规则以 2026-11-03 主审最终版逐条对账表为准；副本与授权源 SHA 相同。
2. 当前流程/状态/业务动作以 `flows/<流程>/FLOW.md` 与 ROUTE-MAP 记录为准；设计图不补业务规则。来源快照日期见文件名。
3. 参考图逐张看 `design/references/IMAGE-INDEX.csv` 的状态、版本、采用依据和原始路径；正文同批实施映射记录适用范围及图面勘误。
4. `provenance/excluded-prototype-pages.csv` 列出 49 页导出中未纳入的 13 页及源审查状态。未通过、未验收、历史候选和待确认图不在有效原型/参考素材目录。

38 页/11 岗位是当前开发阶段范围背景，正式页面/岗位对照尚需与当前决议核对；旧 51 行映射、454 张图库或 49 个导出都不代表现行页面覆盖。此处准确列出已选的 36 个 HTML，并不推断页面图的交互覆盖。
