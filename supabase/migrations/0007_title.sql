-- 사물함: 실제로 받은 칭호만 대표 칭호로 고를 수 있다.
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
  if p_title <> '신규 등록 시민' and not exists (
    select 1 from public.cases c where c.citizen_id = auth.uid() and c.awarded_title = p_title
  ) then
    raise exception 'title not owned';
  end if;
  update public.citizens set title = p_title where id = auth.uid();
end;
$$;
revoke execute on function public.set_my_title(text) from public, anon;
grant execute on function public.set_my_title(text) to authenticated;
