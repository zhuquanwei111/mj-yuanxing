# Spec: mobile-information-architecture

**Objective.** Replace the current collection of pages with a coherent role-and-task structure that tells people where they are, what they can do, and how to return.

**Scope.** Audit all 49 existing indexes and each role entry point. Treat IDs as inventory, not a fixed product map. For each, record role, task, object, entry/source, primary action, related information, state coverage, return destination, and disposition: keep, merge, redesign, retire, or add. Review the existing `page-by-page-mobile-design-review.md` row as a hypothesis, then correct it when task evidence warrants.

**Requirements.** The start screen for each role prioritizes that role’s next work. Top-level bottom navigation is reserved for frequently switched work areas, not actions. Use explicit named views when two sets of content are mutually exclusive; use headings or direct links when people need to compare or scan both. Avoid hidden critical content, vague “More” labels, nested toggles, and arbitrary click-count limits. Deep links into an object retain role, source list, filter, selected view, and return location. Consolidate duplicate summaries only when a clear canonical source remains.

**Acceptance.** Every old index has a recorded disposition and destination; every new screen has a distinct user task; no route is kept solely for compatibility with an old document. Representative participants can enter a role, reach the right object, perform an action, and return without losing context. Consolidation candidates include overlapping today/roster/analytics content in P20/P21, P80/P81/P82, P13/P93, and P94/P95.

**Boundaries.** Mobile-first; desktop product IA remains later. The separate reviewer shell may show page inventory and design notes but never masquerades as product content.
