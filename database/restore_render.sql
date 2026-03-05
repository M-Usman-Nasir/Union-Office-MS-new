-- Restore local dump into Render DB (run with psql -f this file).
-- 1. Run truncate_render_for_restore.sql on Render first.
-- 2. Put your data-only dump (e.g. homeland_union_data.sql) in database/
-- 3. From project root: psql "<Render External URL>" -f database/restore_render.sql
--    Or from database/: psql "<Render External URL>" -f restore_render.sql
-- Path below: relative to CWD when you run psql (e.g. from project root use database/homeland_union_data.sql).
\i database/homeland_union_data.sql
