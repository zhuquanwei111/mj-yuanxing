# Spec: calendar-content-finance

**Objective.** Make schedules, content work, and financial records fully readable and actionable on a phone without horizontal dragging.

**Pages.** P50–P52, P60–P62, P70–P71.

**Requirements.** Calendar views show date, time, object and status; day/week switching is explicit and retains selection. Content pages lead with current item, deadline, review state and next action; long text and review evidence are grouped, not squeezed into tiny labels. Finance records show amount, currency/unit, period, source/status and relevant action. Wide data tables become vertically stacked, labeled records or a responsive summary/detail pattern; no field may disappear into tooltip/hover, clipping, or an unlabeled horizontal scroller. If many records exist, search/filter and pagination remain visible and resettable.

**Acceptance.** Representative date→event→update→return and bill→detail→return flows preserve context. All original columns/fields have a written before/after mapping. 360/390/430 viewports show every required value without page-level horizontal overflow; long amounts, dates and titles wrap legibly.

**Reference trade-offs.** Use image 6’s date/event chronology, image 8’s time-based schedule, and Carbon’s data-table guidance for row hierarchy and visible actions. Do not force desktop tables into phone width.
