-- 4단계: 시민 사건기록실. 반응과 신고를 다루며 누가 눌렀는지는 공개하지 않는다.

alter table public.cases add column hidden boolean not null default false;

-- 공개 사건에 연락처가 들어가지 않도록 서버에서도 막는다. 기존 행은 검사하지 않는다.
alter table public.cases add constraint cases_statement_no_contact
  check (statement !~ '@' and statement !~ '(\D*\d){7}') not valid;

drop policy "public cases and own cases are readable" on public.cases;
create policy "visible public cases and own cases are readable"
  on public.cases for select
  to anon, authenticated
  using ((visibility = 'public' and not hidden) or citizen_id = auth.uid());

-- 본인은 언제든 공개 범위를 바꿀 수 있다.
create policy "citizens update own case visibility"
  on public.cases for update
  to authenticated
  using (citizen_id = auth.uid())
  with check (citizen_id = auth.uid());
grant update (visibility) on public.cases to authenticated;

create table public.reactions (
  case_id    uuid not null references public.cases (id) on delete cascade,
  citizen_id uuid not null references public.citizens (id) on delete cascade,
  kind       text not null check (kind in ('empathy', 'unfair', 'metoo', 'investigate', 'legend')),
  created_at timestamptz not null default now(),
  primary key (case_id, citizen_id, kind)
);
create index reactions_citizen_idx on public.reactions (citizen_id);

alter table public.reactions enable row level security;

-- 반응 행에는 누른 사람의 ID가 있으므로 본인 것만 읽는다. 개수는 아래 함수가 집계해 준다.
create policy "citizens read own reactions"
  on public.reactions for select to authenticated
  using (citizen_id = auth.uid());
create policy "citizens react to visible public cases"
  on public.reactions for insert to authenticated
  with check (
    citizen_id = auth.uid()
    and exists (select 1 from public.cases c where c.id = case_id and c.visibility = 'public' and not c.hidden)
  );
create policy "citizens remove own reactions"
  on public.reactions for delete to authenticated
  using (citizen_id = auth.uid());

revoke all on public.reactions from anon, authenticated;
grant select, delete on public.reactions to authenticated;
grant insert (case_id, citizen_id, kind) on public.reactions to authenticated;

create table public.reports (
  case_id     uuid not null references public.cases (id) on delete cascade,
  reporter_id uuid not null references public.citizens (id) on delete cascade,
  reason      text not null check (reason in ('personal_info', 'abuse', 'sexual', 'spam', 'other')),
  created_at  timestamptz not null default now(),
  primary key (case_id, reporter_id)
);

alter table public.reports enable row level security;

create policy "citizens report others' visible public cases"
  on public.reports for insert to authenticated
  with check (
    reporter_id = auth.uid()
    and exists (
      select 1 from public.cases c
      where c.id = case_id and c.visibility = 'public' and not c.hidden and c.citizen_id <> auth.uid()
    )
  );

revoke all on public.reports from anon, authenticated;
grant insert (case_id, reporter_id, reason) on public.reports to authenticated;

-- 서로 다른 시민의 신고 3건이 쌓이면 일단 숨긴다. 복구는 운영자가 한다.
create or replace function public.hide_reported_case()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select count(*) from public.reports r where r.case_id = new.case_id) >= 3 then
    update public.cases set hidden = true where id = new.case_id;
  end if;
  return new;
end;
$$;
revoke execute on function public.hide_reported_case() from public, anon, authenticated;

create trigger reports_hide_case
  after insert on public.reports
  for each row execute function public.hide_reported_case();

-- 공개 사건 목록. citizen_id를 돌려주지 않아 같은 시민의 글을 ID로 묶을 수 없다.
create or replace function public.public_cases(p_sort text default 'latest', p_limit integer default 20, p_offset integer default 0)
returns table (
  id uuid, title text, report text, verdict text, disposition text, awarded_title text, created_at timestamptz,
  nickname text, "character" jsonb, counts jsonb, mine jsonb, is_mine boolean
)
language sql
volatile
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
   where c.visibility = 'public' and not c.hidden
   order by
     case when p_sort = 'most_reacted' then (select count(*) from public.reactions r where r.case_id = c.id) end desc nulls last,
     case when p_sort = 'random' then random() end,
     c.created_at desc
   limit least(greatest(p_limit, 1), 30)
  offset greatest(p_offset, 0);
$$;
revoke execute on function public.public_cases(text, integer, integer) from public;
grant execute on function public.public_cases(text, integer, integer) to anon, authenticated;

-- 내 사건에 달린 반응 개수. 공개 중이거나 내 사건인 경우만 집계한다.
create or replace function public.case_reaction_counts(p_ids uuid[])
returns table (case_id uuid, kind text, n bigint)
language sql
stable
security definer
set search_path = ''
as $$
  select r.case_id, r.kind, count(*)
    from public.reactions r
    join public.cases c on c.id = r.case_id
   where r.case_id = any (p_ids)
     and ((c.visibility = 'public' and not c.hidden) or c.citizen_id = auth.uid())
   group by r.case_id, r.kind;
$$;
revoke execute on function public.case_reaction_counts(uuid[]) from public;
grant execute on function public.case_reaction_counts(uuid[]) to anon, authenticated;
