# 阶段1：风格调研与设计方向锁定建议

日期：2026-10-10  
项目：明镜移动端原型（约50个页面）  
阶段状态：调研与方向建议已交付，待用户确认方向后进入阶段2

## 1. 本阶段结论

建议将全项目的候选视觉方向修订为**柔和明亮的轻插画卡片风格**：以暖白/奶油色等浅底、柔和彩色点缀、圆润分区和清晰文字层级为共同基调；插画可以出现，但按页面信息密度克制使用。布局参考01/09、03、04、05、06体现了相近的明亮、柔和和亲和感，风格素材分别偏薄荷桃色、课程插画、运动卡通、暖色3D和极简记录，不应把所有元素平均拼在同一屏。布局参考08保留为独立的暗色移动端视觉参照，布局参考02保留为展示构图/色彩表现参照。该方向仍待确认，不是已批准的设计系统或页面方案。

推荐的项目识别点来自业务内容关系：主播/任务对象、所处阶段或状态、负责人/时间、当前下一步。后续每类页面都围绕其真实任务表达，不挪动或删减现有信息架构、业务模块、权限和流程。布局参考02的倾斜拼贴、布局参考03/04的课程与游戏化装饰，以及各图中的化妆品、医疗、招聘等主题内容不直接移植。

### 调研范围和页面基线

- 用户确认：**现有全部入口都要按手机界面完整优化**。因此，页面登记中的 web/phone 标记不再作为移动端覆盖边界；49个现有可访问路由都纳入后续移动端目标。
- 原型登记含46个静态页面元数据项；另有动态学员详情 P41D，以及 AI、MY 两个角色/功能别名，总计49个可访问路由。用户最初描述“50个左右”与当前路由基线相符。路由数不等于独立页面模板数，动态详情、别名和角色状态须分别核对。
- 页面域按现有路由登记归类：统一入口与平台/公会管理（P00、P01–P03、P10–P16、P93–P96）；运营工作（P20–P25）；经纪与关怀（P30、P30D–P33）；培训（P40–P42、P41D）；妆造与调试（P50–P52）；内容与剪辑（P60–P62）；财务（P70–P71）；主播端（P80–P85）；消息与助理（P90–P92、AI、MY）。
- 项目已有49路由、多种移动宽度和短屏的原型验收记录，可作为后续视觉回归的基线。该记录是既有实现证据，不代替本轮新视觉验收。
- tasks/design-inspiration-dribbble-plan.md 是较早的研究/改造提案。它包含可复用的案例链接，但其中关于重组页面或改动信息架构的提议不视为本轮批准范围；本轮要求保留既有业务和信息架构。

## 2. 参考图风格提炼

| 参考图 | 观察与可迁移原则 | 采纳边界 |
|---|---|---|
| 布局参考.webp、布局参考09.webp | 两张是同一组近似画面；浅底、白色内容区、清楚的区块层次、轻柔的色彩点缀和稳定的底部导航，形成易扫描的移动端节奏。 | 合并为一个风格样本；不移植美妆商品、印尼语内容、消费导购主题和装饰性背景点。 |
| 布局参考02.webp | 色彩对比和视觉表达较强，适合作为探索视觉表现力的旁证。 | 不采用倾斜屏幕、拼贴、漂浮控件等展示构图；业务界面保持稳定阅读方向。 |
| 布局参考03.webp | 首页入口、类别和后续内容有明显层次；页面之间区分清楚。 | 不移植课程业务、宣传型大图、插画主导的首屏。 |
| 布局参考04.webp | 导航、对象记录、状态/数值之间的关系清晰；单页重点明确。 | 不移植卡通动物、积分榜、健身活动和游戏化竞争氛围。 |
| 布局参考05.webp | 暖中性色、首页/列表/详情的结构差异、详情信息分段和主要行动突出，最适合作为业务工作流结构参考。 | 不移植招聘主题、品牌图标、人物3D插画或整套棕色品牌视觉。 |
| 布局参考06.webp | 日期上下文、时间顺序记录和当前选择突出；内容留白克制。 | 不移植健康/情绪记录语义和表情符号数据表达。 |
| 布局参考08.webp | 通知按日期分组、类型有区分、记录可快速浏览。 | 不将暗色医疗配色当作项目基线；借鉴信息组织，不借鉴具体内容。 |

## 3. Dribbble 检索方法与参考案例

检索按四个维度交叉进行：视觉风格（柔和浅色、低饱和配色、圆角卡片、扁平/3D插画、留白和信息层次）；业务场景（移动CRM、创作者/达人运营、团队任务、排期）；组件/模式（搜索筛选、状态列表、表单、资料、通知、成功/空/错误反馈）；页面布局（工作台、列表、详情、个人页、分步流程、时间线）。初筛先看视觉呈现和移动屏幕构图，再看业务与交互可迁移性。

### 二次筛选说明：将视觉匹配与业务匹配分层

用户反馈上一轮提到的案例与附件画风有差距。修订后，[Capi CRM](https://dribbble.com/shots/27114544-CRM-mobile-app)、[社媒机构创作者任务](https://dribbble.com/shots/25841954-Task-management-app-for-a-social-media-agency-Mobile-App-UI-UX)和[企业分步验证表单](https://dribbble.com/shots/26125333-Multi-Step-Business-Verification-UI)保留为业务/流程参考，不作为主视觉锚点。用户补充业务相似案例也可参考，因此两组并列保留，标注用途，避免混为同一种匹配度。

以下候选按与附件的视觉特征关联来筛选；它们和明镜的业务可能不同，主要用于判断配色气质、插画表现、卡片形态和手机屏幕节奏：

| 视觉候选 | 对应附件 | 视觉匹配点 | 使用边界 |
|---|---|---|---|
| [Skincare Product Mobile App UI/UX — Sarup Halder](https://dribbble.com/shots/26832604-Skincare-Product-Mobile-App-UI-UX) | 01/09、05 | 浅奶油底、桃色和暖色点缀、干净的移动浏览/详情布局。 | 与附件01/09一样偏消费产品；只看色彩和页面气质。 |
| [Mobile Learning App — Ronas IT](https://dribbble.com/shots/24911553-Mobile-Learning-App) | 03 | 多屏移动流程、分类入口和鲜明插画表达。 | 儿童学习插画较活泼，仅用于评估插画密度与首屏气氛。 |
| [Fitness Mobile iOS App UI Design — NICKELFOX](https://dribbble.com/shots/20659675-Fitness-Mobile-Ios-App-UI-Design) | 04/05 | 米白、暖橙和自然绿组合，运动场景在柔和背景上突出。 | 只参考颜色关系和内容区节奏，不移植运动业务。 |
| [Sport & Workout Mobile UI Design — Roohi Koohi](https://dribbble.com/shots/27674696-sport-workout-mobile-ui-design) | 04/05 | 桃色、橙色、卡片和3D运动插画，视觉表达更鲜活。 | 用于角色插画和鲜艳度对照，控制装饰在高信息密度业务页中的占比。 |
| [Mood Tracker Mobile iOS App Design — Purrweb](https://dribbble.com/shots/27520945-Mood-Tracker-Mobile-iOS-App-Design) | 06 | 柔和自然视觉、低饱和绿/灰/淡紫、安静留白和记录型页面。 | 仅参考轻盈度、节奏与配色气质，不移植情绪追踪内容。 |
| [Doctor Appointment Mobile App — Dark Mode UI — Naasmind](https://dribbble.com/shots/26931437-Doctor-Appointment-Mobile-App-Dark-Mode-UI) | 08 | 深色背景、蓝紫强调色、移动端主页/列表/资料结构。 | 用于对照暗色模式和信息反差；不直接假设全项目使用暗色主题。 |
| [Mobile Onboarding — 3D Illustrations Exploration — Ben Low](https://dribbble.com/shots/18797808-Mobile-Onboarding-Phat-Text-3D-Illustrations-Exploration) | 05 | 暖色、3D人物与形状组成清楚的移动端开场画面。 | 只作为插画与启动/引导气氛参考，不用于业务工作台布局。 |

本轮视觉候选提供的是更贴近附件的审美样本；若确认整体方向，后续阶段2应从中提炼共通视觉语言，而非照搬某个案例或把不同项目的插画、颜色混搭。

以下按每类页面列出3个业务/交互模式候选，重点说明可迁移的页面结构与流程；外观接近度以“二次筛选”里的视觉候选为准。Dribbble作品通常是设计展示概念，不代表经过可用性研究或验证的产品事实。相同案例可能服务多个页面类型，因此分类条目数不等于独立案例数。案例品牌、业务字段、色彩和信息架构均不作为复制依据。

### 首页 / 工作台 / 入口

| Dribbble案例 | 可观察亮点 | 对明镜的参考边界 |
|---|---|---|
| [CRM mobile app — Capi Creative](https://dribbble.com/shots/27114544-CRM-mobile-app) | 移动工作台把任务优先级、期限和负责人放在同一业务语境中，并连接对象详情与进度。 | 可研究工作台如何让人快速判断待处理对象；不照搬其CRM指标和绿色品牌色。 |
| [Conneq CRM — Productivity Management Mobile App](https://dribbble.com/shots/27082491-Conneq-CRM-Productivity-Management-Mobile-App-UI-UX-Design) | 将工作概览、日程和任务进展放在移动端工作流里。 | 关注摘要与当日行动的层次；避免把概览做成指标卡堆叠。 |
| [CRM Dashboard UI Design — Extrive Design](https://dribbble.com/shots/26794716--CRM-Dashboard-UI-Design) | KPI、近期线索、今日事项按决策顺序组织。 | 只借鉴内容优先次序；手机端不可压缩为窄表格或桌面控制台。 |

### 列表浏览

| Dribbble案例 | 可观察亮点 | 对明镜的参考边界 |
|---|---|---|
| [Task management app for a social media agency — Begüm Erdem](https://dribbble.com/shots/25841954-Task-management-app-for-a-social-media-agency-Mobile-App-UI-UX) | 创作者任务、审批、活动和协作场景与主播运营有业务近似性。 | 优先看对象、任务状态与协作关系；不移植社交信息流或营销语义。 |
| [CRM Mobile App UI Design — Ronas IT](https://dribbble.com/shots/25898757-CRM-Mobile-App-UI-Design) | 移动任务列表支持按状态、日期、负责人筛选，任务与统计有对应入口。 | 可研究筛选上下文和列表入口的关系；明镜仍按原有业务状态表达。 |
| [Task Management Mobile UI — Corporate Task Tracking and Approval](https://dribbble.com/shots/26832743-Task-Management-Mobile-UI-Corporate-Task-Tracking-and-Approval) | 显示完成、处理中、未完成状态，并把审批和原因纳入任务追踪。 | 可参考状态可见性；不为匹配案例而新增明镜状态。 |

### 内容详情

| Dribbble案例 | 可观察亮点 | 对明镜的参考边界 |
|---|---|---|
| [CRM mobile app — Capi Creative](https://dribbble.com/shots/27114544-CRM-mobile-app) | 对象信息、进度、里程碑和团队协作按详情语境组织。 | 参考信息分组与对象连续性；不新增原型中不存在的详情模块。 |
| [Task Management Mobile App Design UI — Ronas IT](https://dribbble.com/shots/22990869-Task-Management-Mobile-App-Design-UI) | 将任务描述、负责人和时间投入等关联信息置于同一详情。 | 参考任务与责任信息的呈现关系；字段以现有数据为准。 |
| [Appointment Booking App UI/UX Design — Haastrup Adewale](https://dribbble.com/shots/26483739-Appointment-Booking-App-UI-UX-Design) | 预约、改期、提醒和确认具有连续步骤。 | 可参照详情到行动反馈的衔接；不导入预约产品的业务流程。 |

### 表单填写

| Dribbble案例 | 可观察亮点 | 对明镜的参考边界 |
|---|---|---|
| [Multi-Step Business Verification UI — Johar Wahyu Ngudiono](https://dribbble.com/shots/26125333-Multi-Step-Business-Verification-UI) | 企业信息、联系人、材料、审核、提交确认串成分步流程。 | 与公会入驻表单的步骤型任务较接近；仅用于表单节奏和阶段提示。 |
| [Responsive onboarding form — Henry Dan](https://dribbble.com/shots/18078720-Responsive-onboarding-form) | 关注表单在不同视口下的内容组织。 | 可作为小屏排布样本；最终字段与流程仍由现有原型决定。 |
| [CRM application — Max Williamson](https://dribbble.com/shots/26570780-CRM-application) | 新建业务对象时的资料录入与信息层级。 | 参考表单字段的阅读顺序；不照搬CRM对象或品牌风格。 |

### 个人中心 / 资料

| Dribbble案例 | 可观察亮点 | 对明镜的参考边界 |
|---|---|---|
| [Mobile App Profile Setting — Masoumeh Karami](https://dribbble.com/shots/23479797-Mobile-App-Profile-Setting) | 资料字段编辑与个人设置区分明确。 | 参考可读和可编辑内容的组织，不照搬个人消费应用的设置项。 |
| [Talentswide Mobile Profile Cards — Erşad Başbağ](https://dribbble.com/shots/18578754-Talentswide-Mobile-Profile-Cards) | 个人、项目与公司资料卡有一致的关系层级。 | 可观察多角色资料呈现；不引入粉丝主页或社交资料墙。 |
| [Profile / Settings Mobile UI — Adam Weitz](https://dribbble.com/shots/6204262-Profile-Settings-Mobile-UI) | 个人资料与设置在手机页面中的分组。 | 仅作为常见资料布局样本；配色不是本项目要求。 |

### 搜索 / 筛选

| Dribbble案例 | 可观察亮点 | 对明镜的参考边界 |
|---|---|---|
| [CRM Mobile App UI Design — Ronas IT](https://dribbble.com/shots/25898757-CRM-Mobile-App-UI-Design) | 日期、状态和负责人筛选可以作用于任务列表。 | 可研究筛选条件与结果范围之间的可见关系。 |
| [NetBase Pro Filter and Search — Catherine Hicks](https://dribbble.com/shots/13590869-NetBase-Pro-Filter-and-Search) | 专业搜索条件和筛选项的组织。 | 可借鉴条件分组和搜索反馈；避免把复杂筛选塞进单一隐藏入口。 |
| [Real Estate App — Filter & Search Screen](https://dribbble.com/shots/25899614-Real-Estate-App-Filter-Search-Screen) | 条件与结果之间的层级关系直观。 | 只参考筛选结构，忽略房产语义、地图和交易内容。 |

### 结果反馈 / 成功状态

| Dribbble案例 | 可观察亮点 | 对明镜的参考边界 |
|---|---|---|
| [Success Confirmation Screen UI Design — Pedro Reyes](https://dribbble.com/shots/25487611-Success-Confirmation-Screen-UI-Design) | 完成提示、结果确认和后续操作之间有清晰顺序。 | 反馈应说明具体操作结果，不只展示成功图标。 |
| [Daily UI #27 — Success Screen — Mahfuj Khan Rafsan](https://dribbble.com/shots/27062090-Daily-UI-27-Success-Screen) | 使用简明信息和明确主操作提供收尾反馈。 | 参考克制的确认方式；不移植其绿色视觉。 |
| [Exam Quiz Mobile UI — Terabit](https://dribbble.com/shots/27260734-Exam-Quiz-Mobile-UI-Minimal-MCQ-Design-Score-Tracking) | 分数、进度与结果信息构成明确的考核回执。 | 可研究结果信息的可扫读性；不移植考试产品语义或暗色调。 |

### 异常 / 空状态

| Dribbble案例 | 可观察亮点 | 对明镜的参考边界 |
|---|---|---|
| [Empty State — Task App UI — shahbaaz miday](https://dribbble.com/shots/26929775-Empty-State-Task-App-UI) | “今天没有任务”也有明确语境和解释。 | 空态需说明当前筛选/日期下为何无内容及可用下一步，避免装饰替代说明。 |
| [Mobile Empty State Screens — Hasan](https://dribbble.com/shots/26810621-Mobile-Empty-State-Screens) | 连接异常与维护状态有不同的文案和视觉反馈。 | 参考异常分类与恢复动作；不复制插画风格或幽默表达。 |
| [Empty States — Maintenance, No Connection, No Results — Khalifa](https://dribbble.com/shots/17102716-Empty-States-Maintenance-No-Connection-No-Results) | 多类异常状态并列展示，便于比较不同原因的反馈。 | 参考状态覆盖思路；错误文案、重试和返回入口由实际业务规则决定。 |

## 4. 设计方向建议与确认点

**方向名称：柔和明亮的轻插画卡片风格**

- **风格关键词：** 柔和、明亮、友好、圆润、插画点缀、色彩有节制。
- **主要视觉来源：** 布局参考01/09的薄荷与桃色、浅色卡片；布局参考03/04的插画和活泼分区；布局参考05的暖色氛围；布局参考06的干净留白和记录节奏。布局参考08作为独立暗色样本对照，布局参考02作为展示性构图样本对照。
- **色彩气质：** 以暖白/浅米色为主环境，结合薄荷绿、桃色、珊瑚橙等柔和色彩；用足够清晰的文字和状态符号保持业务可读。具体色值和色阶留待阶段2。
- **版面气质：** 手机纵向阅读优先；以圆润分区和清楚层级承载业务；插画在入口或轻信息区域更自由，在高密度列表与处理流程中适当减量；重要操作保持易触达。
- **业务识别：** 用主播、任务、排期、成长和风险等既有业务对象构成产品辨识度，而不是通用装饰插画或复制Dribbble品牌。

### 应限制的风格用法

1. 布局参考02的倾斜拼贴适合作为展示稿构图样本，不直接覆盖日常操作页面的阅读方向与交互层级。
2. 布局参考08的暗色和紫色强调保留为独立参考；是否作为应用主题或特定角色模式留待方向确认，不先把所有页面套成暗色。
3. 不把课程、化妆品、健身、医疗、招聘等参考图的业务内容、术语或权限流程移植到明镜。
4. 不以“更好看”为由移动、合并、删减或重命名现有业务信息、流程、权限与模块。
5. 插画、渐变、3D、光影和装饰图表应服务于阅读与行动；状态仍需由明确文案/符号表达，不能只靠颜色传达。

### 阶段2前的确认项

1. 确认“柔和明亮的轻插画卡片风格”作为统一视觉方向，或指出更希望优先跟随的参考图编号/风格关键词。
2. 确认全部49个当前路由均以手机体验作为设计目标；此项已由用户明确确认。
3. 需要确认阶段2是否按现有原型的导航/信息架构原样建立规范，还是可在不改变业务语义和流程的条件下提出局部移动端布局调整；未获确认前按保留原结构执行。

## 5. 标杆页候选与页面优先级

当前原型约49个可访问路由。建议先做以下10个标杆页，覆盖8类基础页面，并加入排期和编辑两种移动端特有结构：

| 优先级 | 标杆候选 | 页面类型 | 选择原因 |
|---:|---|---|---|
| 1 | P20 运营工作台·今天 | 首页/工作台 | 信息密度和日常决策链具有代表性。 |
| 2 | P00 统一进入 | 入口 | 验证角色选择入口与跨角色启动体验。 |
| 3 | P21 我的主播 | 列表/搜索筛选 | 同时覆盖对象列表和筛选/无结果关联模式。 |
| 4 | P22 单主播详情 | 内容详情 | 验证对象上下文、状态与后续路径的视觉层级。 |
| 5 | P10 入驻申请表 | 表单 | 代表多步资料填写与提交反馈链路。 |
| 6 | MY 各角色个人页 | 个人中心 | 检验共享骨架与角色差异的移动适配。 |
| 7 | P42 带教与考核 | 结果反馈 | 覆盖待评分、结果记录等关键反馈场景。 |
| 8 | P15 流失预警处置 | 异常/风险 | 覆盖高优先级风险、责任分配与处理入口。 |
| 9 | P50 视觉工作台 | 排期/日程 | 验证日期上下文和时序信息在手机上的表达。 |
| 10 | P61 脚本草稿 | 编辑 | 验证长文本、编辑状态和软键盘场景。 |

分层覆盖建议：

- **P0 标杆：** 上表10页，先用于检验设计方向和阶段2规范是否适用于主要页面结构。
- **P1 同型扩展：** 其余路由按入口/工作台、对象列表、对象详情、表单与设置、消息协作、排期、内容编辑、结果记录、账户资料归类，复用相应模板并核对角色权限与字段差异。
- **P2 特殊状态回扫：** 对每个业务域补齐加载、空结果、校验错误、成功/失败、无权限、长内容和弱网/连接异常等实际存在的状态。它们作为各页面的状态覆盖，不视作新增页面或新业务。
- 各角色工作台仍要在全量覆盖阶段单独核对：首页模板可复用时复用模板，不可复用时依据已有角色目标作受控差异，不为统一而抹平业务差别。

## 6. 阶段1验收清单和后续切片入口

| 验收项 | 阶段1结果 |
|---|---|
| 参考图逐组分析并提出采纳边界 | 完成；8张图已分析，01/09按近似同组处理。 |
| Dribbble按视觉、业务场景、组件、布局维度检索 | 完成；检索方式和每类页面候选案例已记录。 |
| 8类页面类型均有3个参考候选及借鉴说明 | 完成；列表中存在跨类型复用案例。 |
| 明确整体风格方向、关键词和采纳边界 | 已按用户反馈修订为“柔和明亮的轻插画卡片风格”，待用户确认。 |
| 页面覆盖基线与优先级 | 完成；记录49个可访问路由、10个标杆候选和分层策略。 |
| 移动端覆盖范围 | 用户已确认全部入口都按手机界面完整优化。 |
| 是否开始阶段2 | 需阶段1方向验收后启动；阶段2输入为确认后的风格方向和当前路由/业务基线。 |

**风险与注意事项：**

- 参考图跨电商、教育、健身、招聘、健康和医疗，若平均混搭会失去统一品牌感；需要一套明确的主视觉基线和少量克制的场景变体。
- Dribbble重作品展示，不能替代真实触控、可读性、无障碍和业务流程验证；后续必须回到明镜真实数据和交互路径验收。
- 49条路由含动态详情与角色别名，阶段2组件规范和阶段4覆盖台账要按路由、模板、状态分层登记，避免漏测或重复统计。
- “全入口手机化”已明确；但如需改变现有导航、信息组织或桌面端产品行为，应单独识别为范围变化，不在阶段1视觉建议中自行实施。

阶段1交付物：本报告兼作 Dribbble 参考汇总、风格定义和设计方向建议。确认“柔和明亮的轻插画卡片风格”及参考图优先级后，可以阶段2移动端设计系统规范为下一片切片；该报告未修改原型页面或前端代码。
