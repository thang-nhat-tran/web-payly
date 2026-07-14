-- Lets settle_expense_splits persist the payment-proof image uploaded during
-- confirmation onto every settlement row it creates in that batch.
DROP FUNCTION IF EXISTS "public"."settle_expense_splits"("uuid"[]);

CREATE FUNCTION "public"."settle_expense_splits"(
    "p_expense_split_ids" "uuid"[],
    "p_evidence_image_path" "text" DEFAULT NULL
) RETURNS "uuid"[]
    LANGUAGE "plpgsql"
    AS $$
declare
  v_caller uuid := auth.uid();
  v_requested_count integer;
  v_valid_count integer;
  v_settlement_ids uuid[] := '{}';
  v_group record;
  v_settlement_id uuid;
begin
  if v_caller is null then
    raise exception 'Not authenticated';
  end if;

  if p_expense_split_ids is null or array_length(p_expense_split_ids, 1) is null then
    raise exception 'p_expense_split_ids must not be empty';
  end if;

  select count(*) into v_requested_count from (select distinct unnest(p_expense_split_ids)) d;

  -- Reject the whole batch if any requested id isn't the caller's, is
  -- already settled, or points at an expense the caller themself paid.
  select count(*) into v_valid_count
  from expense_splits es
  join expenses e on e.id = es.expense_id
  where es.id = any(p_expense_split_ids)
    and es.user_id = v_caller
    and es.settlement_id is null
    and e.paid_by <> v_caller;

  if v_valid_count <> v_requested_count then
    raise exception 'One or more selected debts are invalid, already settled, or not yours';
  end if;

  for v_group in
    select e.group_id, e.paid_by as to_user, sum(es.share_amount) as total_amount, array_agg(es.id) as split_ids
    from expense_splits es
    join expenses e on e.id = es.expense_id
    where es.id = any(p_expense_split_ids)
      and es.user_id = v_caller
      and es.settlement_id is null
    group by e.group_id, e.paid_by
  loop
    insert into settlements (group_id, from_user, to_user, amount, title, evidence_image_path)
    values (v_group.group_id, v_caller, v_group.to_user, v_group.total_amount, 'Thanh toán nợ', p_evidence_image_path)
    returning id into v_settlement_id;

    update expense_splits set settlement_id = v_settlement_id where id = any(v_group.split_ids);
    v_settlement_ids := array_append(v_settlement_ids, v_settlement_id);
  end loop;

  return v_settlement_ids;
end;
$$;

ALTER FUNCTION "public"."settle_expense_splits"("p_expense_split_ids" "uuid"[], "p_evidence_image_path" "text") OWNER TO "postgres";

GRANT ALL ON FUNCTION "public"."settle_expense_splits"("p_expense_split_ids" "uuid"[], "p_evidence_image_path" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."settle_expense_splits"("p_expense_split_ids" "uuid"[], "p_evidence_image_path" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."settle_expense_splits"("p_expense_split_ids" "uuid"[], "p_evidence_image_path" "text") TO "service_role";
