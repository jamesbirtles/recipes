alter table "public"."shopping_list_items" add column "order" integer not null;

CREATE UNIQUE INDEX shopping_list_items_user_order_unique ON public.shopping_list_items USING btree (user_id, "order");

CREATE OR REPLACE FUNCTION public."insertShoppingListItem"(name text, quantity double precision, unit text, user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
   item_count integer;
begin
  loop
    begin
      select count(*) into item_count from (
      select * from public.shopping_list_items
      where shopping_list_items.user_id = $4 for update) as r;

      insert into public.shopping_list_items (name, quantity, unit, user_id, "order")
      values (name, quantity, unit, user_id, item_count);

      return;
    exception
      when unique_violation then
        -- Someone inserted whilst we were trying to insert
      when others then
        -- Probably someone deleted whilst we were trying to insert
    end;
  end loop;
end;
$function$;
