


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."expense_split_method_enum" AS ENUM (
    'equal',
    'custom',
    'percentage'
);


ALTER TYPE "public"."expense_split_method_enum" OWNER TO "postgres";


CREATE TYPE "public"."group_member_role_enum" AS ENUM (
    'admin',
    'member'
);


ALTER TYPE "public"."group_member_role_enum" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."add_group_creator_as_admin"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
    -- Chèn một dòng vào group_members cho người vừa tạo group
    -- Lưu ý: Đảm bảo giá trị 'admin' khớp chính xác với một giá trị trong user_role_enum của bạn
    INSERT INTO group_members (group_id, user_id, role)
    VALUES (NEW.id, NEW.created_by, 'admin');

    -- Trả về NEW để Postgres tiếp tục hoàn thành các tiến trình ngầm định nếu có
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."add_group_creator_as_admin"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_expense_with_splits"("p_group_id" "uuid", "p_paid_by" "uuid", "p_title" "text", "p_amount" numeric, "p_expense_splits" "jsonb", "p_split_config" "jsonb", "p_split_method" "public"."expense_split_method_enum") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$DECLARE
  v_expense_id uuid;
  v_split_count int;
  v_distinct_user_count int;
BEGIN
  -- Check auth
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Current user must be group member
  IF NOT EXISTS (
    SELECT 1
    FROM group_members gm
    WHERE gm.group_id = p_group_id
      AND gm.user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'You are not a member of this group';
  END IF;

  -- Payer must be group member
  IF NOT EXISTS (
    SELECT 1
    FROM group_members gm
    WHERE gm.group_id = p_group_id
      AND gm.user_id = p_paid_by
  ) THEN
    RAISE EXCEPTION 'Payer is not a member of this group';
  END IF;

  -- Basic validation
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be greater than 0';
  END IF;

  IF jsonb_typeof(p_expense_splits) <> 'array' OR jsonb_array_length(p_expense_splits) = 0 THEN
    RAISE EXCEPTION 'Splits must be a non-empty array';
  END IF;

  -- Validate duplicate users
  SELECT
    COUNT(*),
    COUNT(DISTINCT (split->>'user_id')::uuid)
  INTO v_split_count, v_distinct_user_count
  FROM jsonb_array_elements(p_expense_splits) split;

  IF v_split_count <> v_distinct_user_count THEN
    RAISE EXCEPTION 'Duplicate users in splits';
  END IF;

  -- Validate all split users are group members
  IF EXISTS (
    SELECT 1
    FROM jsonb_array_elements(p_expense_splits) split
    WHERE NOT EXISTS (
      SELECT 1
      FROM group_members gm
      WHERE gm.group_id = p_group_id
        AND gm.user_id = (split->>'user_id')::uuid
    )
  ) THEN
    RAISE EXCEPTION 'All split users must be group members';
  END IF;

  -- Validate split amount
  IF EXISTS (
    SELECT 1
    FROM jsonb_array_elements(p_expense_splits) split
    WHERE (split->>'share_amount')::numeric < 0
  ) THEN
    RAISE EXCEPTION 'Share amount must be greater than or equal to 0';
  END IF;

  -- Insert expense
  INSERT INTO expenses (
    group_id,
    paid_by,
    title,
    amount,
    split_method,
    split_config
  )
  VALUES (
    p_group_id,
    p_paid_by,
    p_title,
    p_amount,
    p_split_method,
    p_split_config
  )
  RETURNING id INTO v_expense_id;

  -- Insert splits
  INSERT INTO expense_splits (
    expense_id,
    user_id,
    share_amount
  )
  SELECT
    v_expense_id,
    (split->>'user_id')::uuid,
    (split->>'share_amount')::numeric
  FROM jsonb_array_elements(p_expense_splits) split;
  
  RETURN v_expense_id;
END;$$;


ALTER FUNCTION "public"."create_expense_with_splits"("p_group_id" "uuid", "p_paid_by" "uuid", "p_title" "text", "p_amount" numeric, "p_expense_splits" "jsonb", "p_split_config" "jsonb", "p_split_method" "public"."expense_split_method_enum") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."join_group_by_token"("p_invite_token" "uuid") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
    v_group_id UUID;
    v_user_id UUID;
BEGIN
    -- 1. Lấy ID của user đang request (đã đăng nhập qua Supabase Auth)
    v_user_id := auth.uid();
    
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Bạn phải đăng nhập để tham gia nhóm.';
    END IF;

    -- 2. Tìm Group ID dựa trên invite_token
    SELECT id INTO v_group_id
    FROM groups
    WHERE invite_token = p_invite_token;

    IF v_group_id IS NULL THEN
        RAISE EXCEPTION 'Mã mời (invite token) không hợp lệ hoặc không tồn tại.';
    END IF;

    -- 3. (Tùy chọn) Kiểm tra xem user đã ở trong nhóm chưa để báo lỗi thân thiện hơn
    -- Nếu không có bước này, DB sẽ tự văng lỗi do khóa chính (group_id, user_id) bị trùng
    IF EXISTS (
        SELECT 1 FROM group_members 
        WHERE group_id = v_group_id AND user_id = v_user_id
    ) THEN
        RAISE EXCEPTION 'Bạn đã là thành viên của nhóm này rồi.';
    END IF;

    -- 4. Thêm user vào group với role 'member' (hoặc giá trị mặc định trong enum của bạn)
    INSERT INTO group_members (group_id, user_id, role)
    VALUES (v_group_id, v_user_id, 'member');

    -- Trả về group_id để frontend xử lý tiếp
    RETURN v_group_id;
END;
$$;


ALTER FUNCTION "public"."join_group_by_token"("p_invite_token" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."settle_expense_splits"("p_expense_split_ids" "uuid"[]) RETURNS "uuid"[]
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
    insert into settlements (group_id, from_user, to_user, amount, title)
    values (v_group.group_id, v_caller, v_group.to_user, v_group.total_amount, 'Thanh toán nợ')
    returning id into v_settlement_id;

    update expense_splits set settlement_id = v_settlement_id where id = any(v_group.split_ids);
    v_settlement_ids := array_append(v_settlement_ids, v_settlement_id);
  end loop;

  return v_settlement_ids;
end;
$$;


ALTER FUNCTION "public"."settle_expense_splits"("p_expense_split_ids" "uuid"[]) OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."expense_splits" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "expense_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "share_amount" numeric(12,2) NOT NULL,
    "settlement_id" "uuid",
    CONSTRAINT "expense_splits_share_amount_check" CHECK (("share_amount" >= (0)::numeric))
);


ALTER TABLE "public"."expense_splits" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."expenses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "group_id" "uuid" NOT NULL,
    "paid_by" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "amount" numeric(12,2) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "split_method" "public"."expense_split_method_enum" NOT NULL,
    "split_config" "jsonb"
);


ALTER TABLE "public"."expenses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."group_members" (
    "group_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "joined_at" timestamp with time zone DEFAULT "now"(),
    "role" "public"."group_member_role_enum" NOT NULL
);


ALTER TABLE "public"."group_members" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."groups" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "created_by" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "cover_image_url" "text",
    "invite_token" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."groups" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."settlements" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "group_id" "uuid" NOT NULL,
    "from_user" "uuid" NOT NULL,
    "to_user" "uuid" NOT NULL,
    "amount" numeric(12,2) NOT NULL,
    "title" "text" NOT NULL,
    "note" "text",
    "settled_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "evidence_image_path" "text",
    CONSTRAINT "settlements_amount_check" CHECK (("amount" > (0)::numeric)),
    CONSTRAINT "settlements_check" CHECK (("from_user" <> "to_user"))
);


ALTER TABLE "public"."settlements" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" NOT NULL,
    "email" "text" NOT NULL,
    "full_name" "text",
    "avatar_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."users" OWNER TO "postgres";


ALTER TABLE ONLY "public"."expense_splits"
    ADD CONSTRAINT "expense_splits_expense_user_unique" UNIQUE ("expense_id", "user_id");



ALTER TABLE ONLY "public"."expense_splits"
    ADD CONSTRAINT "expense_splits_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."expenses"
    ADD CONSTRAINT "expenses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."group_members"
    ADD CONSTRAINT "group_members_pkey" PRIMARY KEY ("group_id", "user_id");



ALTER TABLE ONLY "public"."groups"
    ADD CONSTRAINT "groups_invite_token_key" UNIQUE ("invite_token");



ALTER TABLE ONLY "public"."groups"
    ADD CONSTRAINT "groups_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."settlements"
    ADD CONSTRAINT "settlements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_expense_splits_expense_id" ON "public"."expense_splits" USING "btree" ("expense_id");



CREATE INDEX "idx_expense_splits_settlement_id" ON "public"."expense_splits" USING "btree" ("settlement_id");



CREATE INDEX "idx_expense_splits_user_id" ON "public"."expense_splits" USING "btree" ("user_id");



CREATE INDEX "idx_settlements_from_user" ON "public"."settlements" USING "btree" ("from_user");



CREATE INDEX "idx_settlements_to_user" ON "public"."settlements" USING "btree" ("to_user");



CREATE OR REPLACE TRIGGER "trigger_on_group_created" AFTER INSERT ON "public"."groups" FOR EACH ROW EXECUTE FUNCTION "public"."add_group_creator_as_admin"();



ALTER TABLE ONLY "public"."expense_splits"
    ADD CONSTRAINT "expense_splits_expense_id_fkey" FOREIGN KEY ("expense_id") REFERENCES "public"."expenses"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."expense_splits"
    ADD CONSTRAINT "expense_splits_settlement_id_fkey" FOREIGN KEY ("settlement_id") REFERENCES "public"."settlements"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."expense_splits"
    ADD CONSTRAINT "expense_splits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."expenses"
    ADD CONSTRAINT "expenses_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."expenses"
    ADD CONSTRAINT "expenses_paid_by_fkey" FOREIGN KEY ("paid_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."group_members"
    ADD CONSTRAINT "group_members_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."group_members"
    ADD CONSTRAINT "group_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."groups"
    ADD CONSTRAINT "groups_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."settlements"
    ADD CONSTRAINT "settlements_from_user_fkey" FOREIGN KEY ("from_user") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."settlements"
    ADD CONSTRAINT "settlements_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."settlements"
    ADD CONSTRAINT "settlements_to_user_fkey" FOREIGN KEY ("to_user") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "All member in groups can view group information" ON "public"."groups" FOR SELECT USING (("auth"."uid"() IN ( SELECT "group_members"."user_id"
   FROM "public"."group_members"
  WHERE ("group_members"."group_id" = "groups"."id"))));



CREATE POLICY "All members in group can CRUD expense" ON "public"."expenses" USING (("auth"."uid"() IN ( SELECT "group_members"."user_id"
   FROM "public"."group_members"
  WHERE ("group_members"."group_id" = "expenses"."group_id")))) WITH CHECK (("auth"."uid"() IN ( SELECT "group_members"."user_id"
   FROM "public"."group_members"
  WHERE ("group_members"."group_id" = "expenses"."group_id"))));



CREATE POLICY "Allow authenticated users to view group members" ON "public"."group_members" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Group members can create expense splits" ON "public"."expense_splits" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM ("public"."expenses" "e"
     JOIN "public"."group_members" "gm" ON (("gm"."group_id" = "e"."group_id")))
  WHERE (("e"."id" = "expense_splits"."expense_id") AND ("gm"."user_id" = "auth"."uid"())))));



CREATE POLICY "Group members can delete expense splits" ON "public"."expense_splits" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM ("public"."expenses" "e"
     JOIN "public"."group_members" "gm" ON (("gm"."group_id" = "e"."group_id")))
  WHERE (("e"."id" = "expense_splits"."expense_id") AND ("gm"."user_id" = "auth"."uid"())))));



CREATE POLICY "Group members can read expense splits" ON "public"."expense_splits" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM ("public"."expenses" "e"
     JOIN "public"."group_members" "gm" ON (("gm"."group_id" = "e"."group_id")))
  WHERE (("e"."id" = "expense_splits"."expense_id") AND ("gm"."user_id" = "auth"."uid"())))));



CREATE POLICY "Group members can read settlements" ON "public"."settlements" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."group_members" "gm"
  WHERE (("gm"."group_id" = "settlements"."group_id") AND ("gm"."user_id" = "auth"."uid"())))));



CREATE POLICY "Group members can update expense splits" ON "public"."expense_splits" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM ("public"."expenses" "e"
     JOIN "public"."group_members" "gm" ON (("gm"."group_id" = "e"."group_id")))
  WHERE (("e"."id" = "expense_splits"."expense_id") AND ("gm"."user_id" = "auth"."uid"()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM ("public"."expenses" "e"
     JOIN "public"."group_members" "gm" ON (("gm"."group_id" = "e"."group_id")))
  WHERE (("e"."id" = "expense_splits"."expense_id") AND ("gm"."user_id" = "auth"."uid"())))));



CREATE POLICY "Group members can view each other's profiles" ON "public"."users" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM ("public"."group_members" "gm_self"
     JOIN "public"."group_members" "gm_other" ON (("gm_self"."group_id" = "gm_other"."group_id")))
  WHERE (("gm_self"."user_id" = "auth"."uid"()) AND ("gm_other"."user_id" = "users"."id")))));



CREATE POLICY "Only creator can CRUD group information" ON "public"."groups" USING ((( SELECT "auth"."uid"() AS "uid") = "created_by")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "created_by"));



CREATE POLICY "Users can create their own outgoing settlements" ON "public"."settlements" FOR INSERT WITH CHECK ((("from_user" = "auth"."uid"()) AND (EXISTS ( SELECT 1
   FROM "public"."group_members" "gm"
  WHERE (("gm"."group_id" = "settlements"."group_id") AND ("gm"."user_id" = "auth"."uid"()))))));



CREATE POLICY "Users can update own profile" ON "public"."users" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can view own profile" ON "public"."users" FOR SELECT USING (("auth"."uid"() = "id"));



ALTER TABLE "public"."expense_splits" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."expenses" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."group_members" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."groups" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."settlements" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";






















































































































































GRANT ALL ON FUNCTION "public"."add_group_creator_as_admin"() TO "anon";
GRANT ALL ON FUNCTION "public"."add_group_creator_as_admin"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."add_group_creator_as_admin"() TO "service_role";



GRANT ALL ON FUNCTION "public"."create_expense_with_splits"("p_group_id" "uuid", "p_paid_by" "uuid", "p_title" "text", "p_amount" numeric, "p_expense_splits" "jsonb", "p_split_config" "jsonb", "p_split_method" "public"."expense_split_method_enum") TO "anon";
GRANT ALL ON FUNCTION "public"."create_expense_with_splits"("p_group_id" "uuid", "p_paid_by" "uuid", "p_title" "text", "p_amount" numeric, "p_expense_splits" "jsonb", "p_split_config" "jsonb", "p_split_method" "public"."expense_split_method_enum") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_expense_with_splits"("p_group_id" "uuid", "p_paid_by" "uuid", "p_title" "text", "p_amount" numeric, "p_expense_splits" "jsonb", "p_split_config" "jsonb", "p_split_method" "public"."expense_split_method_enum") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."join_group_by_token"("p_invite_token" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."join_group_by_token"("p_invite_token" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."join_group_by_token"("p_invite_token" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."settle_expense_splits"("p_expense_split_ids" "uuid"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."settle_expense_splits"("p_expense_split_ids" "uuid"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."settle_expense_splits"("p_expense_split_ids" "uuid"[]) TO "service_role";


















GRANT ALL ON TABLE "public"."expense_splits" TO "anon";
GRANT ALL ON TABLE "public"."expense_splits" TO "authenticated";
GRANT ALL ON TABLE "public"."expense_splits" TO "service_role";



GRANT ALL ON TABLE "public"."expenses" TO "anon";
GRANT ALL ON TABLE "public"."expenses" TO "authenticated";
GRANT ALL ON TABLE "public"."expenses" TO "service_role";



GRANT ALL ON TABLE "public"."group_members" TO "anon";
GRANT ALL ON TABLE "public"."group_members" TO "authenticated";
GRANT ALL ON TABLE "public"."group_members" TO "service_role";



GRANT ALL ON TABLE "public"."groups" TO "anon";
GRANT ALL ON TABLE "public"."groups" TO "authenticated";
GRANT ALL ON TABLE "public"."groups" TO "service_role";



GRANT ALL ON TABLE "public"."settlements" TO "anon";
GRANT ALL ON TABLE "public"."settlements" TO "authenticated";
GRANT ALL ON TABLE "public"."settlements" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































