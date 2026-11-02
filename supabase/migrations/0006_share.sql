-- 5단계: 공유 링크. 공개 사건 한 건 조회와, 개인을 특정하지 않는 유입 집계.

create or replace function public.public_case(p_id uuid)
returns table (
  id uuid, title text, report text, verdict text, disposition text, awarded_title text, created_at timestamptz,
  nickname text, "character" jsonb, counts jsonb, mine jsonb, is_mine boolean
)
language sql
stable
security definer
set search_path = ''
as $$
  select c.id, c.title, c.report, c.verdict, c.disposition, c.awarded_title, c.created_at,
         ci.nickname, ci.character,
         coalesce((select jsonb_object_agg(s.kind, s.n)
                     from (select r.kind, count(*) as n from public.reactions r where r.case_id = c.id group by r.kind) s), '{}'::jsonb),
         coalesce((select jsonb_agg(r.kind) from public.reactions r where r.case_id = c.id and r.citizen_id = auth.uid()), '[]'::jsonb),
         coalesce(c.citizen_id = auth.uid(), false)
    from public.cases c
    join public.citizens ci on ci.id = c.citizen_id
   where c.id = p_id and c.visibility = 'public' and not c.hidden;
$$;
revoke execute on function public.public_case(uuid) from public;
grant execute on function public.public_case(uuid) to anon, authenticated;

-- 누가 봤는지가 아니라 몇 번 열리고 몇 명이 등록했는지만 남긴다. 읽기 권한은 주지 않는다.
create table public.share_events (
  id         bigint generated always as identity primary key,
  kind       text not null check (kind in ('visit', 'signup')),
  case_id    uuid references public.cases (id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.share_events enable row level security;
revoke all on public.share_events from anon, authenticated;

create or replace function public.record_share_event(p_kind text, p_case_id uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.share_events (kind, case_id)
  select p_kind, c.id from public.cases c
   where c.id = p_case_id and c.visibility = 'public' and not c.hidden and p_kind in ('visit', 'signup');
$$;
revoke execute on function public.record_share_event(text, uuid) from public;
grant execute on function public.record_share_event(text, uuid) to anon, authenticated;
