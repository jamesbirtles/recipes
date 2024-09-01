CREATE OR REPLACE FUNCTION public."insertShoppingListItem"(
    name text,
    user_id uuid,
    quantity double precision DEFAULT NULL,
    unit text DEFAULT NULL
)
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
      where shopping_list_items.user_id = $2 for update) as r;

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
