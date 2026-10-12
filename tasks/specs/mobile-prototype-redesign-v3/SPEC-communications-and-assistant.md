# Spec: communications-and-assistant

**Objective.** Keep conversations, system notifications, and AI suggestions tied to the right person, event, or business object.

**Pages.** P90–P92 and AI assistant.

**Requirements.** P90 distinguishes general conversation from operational event cards and identifies group/object context. P91 keeps counterpart, message time/order, business record and draft input stable. P92 exposes clear categories such as all/unread/system, with sender/object, type, summary, time, and unread state in each row; opening a conversation returns to the same list position. AI assistant shows the current context, suggested action and affected object; the user can review, accept, edit, or dismiss and sees the result. Reviewer-only claims about AI/human division stay outside the product surface.

**Acceptance.** Users can distinguish message vs notification vs actionable event, locate the latest unread item, open its exact object, act, and return. New/empty conversation and failure-to-send states have guidance; composer remains usable in short viewport/keyboard scenarios.

**Reference trade-offs.** Use image 8’s time/category grouping and image 1’s clear section labels, not its social-discussion visual language or dark clinic theme.
