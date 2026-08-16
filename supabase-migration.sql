alter table public.submissions drop constraint if exists submissions_status_check;

alter table public.submissions add constraint submissions_status_check
check (status in ('pending', 'approved', 'uncertain', 'rejected'));
