# Change Summary

- Replaced the personality questionnaire landing page with a German-first process pain-point capture experience.
- Added a large free-form textarea for describing slow, repetitive, manual, or fragmented internal workflows.
- Added a UI-only confirmation state and a four-metric analysis preview: weekly time, manual steps, tool handoffs, and automation potential.
- Added UI-only process context inputs for monthly time spent, recurrence, main friction, and involved tools; monthly time is required for the preview flow.
- Split the intake into the concrete process problem and an optional solution idea from the user.
- Changed the main friction question to a checkbox group so users can select multiple blockers at once.
- Removed the pre-submit "Vom Gefühl zur belastbaren Spur" preview section and restored the large heading style for "Was bremst am meisten?".
- Updated the post-submit map to use abstract embedding dimensions for semantic similarity, with monthly time, recurrence, and selected friction types shown separately as process statistics.
- Moved the map to a dedicated `/overview` page showing all anonymous entries, three color-coded dummy clusters, cluster counts, and a "new pain point" action; personal submission statistics are no longer shown there.
- Replaced the cluster count legend with aggregate bar charts for monthly time spent, recurrence, and selected friction types across submitted entries.
- Changed the action to "Schmerzpunkt einreichen" and added a post-submit anonymous 2D cluster overview with similar-entry count, axes, and highlighted current entry.
- Kept the cluster points and similarity count as UI-only demo data until the embedding and clustering logic is wired.
- Updated the visual direction with a warm paper background, deep green hero, coral action color, responsive layout, and process-focused copy.
- Renamed the app metadata to Prozessradar and made German the default language.
- Kept the API, result pages, and downstream personality components unchanged for the later wiring pass.
- Verified with `npm run build`; Next.js and TypeScript build successfully.
