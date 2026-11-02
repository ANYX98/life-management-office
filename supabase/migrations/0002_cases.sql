-- 3단계: 민원 사건. 칭호는 사건에서 집계하므로 별도 테이블이 없다.
-- 비공개 사건의 진술은 본인만 읽을 수 있다.

create or replace function public.grade_for_case_count(n integer)
returns text
language sql
immutable
as $$
  select case when n >= 30 then '공단 단골'
              when n >= 10 then '상습 민원인'
              when n >= 3  then '일반 시민'
              else '수습 시민' end;
$$;

create table public.cases (
  id            uuid primary key default gen_random_uuid(),
  case_no       bigint generated always as identity unique,
  citizen_id    uuid not null references public.citizens (id) on delete cascade,
  category      text not null check (char_length(category) <= 20),
  energy        smallint not null check (energy between 0 and 4),
  statement     text not null default '' check (char_length(statement) <= 60),
  visibility    text not null default 'private' check (visibility in ('public', 'private')),
  title         text not null check (char_length(title) <= 60),
  report        text not null check (char_length(report) <= 500),
  verdict       text not null check (char_length(verdict) <= 300),
  disposition   text not null check (char_length(disposition) <= 300),
  awarded_title text check (char_length(awarded_title) <= 30),
  created_at    timestamptz not null default now()
);

create index cases_citizen_created_idx on public.cases (citizen_id, created_at desc);
create index cases_public_created_idx on public.cases (created_at desc) where visibility = 'public';

alter table public.cases enable row level security;

create policy "public cases and own cases are readable"
  on public.cases for select
  to anon, authenticated
  using (visibility = 'public' or citizen_id = auth.uid());

create policy "citizens insert own cases"
  on public.cases for insert
  to authenticated
  with check (citizen_id = auth.uid());

revoke all on public.cases from anon, authenticated;
grant select on public.cases to anon, authenticated;
grant insert (citizen_id, category, energy, statement, visibility, title, report, verdict, disposition, awarded_title)
  on public.cases to authenticated;

-- 사건 수, 등급, 대표 칭호는 클라이언트가 직접 고칠 수 없으므로 이 트리거만 갱신한다.
create or replace function public.apply_case_to_citizen()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.citizens
     set case_count = case_count + 1,
         grade = public.grade_for_case_count(case_count + 1),
         title = coalesce(new.awarded_title, title)
   where id = new.citizen_id;
  return new;
end;
$$;

revoke execute on function public.apply_case_to_citizen() from public, anon, authenticated;

create trigger cases_apply_to_citizen
  after insert on public.cases
  for each row execute function public.apply_case_to_citizen();
