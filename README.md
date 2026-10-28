How to make this a product:


1. Heavy hook, no mechanism.
Better Hook: This is becoming your thinking partner!
Think of somethin better..

2. -> Nice landing page. Better usability (th scale form 1-7 should be shown as an actual scale from left to right)
Scale 1-7 horizontally.

3. Background image visuals, turn the very first page in something that sparks interest! can we incorporate some UX stuff here?

4. Better questions, not that stiff. We need to rephrase the questions without changin meaning. But the questions are old-school german. They should stay german but easiert to understand.

5. Show personalities of current ChatApplications: ChatGPT, Gemini, Claude.
Add interpretation for the user: Similar to gemini/claude/chatgpt? -> For personal stuff.
If complementary: For problem-solving stuff.

6. Complete tracking of the backend funnel: We actually need to save into the database, how often which step of the application was used.
From start to finish up until the actual prompts were copied that we provide.

7. The AI as a partner (Chatti, Gemini or Claude) which is best suited for you and why.

8. Provide a (first mocked up version) 50 question follow-up quiz for even mor einterpretability at the very end!
Optionally repeat with full 50 questions.

9. Use open-router instead of claude, we need a way cheaper model which still works fine for this task.

10. Add a "How this works" sections at the end as well. We will show resources on what this is based.

11. Add a full english version and easily toggle between them for everything in the application.

# Funnel overview:

select
  event_type,
  count(distinct session_id) as sessions
from events
group by event_type
order by sessions desc;


# Ordered funnel with drop-off %

with steps as (
  select unnest(array[
    'page_view', 'started', 'question_answered',
    'submitted', 'results_viewed', 'prompt_copied'
  ]) as step, generate_series(1,6) as ord
),
counts as (
  select event_type, count(distinct session_id) as n
  from events
  group by event_type
)
select
  s.ord,
  s.step,
  coalesce(c.n, 0) as sessions,
  round(100.0 * coalesce(c.n, 0) / nullif(max(coalesce(c.n,0)) over (), 0), 1) as pct_of_start
from steps s
left join counts c on c.event_type = s.step
order by s.ord;

# Sessions over time (dily
select
  date_trunc('day', created_at) as day,
  count(distinct session_id) as sessions,
  count(distinct case when event_type = 'submitted' then session_id end) as completions
from events
group by day
order by day desc;


# Prompt copy rate:

select
  count(distinct case when event_type = 'results_viewed' then session_id end) as saw_results,
  count(distinct case when event_type = 'prompt_copied'  then session_id end) as copied_prompt,
  round(100.0 *
    count(distinct case when event_type = 'prompt_copied'  then session_id end) /
    nullif(count(distinct case when event_type = 'results_viewed' then session_id end), 0)
  , 1) as copy_rate_pct
from events;

# Average Results Page:

select
  session_id,
  (metadata->>'time_on_page')::int as seconds_on_results
from events
where event_type = 'results_exit'
order by created_at desc;

-- Average:
select
  round(avg((metadata->>'time_on_page')::int)) as avg_seconds
from events
where event_type = 'results_exit';
