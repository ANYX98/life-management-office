-- 6단계: 댓글과 운영자 화면.

create table public.comments (
  id         uuid primary key default gen_random_uuid(),
  case_id    uuid not null references public.cases (id) on delete cascade,
  citizen_id uuid not null references public.citizens (id) on delete cascade,
  body       text not null check (char_length(btrim(body)) between 1 and 100 and body !~ '@' and body !~ '(\D*\d){7}'),
  hidden     boolean not null default false,
  created_at timestamptz not null default now()
);
create index comments_case_idx on public.comments (case_id, created_at);
create index comments_citizen_idx on public.comments (citizen_id, created_at desc);

create table public.comment_reports (
  comment_id  uuid not null references public.comments (id) on delete cascade,
  reporter_id uuid not null references public.citizens (id) on delete cascade,
  reason      text not null check (reason in ('personal_info', 'abuse', 'sexual', 'spam', 'other')),
  created_at  timestamptz not null default now(),
  primary key (comment_id, reporter_id)
);

create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

alter table public.comments enable row level security;
alter table public.comment_reports enable row level security;
alter table public.admins enable row level security;
revoke all on public.comments from anon, authenticated;
revoke all on public.comment_reports from anon, authenticated;
revoke all on public.admins from anon, authenticated;
-- 세 테이블 모두 아래 함수로만 다룬다.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

-- 댓글 목록. 사건이 공개 중이거나 내 사건일 때만 보인다. citizen_id는 돌려주지 않는다.
create or replace function public.case_comments(p_case uuid)
returns table (id uuid, body text, created_at timestamptz, nickname text, "character" jsonb, is_mine boolean, can_delete boolean)
language sql
stable
security definer
set search_path = ''
as $$
  select m.id, m.body, m.created_at, ci.nickname, ci.character,
         coalesce(m.citizen_id = auth.uid(), false),
         coalesce(m.citizen_id = auth.uid() or c.citizen_id = auth.uid(), false)
    from public.comments m
    join public.cases c on c.id = m.case_id
    join public.citizens ci on ci.id = m.citizen_id
   where m.case_id = p_case and not m.hidden
     and ((c.visibility = 'public' and not c.hidden) or c.citizen_id = auth.uid())
   order by m.created_at
   limit 100;
$$;

create or replace function public.add_comment(p_case uuid, p_body text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or not exists (select 1 from public.citizens c where c.id = auth.uid()) then
    raise exception 'not a citizen';
  end if;
  if not exists (select 1 from public.cases c where c.id = p_case and c.visibility = 'public' and not c.hidden) then
    raise exception 'case not open';
  end if;
  if (select count(*) from public.comments m where m.citizen_id = auth.uid() and m.created_at > now() - interval '1 hour') >= 20 then
    raise exception 'too many comments';
  end if;
  insert into public.comments (case_id, citizen_id, body) values (p_case, auth.uid(), btrim(p_body));
end;
$$;

-- 내 댓글, 또는 내 사건에 달린 댓글을 지울 수 있다.
create or replace function public.delete_comment(p_comment uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  delete from public.comments m
   using public.cases c
   where m.id = p_comment and c.id = m.case_id
     and (m.citizen_id = auth.uid() or c.citizen_id = auth.uid());
$$;

create or replace function public.report_comment(p_comment uuid, p_reason text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or not exists (select 1 from public.citizens c where c.id = auth.uid()) then
    raise exception 'not a citizen';
  end if;
  if exists (select 1 from public.comments m where m.id = p_comment and m.citizen_id = auth.uid()) then
    raise exception 'own comment';
  end if;
  insert into public.comment_reports (comment_id, reporter_id, reason)
  values (p_comment, auth.uid(), p_reason)
  on conflict do nothing;
  if (select count(*) from public.comment_reports r where r.comment_id = p_comment) >= 3 then
    update public.comments set hidden = true where id = p_comment;
  end if;
end;
$$;

-- 운영자 기능. 신고된 글만 보여 주며, 신고되지 않은 '나만 보기' 글은 이 화면에 나오지 않는다.
create or replace function public.admin_overview()
returns json
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then raise exception 'forbidden'; end if;
  return json_build_object(
    'citizens', (select count(*) from public.citizens),
    'cases', (select count(*) from public.cases),
    'public_cases', (select count(*) from public.cases where visibility = 'public'),
    'hidden_cases', (select count(*) from public.cases where hidden),
    'comments', (select count(*) from public.comments),
    'reactions', (select count(*) from public.reactions),
    'share_visits', (select count(*) from public.share_events where kind = 'visit'),
    'share_signups', (select count(*) from public.share_events where kind = 'signup'),
    'joint_votes_this_week', (select count(*) from public.joint_votes where week_start = public.joint_week_start())
  );
end;
$$;

create or replace function public.admin_reports()
returns table (kind text, target_id uuid, label text, body text, nickname text, hidden boolean, reports bigint, reasons text[], last_at timestamptz)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then raise exception 'forbidden'; end if;
  return query
  select 'case'::text, c.id, c.title, c.report, ci.nickname, c.hidden, count(*), array_agg(distinct r.reason), max(r.created_at)
    from public.reports r join public.cases c on c.id = r.case_id join public.citizens ci on ci.id = c.citizen_id
   where c.visibility = 'public' or c.hidden
   group by c.id, ci.nickname
  union all
  select 'comment'::text, m.id, '댓글'::text, m.body, ci.nickname, m.hidden, count(*), array_agg(distinct r.reason), max(r.created_at)
    from public.comment_reports r join public.comments m on m.id = r.comment_id join public.citizens ci on ci.id = m.citizen_id
   group by m.id, ci.nickname
  order by 9 desc
  limit 100;
end;
$$;

-- 숨기기 또는 복구. 복구하면 신고 기록도 지워 다시 바로 숨겨지지 않게 한다.
create or replace function public.admin_set_hidden(p_kind text, p_target uuid, p_hidden boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then raise exception 'forbidden'; end if;
  if p_kind = 'case' then
    update public.cases set hidden = p_hidden where id = p_target;
    if not p_hidden then delete from public.reports where case_id = p_target; end if;
  elsif p_kind = 'comment' then
    update public.comments set hidden = p_hidden where id = p_target;
    if not p_hidden then delete from public.comment_reports where comment_id = p_target; end if;
  else
    raise exception 'bad kind';
  end if;
end;
$$;

revoke execute on function public.is_admin() from public;
revoke execute on function public.case_comments(uuid) from public;
revoke execute on function public.add_comment(uuid, text) from public;
revoke execute on function public.delete_comment(uuid) from public;
revoke execute on function public.report_comment(uuid, text) from public;
revoke execute on function public.admin_overview() from public;
revoke execute on function public.admin_reports() from public;
revoke execute on function public.admin_set_hidden(text, uuid, boolean) from public;
grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.case_comments(uuid) to anon, authenticated;
grant execute on function public.add_comment(uuid, text) to authenticated;
grant execute on function public.delete_comment(uuid) to authenticated;
grant execute on function public.report_comment(uuid, text) to authenticated;
grant execute on function public.admin_overview() to authenticated;
grant execute on function public.admin_reports() to authenticated;
grant execute on function public.admin_set_hidden(text, uuid, boolean) to authenticated;
