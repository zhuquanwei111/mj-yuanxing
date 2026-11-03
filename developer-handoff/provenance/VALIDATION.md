# 核对记录

- 基线：工作分支 `ao/handoff-package/root` 从 `origin/main` 的 `0bfb2183d2582a03ceec6ffb67fbd7d85c58ad93` 开始；GitHub 只读 API 核对的远端 `main` SHA 相同。
- 原型：按 2026-10-19 `qualified-pages` manifest 选中 36 个页面；逐文件大小/SHA 与 manifest 一致。49 页总导出中另外 13 页均按原审查状态记入排除账，没有复制到 `prototype/pages/`。P97/P98 单独未通过候选未纳入。
- 页面覆盖：51 个稳定 ID 行中，36 行对应所选 HTML，其他 15 行没有本次合格 HTML；这 51 行包含全局/待归类 ID，不作为 51 个产品页面或 38 页范围结论。
- 图片：123 张采用/有限部分参考图逐图核对源 SHA；74 张采用、49 张部分采用/结构或状态参考。另有 13 张“部分采用”但标成历史候选，已排除。图像索引保留脱敏来源定位符、原文件名、版本、页面 ID、状态和 SHA。
- 流程与设计：17 份流程说明、14 份 canonical 批次实施映射；映射内本地链接已转到包内路径，未随包提供的图稿链接转成来源名/排除说明。75 个 Markdown 包内相对链接检查无断链。
- 业务规则：56 行、9 个方向（ARC 4、PAG 5、PER 10、AI 6、TSK 8、MSG 9、LIF 4、CNT 4、TEC 6）；副本 SHA256 与指定主审版相同：`296BA75CB03A489431ED74019742E5F997CF2834C551C1BBCF3EA56E6FFCB3FF`。
- 隐私：来源账与图像索引使用 `artifact://`/`repo-source://` 脱敏定位符，替代工作站账号和本机存储路径；源 SHA、版本和包内路径保留。主审规则原文按指定 SHA 保持不变。
- 文件清单：`SOURCE-MANIFEST.csv` 逐源记录脱敏来源定位符、版本/日期、原 SHA、包内路径与包内 SHA；`SHA256-MANIFEST.csv` 核对包内其他文件。
- HTML边界：36 个 HTML 均可按 UTF-8 读取，无缺失的静态本地资源。页面依赖外部 Tailwind CDN、Google Fonts/Material Symbols。P25 源文件用 `${item.anchorLink}` 动态生成指向 `#P22` 的链接；它不证明目标页整合可达，页面仍是独立导出。
- 人工打开：本轮调用 `ao preview developer-handoff/README.md`、`ao preview developer-handoff/prototype/pages/P00-P00｜选择工作身份｜统一产品版.html` 与 `ao preview README.md` 后，AO Browser 仍停留 `about:blank`，managed preview 状态为 stopped；因此本轮未完成浏览器视觉/点击验收。此限制未被表述为已验收。

本包仅可证明素材选择、文件完整性、路径引用和来源一致性；不证明跨页交互、权限、后台送达/已读、支付、跨设备持久化或生产可用性。
