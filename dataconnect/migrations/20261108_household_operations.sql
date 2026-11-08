-- Apply after the compatible schema migration and before deploying the web connector.
-- Runs with the database caller's permissions. All effects share the initiating transaction.
CREATE OR REPLACE FUNCTION public.ensure_household_payroll() RETURNS trigger
LANGUAGE plpgsql SET search_path = pg_catalog, public AS $$
DECLARE period text := to_char(now() AT TIME ZONE NEW.timezone, 'FMMonth YYYY');
BEGIN
  INSERT INTO payroll_profile(household_id,staff_id,base_salary,pay_frequency,created_at,updated_at)
  SELECT NEW.id,s.id,s.salary,'monthly',now(),now() FROM staff_member s
  WHERE s.household_id=NEW.id AND NOT EXISTS (SELECT 1 FROM payroll_profile p WHERE p.staff_id=s.id);
  INSERT INTO payroll_run(household_id,staff_id,base_salary,net_pay,month_label,created_at,updated_at)
  SELECT NEW.id,s.id,s.salary,s.salary,period,now(),now() FROM staff_member s
  WHERE s.household_id=NEW.id AND NOT EXISTS (SELECT 1 FROM payroll_run p WHERE p.staff_id=s.id AND p.month_label=period);
  RETURN NEW;
END $$;
CREATE OR REPLACE TRIGGER initialize_monthly_payroll AFTER UPDATE OF updated_at ON public.household
FOR EACH ROW EXECUTE FUNCTION public.ensure_household_payroll();

CREATE OR REPLACE FUNCTION public.apply_approved_attendance() RETURNS trigger
LANGUAGE plpgsql SET search_path = pg_catalog, public AS $$
DECLARE
  person staff_member%ROWTYPE;
  pay payroll_run%ROWTYPE;
  period text := to_char(NEW.requested_for, 'FMMonth YYYY');
  absent_days integer;
  adjustment integer;
BEGIN
  IF NEW.status <> 'approved' THEN RETURN NEW; END IF;
  SELECT * INTO STRICT person FROM staff_member WHERE id=NEW.staff_id AND household_id=NEW.household_id FOR UPDATE;
  IF NEW.requested_for > (now() AT TIME ZONE (SELECT timezone FROM household WHERE id=NEW.household_id))::date THEN
    RAISE EXCEPTION 'Cannot change future attendance';
  END IF;
  SELECT * INTO pay FROM payroll_run WHERE staff_id=person.id AND month_label=period
    ORDER BY updated_at DESC,created_at DESC,id DESC LIMIT 1 FOR UPDATE;
  IF NOT FOUND THEN
    INSERT INTO payroll_run(household_id,staff_id,base_salary,net_pay,month_label,created_at,updated_at)
    VALUES (NEW.household_id,person.id,person.salary,person.salary,period,now(),now()) RETURNING * INTO pay;
  END IF;
  IF pay.status <> 'draft' THEN RAISE EXCEPTION 'Reopen the payroll period before editing attendance'; END IF;
  SELECT count(*) INTO absent_days FROM (
    SELECT DISTINCT ON (requested_for) requested_status FROM attendance_correction_request
    WHERE staff_id=person.id AND status='approved' AND date_trunc('month',requested_for)=date_trunc('month',NEW.requested_for)
    ORDER BY requested_for,reviewed_at DESC,created_at DESC,id DESC
  ) daily WHERE requested_status='absent';
  adjustment := least(pay.base_salary, ceil(pay.base_salary / 30.0)::int * absent_days);
  UPDATE payroll_run SET deductions=deductions-attendance_deductions+adjustment,
    net_pay=base_salary-advances-deductions+attendance_deductions-adjustment,
    attendance_deductions=adjustment,updated_at=now() WHERE id=pay.id;
  RETURN NEW;
END $$;
CREATE OR REPLACE TRIGGER reconcile_daily_attendance AFTER INSERT OR UPDATE OF status ON public.attendance_correction_request
FOR EACH ROW EXECUTE FUNCTION public.apply_approved_attendance();

CREATE OR REPLACE FUNCTION public.post_household_purchase() RETURNS trigger
LANGUAGE plpgsql SET search_path = pg_catalog, public AS $$
BEGIN
  IF NEW.status <> 'purchased' OR NEW.purchase_quantity IS NULL THEN RETURN NEW; END IF;
  IF OLD.status='purchased' AND OLD.linked_expense_id IS NOT NULL THEN RETURN OLD; END IF;
  IF OLD.status <> 'approved' THEN RAISE EXCEPTION 'Only approved requests can be posted'; END IF;
  NEW.inventory_item_id := coalesce(NEW.inventory_item_id,OLD.inventory_item_id);
  IF NEW.inventory_item_id IS NULL AND NEW.purchase_quantity <> 0 THEN RAISE EXCEPTION 'Select a stock item'; END IF;
  IF NEW.inventory_item_id IS NOT NULL THEN
    IF NOT (NEW.purchase_quantity > 0 AND NEW.purchase_quantity < 'Infinity'::float8) THEN RAISE EXCEPTION 'Enter the purchased quantity'; END IF;
    UPDATE inventory_item SET current_quantity=current_quantity+NEW.purchase_quantity,updated_at=now()
      WHERE id=NEW.inventory_item_id AND household_id=NEW.household_id;
    IF NOT FOUND THEN RAISE EXCEPTION 'Stock item belongs to a different household'; END IF;
    INSERT INTO inventory_movement(id,household_id,item_id,movement_type,quantity,source,notes,occurred_at,created_at)
      VALUES (NEW.id,NEW.household_id,NEW.inventory_item_id,'purchase',NEW.purchase_quantity,'cash-request',NEW.reason,now(),now());
  END IF;
  INSERT INTO expense_entry(id,household_id,staff_id,category,amount,description,receipt_url,spent_at,created_at,updated_at)
    VALUES (NEW.id,NEW.household_id,NEW.staff_id,CASE WHEN NEW.category IN ('Groceries','Fuel','Repairs','Advances') THEN NEW.category ELSE 'Household' END,
      coalesce(NEW.amount_approved,NEW.amount_requested),NEW.reason,NEW.receipt_url,now(),now(),now());
  NEW.linked_expense_id := NEW.id;
  NEW.purchased_at := now();
  RETURN NEW;
END $$;
CREATE OR REPLACE TRIGGER finalize_cash_purchase BEFORE UPDATE OF status ON public.staff_cash_request
FOR EACH ROW EXECUTE FUNCTION public.post_household_purchase();
