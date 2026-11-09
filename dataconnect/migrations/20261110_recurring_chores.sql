-- Apply after the compatible schema migration. A series and its dated tasks
-- commit together. Historical tasks and completed occurrences keep their values.
CREATE UNIQUE INDEX IF NOT EXISTS routine_occurrence_date
  ON public.task_instance(template_id, occurrence_day);

CREATE OR REPLACE FUNCTION public.schedule_household_routine() RETURNS trigger
LANGUAGE plpgsql SET search_path = pg_catalog, public AS $$
DECLARE
  zone text;
  today date;
  room_name text;
BEGIN
  SELECT timezone INTO STRICT zone FROM household WHERE id = NEW.household_id;
  today := (now() AT TIME ZONE zone)::date;
  IF NEW.weekdays IS NULL OR NEW.assigned_staff_id IS NULL THEN
    IF TG_OP = 'UPDATE' AND OLD.weekdays IS NOT NULL THEN
      DELETE FROM task_instance WHERE template_id=NEW.id AND occurrence_day >= today AND status='pending';
    END IF;
    RETURN NEW;
  END IF;
  IF NEW.starts_on IS NULL OR NEW.ends_on IS NULL OR NEW.local_time IS NULL
    OR NEW.ends_on < NEW.starts_on OR NEW.ends_on - NEW.starts_on > 90
    OR (TG_OP = 'INSERT' AND NEW.starts_on < today)
    OR NEW.weekdays !~ '^[1-7](,[1-7]){0,6}$' OR NEW.local_time !~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'
    OR trim(NEW.name) = '' OR NOT EXISTS (SELECT FROM staff_member WHERE id=NEW.assigned_staff_id AND household_id=NEW.household_id)
  THEN RAISE EXCEPTION 'Invalid routine dates, weekdays, time, name or assignee'; END IF;
  IF NEW.room_id IS NOT NULL THEN
    SELECT name INTO STRICT room_name FROM room_zone WHERE id=NEW.room_id AND household_id=NEW.household_id;
  END IF;

  DELETE FROM task_instance WHERE template_id=NEW.id AND occurrence_day >= today AND status='pending'
    AND (occurrence_day NOT BETWEEN NEW.starts_on AND NEW.ends_on
      OR NOT (extract(isodow FROM occurrence_day)::int::text = ANY(string_to_array(NEW.weekdays, ','))));
  INSERT INTO task_instance(household_id,template_id,occurrence_day,assigned_staff_id,title,status,due_at,routine_room,routine_instructions,created_at,updated_at)
    SELECT NEW.household_id,NEW.id,d,NEW.assigned_staff_id,NEW.name,'pending',
      (d + NEW.local_time::time) AT TIME ZONE zone,room_name,NEW.instructions,now(),now()
    FROM (SELECT greatest(today,NEW.starts_on)+n AS d FROM generate_series(0,NEW.ends_on-greatest(today,NEW.starts_on)) AS n) days
    WHERE extract(isodow FROM d)::int::text = ANY(string_to_array(NEW.weekdays, ','))
    ON CONFLICT(template_id,occurrence_day) DO UPDATE SET title=excluded.title, assigned_staff_id=excluded.assigned_staff_id,
      due_at=excluded.due_at,routine_room=excluded.routine_room,routine_instructions=excluded.routine_instructions,updated_at=now()
    WHERE task_instance.status='pending';
  RETURN NEW;
END $$;
CREATE OR REPLACE TRIGGER generate_routine_tasks AFTER INSERT OR UPDATE ON public.task_template
FOR EACH ROW EXECUTE FUNCTION public.schedule_household_routine();
