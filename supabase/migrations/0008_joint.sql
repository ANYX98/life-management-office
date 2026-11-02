-- 공동 사건: 매주 하나의 안건에 모든 시민이 한 표씩 낸다. 누가 어디에 냈는지는 공개하지 않는다.

create table public.joint_events (
  id           text primary key,
  ord          integer not null unique,
  title        text not null,
  description  text not null,
  options      jsonb not null,
  reward_title text not null
);

insert into public.joint_events (id, ord, title, description, options, reward_title) values
('monday', 0, '월요일 폐지 청원', '월요일을 없애 달라는 청원이 접수되었습니다. 공단은 권한이 없지만 투표는 받습니다.',
 '[{"id":"abolish","label":"폐지한다","notice":"시민 다수가 월요일 폐지에 찬성했습니다. 월요일은 다음 주에도 옵니다. 공단이 전달은 했습니다."},{"id":"tuesday","label":"화요일로 이관한다","notice":"월요일을 화요일로 이관하기로 했습니다. 화요일이 항의하고 있습니다."},{"id":"keep","label":"그냥 둔다","notice":"시민 다수가 월요일을 그냥 두기로 했습니다. 다들 포기가 빠르십니다."}]',
 '월요일 폐지 청원인'),
('motivation', 1, '전 국민 의욕 회복 프로젝트', '실종된 의욕을 어떻게 찾을지 시민 의견을 받습니다.',
 '[{"id":"search","label":"수색대를 보낸다","notice":"수색대를 보내기로 했습니다. 수색대의 의욕도 실종 상태입니다."},{"id":"coffee","label":"커피로 유인한다","notice":"커피로 유인하기로 했습니다. 의욕 대신 심장 박동이 돌아왔습니다."},{"id":"wait","label":"알아서 오게 둔다","notice":"알아서 오게 두기로 했습니다. 공단이 가장 좋아하는 방식입니다."}]',
 '의욕 수색 자원봉사자'),
('bed', 2, '침대 독립 기념일 제정', '침대에서 처음 나온 날을 기념일로 정하자는 안건입니다.',
 '[{"id":"yes","label":"공휴일로 지정한다","notice":"침대 독립 기념일을 공휴일로 정했습니다. 쉬는 날이라 다들 침대에 있습니다."},{"id":"no","label":"침대에 남는다","notice":"시민 다수가 독립을 거부하고 침대에 남기로 했습니다."},{"id":"half","label":"이불만 독립시킨다","notice":"이불만 독립시키기로 했습니다. 이불이 돌아왔습니다."}]',
 '침대 독립 유공자'),
('lunch', 3, '점심 메뉴 통일 운동', '전 시민의 점심을 통일하면 고민이 사라진다는 주장입니다.',
 '[{"id":"ramen","label":"라면으로 통일","notice":"점심을 라면으로 통일했습니다. 물 조절로 분쟁이 시작되었습니다."},{"id":"rice","label":"국밥으로 통일","notice":"점심을 국밥으로 통일했습니다. 부먹 찍먹보다는 조용합니다."},{"id":"none","label":"각자 알아서 먹는다","notice":"각자 알아서 먹기로 했습니다. 고민은 그대로입니다. 네."}]',
 '점심 통일 추진위원'),
('alarm', 4, '알람 감축 협상', '시민 1인당 알람 개수를 제한하자는 협상안입니다.',
 '[{"id":"one","label":"알람은 하나만","notice":"알람을 하나로 줄이기로 했습니다. 내일 지각자가 늘 예정입니다."},{"id":"many","label":"많을수록 좋다","notice":"알람을 제한하지 않기로 했습니다. 알람 쪽 피해가 우려됩니다."},{"id":"none","label":"알람을 없앤다","notice":"알람을 없애기로 했습니다. 공단은 책임지지 않습니다."}]',
 '알람 협상 대표단'),
('tomorrow', 5, '내일로 미루기 합법화', '오늘 할 일을 내일로 미루는 행위를 합법화하는 안건입니다.',
 '[{"id":"legal","label":"합법화한다","notice":"미루기를 합법화했습니다. 시행일은 내일로 미뤘습니다."},{"id":"later","label":"이 투표도 미룬다","notice":"이 안건을 미루기로 했습니다. 다음에 또 올라옵니다."},{"id":"today","label":"오늘 한다","notice":"오늘 하기로 했습니다. 공단은 믿지 않습니다."}]',
 '내일로 미루기 추진위원');

create table public.joint_votes (
  week_start date not null,
  event_id   text not null references public.joint_events (id),
  citizen_id uuid not null references public.citizens (id) on delete cascade,
  option_id  text not null,
  created_at timestamptz not null default now(),
  primary key (week_start, citizen_id)
);

alter table public.joint_events enable row level security;
alter table public.joint_votes enable row level security;
revoke all on public.joint_events from anon, authenticated;
revoke all on public.joint_votes from anon, authenticated;
-- 표는 아래 함수로만 다룬다. 테이블을 직접 읽거나 쓸 수 없다.

create or replace function public.joint_week_start(p_at timestamptz default now())
returns date
language sql
stable
as $$
  select date_trunc('week', p_at at time zone 'Asia/Seoul')::date;
$$;

create or replace function public.joint_event_for(p_week date)
returns text
language sql
stable
set search_path = ''
as $$
  select e.id from public.joint_events e, (select count(*) as c from public.joint_events) n
   where e.ord = ((((floor((p_week - date '2026-11-02') / 7.0))::bigint % n.c) + n.c) % n.c)::int;
$$;

create or replace function public.current_joint()
returns json
language sql
stable
security definer
set search_path = ''
as $$
  with w as (select public.joint_week_start() as week),
       ev as (select e.* from public.joint_events e, w where e.id = public.joint_event_for(w.week))
  select json_build_object(
    'week_start', (select week from w),
    'id', ev.id,
    'title', ev.title,
    'description', ev.description,
    'options', (select json_agg(json_build_object('id', o->>'id', 'label', o->>'label')) from jsonb_array_elements(ev.options) o),
    'reward_title', ev.reward_title,
    'counts', coalesce((select json_object_agg(s.option_id, s.n) from (
       select v.option_id, count(*) n from public.joint_votes v, w where v.week_start = w.week group by v.option_id) s), '{}'::json),
    'my_choice', (select v.option_id from public.joint_votes v, w where v.week_start = w.week and v.citizen_id = auth.uid())
  ) from ev;
$$;

create or replace function public.last_joint_result()
returns json
language sql
stable
security definer
set search_path = ''
as $$
  with w as (select public.joint_week_start() - 7 as week),
       ev as (select e.* from public.joint_events e, w where e.id = public.joint_event_for(w.week)),
       tally as (select v.option_id, count(*) n, min(v.created_at) first_at from public.joint_votes v, w where v.week_start = w.week group by v.option_id),
       top as (select option_id, n from tally order by n desc, first_at limit 1)
  select json_build_object(
    'title', ev.title,
    'total', coalesce((select sum(n) from tally), 0),
    'notice', (select o->>'notice' from jsonb_array_elements(ev.options) o, top where o->>'id' = top.option_id)
  ) from ev;
$$;

create or replace function public.vote_joint(p_option text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_week date := public.joint_week_start();
  v_event text := public.joint_event_for(v_week);
begin
  if auth.uid() is null or not exists (select 1 from public.citizens c where c.id = auth.uid()) then
    raise exception 'not a citizen';
  end if;
  if not exists (
    select 1 from public.joint_events e, jsonb_array_elements(e.options) o
     where e.id = v_event and o->>'id' = p_option
  ) then
    raise exception 'invalid option';
  end if;
  insert into public.joint_votes (week_start, event_id, citizen_id, option_id)
  values (v_week, v_event, auth.uid(), p_option)
  on conflict (week_start, citizen_id) do nothing;
end;
$$;

create or replace function public.my_joint_titles()
returns setof text
language sql
stable
security definer
set search_path = ''
as $$
  select distinct e.reward_title from public.joint_votes v
    join public.joint_events e on e.id = v.event_id
   where v.citizen_id = auth.uid();
$$;

-- 공동 사건 칭호도 대표 칭호로 고를 수 있게 넓힌다.
create or replace function public.set_my_title(p_title text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'not signed in';
  end if;
  if p_title <> '신규 등록 시민'
     and not exists (select 1 from public.cases c where c.citizen_id = auth.uid() and c.awarded_title = p_title)
     and not exists (
       select 1 from public.joint_votes v join public.joint_events e on e.id = v.event_id
        where v.citizen_id = auth.uid() and e.reward_title = p_title
     ) then
    raise exception 'title not owned';
  end if;
  update public.citizens set title = p_title where id = auth.uid();
end;
$$;

revoke execute on function public.joint_event_for(date) from public;
revoke execute on function public.current_joint() from public;
revoke execute on function public.last_joint_result() from public;
revoke execute on function public.vote_joint(text) from public;
revoke execute on function public.my_joint_titles() from public;
grant execute on function public.joint_week_start(timestamptz) to anon, authenticated;
grant execute on function public.current_joint() to anon, authenticated;
grant execute on function public.last_joint_result() to anon, authenticated;
grant execute on function public.vote_joint(text) to authenticated;
grant execute on function public.my_joint_titles() to authenticated;
