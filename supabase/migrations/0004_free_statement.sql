-- 민원 진술을 자유 서술로 넓힌다: 60자에서 200자로.
alter table public.cases drop constraint cases_statement_check;
alter table public.cases add constraint cases_statement_check check (char_length(statement) <= 200);
