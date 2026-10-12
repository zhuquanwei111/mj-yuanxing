# Spec: prototype-usability-validation

**Objective.** Prove that the redesigned prototype is understandable and operable through behavior and viewport evidence, and turn findings into the next design decision.

**Scope.** Validate dispositions for every old page index and modal call site, plus every new view and cross-page path. The source inventory counts are not pass criteria: a removed or merged route is accepted only when its task and data have a clear destination.

**Requirements.** Test by role and high-risk task, including normal, empty, bad-input, denied/locked, slow/failure, long-name/long-copy/large-amount cases where applicable. Capture at 360×800, 390×844, 430×932 and a 320×568 narrow/short stress size. Use browser screenshots and real clicks; log route, viewport, actions, observed result, issue, evidence path, and status. Measure page-level overflow and modal bounds, then inspect screenshots for semantic clipping. Validate touch targets, contrast, keyboard focus, keyboard-open forms, escape/close, focus return, draft retention, and list scroll restoration. Conduct moderated task observation; record successful completion and wrong turns rather than collecting preference votes alone. Freeze versions used for testing.

**Acceptance.** A 100% route-disposition and modal-disposition matrix exists; no route or interaction is silently omitted. Every critical user path has a behavior test and evidence. No known issue is marked passed solely from source inspection, a screenshot, or a successful script. Findings close with the six-field decision record: hypothesis, method, observation, evidence, conclusion, next decision.

**Boundaries.** This module does not claim production accessibility certification or real backend behavior. Platform-specific iOS/Android keyboard behavior is separately marked if the browser prototype cannot represent it.
