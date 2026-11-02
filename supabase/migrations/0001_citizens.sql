-- 인생관리공단 1~2단계 스키마: 시민 공개 프로필
-- 이메일 등 인증 정보는 auth.users에만 있고, 이 테이블에는 공개해도 되는 값만 둔다.

create or replace function public.random_citizen_type()
returns text
language sql
volatile
as $$
  select (array['침대 밀착형','계획 과다형','미래 위임형','카페인 의존형',
                '갑자기 갓생형','조용한 생존형','점심 숙고형','알람 협상형'])[1 + floor(random() * 8)::int];
$$;

create table public.citizens (
  id           uuid primary key references auth.users (id) on delete cascade,
  citizen_no   bigint generated always as identity unique,
  nickname     text not null
               check (char_length(btrim(nickname)) between 2 and 12 and nickname !~ '@'),
  character    jsonb not null
               check (jsonb_typeof(character) = 'object' and pg_column_size(character) < 2048),
  citizen_type text not null default public.random_citizen_type(),
  grade        text not null default '수습 시민',
  title        text not null default '신규 등록 시민',
  case_count   integer not null default 0 check (case_count >= 0),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index citizens_created_at_idx on public.citizens (created_at);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger citizens_touch_updated_at
  before update on public.citizens
  for each row execute function public.touch_updated_at();

alter table public.citizens enable row level security;

-- 공개 프로필은 누구나 읽을 수 있다. 민감 정보는 이 테이블에 없다.
create policy "citizens are publicly readable"
  on public.citizens for select
  to anon, authenticated
  using (true);

-- 익명 로그인 사용자도 authenticated 역할이다. 자기 행만 만들고 고칠 수 있다.
create policy "citizens insert own row"
  on public.citizens for insert
  to authenticated
  with check (id = auth.uid());

create policy "citizens update own row"
  on public.citizens for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- 등급, 칭호, 사건 수 등 게임 값은 클라이언트가 직접 바꿀 수 없도록 열 단위로 막는다.
revoke all on public.citizens from anon, authenticated;
grant select on public.citizens to anon, authenticated;
grant insert (id, nickname, character) on public.citizens to authenticated;
grant update (nickname, character) on public.citizens to authenticated;

-- 광장 통계: 실제 집계만 돌려준다. 하루 기준은 한국 시간.
create or replace function public.plaza_stats()
returns json
language sql
stable
as $$
  select json_build_object(
    'total_citizens', count(*),
    'registered_today', count(*) filter (
      where created_at >= (date_trunc('day', now() at time zone 'Asia/Seoul') at time zone 'Asia/Seoul')
    )
  )
  from public.citizens;
$$;

grant execute on function public.plaza_stats() to anon, authenticated;
