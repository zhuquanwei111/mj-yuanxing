# Spec: mobile-interaction-patterns

**Objective.** Make every action predictable, reversible when possible, and safe on short mobile screens and with the keyboard open.

**Scope.** Inventory the 34 existing popup call sites as interaction opportunities, not an obligation to keep them as modals. Classify each as inline action, bottom sheet, full-screen editor, dedicated view, or removal. Define shared navigation, filtering, forms, feedback, state, and focus behavior.

**Requirements.** Applicable views cover default, empty, loading/processing, partial, error, unavailable/no-permission, disabled, and success states. Each action responds visibly; labels state the result. Save/review/send flows distinguish draft, preview, confirmation, sent, and failure. Preserve draft values across tabs, periods, and returns. Use undo for reversible changes; reserve confirmation for materially destructive/irreversible actions. Use an in-phone bottom sheet for brief choices and a full-height bounded surface or page for complex editing; do not let overlay, mask, or fixed footer escape the phone viewport. With keyboard open, the active field, close control, and save/cancel remain reachable. Closing restores focus and prior scroll/context.

**Acceptance.** Every popup inventory row has a disposition, content classification, state set, viewport fit, keyboard behavior, close/return behavior, and screenshot/click evidence. No action depends only on hover, color, or an unlabeled icon.

**References.** Use GOV.UK progressive-disclosure guidance to keep essential information visible; use Apple HIG for stable top-level navigation and sufficiently large action targets. Platform-specific behavior must be translated to the HTML prototype rather than copied verbatim.

## V3 弹层逐项处置

以下决策覆盖原型中的34个弹层调用点（M31为无入口旧函数）。只保留短确认与少量即时选择使用叠层；跨对象查看、复杂编辑和多步流程进入手机内全屏视图，并保留来源、筛选和返回位置。归属任务负责按本表落实；T4先统一基础弹层、焦点、遮罩与反馈规则。

| 编号 / 调用 | V3 决定 | 理由与归属任务 |
|---|---|---|
| M01 `broadcastModal` | 全屏草稿 → 预览 → 发送确认 | 群发涉及受众与送达状态；T5 |
| M02 `drillNew` | 纵向数据明细视图 | 名单需完整阅读并可下钻；T7 |
| M03 `drillRoster` | 纵向构成视图 | 多组人数需逐行查看；T7 |
| M04 `drillLive` | 独立在播名单视图 | 人数/状态可能增长，需搜索和返回；T7 |
| M05 `drillVoice` | 今日/本月纵向指标详情 | 两个周期口径分开呈现，避免横向表格；T7 |
| M06 `drillRate` | 开播率及分母明细视图 | 明确人数和统计范围；T7 |
| M07 `editP23` | 全屏规划编辑器 | 长文本与发送前草稿状态；T6 |
| M08 `editP24` | 全屏复盘编辑器 | 长文本、修改后重确认；T6 |
| M09 `assignModal` | 底部面板快速派人 | 单一对象与简短人员选择；T4已接入底部面板，T7完善责任信息 |
| M10 `editSubject` | 就地编辑课目名称 | 改单字段无需离开任务上下文；T9 |
| M11 `openResched` | 独立改期步骤 | 日期、时段、冲突检查需有连续上下文；T11 |
| M12 `openBizModal` | 底部面板选择业务卡类型 | 仅三种即时操作；T4已接入底部面板，T12完善发送状态 |
| M13 `dirTaskModal` | 全屏任务编辑流程 | 任务对象、负责人和截止时间需完整检查；T7 |
| M14 `assign41Modal` | 全屏分配名单视图 | 主播名单需搜索、筛选和批量查看；T7 |
| M15 `addGroupModal` | 全屏新建组表单 | 组名与负责人需校验；T7 |
| M16 `moveModal` | 底部面板调组选择 | 86人不能塞进原生长下拉；T7改为可搜索名单、先显示目标对象与归属变化，保存后提供撤销；T4已接入底部面板 |
| M17 `scoreExam` | 全屏评分步骤 | 分数、判定和下一步补考状态必须同屏核对；T9 |
| M18 `addLead` | 全屏录入线索表单 | 多字段录入并进入邀约流程；T8 |
| M19 `careModal` | 全屏关怀记录表单 | 情绪/风险记录需完整上下文和后续跟进；T8 |
| M20 `newReq` | 全屏新建剪辑需求 | 需求描述、素材与负责人需完整录入；T11 |
| M21 `topicLink` | 独立内容链路详情 | 流程节点多，适合按时间顺序浏览；T11 |
| M22 `newTopicModal` | 全屏新建选题表单 | 选题需填写内容与来源；T11 |
| M23 `p61Edit` | 全屏脚本编辑器 | 长正文需稳定编辑与保存反馈；T11 |
| M24 `taskDetail62` | 独立剪辑需求详情 | 进度、素材、回传和返修同属一个对象；T11 |
| M25 `auditTimeline` | 独立审核时间线视图 | 多节点记录按时间纵向查看；T13 |
| M26 `planModal` | 独立套餐比较/变更步骤 | 权限和用量影响需先展示再确认；T13 |
| M27 `stopModal` | 保留短确认对话框 | 停用影响高，需明确后果并要求再次确认；T13 |
| M28 `noticeModal` | 全屏公告草稿 → 预览 → 发送确认 | 全平台消息不可误发；T13 |
| M29 `monthReport` | 独立月报视图 | 完整账期摘要需可纵向阅读与返回；T7 |
| M30 `editTodo` | 全屏待办草稿编辑器 | 长正文、保存与生效是两个状态；T5 |
| M31 `editPlan` | 移除无入口旧函数 | 当前规划编辑统一使用M07；T4删除旧实现 |
| M32 `openMsg` | 全屏消息撰写/会话视图 | 接收人、上下文和发送状态不可压成短弹窗；T12 |
| M33 `openHandoff` | 全屏交接步骤 | 接收人、原因、回执构成闭环；T6 |
| M34 `openComm` | 全屏沟通记录表单 | 方式、内容与下次跟进需完整记录；T8 |

这些决策是目标信息架构，不代表尚未到达的模块任务已完成。手机内全屏视图不得形成新的一级导航；按任务拆分逐批落地，逐页验证来源返回与表单状态。
